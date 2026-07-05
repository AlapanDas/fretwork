import { SCALE_SONGS } from "../lib/theory";

export default function UsedBy({ scaleId }) {
  const songs = SCALE_SONGS[scaleId];
  if (!songs || songs.length === 0) return null;

  return (
    <details className="panel used-by-panel">
      <summary>Used in</summary>
      <div className="panel-body">
        <ul className="used-by-list">
          {songs.map(({ song, artist }) => (
            <li key={song} className="used-by-card">
              <span className="used-by-note">♩</span>
              <div>
                <div className="used-by-song">{song}</div>
                <div className="used-by-artist">{artist}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
