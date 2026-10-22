"use client";

import { useId } from "react";
import "./CoffeeScene.css";

type CoffeeSceneProps = {
  progress: number;
  running: boolean;
  mode: "focus" | "break";
  completed: number;
  justCompleted?: boolean;
};

const MAX_VISIBLE_CUPS = 6;

export default function CoffeeScene({
  progress,
  running,
  mode,
  completed,
  justCompleted = false,
}: CoffeeSceneProps) {
  const id = useId().replace(/:/g, "");

  const isFocus = mode === "focus";
  const fill = isFocus ? Math.max(0, Math.min(1, progress)) : 1;

  const brewing = isFocus && running && fill < 1;
  const liquidBottom = 457;
  const liquidHeight = fill * 112;
  const liquidTop = liquidBottom - liquidHeight;
  const dropDistance = Math.max(0, liquidTop - 307);
  const cups = Math.min(completed, MAX_VISIBLE_CUPS);

  return (
    <div className="drizlo-coffee-scene">
      <div
        className={`drizlo-coffee-illustration ${brewing ? "is-brewing" : ""}`}
      >
        <svg
          className="drizlo-coffee-art"
          viewBox="0 0 640 570"
          role="img"
          aria-label={`Coffee carafe ${Math.round(fill * 100)} percent full`}
        >
          <defs>
            <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF1D8" />
              <stop offset="28%" stopColor="#F7D6AB" />
              <stop offset="65%" stopColor="#C68C5D" />
              <stop offset="100%" stopColor="#885234" />
            </linearGradient>

            <linearGradient
              id={`${id}-ceramic-rim`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#FFF7E5" />
              <stop offset="100%" stopColor="#D49C6D" />
            </linearGradient>

            <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFF1D7" stopOpacity=".33" />
              <stop offset="30%" stopColor="#FFE6C5" stopOpacity=".08" />
              <stop offset="70%" stopColor="#FFDBA5" stopOpacity=".04" />
              <stop offset="100%" stopColor="#FFF0CF" stopOpacity=".38" />
            </linearGradient>

            <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2=".35" y2="1">
              <stop offset="0%" stopColor="#96502B" />
              <stop offset="12%" stopColor="#592611" />
              <stop offset="65%" stopColor="#341307" />
              <stop offset="100%" stopColor="#170A07" />
            </linearGradient>

            <linearGradient
              id={`${id}-coffee-surface`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#E3A061" />
              <stop offset="45%" stopColor="#A45A31" />
              <stop offset="100%" stopColor="#54230E" />
            </linearGradient>

            <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#42251C" />
              <stop offset="35%" stopColor="#A66C48" />
              <stop offset="70%" stopColor="#4A2C22" />
              <stop offset="100%" stopColor="#291713" />
            </linearGradient>

            <linearGradient id={`${id}-steam`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFE8CA" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFF2D9" stopOpacity=".65" />
              <stop offset="100%" stopColor="#FFF2D9" stopOpacity="0" />
            </linearGradient>

            <radialGradient id={`${id}-glow`}>
              <stop offset="0%" stopColor="#FFD391" stopOpacity=".25" />
              <stop offset="100%" stopColor="#FFB66B" stopOpacity="0" />
            </radialGradient>

            <filter
              id={`${id}-shadow`}
              x="-60%"
              y="-80%"
              width="220%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="12" />
            </filter>

            <filter
              id={`${id}-soft-glow`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="6" />
            </filter>

            <clipPath id={`${id}-carafe-clip`}>
              <path
                d="
                  M 232 324
                  L 386 324
                  L 403 427
                  Q 408 458 367 462
                  L 253 462
                  Q 212 458 217 427
                  Z
                "
              />
            </clipPath>
          </defs>

          {/* Warm light blending into the environment */}
          <ellipse
            cx="310"
            cy="330"
            rx="235"
            ry="250"
            fill={`url(#${id}-glow)`}
          />

          {/* Contact shadow on the background counter */}
          <ellipse
            cx="322"
            cy="478"
            rx="165"
            ry="17"
            fill="#190B07"
            opacity=".55"
            filter={`url(#${id}-shadow)`}
          />

          {/* Base plate */}
          <ellipse
            cx="316"
            cy="471"
            rx="145"
            ry="18"
            fill="#30180F"
            opacity=".9"
          />
          <ellipse
            cx="316"
            cy="467"
            rx="141"
            ry="13"
            fill={`url(#${id}-metal)`}
          />
          <ellipse cx="316" cy="463" rx="127" ry="9" fill="#5B3321" />
          <path
            d="M207 462 Q316 448 425 462"
            stroke="#F2B87D"
            strokeWidth="2"
            opacity=".45"
            fill="none"
          />

          {/* Metal brewing stand */}
          <rect
            x="421"
            y="172"
            width="13"
            height="291"
            rx="6"
            fill={`url(#${id}-metal)`}
          />
          <path
            d="M426 178 V453"
            stroke="#DDA16E"
            strokeWidth="2"
            opacity=".45"
          />
          <ellipse cx="427" cy="464" rx="32" ry="8" fill="#3A2118" />

          <rect
            x="371"
            y="205"
            width="62"
            height="12"
            rx="5"
            fill={`url(#${id}-metal)`}
          />
          <circle
            cx="429"
            cy="211"
            r="9"
            fill="#70442D"
            stroke="#DDA36E"
            strokeWidth="2"
          />
          <circle cx="429" cy="211" r="3" fill="#352017" />

          {/* Steam rising from the brewer */}
          <g className="drizlo-steam-group">
            <path
              className="drizlo-steam drizlo-steam-1"
              d="M275 163 C256 141 293 120 272 97 C257 80 279 59 272 43"
              fill="none"
              stroke={`url(#${id}-steam)`}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              className="drizlo-steam drizlo-steam-2"
              d="M311 160 C334 135 299 114 318 90 C333 71 309 53 322 34"
              fill="none"
              stroke={`url(#${id}-steam)`}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="drizlo-steam drizlo-steam-3"
              d="M345 164 C328 142 359 119 343 101 C329 84 353 66 348 50"
              fill="none"
              stroke={`url(#${id}-steam)`}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Dripper silhouette and body */}
          <path
            d="
              M207 183
              Q310 173 413 183
              L361 294
              Q356 305 310 306
              Q264 305 259 294
              Z
            "
            fill={`url(#${id}-ceramic)`}
            stroke="#FFE7C5"
            strokeWidth="4"
          />

          {/* Ceramic pleats */}
          {[
            "M231 194 L272 289",
            "M253 190 L284 297",
            "M277 188 L298 302",
            "M310 187 L310 303",
            "M343 188 L322 302",
            "M367 190 L336 297",
            "M390 194 L348 289",
          ].map((d, index) => (
            <path
              key={index}
              d={d}
              fill="none"
              stroke={index % 2 === 0 ? "#A96C43" : "#FFF0D8"}
              strokeWidth={index % 2 === 0 ? 2 : 1.5}
              opacity={index % 2 === 0 ? 0.32 : 0.5}
            />
          ))}

          {/* Upper rim */}
          <ellipse
            cx="310"
            cy="184"
            rx="106"
            ry="19"
            fill={`url(#${id}-ceramic-rim)`}
            stroke="#FFF0D6"
            strokeWidth="3"
          />
          <ellipse cx="310" cy="185" rx="88" ry="11" fill="#63361E" />
          <ellipse cx="310" cy="186" rx="78" ry="8" fill="#26140F" />

          {/* Coffee grounds */}
          <path
            d="M235 187 Q273 177 309 185 Q348 178 386 187"
            fill="none"
            stroke="#9B552F"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dripper outlet */}
          <path
            d="M297 303 H323 L319 314 H301 Z"
            fill="#B8794B"
            stroke="#EAC093"
            strokeWidth="2"
          />

          {/* Carafe handle, behind the body */}
          <path
            d="
              M386 341
              C449 316 473 365 458 407
              C448 438 421 444 396 428
            "
            fill="none"
            stroke="#D3A477"
            strokeWidth="21"
            strokeLinecap="round"
          />
          <path
            d="
              M389 342
              C445 322 460 370 448 404
              C438 428 420 431 400 417
            "
            fill="none"
            stroke="#4A291B"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M414 342 Q463 354 447 402"
            fill="none"
            stroke="#FFE3B9"
            strokeWidth="3"
            opacity=".7"
          />

          {/* Carafe neck */}
          <path
            d="M228 317 Q310 311 392 317 L388 336 H232 Z"
            fill="#CDA079"
            opacity=".85"
          />

          {/* Glass carafe */}
          <path
            d="
              M230 323
              L388 323
              L404 427
              Q411 461 368 464
              L252 464
              Q209 461 216 427
              Z
            "
            fill={`url(#${id}-glass)`}
            stroke="#FFE6C5"
            strokeWidth="4"
          />

          {/* Coffee liquid, clipped to glass */}
          <g clipPath={`url(#${id}-carafe-clip)`}>
            <rect
              x="207"
              y={liquidTop}
              width="207"
              height={liquidHeight + 10}
              fill={`url(#${id}-coffee)`}
              className="drizlo-liquid"
            />

            {fill > 0.005 && (
              <>
                <ellipse
                  cx="310"
                  cy={liquidTop + 2}
                  rx="96"
                  ry="9"
                  fill={`url(#${id}-coffee-surface)`}
                  className={brewing ? "drizlo-liquid-active" : ""}
                />

                <path
                  d={`M220 ${liquidTop + 4} Q310 ${
                    liquidTop - 3
                  } 400 ${liquidTop + 4}`}
                  fill="none"
                  stroke="#F7BC7C"
                  strokeWidth="2"
                  opacity=".6"
                />

                {brewing && (
                  <ellipse
                    cx="310"
                    cy={liquidTop + 3}
                    rx="20"
                    ry="4"
                    fill="none"
                    stroke="#EBA56A"
                    strokeWidth="2"
                    className="drizlo-ripple"
                  />
                )}

                <path
                  d={`M237 ${liquidTop + 13} Q254 ${
                    liquidTop + 30
                  } 248 ${liquidBottom - 9}`}
                  fill="none"
                  stroke="#D6814A"
                  strokeWidth="7"
                  opacity=".12"
                />
              </>
            )}
          </g>

          {/* Carafe highlights */}
          <path
            d="M238 338 Q225 384 231 428 Q234 446 250 452"
            fill="none"
            stroke="#FFF1D9"
            strokeWidth="9"
            opacity=".58"
            strokeLinecap="round"
          />

          <path
            d="M377 337 Q390 379 391 420"
            fill="none"
            stroke="#FFE1B5"
            strokeWidth="6"
            opacity=".36"
            strokeLinecap="round"
          />

          <path
            d="M257 459 Q310 467 365 459"
            fill="none"
            stroke="#F9D2A3"
            strokeWidth="3"
            opacity=".55"
          />

          {/* Carafe opening */}
          <ellipse
            cx="310"
            cy="323"
            rx="85"
            ry="9"
            fill="#E8C5A0"
            opacity=".8"
          />
          <ellipse
            cx="310"
            cy="323"
            rx="77"
            ry="5"
            fill="#57311F"
            opacity=".8"
          />

          {/* Falling coffee droplets */}
          <g
            className="drizlo-drip-system"
            style={
              {
                "--drop-distance": `${dropDistance}px`,
              } as React.CSSProperties
            }
          >
            {brewing && (
              <>
                <ellipse
                  className="drizlo-drop drizlo-drop-a"
                  cx="310"
                  cy="316"
                  rx="3.5"
                  ry="6"
                  fill="#4E200D"
                />

                <ellipse
                  className="drizlo-drop drizlo-drop-b"
                  cx="310"
                  cy="316"
                  rx="2.5"
                  ry="4.5"
                  fill="#A65A30"
                />
              </>
            )}
          </g>

          {/* A few scattered coffee beans */}
          <g className="drizlo-coffee-beans">
            <g transform="translate(193 468) rotate(-28)">
              <ellipse
                rx="10"
                ry="5"
                fill="#4B2415"
                stroke="#A76A43"
                strokeWidth="1.5"
              />
              <path
                d="M0 -4 Q-3 0 0 4"
                fill="none"
                stroke="#C28A5B"
                strokeWidth="1"
              />
            </g>

            <g transform="translate(444 472) rotate(24)">
              <ellipse
                rx="9"
                ry="5"
                fill="#3B1B10"
                stroke="#9B5B37"
                strokeWidth="1.5"
              />
              <path
                d="M0 -4 Q3 0 0 4"
                fill="none"
                stroke="#C28A5B"
                strokeWidth="1"
              />
            </g>
          </g>
        </svg>
      </div>

      {justCompleted && (
        <div className="drizlo-completion-message">
          <span className="drizlo-completion-icon">✦</span>
          <span>Beautifully done. Your coffee is ready.</span>
        </div>
      )}

      <div className="drizlo-scene-status" role="status">
        <span className={`drizlo-status-dot ${brewing ? "active" : ""}`} />
        <span>
          {!isFocus
            ? "Freshly brewed"
            : brewing
              ? "Brewing slowly..."
              : fill >= 1
                ? "Coffee is ready"
                : fill > 0
                  ? "Brewing paused"
                  : "Ready to brew"}
        </span>
      </div>

      <div className="drizlo-cup-shelf">
        <div className="drizlo-shelf-heading">
          <span>YOUR COFFEE COLLECTION</span>
          <span>{completed} brewed</span>
        </div>

        <div className="drizlo-shelf-interior">
          {cups === 0 ? (
            <span className="drizlo-empty-shelf">
              Your first cup is waiting.
            </span>
          ) : (
            <div className="drizlo-cups">
              {Array.from({ length: cups }, (_, index) => (
                <svg
                  key={index}
                  className="drizlo-cup"
                  viewBox="0 0 52 54"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="24"
                    cy="48"
                    rx="20"
                    ry="3"
                    fill="#160B08"
                    opacity=".4"
                  />
                  <path
                    d="M35 17 C51 14 51 36 36 34"
                    fill="none"
                    stroke="#F1D2A7"
                    strokeWidth="5"
                  />
                  <path
                    d="M10 15 H37 L34 42 Q23 48 13 42 Z"
                    fill="#F5D8AC"
                    stroke="#FFF0D7"
                    strokeWidth="2"
                  />
                  <ellipse cx="23.5" cy="15" rx="13.5" ry="4" fill="#FFF0D7" />
                  <ellipse cx="23.5" cy="15" rx="10" ry="2.5" fill="#7B4528" />
                  <path
                    d="M16 21 L18 39"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    opacity=".45"
                  />
                </svg>
              ))}
            </div>
          )}
        </div>

        {completed > MAX_VISIBLE_CUPS && (
          <span className="drizlo-extra-cups">
            +{completed - MAX_VISIBLE_CUPS} more cups
          </span>
        )}
      </div>
    </div>
  );
}
