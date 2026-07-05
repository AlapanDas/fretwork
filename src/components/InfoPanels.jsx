import {
  spellScale,
  degreeOf,
  intervalNameOf,
  stepFormula,
  diatonicChords,
  SCALE_NOTES_TEXT,
} from "../lib/theory";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

export default function InfoPanels({ rootLabel, scale }) {
  const names = spellScale(rootLabel, scale.intervals);
  const steps = stepFormula(scale.intervals);
  const chords = diatonicChords(rootLabel, scale.intervals);

  return (
    <div className="panels">
      <details className="panel" open>
        <summary>Notes & degrees</summary>
        <div className="panel-body">
          <div className="table-scroll">
          <table className="degree-table">
            <thead>
              <tr>
                <th>Degree</th>
                {scale.intervals.map((iv) => (
                  <th key={iv}>{degreeOf(iv)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Note</th>
                {names.map((n, i) => (
                  <td key={i} className={`note-name ${i === 0 ? "is-root" : ""}`}>
                    {n}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Interval</th>
                {scale.intervals.map((iv) => (
                  <td key={iv}>{intervalNameOf(iv)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          </div>
          <p className="steps">
            Step formula:&nbsp;
            {steps.map((s) => (s === 1 ? "H" : s === 2 ? "W" : `${s / 2}W`)).join(" – ")}
            &nbsp;&nbsp;({steps.join(" - ")} in semitones)
          </p>
        </div>
      </details>

      {chords && (
        <details className="panel">
          <summary>Diatonic chords</summary>
          <div className="panel-body">
            <div className="table-scroll">
            <table className="chord-table">
              <thead>
                <tr>
                  <th></th>
                  {ROMAN.map((r) => (
                    <th key={r}>{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Triads</th>
                  {chords.map((c, i) => (
                    <td key={i} className={i === 0 ? "is-root" : ""}>
                      {c.triad}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Sevenths</th>
                  {chords.map((c, i) => (
                    <td key={i} className={i === 0 ? "is-root" : ""}>
                      {c.seventh}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </details>
      )}

      <details className="panel">
        <summary>About this scale</summary>
        <div className="panel-body">
          <p>{SCALE_NOTES_TEXT[scale.id]}</p>
          <p>
            {scale.intervals.length} notes per octave. Every pattern shown is movable: shift the
            whole shape up or down the neck and the scale changes key with it.
          </p>
        </div>
      </details>
    </div>
  );
}
