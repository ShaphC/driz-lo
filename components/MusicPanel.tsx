"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, PointerEvent as ReactPointerEvent } from "react";
import "./MusicPanel.css";

type Playlist = {
  id: string;
  name: string;
  url: string;
};

type View = "player" | "library";
type MusicProvider = "soundcloud" | "spotify";

type SoundCloudWidget = {
  bind: (event: string, callback: () => void) => void;
  unbind: (event: string) => void;
  getSounds: (callback: (sounds: unknown[]) => void) => void;
  getCurrentSoundIndex: (callback: (index: number) => void) => void;
  skip: (index: number) => void;
  play: () => void;
};

type SoundCloudAPI = {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: { READY: string; FINISH: string };
  };
};

declare global {
  interface Window {
    SC?: SoundCloudAPI;
  }
}

// Retain existing storage keys so previously saved playlists are preserved.
const KEY = "drizlo-soundcloud-playlists-v1";
const SELECTED_KEY = "drizlo-soundcloud-selected-v1";

const CURATED: Playlist[] = [
  {
    id: "ambient-default",
    name: "Ambient — SoundCloud",
    url: "https://soundcloud.com/ambientmusicstreaming/sets/ambient",
  },
];

function validSoundCloudUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();

    if (
      url.protocol !== "https:" ||
      !["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"].includes(
        host,
      )
    ) {
      return null;
    }

    if (url.pathname.split("/").filter(Boolean).length < 2) {
      return null;
    }

    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function validSpotifyUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0]?.startsWith("intl-")) {
      parts.shift();
    }

    const [type, id] = parts;

    if (
      !["playlist", "album", "track"].includes(type) ||
      !/^[A-Za-z0-9]{22}$/.test(id ?? "") ||
      parts.length !== 2
    ) {
      return null;
    }

    return `https://open.spotify.com/${type}/${id}`;
  } catch {
    return null;
  }
}

