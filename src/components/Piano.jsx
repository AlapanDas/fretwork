import { useMemo } from "react";
import { pcOfLabel, noteNameLookup, degreeOf } from "../lib/theory";

const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
// white-key index within the octave → pitch class of the black key to its right
const BLACK_AFTER = { 0: 1, 1: 3, 3: 6, 4: 8, 5: 10 };

/**
 * SVG piano keyboard spanning two octaves (C4–C6) with scale notes marked,
 * matching the fretboard's display modes and colors.
 */
export default function Piano({ rootLabel, scaleName, intervals, showNames }) {
  const rootPc = pcOfLabel(rootLabel);

  const { nameMap, inScale } = useMemo(
    () => ({
      nameMap: noteNameLookup(rootLabel, intervals),
      inScale: new Set(intervals.map((iv) => (rootPc + iv) % 12)),
    }),
    [rootLabel, rootPc, intervals]
  );

  // Geometry
  const octaves = 2;
  const whiteW = 52;
  const whiteH = 190;
  const blackW = 30;
  const blackH = 118;

  const whites = [];
  const blacks = [];
  for (let o = 0; o < octaves; o++) {
    WHITE_PCS.forEach((pc, wi) => {
      const x = (o * 7 + wi) * whiteW;
      whites.push({ x, pc, octave: 4 + o });
      if (BLACK_AFTER[wi] !== undefined) {
        blacks.push({ x: x + whiteW - blackW / 2, pc: BLACK_AFTER[wi], octave: 4 + o });
      }
    });
  }
  // Closing C at the top of the range
  whites.push({ x: octaves * 7 * whiteW, pc: 0, octave: 4 + octaves });

  const width = (octaves * 7 + 1) * whiteW;
  const height = whiteH + 26;

  const labelOf = (pc) =>
    showNames === "names"
      ? nameMap[pc]
      : showNames === "degrees"
        ? degreeOf((pc - rootPc + 12) % 12)
        : null;

  const marker = (cx, cy, pc, dark) => {
    const label = labelOf(pc);
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill={pc === rootPc ? "#d5503c" : "#4fb3a1"}
          stroke={dark ? "#29201a" : "#fffdf7"}
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
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <svg
      className="board-svg piano-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${rootLabel} ${scaleName || "scale"} on a piano keyboard, two octaves`}
    >
      {/* White keys */}
      {whites.map((k, i) => (
        <g key={`w${i}`}>
          <rect
            x={k.x}
            y={0}
            width={whiteW}
            height={whiteH}
            rx={4}
            fill="#fffdf7"
            stroke="#3a2b21"
            strokeWidth={1.5}
          />
          {inScale.has(k.pc) && marker(k.x + whiteW / 2, whiteH - 22, k.pc, false)}
          {k.pc === 0 && (
            <text
              x={k.x + whiteW / 2}
              y={height - 6}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill="#8a7a68"
            >
              C{k.octave}
            </text>
          )}
        </g>
      ))}

      {/* Black keys */}
      {blacks.map((k, i) => (
        <g key={`b${i}`}>
          <rect x={k.x} y={0} width={blackW} height={blackH} rx={3} fill="#29201a" />
          {inScale.has(k.pc) && marker(k.x + blackW / 2, blackH - 20, k.pc, true)}
        </g>
      ))}
    </svg>
  );
}
