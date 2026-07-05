import { useEffect, useMemo, useRef, useState } from "react";
import { midiForStrings, freqOfMidi, nameOfMidi, noteFromFreq, autoCorrelate } from "../lib/tuner";

/**
 * Two-part tuner:
 *  1. Reference tones — click a string to hear its open-string pitch.
 *  2. Mic tuner — autocorrelation pitch detection with a cents meter.
 */
export default function Tuner({ tuning, instrument }) {
  const midis = useMemo(
    () => midiForStrings(tuning.strings, instrument),
    [tuning, instrument]
  );

  // --- Reference tones -----------------------------------------------------
  const audioCtxRef = useRef(null);
  const [playing, setPlaying] = useState(null);

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playTone = (midi) => {
    const ctx = ensureCtx();
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freqOfMidi(midi);
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.9);
    setPlaying(midi);
    osc.onended = () => setPlaying((p) => (p === midi ? null : p));
  };

  // --- Mic tuner ------------------------------------------------------------
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState(null); // { freq, midi, cents }
  const [micError, setMicError] = useState("");
  const micRef = useRef(null); // { stream, source, analyser, raf, buf }

  const stopMic = () => {
    const mic = micRef.current;
    if (!mic) return;
    cancelAnimationFrame(mic.raf);
    mic.source.disconnect();
    mic.stream.getTracks().forEach((track) => track.stop());
    micRef.current = null;
    setListening(false);
    setReading(null);
  };

  const startMic = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = ensureCtx();
      ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      const mic = { stream, source, analyser, raf: 0, buf };
      micRef.current = mic;
      setListening(true);

      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, ctx.sampleRate);
        if (freq > 0 && freq < 2000) {
          const { midi, cents } = noteFromFreq(freq);
          setReading({ freq, midi, cents });
        } else {
          setReading(null);
        }
        mic.raf = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      setMicError(
        err.name === "NotAllowedError"
          ? "Microphone access was denied. Allow it in your browser settings to use the tuner."
          : "Could not access a microphone on this device."
      );
      setListening(false);
    }
  };

  // Clean up mic + audio context on unmount.
  useEffect(
    () => () => {
      stopMic();
      audioCtxRef.current?.close();
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const inTune = reading && Math.abs(reading.cents) <= 5;
  const needleLeft = reading ? 50 + Math.max(-50, Math.min(50, reading.cents)) : 50;
  const readingName = reading ? nameOfMidi(reading.midi) : null;

  return (
    <div className="tuner">
      <section className="tuner-section" aria-label="Reference tones">
        <h4>Reference tones — {tuning.name}</h4>
        <div className="string-tones">
          {midis.map((midi, i) => {
            const { note, octave } = nameOfMidi(midi);
            return (
              <button
                key={i}
                className={`string-tone ${playing === midi ? "playing" : ""} ${
                  reading && reading.midi === midi ? "near" : ""
                }`}
                onClick={() => playTone(midi)}
                aria-label={`Play ${note}${octave} reference tone, string ${i + 1}`}
              >
                {note}
                {octave}
                <small>string {i + 1}</small>
              </button>
            );
          })}
        </div>
        <p className="tuner-hint">Tap a string to hear its open-string pitch.</p>
      </section>

      <section className="tuner-section" aria-label="Microphone tuner">
        <h4>Mic tuner</h4>
        <div className="mic-controls">
          <button
            className={`mic-btn ${listening ? "stop" : ""}`}
            onClick={listening ? stopMic : startMic}
            aria-pressed={listening}
          >
            {listening ? "Stop tuner" : "Start tuner"}
          </button>
          {listening && !reading && <span className="tuner-hint">Listening… play a string.</span>}
        </div>
        {micError && (
          <p className="tuner-error" role="alert">
            {micError}
          </p>
        )}

        {listening && (
          <div className="tuner-readout" aria-live="polite">
            <div className={`tuner-note ${inTune ? "in-tune" : ""}`}>
              {readingName ? (
                <>
                  {readingName.note}
                  <sub>{readingName.octave}</sub>
                </>
              ) : (
                "—"
              )}
            </div>
            <div
              className="cents-meter"
              role="img"
              aria-label={
                reading
                  ? `${readingName.note}${readingName.octave}, ${reading.cents} cents ${
                      reading.cents >= 0 ? "sharp" : "flat"
                    }`
                  : "No note detected"
              }
            >
              <div className="center-line" />
              {reading && (
                <div
                  className={`cents-needle ${inTune ? "in-tune" : ""}`}
                  style={{ left: `${needleLeft}%` }}
                />
              )}
            </div>
            <div className="cents-label">
              {reading ? `${reading.cents > 0 ? "+" : ""}${reading.cents}¢` : ""}
            </div>
            <div className="tuner-freq">{reading ? `${reading.freq.toFixed(1)} Hz` : ""}</div>
          </div>
        )}
      </section>
    </div>
  );
}
