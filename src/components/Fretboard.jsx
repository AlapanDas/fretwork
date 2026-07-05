import { useMemo } from "react";
import { mapScaleToFretboard, noteNameLookup, degreeOf, pcOfLabel } from "../lib/theory";

const INLAY_FRETS = [3, 5, 7, 9, 15];
const DOUBLE_INLAY = 12;

/**
 * SVG fretboard. Strings drawn low (bottom) → high (top), like the view of
 * a player looking down at their own guitar. `lefty` mirrors horizontally.
 */
export default function Fretboard({
  strings, // open-string pitch classes, low → high
  rootLabel,
  scaleName,
  intervals,
  fretCount = 15,
  showNames, // "names" | "degrees" | "dots"
  lefty,
}) {
  const rootPc = pcOfLabel(rootLabel);

  const { positions, nameMap } = useMemo(
    () => ({
      positions: mapScaleToFretboard(strings, rootPc, intervals, fretCount),
      nameMap: noteNameLookup(rootLabel, intervals),
    }),
    [strings, rootPc, rootLabel, intervals, fretCount]
  );

  // Geometry
  const nutW = 14;
  const fretW = 64;
  const stringGap = 30;
  const padTop = 26;
  const padLeft = 44;
  const width = padLeft + nutW + fretCount * fretW + 20;
  const height = padTop + (strings.length - 1) * stringGap + 44;

  const fretX = (f) => padLeft + nutW + f * fretW; // wire position
  const noteX = (f) => (f === 0 ? padLeft + nutW / 2 : fretX(f) - fretW / 2);
  // string index 0 = lowest → drawn at bottom
  const stringY = (s) => padTop + (strings.length - 1 - s) * stringGap;

  const boardTop = padTop - 14;
  const boardH = (strings.length - 1) * stringGap + 28;

  return (
    <svg
      className="board-svg"
      viewBox={`0 0 ${width} ${height}`}
      style={lefty ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label={`${rootLabel} ${scaleName || "scale"} on a ${strings.length}-string fretboard, ${fretCount} frets`}
    >
      {/* Board */}
      <rect
        x={padLeft}
        y={boardTop}
        width={nutW + fretCount * fretW}
        height={boardH}
        rx={4}
        fill="#3a2b21"
      />
      {/* Nut */}
      <rect x={padLeft} y={boardTop} width={nutW} height={boardH} fill="#efe6d2" rx={2} />

      {/* Inlays */}
      {INLAY_FRETS.filter((f) => f <= fretCount).map((f) => (
        <circle
          key={f}
          cx={noteX(f)}
          cy={boardTop + boardH / 2}
          r={5.5}
          fill="#d8c9a5"
          opacity={0.55}
        />
      ))}
      {DOUBLE_INLAY <= fretCount && (
        <>
          <circle cx={noteX(12)} cy={boardTop + boardH * 0.3} r={5.5} fill="#d8c9a5" opacity={0.55} />
          <circle cx={noteX(12)} cy={boardTop + boardH * 0.7} r={5.5} fill="#d8c9a5" opacity={0.55} />
        </>
      )}

      {/* Fret wires */}
      {Array.from({ length: fretCount }, (_, i) => i + 1).map((f) => (
        <line
          key={f}
          x1={fretX(f)}
          y1={boardTop}
          x2={fretX(f)}
          y2={boardTop + boardH}
          stroke="#8f7a63"
          strokeWidth={2}
        />
      ))}

      {/* Strings — thicker for lower strings */}
      {strings.map((_, s) => (
        <line
          key={s}
          x1={padLeft}
          y1={stringY(s)}
          x2={padLeft + nutW + fretCount * fretW}
          y2={stringY(s)}
          stroke="#cfc2ac"
          strokeWidth={0.8 + (strings.length - 1 - s) * 0.45}
        />
      ))}

      {/* Fret numbers */}
      {Array.from({ length: fretCount }, (_, i) => i + 1).map((f) => (
        <text
          key={f}
          x={noteX(f)}
          y={height - 8}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill="#8a7a68"
          transform={lefty ? `scale(-1,1) translate(${-2 * noteX(f)},0)` : undefined}
        >
          {f}
        </text>
      ))}

      {/* Notes */}
      {positions.map((frets, s) =>
        frets.map(({ fret, pc, isRoot }) => {
          const cx = noteX(fret);
          const cy = stringY(s);
          const label =
            showNames === "names"
              ? nameMap[pc]
              : showNames === "degrees"
                ? degreeOf((pc - rootPc + 12) % 12)
                : null;
          return (
            <g key={`${s}-${fret}`}>
              <circle
                cx={cx}
                cy={cy}
                r={11}
                fill={isRoot ? "#d5503c" : "#4fb3a1"}
                stroke="#fffdf7"
                strokeWidth={1.5}
              />
              {label && (
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  fontSize={label.length > 2 ? 8 : 10}
                  fontWeight={600}
                  fontFamily="Inter, sans-serif"
                  fill="#fff"
                  transform={lefty ? `scale(-1,1) translate(${-2 * cx},0)` : undefined}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}
