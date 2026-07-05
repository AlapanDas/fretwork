# Fretwork

A React scale explorer inspired by guitarscale.org, rebuilt from scratch with a modern,
Fender-flavored UI. Everything is computed client-side — switching root note, scale,
tuning, instrument, or handedness re-renders instantly with zero page loads.

## Features

- **17 root note choices** (all 12 pitches incl. enharmonic spellings: C# / Db, etc.)
- **24 scale types** across five groups: Essentials, Pentatonic & Blues, the seven Modes,
  Jazz & Symmetric (bebop, whole tone, diminished), and World & Exotic (Spanish, Persian, Gypsy)
- **Guitar + bass** with tuning presets: Standard, Drop D, Double Drop D, DADGAD,
  Open D / E / G, D Standard, and 4/5-string bass
- **SVG fretboard** (12 / 15 / 22 frets) with rosewood board, pearl inlays, gauge-scaled strings
- Note labels as **names, degrees, or plain dots**; **left-handed mirror** mode
- **Correct note spelling** — heptatonic scales get one note per letter (F# major shows E#, not F)
- Collapsible theory panels: degrees + interval names, step formula (W–H), and
  **diatonic triads & seventh chords** computed by stacking thirds

## Palette

| Token    | Hex       | Nod to                    |
| -------- | --------- | ------------------------- |
| Blonde   | `#F6F0E4` | blonde Telecaster finish  |
| Rosewood | `#29201A` | rosewood fingerboard      |
| Tweed    | `#C7A76C` | tweed amp covering        |
| Surf     | `#4FB3A1` | Surf Green                |
| Fiesta   | `#D5503C` | Fiesta Red (root notes)   |

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Structure

```
src/
  lib/theory.js          # notes, spelling, scale catalog, tunings, chord math
  components/
    Fretboard.jsx        # SVG fretboard renderer
    InfoPanels.jsx       # degrees / chords / theory panels
  App.jsx                # state + layout
  styles.css             # design tokens + all styling
```

No state library, no router, no CSS framework — just React, one theory module, and CSS
custom properties. Adding a scale is one line in `SCALE_GROUPS`; adding a tuning is one
line in `GUITAR_TUNINGS`.

## Support

If Fretwork helps your practice, you can [☕ buy me a coffee](https://buymeacoffee.com/alapandas3).
