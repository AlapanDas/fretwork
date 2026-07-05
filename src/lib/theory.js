// ---------------------------------------------------------------------------
// Core pitch data
// ---------------------------------------------------------------------------

export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// Root choices shown in the nav — enharmonic pairs share a pitch class.
export const ROOTS = [
  { label: "C", pc: 0 },
  { label: "C#", pc: 1 },
  { label: "Db", pc: 1 },
  { label: "D", pc: 2 },
  { label: "D#", pc: 3 },
  { label: "Eb", pc: 3 },
  { label: "E", pc: 4 },
  { label: "F", pc: 5 },
  { label: "F#", pc: 6 },
  { label: "Gb", pc: 6 },
  { label: "G", pc: 7 },
  { label: "G#", pc: 8 },
  { label: "Ab", pc: 8 },
  { label: "A", pc: 9 },
  { label: "A#", pc: 10 },
  { label: "Bb", pc: 10 },
  { label: "B", pc: 11 },
];

// ---------------------------------------------------------------------------
// Scale catalog — intervals are semitones from the root
// ---------------------------------------------------------------------------

export const SCALE_GROUPS = [
  {
    name: "Essentials",
    scales: [
      { id: "major", name: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
      { id: "minor", name: "Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
      { id: "melodic-minor", name: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
      { id: "harmonic-minor", name: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
    ],
  },
  {
    name: "Pentatonic & Blues",
    scales: [
      { id: "pentatonic-major", name: "Major Pentatonic", intervals: [0, 2, 4, 7, 9] },
      { id: "pentatonic-minor", name: "Minor Pentatonic", intervals: [0, 3, 5, 7, 10] },
      { id: "blues", name: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
      { id: "rocknroll", name: "Rock 'n' Roll", intervals: [0, 2, 3, 4, 5, 7, 9, 10] },
    ],
  },
  {
    name: "Modes",
    scales: [
      { id: "ionian", name: "Ionian", intervals: [0, 2, 4, 5, 7, 9, 11] },
      { id: "dorian", name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
      { id: "phrygian", name: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
      { id: "lydian", name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
      { id: "mixolydian", name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
      { id: "aeolian", name: "Aeolian", intervals: [0, 2, 3, 5, 7, 8, 10] },
      { id: "locrian", name: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10] },
    ],
  },
  {
    name: "Jazz & Symmetric",
    scales: [
      { id: "dorian-bebop", name: "Dorian Bebop", intervals: [0, 2, 3, 4, 5, 7, 9, 10] },
      { id: "mixolydian-bebop", name: "Mixolydian Bebop", intervals: [0, 2, 4, 5, 7, 9, 10, 11] },
      { id: "whole-tone", name: "Whole Tone", intervals: [0, 2, 4, 6, 8, 10] },
      { id: "half-whole-dim", name: "Half-Whole Diminished", intervals: [0, 1, 3, 4, 6, 7, 9, 10] },
      { id: "whole-half-dim", name: "Whole-Half Diminished", intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
    ],
  },
  {
    name: "World & Exotic",
    scales: [
      { id: "spanish", name: "Spanish Major", intervals: [0, 1, 4, 5, 7, 8, 10] },
      { id: "persian", name: "Persian", intervals: [0, 1, 4, 5, 6, 8, 11] },
      { id: "gypsy-major", name: "Gypsy Major", intervals: [0, 1, 4, 5, 7, 8, 11] },
      { id: "gypsy-minor", name: "Gypsy Minor", intervals: [0, 2, 3, 6, 7, 8, 11] },
    ],
  },
];

export const ALL_SCALES = SCALE_GROUPS.flatMap((g) => g.scales);
export const scaleById = (id) => ALL_SCALES.find((s) => s.id === id);

// Short, original blurbs shown in the theory panel.
export const SCALE_NOTES_TEXT = {
  major: "The bedrock of Western harmony. Bright and resolved — most songs you know lean on it.",
  minor: "The natural minor. Darker sibling of the major scale; shares its notes with the relative major three semitones up.",
  "melodic-minor": "A minor scale with raised 6th and 7th on the way up. A staple of jazz vocabulary.",
  "harmonic-minor": "Minor with a raised 7th, producing the dramatic augmented-second leap loved in classical and neoclassical rock.",
  "pentatonic-major": "Five notes, zero friction. Country, pop and folk solos live here.",
  "pentatonic-minor": "The first scale most lead players learn. Rock and blues soloing starts from these five notes.",
  blues: "Minor pentatonic plus the flat five — the 'blue note' that gives the style its grit.",
  rocknroll: "A hybrid of the major and minor pentatonics. Chuck Berry-style double stops and honky-tonk lines come from this pool.",
  ionian: "Mode I — identical to the major scale.",
  dorian: "Mode II — minor with a bright natural 6th. Santana, funk and modal jazz territory.",
  phrygian: "Mode III — the flat 2nd gives it a Spanish, slightly menacing color.",
  lydian: "Mode IV — major with a raised 4th. Dreamy, floating, film-score flavor.",
  mixolydian: "Mode V — major with a flat 7th. The default sound of rock and blues over a dominant chord.",
  aeolian: "Mode VI — identical to the natural minor scale.",
  locrian: "Mode VII — diminished 5th on the root chord makes it the least stable mode.",
  "dorian-bebop": "Dorian with an added major 3rd passing tone, keeping chord tones on the downbeats.",
  "mixolydian-bebop": "Mixolydian with an added natural 7th passing tone — the classic bebop dominant sound.",
  "whole-tone": "All whole steps. Symmetrical, ambiguous, dreamlike — pairs with augmented chords.",
  "half-whole-dim": "Alternating half and whole steps. The go-to color over dominant 7♭9 chords.",
  "whole-half-dim": "Alternating whole and half steps. Fits diminished 7th chords.",
  spanish: "Phrygian with a major 3rd (Phrygian dominant). Flamenco and metal both claim it.",
  persian: "An exotic scale with both a flat 2nd and flat 5th — intensely dramatic.",
  "gypsy-major": "Also called the double harmonic major. Two augmented seconds give it an unmistakable Eastern sound.",
  "gypsy-minor": "The Hungarian minor: harmonic minor with a raised 4th.",
};

// ---------------------------------------------------------------------------
// Tunings
// ---------------------------------------------------------------------------
// Strings listed low → high as { pc, octave-ish label }.

export const GUITAR_TUNINGS = [
  { id: "standard", name: "Standard (E A D G B E)", strings: [4, 9, 2, 7, 11, 4] },
  { id: "drop-d", name: "Drop D (D A D G B E)", strings: [2, 9, 2, 7, 11, 4] },
  { id: "double-drop-d", name: "Double Drop D (D A D G B D)", strings: [2, 9, 2, 7, 11, 2] },
  { id: "dadgad", name: "DADGAD", strings: [2, 9, 2, 7, 9, 2] },
  { id: "open-d", name: "Open D (D A D F# A D)", strings: [2, 9, 2, 6, 9, 2] },
  { id: "open-e", name: "Open E (E B E G# B E)", strings: [4, 11, 4, 8, 11, 4] },
  { id: "open-g", name: "Open G (D G D G B D)", strings: [2, 7, 2, 7, 11, 2] },
  { id: "d-standard", name: "D Standard (D G C F A D)", strings: [2, 7, 0, 5, 9, 2] },
];

export const BASS_TUNINGS = [
  { id: "bass-standard", name: "Standard (E A D G)", strings: [4, 9, 2, 7] },
  { id: "bass-drop-d", name: "Drop D (D A D G)", strings: [2, 9, 2, 7] },
  { id: "bass-5-string", name: "5-string (B E A D G)", strings: [11, 4, 9, 2, 7] },
];

// ---------------------------------------------------------------------------
// Note spelling
// ---------------------------------------------------------------------------

const accidentalString = (diff) => {
  // diff = pc - letterPc, normalized to [-2, 2]
  let d = ((diff % 12) + 12) % 12;
  if (d > 6) d -= 12;
  if (d === 0) return "";
  if (d > 0) return "#".repeat(d);
  return "b".repeat(-d);
};

/**
 * Spell a scale with sensible note names.
 * Heptatonic scales get one note per letter; everything else falls back to a
 * sharp/flat preference derived from the root label.
 */
export function spellScale(rootLabel, intervals) {
  const rootPc = pcOfLabel(rootLabel);
  const pcs = intervals.map((i) => (rootPc + i) % 12);

  if (intervals.length === 7) {
    const rootLetterIdx = LETTERS.indexOf(rootLabel[0]);
    const names = pcs.map((pc, i) => {
      const letter = LETTERS[(rootLetterIdx + i) % 7];
      const diff = pc - LETTER_PC[letter];
      const acc = accidentalString(diff);
      // Bail out of triple accidentals — fall back to preference spelling.
      if (acc.length > 2) return null;
      return letter + acc;
    });
    if (!names.includes(null)) return names;
  }

  const preferFlats = rootLabel.includes("b") || ["F"].includes(rootLabel);
  const table = preferFlats ? FLAT_NAMES : SHARP_NAMES;
  return pcs.map((pc) => table[pc]);
}

export function pcOfLabel(label) {
  const letter = label[0];
  let pc = LETTER_PC[letter];
  for (const ch of label.slice(1)) pc += ch === "#" ? 1 : -1;
  return ((pc % 12) + 12) % 12;
}

// ---------------------------------------------------------------------------
// Degrees & intervals
// ---------------------------------------------------------------------------

const DEGREE_NAMES = {
  0: "1",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7",
};

const INTERVAL_NAMES = {
  0: "Unison",
  1: "Minor 2nd",
  2: "Major 2nd",
  3: "Minor 3rd",
  4: "Major 3rd",
  5: "Perfect 4th",
  6: "Tritone",
  7: "Perfect 5th",
  8: "Minor 6th",
  9: "Major 6th",
  10: "Minor 7th",
  11: "Major 7th",
};

export const degreeOf = (semitones) => DEGREE_NAMES[semitones % 12];
export const intervalNameOf = (semitones) => INTERVAL_NAMES[semitones % 12];

/** Whole/half-step formula, e.g. [2,2,1,2,2,2,1] for major. */
export function stepFormula(intervals) {
  const steps = [];
  for (let i = 0; i < intervals.length; i++) {
    const next = i + 1 < intervals.length ? intervals[i + 1] : intervals[0] + 12;
    steps.push(next - intervals[i]);
  }
  return steps;
}

// ---------------------------------------------------------------------------
// Diatonic chords (heptatonic scales only)
// ---------------------------------------------------------------------------

const TRIAD_QUALITY = { "4,7": "", "3,7": "m", "3,6": "dim", "4,8": "aug" };
const SEVENTH_QUALITY = {
  "4,7,11": "maj7",
  "4,7,10": "7",
  "3,7,10": "m7",
  "3,6,10": "m7b5",
  "3,6,9": "dim7",
  "4,8,11": "maj7#5",
  "3,7,11": "m(maj7)",
  "4,8,10": "7#5",
};

export function diatonicChords(rootLabel, intervals) {
  if (intervals.length !== 7) return null;
  const names = spellScale(rootLabel, intervals);
  const chords = [];
  for (let i = 0; i < 7; i++) {
    const at = (k) => (intervals[(i + k) % 7] + (i + k >= 7 ? 12 : 0) - intervals[i] + 24) % 12;
    const third = at(2);
    const fifth = at(4);
    const seventh = at(6);
    const triad = TRIAD_QUALITY[`${third},${fifth}`];
    const seven = SEVENTH_QUALITY[`${third},${fifth},${seventh}`];
    chords.push({
      degree: i + 1,
      triad: triad !== undefined ? names[i] + triad : "—",
      seventh: seven !== undefined ? names[i] + seven : "—",
    });
  }
  return chords;
}

// ---------------------------------------------------------------------------
// Fretboard mapping
// ---------------------------------------------------------------------------

/**
 * Returns per-string arrays of frets that belong to the scale.
 * strings: array of open-string pitch classes (low → high)
 */
export function mapScaleToFretboard(strings, rootPc, intervals, fretCount) {
  const set = new Set(intervals.map((i) => (rootPc + i) % 12));
  return strings.map((openPc) => {
    const frets = [];
    for (let f = 0; f <= fretCount; f++) {
      const pc = (openPc + f) % 12;
      if (set.has(pc)) frets.push({ fret: f, pc, isRoot: pc === rootPc });
    }
    return frets;
  });
}

/** Map a pitch class to its display name within the current scale spelling. */
export function noteNameLookup(rootLabel, intervals) {
  const rootPc = pcOfLabel(rootLabel);
  const names = spellScale(rootLabel, intervals);
  const map = {};
  intervals.forEach((iv, idx) => {
    map[(rootPc + iv) % 12] = names[idx];
  });
  return map;
}
