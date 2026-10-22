"use client";

import { useId } from "react";
import "./CoffeeScene.css";

type CoffeeSceneProps = {
  progress: number;
  running: boolean;
  mode: "focus" | "break";
  completed: number;
};

const MAX_VISIBLE_CUPS = 6;

export default function CoffeeScene({
  progress,
  running,
  mode,
  completed,
}: CoffeeSceneProps) {
  const id = useId().replace(/:/g, "");
  const isFocus = mode === "focus";
  const fill = isFocus ? Math.max(0, Math.min(1, progress)) : 1;

  const brewing = isFocus && running && fill < 1;
  const liquidTop = 421 - fill * 125;
  const cups = Math.min(completed, MAX_VISIBLE_CUPS);
  const dropDistance = Math.max(0, liquidTop - 288);

  return (
    <div className="drizlo-coffee-scene">
      <div className="drizlo-ambient-light" />

      <svg
        className="drizlo-coffee-art"
        viewBox="0 0 640 570"
        role="img"
        aria-label={`Coffee carafe ${Math.round(fill * 100)} percent full`}
      >
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFF1D7" stopOpacity=".48" />
            <stop offset=".25" stopColor="#FFF1D7" stopOpacity=".06" />
            <stop offset=".75" stopColor="#FFF1D7" stopOpacity=".1" />
            <stop offset="1" stopColor="#FFD39D" stopOpacity=".4" />
          </linearGradient>

          <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="1" y2=".25">
            <stop offset="0" stopColor="#4C2116" />
            <stop offset=".45" stopColor="#8F421E" />
            <stop offset="1" stopColor="#3B180F" />
          </linearGradient>

          <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#FFE5BB" />
            <stop offset=".55" stopColor="#D7A478" />
            <stop offset="1" stopColor="#8C533B" />
          </linearGradient>

          <linearGradient id={`${id}-table`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B9784D" />
            <stop offset=".35" stopColor="#815036" />
            <stop offset="1" stopColor="#4B2A23" />
          </linearGradient>

          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#FFD3A0" stopOpacity=".55" />
            <stop offset="1" stopColor="#FFB46D" stopOpacity="0" />
          </radialGradient>

          <clipPath id={`${id}-inside`}>
            <path d="M236 291 H387 L408 403 Q411 441 367 447 H256 Q212 441 215 403 Z" />
          </clipPath>

          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>

        {/* Warm sunlight */}
        <circle
          className="drizlo-sunlight"
          cx="465"
          cy="132"
          r="205"
          fill={`url(#${id}-sun)`}
        />

        {/* Window */}
        <g opacity=".28" stroke="#FFD8A3" strokeWidth="9">
          <path d="M54 0 V380 M585 0 V380 M54 174 H585" />
        </g>

        {/* Countertop */}
        <ellipse
          cx="315"
          cy="464"
          rx="235"
          ry="25"
          fill="#1B0C0A"
          opacity=".5"
          filter={`url(#${id}-blur)`}
        />

        <path d="M10 453 H630 V477 H10 Z" fill={`url(#${id}-table)`} />
        <path d="M10 456 H630" stroke="#E6A46C" strokeWidth="3" />
        <rect x="10" y="477" width="620" height="93" fill="#4B2A23" />

        <g stroke="#BA7950" opacity=".2" fill="none">
          <path d="M30 499 Q300 487 609 505" />
          <path d="M40 542 Q310 525 600 550" />
        </g>

        {/* Brewing stand */}
        <g fill="none" stroke="#51332A" strokeLinecap="round">
          <path d="M442 135 V454" strokeWidth="14" />
          <path d="M442 159 H312" strokeWidth="11" />
        </g>
        <ellipse cx="442" cy="455" rx="42" ry="8" fill="#38221C" />

        {/* Ceramic dripper */}
        <path
          d="M215 147 Q312 133 409 147 L351 254 Q312 275 273 254 Z"
          fill={`url(#${id}-ceramic)`}
          stroke="#F7D8AE"
          strokeWidth="4"
        />

        <g stroke="#996344" strokeWidth="2" opacity=".4" fill="none">
          <path d="M243 155 L286 254" />
          <path d="M278 155 L303 263" />
          <path d="M312 154 V264" />
          <path d="M346 155 L321 263" />
          <path d="M381 155 L338 254" />
        </g>

        <ellipse
          cx="312"
          cy="147"
          rx="97"
          ry="17"
          fill="#E5B88A"
          stroke="#FFE2BB"
          strokeWidth="4"
        />
        <ellipse cx="312" cy="147" rx="80" ry="10" fill="#563126" />
        <ellipse cx="312" cy="147" rx="63" ry="6" fill="#302019" />

        <path d="M298 259 Q312 267 326 259 L319 276 H305 Z" fill="#A96F4D" />

        {/* Glass handle */}
        <path
          d="M388 325 C477 297 476 429 397 418"
          fill="none"
          stroke="#F4CEA1"
          strokeWidth="19"
          strokeLinecap="round"
          opacity=".65"
        />
        <path
          d="M398 336 C449 326 449 404 399 402"
          fill="none"
          stroke="#FFF0D4"
          strokeWidth="4"
          opacity=".5"
        />

        {/* Carafe */}
        <path
          d="M236 291 H387 L408 403 Q411 441 367 447 H256 Q212 441 215 403 Z"
          fill={`url(#${id}-glass)`}
          stroke="#FFE4BC"
          strokeWidth="5"
        />

        {/* Coffee liquid */}
        <g clipPath={`url(#${id}-inside)`}>
          <rect
            x="205"
            y={liquidTop}
            width="215"
            height={Math.max(0, 453 - liquidTop)}
            fill={`url(#${id}-coffee)`}
          />

          {fill > 0 && (
            <>
              <g className={brewing ? "drizlo-liquid-active" : ""}>
                <ellipse
                  cx="312"
                  cy={liquidTop}
                  rx="103"
                  ry="7"
                  fill="#B86C3C"
                />

                <ellipse
                  cx="312"
                  cy={liquidTop - 1}
                  rx="74"
                  ry="3"
                  fill="#E3A069"
                  opacity=".3"
                />

                <path
                  d={`M245 ${liquidTop + 1} Q312 ${liquidTop - 4} 379 ${liquidTop + 1}`}
                  fill="none"
                  stroke="#F6C38D"
                  strokeWidth="1.5"
                  opacity=".4"
                />
              </g>

              <path
                d={`M224 ${liquidTop + 14} Q312 ${liquidTop + 7} 399 ${liquidTop + 14}`}
                fill="none"
                stroke="#F0AF6E"
                strokeWidth="2"
                opacity=".45"
              />

              {brewing && (
                <g
                  className="drizlo-ripple"
                  style={{
                    transformOrigin: `312px ${liquidTop}px`,
                  }}
                >
                  <ellipse
                    cx="312"
                    cy={liquidTop}
                    rx="16"
                    ry="3"
                    fill="none"
                    stroke="#F9C58B"
                    strokeWidth="2"
                  />
                </g>
              )}
            </>
          )}
        </g>

        {/* Glass reflections */}
        <path
          d="M245 308 Q231 370 241 418"
          fill="none"
          stroke="#FFF7E8"
          strokeWidth="10"
          strokeLinecap="round"
          opacity=".32"
        />
        <path
          d="M379 310 Q395 371 385 420"
          fill="none"
          stroke="#FFE4BD"
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".25"
        />
        <path
          d="M232 291 Q312 279 392 291"
          fill="none"
          stroke="#FFE9C7"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Falling coffee drops */}
        {brewing && (
          <g>
            <ellipse
              className="drizlo-drop drizlo-drop-a"
              cx="312"
              cy="280"
              rx="4"
              ry="8"
              fill="#AC5829"
              style={
                {
                  "--drop-distance": `${dropDistance}px`,
                } as React.CSSProperties
              }
            />
            <ellipse
              className="drizlo-drop drizlo-drop-b"
              cx="312"
              cy="280"
              rx="3"
              ry="6"
              fill="#DA8E4B"
              style={
                {
                  "--drop-distance": `${dropDistance}px`,
                } as React.CSSProperties
              }
            />
          </g>
        )}

        {/* Steam */}
        {fill > 0.05 && (
          <g
            className={`drizlo-steam ${running || !isFocus ? "is-active" : ""}`}
            fill="none"
            stroke="#FFE9CA"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path
              className="drizlo-steam-line drizlo-steam-one"
              d="M270 282 C249 260 286 243 267 216"
            />
            <path
              className="drizlo-steam-line drizlo-steam-two"
              d="M313 282 C292 257 331 241 312 211"
            />
            <path
              className="drizlo-steam-line drizlo-steam-three"
              d="M357 282 C336 260 373 243 355 216"
            />
          </g>
        )}

        {/* Coffee beans */}
        <g fill="#492418" stroke="#A46A46" strokeWidth="2">
          <ellipse
            cx="128"
            cy="445"
            rx="11"
            ry="6"
            transform="rotate(-24 128 445)"
          />
          <ellipse
            cx="154"
            cy="448"
            rx="9"
            ry="5"
            transform="rotate(18 154 448)"
          />
          <ellipse
            cx="501"
            cy="445"
            rx="11"
            ry="6"
            transform="rotate(-10 501 445)"
          />
        </g>
      </svg>

      {/* Status below artwork */}
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

      {/* Completed cups */}
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
                    fill="#1E0E0B"
                    opacity=".35"
                  />
                  <path
                    d="M35 17 C51 14 51 36 36 34"
                    fill="none"
                    stroke="#D4A77B"
                    strokeWidth="5"
                  />
                  <path
                    d="M10 15 H37 L34 42 Q23 48 13 42 Z"
                    fill="#E4BC90"
                    stroke="#FFE0B7"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="23.5"
                    cy="15"
                    rx="13.5"
                    ry="4"
                    fill="#6A311D"
                    stroke="#F4D0A6"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 24 L17 37"
                    stroke="#FFF0D9"
                    strokeWidth="3"
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