function getMusicProvider(url: string): MusicProvider | null {
  if (validSpotifyUrl(url)) return "spotify";
  if (validSoundCloudUrl(url)) return "soundcloud";
  return null;
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
  const [playerHeight, setPlayerHeight] = useState(420);

  const dragRef = useRef<{ y: number; height: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let savedPlaylists: Playlist[] = [];
    let savedSelected: string | null = null;

    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");

      if (Array.isArray(raw)) {
        savedPlaylists = raw
          .filter(
            (p): p is Playlist =>
              typeof p?.id === "string" &&
              typeof p?.name === "string" &&
              typeof p?.url === "string" &&
              !!getMusicProvider(p.url),
          )
          .slice(0, 30);
      }

      savedSelected = localStorage.getItem(SELECTED_KEY);
    } catch {
      // Invalid saved data must never affect the timer.
    }

    setPlaylists(savedPlaylists);

    const available = [...CURATED, ...savedPlaylists];

    const initial = available.some((p) => p.id === savedSelected)
      ? savedSelected
      : savedPlaylists.length > 0
        ? savedPlaylists[0].id
        : (CURATED[0]?.id ?? null);

    setSelected(initial);
    setView(initial ? "player" : "library");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(KEY, JSON.stringify(playlists));
    } catch {
      // Storage optional.
    }
  }, [playlists, ready]);

  useEffect(() => {
    if (!ready) return;

    try {
      if (selected) {
        localStorage.setItem(SELECTED_KEY, selected);
      } else {
        localStorage.removeItem(SELECTED_KEY);
      }
    } catch {
      // Storage optional.
    }
  }, [selected, ready]);

  const all = useMemo(() => [...CURATED, ...playlists], [playlists]);
  const current = all.find((p) => p.id === selected) || null;

  const provider = current ? getMusicProvider(current.url) : null;

  const embedUrl =
    current && provider === "soundcloud"
      ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          current.url,
        )}&color=%23f5b579&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`
      : null;

  const spotifyEmbedUrl =
    current && provider === "spotify"
      ? validSpotifyUrl(current.url)?.replace(
          "https://open.spotify.com/",
          "https://open.spotify.com/embed/",
        )
      : null;

  // Advance only after the listener manually starts playback.
  // Single tracks stop naturally.
  useEffect(() => {
    if (provider !== "soundcloud" || !current || !iframeRef.current) {
      return;
    }

    let disposed = false;
    let advanceTimeout: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (disposed || !window.SC || !iframeRef.current) return;

      const api = window.SC;
      const activeWidget = api.Widget(iframeRef.current);

      const onFinish = () => {
        activeWidget.getSounds((sounds) => {
          if (disposed || !Array.isArray(sounds) || sounds.length < 2) {
            return;
          }

          activeWidget.getCurrentSoundIndex((index) => {
            if (
              disposed ||
              !Number.isInteger(index) ||
              index < 0 ||
              index >= sounds.length - 1
            ) {
              return;
            }

            activeWidget.skip(index + 1);

            advanceTimeout = setTimeout(() => {
              if (!disposed) {
                activeWidget.play();
              }
            }, 250);
          });
        });
      };

      activeWidget.bind(api.Widget.Events.FINISH, onFinish);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-drizlo-soundcloud-api]",
    );

    if (window.SC) {
      connect();
    } else if (existingScript) {
      existingScript.addEventListener("load", connect);
    } else {
      const script = document.createElement("script");
      script.src = "https://w.soundcloud.com/player/api.js";
      script.async = true;
      script.dataset.drizloSoundcloudApi = "true";
      script.addEventListener("load", connect);
      document.head.appendChild(script);
    }

    return () => {
      disposed = true;

      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
      }

      const script = document.querySelector<HTMLScriptElement>(
        "script[data-drizlo-soundcloud-api]",
      );

      script?.removeEventListener("load", connect);

      // Do not unbind a detached iframe.
      // The disposed guard makes old callbacks inert.
    };
  }, [current?.id, provider]);

  function beginResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    dragRef.current = {
      y: event.clientY,
      height: playerHeight,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function resizePlayer(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const maximum = Math.max(220, Math.min(650, window.innerHeight - 240));

    setPlayerHeight(
      Math.max(
        180,
        Math.min(
          maximum,
          dragRef.current.height + event.clientY - dragRef.current.y,
        ),
      ),
    );
  }

  function endResize() {
    dragRef.current = null;
  }

  function saveRename(id: string) {
    const next = renameValue.trim().slice(0, 60);

    if (next) {
      setPlaylists((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: next } : p)),
      );
    }

    setRenameId(null);
  }

  function choosePlaylist(id: string) {
    setSelected(id);
    setView("player");
    setError("");
  }

  function addPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const url = validSpotifyUrl(link) ?? validSoundCloudUrl(link);

    if (!url) {
      setError(
        "Paste a valid Spotify or SoundCloud playlist, album, or track URL.",
      );
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
      setError(
        "You can save up to 30 links. Remove one before adding another.",
      );
      return;
    }

    const item: Playlist = {
      id: `saved-${Date.now()}`,
      name: name.trim().slice(0, 60) || "My music playlist",
      url,
    };

    setPlaylists((prev) => [...prev, item]);
    choosePlaylist(item.id);
    setLink("");
    setName("");
  }

  return (
    <aside
      className={`drizlo-music ${open ? "drizlo-music-open" : ""} ${
        view === "library"
          ? "drizlo-music-library-mode"
          : "drizlo-music-player-mode"
      }`}
      aria-label="Music player"
    >
      <button
        className="drizlo-music-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="drizlo-music-body"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "✕ Close music" : "♫ Music"}
      </button>

      <div
        className="drizlo-music-body"
        id="drizlo-music-body"
        aria-hidden={!open}
      >
        {view === "library" && (
          <>
            <div className="drizlo-music-heading">
              <strong>Choose your music</strong>
              <span>Spotify & SoundCloud</span>
            </div>

            <div className="drizlo-music-browse-links">
              <span>Browse:</span>

              <a
                href="https://open.spotify.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify ↗
              </a>

              <span>or</span>

              <a
                href="https://soundcloud.com/discover"
                target="_blank"
                rel="noopener noreferrer"
              >
                SoundCloud ↗
              </a>
            </div>
          </>
        )}

        {view === "player" && current ? (
          <button
            className="drizlo-music-switch"
            type="button"
            onClick={() => setView("library")}
          >
            Change playlist
          </button>
        ) : (
          <div className="drizlo-music-library">
            {current && (
              <button
                className="drizlo-music-back"
                type="button"
                onClick={() => setView("player")}
              >
                ← Back to player
              </button>
            )}

            <h3>Playlists</h3>

            <div
              className="drizlo-music-saved-scroll"
              role="region"
              aria-label="Available playlists"
              tabIndex={0}
            >
              <div className="drizlo-music-list">
                {CURATED.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={selected === p.id ? "is-active" : ""}
                    onClick={() => choosePlaylist(p.id)}
                  >
                    {p.name}
                  </button>
                ))}

                {playlists.map((p) => (
                  <div className="drizlo-music-item" key={p.id}>
                    {renameId === p.id ? (
                      <form
                        className="drizlo-music-rename-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          saveRename(p.id);
                        }}
                      >
                        <input
                          aria-label={`Rename ${p.name}`}
                          maxLength={60}
                          value={renameValue}
                          onChange={(event) =>
                            setRenameValue(event.target.value)
                          }
                          autoFocus
                        />

                        <button type="submit" aria-label="Save name">
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => setRenameId(null)}
                          aria-label="Cancel rename"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={selected === p.id ? "is-active" : ""}
                          onClick={() => choosePlaylist(p.id)}
                        >
                          {p.name}
                        </button>

                        <button
                          type="button"
                          className="drizlo-music-rename"
                          aria-label={`Rename ${p.name}`}
                          onClick={() => {
                            setRenameId(p.id);
                            setRenameValue(p.name);
                          }}
                        >
                          Rename
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      className="drizlo-music-remove"
                      onClick={() => {
                        setPlaylists((prev) =>
                          prev.filter((x) => x.id !== p.id),
                        );

                        if (selected === p.id) {
                          // Return to the built-in playlist.
                          setSelected(CURATED[0]?.id ?? null);
                          setView("library");
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={addPlaylist} className="drizlo-music-form">
              <label htmlFor="drizlo-music-url">
                Add Spotify or SoundCloud playlist
              </label>

              <input
                id="drizlo-music-url"
                type="url"
                placeholder="Paste a Spotify or SoundCloud link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                required
              />

              <label htmlFor="drizlo-music-name">Name (optional)</label>

              <input
                id="drizlo-music-name"
                type="text"
                maxLength={60}
                placeholder="My focus music"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <button type="submit">Save & load</button>

              {error && (
                <span role="alert" className="drizlo-music-error">
                  {error}
                </span>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Keep SoundCloud mounted while its library is open. */}
      <div
        className={`drizlo-music-player ${
          provider === "soundcloud" ? "has-track" : ""
        } ${view === "library" ? "is-library-view" : ""}`}
      >
        {embedUrl && (
          <>
            <iframe
              ref={iframeRef}
              key={current?.id}
              title={`SoundCloud: ${current?.name}`}
              src={embedUrl}
              width="100%"
              height={playerHeight}
              style={{ height: playerHeight }}
              allow="autoplay; encrypted-media"
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

                  setPlayerHeight((height) =>
                    Math.max(
                      180,
                      Math.min(
                        650,
                        height + (event.key === "ArrowDown" ? 40 : -40),
                      ),
                    ),
                  );
                }
              }}
            >
              <span />
            </div>
          </>
        )}
      </div>

      {/* Spotify embedded player */}
      {spotifyEmbedUrl && (
        <div
          className={`drizlo-music-spotify ${
            open && view === "player" ? "is-visible" : ""
          }`}
        >
          <iframe
            title={`Spotify: ${current?.name ?? "Playlist"}`}
            src={spotifyEmbedUrl}
            width="100%"
            height={playerHeight}
            style={{ height: playerHeight }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </aside>
  );
}
