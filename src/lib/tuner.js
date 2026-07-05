// ---------------------------------------------------------------------------
// Tuner helpers — pitch math and autocorrelation pitch detection
// ---------------------------------------------------------------------------

import { SHARP_NAMES } from "./theory";

export const freqOfMidi = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** "E2", "A#3" … from a MIDI number. */
export const nameOfMidi = (midi) => ({
  note: SHARP_NAMES[midi % 12],
  octave: Math.floor(midi / 12) - 1,
});

/**
 * Derive concrete MIDI numbers for a tuning's open strings.
 * Tunings store pitch classes only (low → high); we anchor the lowest string
 * to the instrument's usual register (guitar low strings live around D2–C#3,
 * bass around B0–A#1) and walk upward, taking the smallest ascending interval
 * to each next string — which matches how real tunings are strung.
 */
export function midiForStrings(strings, instrument) {
  const anchorMidi = instrument === "bass" ? 23 : 38; // B0 | D2
  const anchorPc = anchorMidi % 12;
  const midis = [];
  let prev = 0;
  strings.forEach((pc, i) => {
    if (i === 0) {
      prev = anchorMidi + ((((pc - anchorPc) % 12) + 12) % 12);
    } else {
      prev += ((((pc - prev) % 12) + 12) % 12) || 12;
    }
    midis.push(prev);
  });
  return midis;
}

/** Nearest MIDI note + cents deviation for a detected frequency. */
export function noteFromFreq(freq) {
  const midiFloat = 69 + 12 * Math.log2(freq / 440);
  const midi = Math.round(midiFloat);
  return { midi, cents: Math.round((midiFloat - midi) * 100) };
}

/**
 * ACF2+ autocorrelation pitch detector (time-domain).
 * Returns the detected frequency in Hz, or -1 when the signal is too quiet.
 */
export function autoCorrelate(buf, sampleRate) {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1; // too quiet to bother

  // Trim leading/trailing silence for a cleaner correlation.
  const thres = 0.2;
  let r1 = 0;
  let r2 = size - 1;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thres) {
      r2 = size - i;
      break;
    }
  }
  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (d + 1 < size && c[d] > c[d + 1]) d++;

  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  if (maxpos <= 0) return -1;
  let T0 = maxpos;

  // Parabolic interpolation around the peak for sub-sample accuracy.
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1] ?? x2;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}
