"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./MusicPanel.css";

type Playlist = { id: string; name: string; url: string };
type View = "player" | "library";

const KEY = "drizlo-soundcloud-playlists-v1";
const SELECTED_KEY = "drizlo-soundcloud-selected-v1";
// Add verified, publicly embeddable SoundCloud playlist URLs here when curated.
const CURATED: Playlist[] = [{ id: "ambient-default", name: "Ambient — SoundCloud", url: "https://soundcloud.com/ambientmusicstreaming/sets/ambient" }];

function validSoundCloudUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      !["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"].includes(host)
    ) return null;
    if (url.pathname.split("/").filter(Boolean).length < 2) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export default function MusicPanel() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("library");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [playerHeight, setPlayerHeight] = useState(300);
  const dragRef = useRef<{ y: number; height: number } | null>(null);

  useEffect(() => {
    let savedPlaylists: Playlist[] = [];
    let savedSelected: string | null = null;
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) {
        savedPlaylists = raw.filter(
          (p): p is Playlist =>
            typeof p?.id === "string" &&
            typeof p?.name === "string" &&
            typeof p?.url === "string" &&
            !!validSoundCloudUrl(p.url),
        ).slice(0, 30);
      }
      savedSelected = localStorage.getItem(SELECTED_KEY);
    } catch {
      // Invalid saved data must never affect the timer.
    }
    setPlaylists(savedPlaylists);
    const available = [...CURATED, ...savedPlaylists];
    const initial = available.some((p) => p.id === savedSelected)
      ? savedSelected
      : savedPlaylists.length > 0 ? savedPlaylists[0].id : CURATED[0]?.id ?? null;
    setSelected(initial);
    setView(initial ? "player" : "library");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(playlists)); } catch { /* Storage optional. */ }
  }, [playlists, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (selected) localStorage.setItem(SELECTED_KEY, selected);
      else localStorage.removeItem(SELECTED_KEY);
    } catch { /* Storage optional. */ }
  }, [selected, ready]);

  const all = useMemo(() => [...CURATED, ...playlists], [playlists]);
  const current = all.find((p) => p.id === selected) || null;
  const embedUrl = current
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(current.url)}&color=%23f5b579&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`
    : null;

  function beginResize(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = { y: event.clientY, height: playerHeight };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function resizePlayer(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const maximum = Math.max(220, Math.min(650, window.innerHeight - 240));
    setPlayerHeight(Math.max(180, Math.min(maximum, dragRef.current.height + event.clientY - dragRef.current.y)));
  }

  function endResize() { dragRef.current = null; }

  function saveRename(id: string) {
    const next = renameValue.trim().slice(0, 60);
    if (next) setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, name: next } : p));
    setRenameId(null);
  }

  function choosePlaylist(id: string) {
    setSelected(id);
    setView("player");
    setError("");
  }

  function addPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = validSoundCloudUrl(link);
    if (!url) {
      setError("Paste a public SoundCloud track or playlist URL (https://soundcloud.com/...).");
      return;
    }
    const existing = all.find((p) => p.url === url);
    if (existing) {
      choosePlaylist(existing.id);
      setLink("");
      setName("");
      return;
    }
    if (playlists.length >= 30) {
      setError("You can save up to 30 links. Remove one before adding another.");
      return;
    }
    const item: Playlist = {
      id: `saved-${Date.now()}`,
      name: name.trim().slice(0, 60) || "My SoundCloud playlist",
      url,
    };
    setPlaylists((prev) => [...prev, item]);
    choosePlaylist(item.id);
    setLink("");
    setName("");
  }

  return (
    <aside className={`drizlo-music ${open ? "drizlo-music-open" : ""}`} aria-label="Music player">
      <button
        className="drizlo-music-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="drizlo-music-body"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "✕ Close music" : "♫ Music"}
      </button>

      <div className="drizlo-music-body" id="drizlo-music-body" aria-hidden={!open}>
        <div className="drizlo-music-heading">
          <strong>{view === "player" && current ? "Now playing" : "Choose your music"}</strong>
          <span>SoundCloud</span>
        </div>

        {view === "player" && current ? (
          <div className="drizlo-music-player-view">
            <p className="drizlo-music-selected-name">{current.name}</p>
            <p>Music plays independently of your focus timer.</p>
            <button className="drizlo-music-switch" type="button" onClick={() => setView("library")}>Change music</button>
          </div>
        ) : (
          <div className="drizlo-music-library">
            {current && (
              <button className="drizlo-music-back" type="button" onClick={() => setView("player")}>← Back to player</button>
            )}
            {CURATED.length > 0 && (
              <>
                <h3>Ambient picks</h3>
                <div className="drizlo-music-list">
                  {CURATED.map((p) => (
                    <button type="button" key={p.id} className={selected === p.id ? "is-active" : ""} onClick={() => choosePlaylist(p.id)}>{p.name}</button>
                  ))}
                </div>
              </>
            )}
            {CURATED.length === 0 && (
              <p className="drizlo-music-notice">Curated ambient playlists are coming after we verify public embeds. You can add your own now.</p>
            )}
            {playlists.length > 0 && (
              <>
                <h3>Your saved links</h3>
                <div className="drizlo-music-list">
                  {playlists.map((p) => (
                    <div className="drizlo-music-item" key={p.id}>
                      {renameId === p.id ? (
                        <form className="drizlo-music-rename-form" onSubmit={(event) => { event.preventDefault(); saveRename(p.id); }}>
                          <input aria-label={`Rename ${p.name}`} maxLength={60} value={renameValue} onChange={(event) => setRenameValue(event.target.value)} autoFocus />
                          <button type="submit" aria-label="Save name">Save</button>
                          <button type="button" onClick={() => setRenameId(null)} aria-label="Cancel rename">Cancel</button>
                        </form>
                      ) : (
                        <>
                          <button type="button" className={selected === p.id ? "is-active" : ""} onClick={() => choosePlaylist(p.id)}>{p.name}</button>
                          <button type="button" className="drizlo-music-rename" aria-label={`Rename ${p.name}`} onClick={() => { setRenameId(p.id); setRenameValue(p.name); }}>Rename</button>
                        </>
                      )}
                      <button type="button" aria-label={`Remove ${p.name}`} className="drizlo-music-remove" onClick={() => {
                        setPlaylists((prev) => prev.filter((x) => x.id !== p.id));
                        if (selected === p.id) { setSelected(null); setView("library"); }
                      }}>×</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <form onSubmit={addPlaylist} className="drizlo-music-form">
              <label htmlFor="drizlo-music-url">Add SoundCloud track or playlist</label>
              <input id="drizlo-music-url" type="url" placeholder="https://soundcloud.com/..." value={link} onChange={(e) => setLink(e.target.value)} required />
              <label htmlFor="drizlo-music-name">Name (optional)</label>
              <input id="drizlo-music-name" type="text" maxLength={60} placeholder="My focus music" value={name} onChange={(e) => setName(e.target.value)} />
              <button type="submit">Save & load</button>
              {error && <span role="alert" className="drizlo-music-error">{error}</span>}
            </form>
            <a className="drizlo-music-browse" href="https://soundcloud.com/discover" target="_blank" rel="noopener noreferrer">Browse SoundCloud ↗</a>
          </div>
        )}
      </div>

      {/* Keep the iframe mounted when changing views or collapsing the panel. */}
      <div className={`drizlo-music-player ${current ? "has-track" : ""} ${view === "library" ? "is-library-view" : ""}`}>
        {embedUrl && (
          <>
            <div className="drizlo-music-now">{current?.name}</div>
            <iframe
              key={current?.id}
              title={`SoundCloud: ${current?.name}`}
              src={embedUrl}
              width="100%"
              height={playerHeight}
              style={{ height: playerHeight }}
              allow="autoplay"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div
              className="drizlo-music-resize"
              role="separator"
              aria-label="Resize playlist player"
              aria-orientation="horizontal"
              aria-valuemin={180}
              aria-valuemax={650}
              aria-valuenow={playerHeight}
              tabIndex={0}
              onPointerDown={beginResize}
              onPointerMove={resizePlayer}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setPlayerHeight((height) => Math.max(180, Math.min(650, height + (event.key === "ArrowDown" ? 40 : -40))));
                }
              }}
            ><span /></div>
          </>
        )}
      </div>
    </aside>
  );
}
