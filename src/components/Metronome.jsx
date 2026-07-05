import { useEffect, useRef, useState } from "react";

const MIN_BPM = 40;
const MAX_BPM = 240;

/**
 * Web Audio metronome using the classic lookahead scheduler:
 * a coarse setInterval wakes up every 25ms and schedules clicks
 * ~120ms ahead on the audio clock, so timing stays sample-accurate
 * even when the main thread is busy.
 */
export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(-1); // currently sounding beat, for the dots

  // Live refs so the scheduler picks up tempo/meter changes without restarting.
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const beatsRef = useRef(beatsPerBar);
  beatsRef.current = beatsPerBar;

  const engineRef = useRef(null); // { ctx, timer, raf, nextNoteTime, beatIndex, queue }
  const tapsRef = useRef([]);

  const stop = () => {
    const e = engineRef.current;
    if (!e) return;
    clearInterval(e.timer);
    cancelAnimationFrame(e.raf);
    e.ctx.close();
    engineRef.current = null;
    setRunning(false);
    setBeat(-1);
  };

  const start = () => {
    if (engineRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    const e = {
      ctx,
      nextNoteTime: ctx.currentTime + 0.06,
      beatIndex: 0,
      queue: [], // scheduled { time, beat } pairs waiting for their visual flash
      timer: 0,
      raf: 0,
    };
    engineRef.current = e;

    const click = (time, accent) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = accent ? 1568 : 1046; // G6 / C6 — woodblock-ish
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(accent ? 0.4 : 0.22, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.08);
    };

    e.timer = setInterval(() => {
      while (e.nextNoteTime < e.ctx.currentTime + 0.12) {
        const beatInBar = e.beatIndex % beatsRef.current;
        click(e.nextNoteTime, beatInBar === 0);
        e.queue.push({ time: e.nextNoteTime, beat: beatInBar });
        e.nextNoteTime += 60 / bpmRef.current;
        e.beatIndex++;
      }
    }, 25);

    // Flash the beat dot exactly when its click becomes audible.
    const draw = () => {
      while (e.queue.length && e.queue[0].time <= e.ctx.currentTime) {
        setBeat(e.queue.shift().beat);
      }
      e.raf = requestAnimationFrame(draw);
    };
    e.raf = requestAnimationFrame(draw);
    setRunning(true);
  };

  const tap = () => {
    const now = performance.now();
    // Only keep taps close enough together to be one tempo gesture.
    const taps = [...tapsRef.current.filter((t) => now - t < 2500), now];
    tapsRef.current = taps;
    if (taps.length >= 2) {
      const intervals = taps.slice(1).map((t, i) => t - taps[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setBpm(Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, 60000 / avg))));
    }
  };

  // Kill the scheduler if the component unmounts mid-run.
  useEffect(() => stop, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="metronome">
      <div className="metro-row">
        <button
          className="metro-step"
          onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 1))}
          aria-label="Decrease tempo"
        >
          −
        </button>
        <div className="metro-bpm">
          <strong>{bpm}</strong>
          <span>BPM</span>
        </div>
        <button
          className="metro-step"
          onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 1))}
          aria-label="Increase tempo"
        >
          +
        </button>
        <input
          className="metro-slider"
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(event) => setBpm(Number(event.target.value))}
          aria-label="Tempo in beats per minute"
        />
      </div>

      <div className="metro-row">
        <select
          value={beatsPerBar}
          onChange={(event) => setBeatsPerBar(Number(event.target.value))}
          aria-label="Time signature"
        >
          <option value={2}>2/4</option>
          <option value={3}>3/4</option>
          <option value={4}>4/4</option>
          <option value={6}>6/8</option>
        </select>
        <button
          className={`mic-btn ${running ? "stop" : ""}`}
          onClick={running ? stop : start}
          aria-pressed={running}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button className="metro-tap" onClick={tap}>
          Tap tempo
        </button>
      </div>

      <div className="metro-beats" aria-hidden="true">
        {Array.from({ length: beatsPerBar }, (_, i) => (
          <span
            key={i}
            className={`metro-dot ${i === beat ? "on" : ""} ${i === 0 ? "accent" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
