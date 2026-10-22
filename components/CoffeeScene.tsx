"use client";

import { useId } from "react";
import "./CoffeeScene.css";

interface CoffeeSceneProps {
  progress: number;
  running: boolean;
  mode: "focus" | "break";
  completed: number;
}

export default function CoffeeScene({
  progress,
  running,
  mode,
  completed,
}: CoffeeSceneProps) {
  const id = useId().replace(/:/g, "");
  const focus = mode === "focus";
  const fill = focus ? Math.max(0, Math.min(1, progress)) : 1;
  const brewing = focus && running && fill < 1;
  const hasCoffee = fill > 0 || !focus;

  const liquidBottom = 430;
  const liquidHeight = 139 * fill;
  const liquidTop = liquidBottom - liquidHeight;

  return (
    <div className="drizzlo-coffee-scene">
      <div className="coffee-scene-glow" />

      <svg
        className="coffee-artwork"
        viewBox="0 0 600 540"
        role="img"
        aria-label={`Coffee brewing, ${Math.round(fill * 100)} percent full`}
      >
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFE2B0" stopOpacity=".4" />
            <stop offset=".3" stopColor="#FFF4DB" stopOpacity=".08" />
            <stop offset=".75" stopColor="#FFF0C5" stopOpacity=".13" />
            <stop offset="1" stopColor="#FFCF91" stopOpacity=".48" />
          </linearGradient>

          <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="1" y2=".2">
            <stop offset="0" stopColor="#38170F" />
            <stop offset=".38" stopColor="#713017" />
            <stop offset=".72" stopColor="#9B481C" />
            <stop offset="1" stopColor="#421B11" />
          </linearGradient>

          <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE4B7" />
            <stop offset=".55" stopColor="#D5A77C" />
            <stop offset="1" stopColor="#8F5A3C" />
          </linearGradient>

          <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B36C43" />
            <stop offset=".4" stopColor="#7B412B" />
            <stop offset="1" stopColor="#48271F" />
          </linearGradient>

          <radialGradient id={`${id}-halo`}>
            <stop offset="0" stopColor="#FFD194" stopOpacity=".35" />
            <stop offset="1" stopColor="#FFD194" stopOpacity="0" />
          </radialGradient>

          <clipPath id={`${id}-carafe-clip`}>
            <path d="M226 281 L374 281 L393 397 Q395 439 355 444 L245 444 Q205 439 207 397 Z" />
          </clipPath>

          <filter id={`${id}-shadow`}>
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Ambient lighting */}
        <ellipse
          cx="300"
          cy="265"
          rx="260"
          ry="245"
          fill={`url(#${id}-halo)`}
        />

        {/* Window */}
        <g opacity=".5">
          <path
            d="M60 25 V365 M540 25 V365 M60 185 H540"
            stroke="#FFD9A4"
            strokeWidth="8"
            opacity=".3"
          />
          <circle cx="470" cy="105" r="48" fill="#F7A85B" opacity=".2" />
        </g>

        {/* Countertop */}
        <ellipse
          cx="300"
          cy="461"
          rx="225"
          ry="25"
          fill="#1B0C0A"
          opacity=".5"
          filter={`url(#${id}-shadow)`}
        />

        <rect
          x="25"
          y="450"
          width="550"
          height="21"
          rx="7"
          fill={`url(#${id}-wood)`}
        />

        <path d="M30 455 H570" stroke="#E8A36B" strokeWidth="2" opacity=".6" />

        <rect x="35" y="471" width="530" height="65" fill="#48271F" />

        <path
          d="M55 489 Q240 479 540 497 M80 518 Q320 507 520 525"
          stroke="#A35F3C"
          strokeWidth="2"
          opacity=".25"
          fill="none"
        />

        {/* Brewing stand */}
        <path
          d="M425 135 V450"
          stroke="#4C3029"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <path
          d="M425 159 H300"
          stroke="#4C3029"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <ellipse cx="425" cy="451" rx="38" ry="7" fill="#38221C" />

        {/* Ceramic dripper */}
        <path
          d="M204 151 Q300 136 396 151 L337 249 Q300 271 263 249 Z"
          fill={`url(#${id}-ceramic)`}
          stroke="#F8D5A6"
          strokeWidth="4"
        />

        <g stroke="#9C674B" strokeWidth="2" opacity=".45" fill="none">
          <path d="M232 158 L279 250" />
          <path d="M262 155 L290 257" />
          <path d="M300 155 V259" />
          <path d="M338 155 L310 257" />
          <path d="M368 158 L321 250" />
        </g>

        <ellipse
          cx="300"
          cy="151"
          rx="96"
          ry="16"
          fill="#E6B98B"
          stroke="#FFE0B2"
          strokeWidth="4"
        />

        <ellipse cx="300" cy="151" rx="78" ry="10" fill="#5E3325" />
        <ellipse cx="300" cy="151" rx="61" ry="6" fill="#302019" />

        <path d="M285 256 Q300 264 315 256 L307 272 H293 Z" fill="#B57A55" />

        {/* Carafe handle */}
        <path
          d="M374 316 C455 294 459 422 382 417"
          fill="none"
          stroke="#F1C99B"
          strokeWidth="17"
          opacity=".65"
          strokeLinecap="round"
        />

        <path
          d="M386 329 C429 326 432 398 387 401"
          fill="none"
          stroke="#FFF0D5"
          strokeWidth="4"
          opacity=".45"
        />

        {/* Glass carafe */}
        <path
          d="M226 281 L374 281 L393 397 Q395 439 355 444 L245 444 Q205 439 207 397 Z"
          fill={`url(#${id}-glass)`}
          stroke="#FFE5BF"
          strokeWidth="5"
        />

        {/* Liquid */}
        <g clipPath={`url(#${id}-carafe-clip)`}>
          <rect
            x="200"
            y={liquidTop}
            width="200"
            height={liquidHeight + 10}
            fill={`url(#${id}-coffee)`}
          />

          {hasCoffee && (
            <>
              <ellipse
                className={brewing ? "coffee-surface-moving" : ""}
                cx="300"
                cy={liquidTop}
                rx="96"
                ry="7"
                fill="#B66A37"
                opacity=".85"
              />

              <path
                d={`M220 ${liquidTop + 14} Q300 ${liquidTop + 8} 380 ${liquidTop + 14}`}
                stroke="#E5A061"
                strokeWidth="2"
                opacity=".45"
                fill="none"
              />
            </>
          )}
        </g>

        {/* Glass reflections */}
        <path
          d="M236 296 Q222 359 230 408"
          stroke="#FFF6E3"
          strokeWidth="10"
          opacity=".36"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M364 302 Q380 365 371 413"
          stroke="#FFE1B0"
          strokeWidth="5"
          opacity=".25"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M223 281 Q300 270 377 281"
          fill="none"
          stroke="#FFE5BF"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Animated coffee drops */}
        {brewing && (
          <g className="coffee-drip-group">
            <ellipse
              className="coffee-drop coffee-drop-one"
              cx="300"
              cy="273"
              rx="4"
              ry="9"
              fill="#A95727"
            />

            <ellipse
              className="coffee-drop coffee-drop-two"
              cx="300"
              cy="273"
              rx="3"
              ry="6"
              fill="#E2A062"
            />
          </g>
        )}

        {/* Steam */}
        {hasCoffee && (
          <g
            className={
              running || !focus ? "coffee-steam active" : "coffee-steam"
            }
            fill="none"
            stroke="#FFE6C2"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path
              className="steam-path steam-a"
              d="M256 275 C237 253 273 237 255 210"
            />

            <path
              className="steam-path steam-b"
              d="M301 272 C282 248 320 232 301 204"
            />

            <path
              className="steam-path steam-c"
              d="M344 275 C326 251 361 235 344 208"
            />
          </g>
        )}

        {/* Coffee beans */}
        <g fill="#4B2418" stroke="#A46542" strokeWidth="2">
          <ellipse
            cx="120"
            cy="442"
            rx="10"
            ry="6"
            transform="rotate(-25 120 442)"
          />

          <ellipse
            cx="145"
            cy="446"
            rx="9"
            ry="5"
            transform="rotate(18 145 446)"
          />

          <ellipse
            cx="480"
            cy="443"
            rx="11"
            ry="6"
            transform="rotate(-10 480 443)"
          />
        </g>
      </svg>

      {/* Animation status */}
      <div className="coffee-scene-caption">
        <span className="coffee-scene-indicator" />

        <span>
          {focus
            ? running
              ? "Brewing slowly..."
              : fill > 0
                ? "Brewing paused"
                : "Ready to brew"
            : "Freshly brewed"}
        </span>
      </div>

      {/* Completed sessions */}
      {completed > 0 && (
        <div className="coffee-collection-label">
          {completed} {completed === 1 ? "cup" : "cups"} brewed
        </div>
      )}
    </div>
  );
}
