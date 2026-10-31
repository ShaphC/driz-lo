"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "./MusicPanel.css";
type Playlist = { id: string; name: string; url: string };
const KEY = "drizlo-soundcloud-playlists-v1";
const SELECTED_KEY = "drizlo-soundcloud-selected-v1";
// Add verified, publicly embeddable SoundCloud playlist URLs here when curated.
// Do not use unverified playlist URLs or claim these are already licensed/available.
const CURATED: Playlist[] = [];
function validSoundCloudUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      !["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"].includes(
        host,
      )
    )
      return null;
    if (
      url.pathname === "/" ||
      url.pathname.split("/").filter(Boolean).length < 2
    )
      return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}
export default function MusicPanel() {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw))
        setPlaylists(
          raw
            .filter(
              (p): p is Playlist =>
                typeof p?.id === "string" &&
                typeof p?.name === "string" &&
                typeof p?.url === "string" &&
                !!validSoundCloudUrl(p.url),
            )
            .slice(0, 30),
        );
      setSelected(localStorage.getItem(SELECTED_KEY));
    } catch {
      /* Bad saved data should not break timer. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(playlists));
  }, [playlists, ready]);
  useEffect(() => {
    if (ready) {
      if (selected) localStorage.setItem(SELECTED_KEY, selected);
      else localStorage.removeItem(SELECTED_KEY);
    }
  }, [selected, ready]);
  const all = useMemo(() => [...CURATED, ...playlists], [playlists]);
  const current = all.find((p) => p.id === selected) || null;
  const embedUrl = current
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(current.url)}&color=%23f5b579&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`
    : null;
  function addPlaylist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = validSoundCloudUrl(link);
    if (!url) {
      setError(
        "Paste a public SoundCloud track or playlist URL (https://soundcloud.com/...).",
      );
      return;
    }
    const existing = playlists.find((p) => p.url === url);
    if (existing) {
      setSelected(existing.id);
      setError("");
      setLink("");
      return;
    }
    if (playlists.length >= 30) {
      setError(
        "You can save up to 30 links. Remove one before adding another.",
      );
      return;
    }
    const item = {
      id: `saved-${Date.now()}`,
      name: name.trim().slice(0, 60) || "My SoundCloud playlist",
      url,
    };
    setPlaylists((prev) => [...prev, item]);
    setSelected(item.id);
    setLink("");
    setName("");
    setError("");
  }
  return (
    <aside
      className={`drizlo-music ${open ? "drizlo-music-open" : ""}`}
      aria-label="Music player"
    >
      <button
        className="drizlo-music-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="drizlo-music-body"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕ Close music" : "♫ Music"}
      </button>
      <div
        className="drizlo-music-body"
        id="drizlo-music-body"
        aria-hidden={!open}
      >
        <div className="drizlo-music-heading">
          <strong>Listen while you focus</strong>
          <span>SoundCloud</span>
        </div>
        <p>
          Choose a saved sound or add a public SoundCloud link. Music plays
          independently of the timer.
        </p>
        {CURATED.length > 0 && (
          <>
            <h3>Ambient picks</h3>
            <div className="drizlo-music-list">
              {CURATED.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={selected === p.id ? "is-active" : ""}
                  onClick={() => setSelected(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </>
        )}
        {CURATED.length === 0 && (
          <p className="drizlo-music-notice">
            Curated ambient playlists are coming after we verify public embeds.
            You can add your own now.
          </p>
        )}
        {playlists.length > 0 && (
          <>
            <h3>Your saved links</h3>
            <div className="drizlo-music-list">
              {playlists.map((p) => (
                <div className="drizlo-music-item" key={p.id}>
                  <button
                    type="button"
                    className={selected === p.id ? "is-active" : ""}
                    onClick={() => setSelected(p.id)}
                  >
                    {p.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    className="drizlo-music-remove"
                    onClick={() => {
                      setPlaylists((prev) => prev.filter((x) => x.id !== p.id));
                      if (selected === p.id) setSelected(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <form onSubmit={addPlaylist} className="drizlo-music-form">
          <label htmlFor="drizlo-music-url">
            Add SoundCloud track or playlist
          </label>
          <input
            id="drizlo-music-url"
            type="url"
            placeholder="https://soundcloud.com/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <label htmlFor="drizlo-music-name">Name (optional)</label>
          <input
            id="drizlo-music-name"
            type="text"
            maxLength={60}
            placeholder="My focus music"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Save & load</button>
          {error && (
            <span role="alert" className="drizlo-music-error">
              {error}
            </span>
          )}
        </form>
        <a
          className="drizlo-music-browse"
          href="https://soundcloud.com/discover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse SoundCloud ↗
        </a>
      </div>
      {/* Never unmount the player when the panel closes: playback can continue. */}
      <div
        className={`drizlo-music-player ${current ? "has-track" : ""}`}
        ref={playerRef}
      >
        {embedUrl && (
          <>
            <div className="drizlo-music-now">{current?.name}</div>
            <iframe
              key={current?.id}
              title={`SoundCloud: ${current?.name}`}
              src={embedUrl}
              width="100%"
              height="166"
              allow="autoplay"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </>
        )}
      </div>
    </aside>
  );
}
