import { useEffect, useMemo, useState } from "react";
import {
  ROOTS,
  SCALE_GROUPS,
  scaleById,
  spellScale,
  GUITAR_TUNINGS,
  BASS_TUNINGS,
} from "./lib/theory";
import Fretboard from "./components/Fretboard";
import InfoPanels from "./components/InfoPanels";
import Tuner from "./components/Tuner";

export default function App() {
  const [rootLabel, setRootLabel] = useState("A");
  const [scaleId, setScaleId] = useState("pentatonic-minor");
  const [instrument, setInstrument] = useState("guitar");
  const [guitarTuning, setGuitarTuning] = useState("standard");
  const [bassTuning, setBassTuning] = useState("bass-standard");
  const [display, setDisplay] = useState("names"); // names | degrees | dots
  const [lefty, setLefty] = useState(false);
  const [fretCount, setFretCount] = useState(15);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fretwork-theme", theme);
  }, [theme]);

  const scale = scaleById(scaleId);
  const tunings = instrument === "guitar" ? GUITAR_TUNINGS : BASS_TUNINGS;
  const tuningId = instrument === "guitar" ? guitarTuning : bassTuning;
  const tuning = tunings.find((t) => t.id === tuningId);

  const noteNames = useMemo(
    () => spellScale(rootLabel, scale.intervals),
    [rootLabel, scale]
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="header-inner">
          <div>
            <div className="brand">
              Fret<em>work</em>
            </div>
            <div className="brand-sub">Guitar scale explorer</div>
          </div>
          <div className="header-actions">
            <div className="instrument-toggle" role="group" aria-label="Instrument">
              <button
                className={instrument === "guitar" ? "active" : ""}
                aria-pressed={instrument === "guitar"}
                onClick={() => setInstrument("guitar")}
              >
                Guitar
              </button>
              <button
                className={instrument === "bass" ? "active" : ""}
                aria-pressed={instrument === "bass"}
                onClick={() => setInstrument("bass")}
              >
                Bass
              </button>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </div>
        <nav className="note-strip" aria-label="Root note">
          <div className="note-strip-inner">
            {ROOTS.map((r) => (
              <button
                key={r.label}
                className={`note-btn ${r.label === rootLabel ? "active" : ""}`}
                aria-pressed={r.label === rootLabel}
                onClick={() => setRootLabel(r.label)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className={`layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        {sidebarOpen ? (
          <aside className="sidebar" aria-label="Scale picker">
            <div className="sidebar-head">
              <h2>Scales</h2>
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(false)}
                aria-label="Collapse scale picker"
                title="Collapse"
              >
                ‹
              </button>
            </div>
            {SCALE_GROUPS.map((group) => (
              <div className="scale-group" key={group.name}>
                <h3>{group.name}</h3>
                {group.scales.map((s) => (
                  <button
                    key={s.id}
                    className={`scale-btn ${s.id === scaleId ? "active" : ""}`}
                    aria-pressed={s.id === scaleId}
                    onClick={() => setScaleId(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            ))}
          </aside>
        ) : (
          <button
            className="sidebar-open"
            onClick={() => setSidebarOpen(true)}
            aria-label="Show scale picker"
            title="Show scales"
          >
            <span className="sidebar-open-icon">›</span>
            <span className="sidebar-open-label">Scales</span>
          </button>
        )}

        <main id="main" tabIndex={-1}>
          <h1 className="scale-title" aria-live="polite">
            <span className="root">{rootLabel}</span> {scale.name}
          </h1>
          <div className="scale-meta">
            <span className="chip root">
              Root <strong>{rootLabel}</strong>
            </span>
            <span className="chip">
              Notes <strong>{noteNames.join(" ")}</strong>
            </span>
            <span className="chip">
              Tuning <strong>{tuning.name}</strong>
            </span>
          </div>

          <div className="controls">
            <div className="seg" role="group" aria-label="Note labels">
              <button
                className={display === "names" ? "active" : ""}
                aria-pressed={display === "names"}
                onClick={() => setDisplay("names")}
              >
                Note names
              </button>
              <button
                className={display === "degrees" ? "active" : ""}
                aria-pressed={display === "degrees"}
                onClick={() => setDisplay("degrees")}
              >
                Degrees
              </button>
              <button
                className={display === "dots" ? "active" : ""}
                aria-pressed={display === "dots"}
                onClick={() => setDisplay("dots")}
              >
                Dots
              </button>
            </div>

            <select
              value={tuningId}
              onChange={(e) =>
                instrument === "guitar"
                  ? setGuitarTuning(e.target.value)
                  : setBassTuning(e.target.value)
              }
              aria-label="Tuning"
            >
              {tunings.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              value={fretCount}
              onChange={(e) => setFretCount(Number(e.target.value))}
              aria-label="Fret count"
            >
              <option value={12}>12 frets</option>
              <option value={15}>15 frets</option>
              <option value={22}>22 frets</option>
            </select>

            <div className="seg" role="group" aria-label="Handedness">
              <button
                className={!lefty ? "active" : ""}
                aria-pressed={!lefty}
                onClick={() => setLefty(false)}
              >
                Right-handed
              </button>
              <button
                className={lefty ? "active" : ""}
                aria-pressed={lefty}
                onClick={() => setLefty(true)}
              >
                Left-handed
              </button>
            </div>
          </div>

          <div className="board-card">
            <Fretboard
              strings={tuning.strings}
              rootLabel={rootLabel}
              scaleName={scale.name}
              intervals={scale.intervals}
              fretCount={fretCount}
              showNames={display}
              lefty={lefty}
            />
            <div className="legend">
              <span>
                <i className="dot root" /> Root note
              </span>
              <span>
                <i className="dot note" /> Scale note
              </span>
            </div>
          </div>

          <details className="panel tuner-panel">
            <summary>Tuner</summary>
            <div className="panel-body">
              <Tuner tuning={tuning} instrument={instrument} />
            </div>
          </details>

          <InfoPanels rootLabel={rootLabel} scale={scale} />
        </main>
      </div>

      <footer className="footer">
        Fretwork — an open scale reference. All diagrams are generated live; switching root, scale,
        tuning or instrument never reloads the page.
      </footer>
    </>
  );
}
