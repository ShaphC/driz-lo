"use client";

import { useId, type CSSProperties } from "react";
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
  // Focus fills the carafe; the following break drains it.
  const elapsed = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  // progress is elapsed fraction (0 at start, 1 at end).
  // 0% -> 100% during focus; 100% -> 0% during breaks.
  const fill = isFocus ? elapsed : 1 - elapsed;

  const brewing = isFocus && running && fill < 1;

  const liquidBottom = 457;
  const liquidHeight = fill * 112;
  const liquidTop = liquidBottom - liquidHeight;
  const dropDistance = Math.max(0, liquidTop - 307);

  const cups = Math.min(completed, MAX_VISIBLE_CUPS);

  return (
    <div className="drizlo-coffee-scene">
      {/* Full-screen illustrated environment */}
      <svg
        className="drizlo-environment"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Sunset café with a coffee carafe ${Math.round(fill * 100)} percent full`}
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6D3B59" />
            <stop offset="45%" stopColor="#D87863" />
            <stop offset="78%" stopColor="#F4A45F" />
            <stop offset="100%" stopColor="#F8C37A" />
          </linearGradient>

          <linearGradient id={`${id}-room`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#513026" />
            <stop offset="100%" stopColor="#2B1918" />
          </linearGradient>

          <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BD8051" />
            <stop offset="16%" stopColor="#915733" />
            <stop offset="100%" stopColor="#4D2B21" />
          </linearGradient>

          <radialGradient id={`${id}-sun-glow`}>
            <stop offset="0%" stopColor="#FFE5A0" stopOpacity=".7" />
            <stop offset="100%" stopColor="#FFE5A0" stopOpacity="0" />
          </radialGradient>

          <clipPath id={`${id}-window-clip`}>
            <rect x="340" y="70" width="1000" height="575" />
          </clipPath>
        </defs>

        {/* Interior wall */}
        <rect width="1600" height="900" fill={`url(#${id}-room)`} />

        {/* Window frame */}
        <rect
          x="322"
          y="52"
          width="1036"
          height="612"
          rx="5"
          fill="#2B1715"
          stroke="#86513A"
          strokeWidth="20"
        />

        {/* View outside */}
        <g clipPath={`url(#${id}-window-clip)`}>
          <rect
            x="340"
            y="70"
            width="1000"
            height="575"
            fill={`url(#${id}-sky)`}
          />

          <circle cx="955" cy="360" r="250" fill={`url(#${id}-sun-glow)`} />

          <circle cx="955" cy="360" r="52" fill="#FFE5A0" />

          {/* Clouds */}
          <g fill="#F8AD80" opacity=".65">
            <ellipse cx="590" cy="205" rx="100" ry="18" />
            <ellipse cx="655" cy="198" rx="70" ry="13" />
            <ellipse cx="1090" cy="175" rx="130" ry="17" />
            <ellipse cx="1160" cy="165" rx="80" ry="13" />
            <ellipse cx="840" cy="275" rx="90" ry="12" />
          </g>

          {/* Distant mountains */}
          <path
            d="
              M340 490
              L510 360
              L640 445
              L790 330
              L980 465
              L1120 365
              L1340 475
              V645 H340 Z
            "
            fill="#81506A"
          />

          <path
            d="
              M340 545
              L560 435
              L730 515
              L940 410
              L1120 510
              L1340 425
              V645 H340 Z
            "
            fill="#62445B"
          />

          {/* Water */}
          <rect x="340" y="540" width="1000" height="105" fill="#B96D67" />

          <g stroke="#F7B77C" strokeWidth="4" opacity=".5">
            <path d="M740 565 H1100" />
            <path d="M820 585 H1040" />
            <path d="M870 605 H1010" />
            <path d="M910 625 H990" />
          </g>

          {/* City silhouette */}
          <path
            d="
              M340 620 V580
              H380 V555
              H420 V590
              H455 V560
              H500 V600
              H540 V565
              H580 V590
              H620 V550
              H665 V605
              H710 V575
              H750 V615
              H790 V570
              H830 V600
              H880 V555
              H925 V590
              H965 V565
              H1010 V610
              H1050 V580
              H1090 V550
              H1130 V600
              H1180 V570
              H1220 V610
              H1270 V565
              H1340 V645
              H340 Z
            "
            fill="#4C354A"
            opacity=".8"
          />
        </g>

        {/* Window dividers */}
        <g stroke="#764631" strokeWidth="18">
          <path d="M680 70 V645" />
          <path d="M1015 70 V645" />
          <path d="M340 315 H1340" />
        </g>

        {/* Left shelves */}
        <rect x="0" y="145" width="310" height="24" fill="#9C623F" />
        <rect x="0" y="166" width="310" height="12" fill="#3A211A" />

        {/* Coffee jars */}
        {[75, 165, 245].map((x) => (
          <g key={x}>
            <rect
              x={x - 30}
              y="65"
              width="60"
              height="80"
              rx="9"
              fill="#5C392B"
              stroke="#B17B56"
              strokeWidth="4"
            />
            <rect
              x={x - 35}
              y="55"
              width="70"
              height="14"
              rx="4"
              fill="#8C5B3E"
            />
            <rect
              x={x - 24}
              y="100"
              width="48"
              height="38"
              rx="5"
              fill="#2E1B17"
            />
          </g>
        ))}

        {/* Hanging plant */}
        <path d="M265 0 V95" stroke="#8B6A42" strokeWidth="5" />

        <path
          d="
            M215 95
            Q265 145 315 95
            L295 140
            H235 Z
          "
          fill="#9D623E"
        />

        <g fill="#54704B">
          <ellipse
            cx="235"
            cy="165"
            rx="22"
            ry="13"
            transform="rotate(-35 235 165)"
          />
          <ellipse
            cx="280"
            cy="170"
            rx="23"
            ry="13"
            transform="rotate(35 280 170)"
          />
          <ellipse
            cx="220"
            cy="205"
            rx="24"
            ry="13"
            transform="rotate(-45 220 205)"
          />
          <ellipse
            cx="305"
            cy="215"
            rx="24"
            ry="13"
            transform="rotate(45 305 215)"
          />
          <ellipse
            cx="250"
            cy="245"
            rx="20"
            ry="11"
            transform="rotate(-25 250 245)"
          />
        </g>

        <g stroke="#415B3A" strokeWidth="5" fill="none">
          <path d="M265 130 Q235 180 220 215" />
          <path d="M265 130 Q295 180 305 225" />
          <path d="M265 130 Q270 210 250 250" />
        </g>

        {/* Pendant light */}
        <path d="M1470 0 V125" stroke="#2A1916" strokeWidth="8" />

        <path
          d="
            M1390 175
            Q1400 115 1470 115
            Q1540 115 1550 175
            Z
          "
          fill="#38231D"
          stroke="#7D4B35"
          strokeWidth="5"
        />

        <ellipse cx="1470" cy="175" rx="80" ry="12" fill="#D7955B" />

        <ellipse
          cx="1470"
          cy="185"
          rx="42"
          ry="12"
          fill="#FFD58C"
          opacity=".8"
        />

        {/* ======================================
            DEEP WOODEN COUNTERTOP
           ====================================== */}

        {/* Rear edge */}
        <rect x="0" y="615" width="1600" height="18" fill="#C48A59" />

        <rect x="0" y="630" width="1600" height="12" fill="#8B5438" />

        {/* Main counter surface */}
        <path d="M0 630 H1600 V900 H0 Z" fill={`url(#${id}-wood)`} />

        {/* Warm reflected light */}
        <path
          d="
            M0 650
            Q450 625 800 655
            T1600 645
            V720
            Q800 690 0 730
            Z
          "
          fill="#E3A46D"
          opacity=".12"
        />

        {/* Wood grain */}
        <g fill="none" stroke="#E2A16C" strokeWidth="3" opacity=".17">
          <path d="M0 690 Q420 670 800 690 T1600 685" />
          <path d="M0 755 Q350 735 750 760 T1600 745" />
          <path d="M0 820 Q450 800 850 825 T1600 810" />
          <path d="M0 875 Q400 860 850 880 T1600 865" />
        </g>

        {/* Front counter edge */}
        <rect x="0" y="875" width="1600" height="25" fill="#5B3428" />

        <rect x="0" y="875" width="1600" height="5" fill="#A86D47" />

        {/* Brewer and countertop share one coordinate system.
            Coffee carafe base (local y=472) sits at scene y≈719.
            Never position the brewer separately with CSS. */}
        <g className="drizlo-brewer-group" transform="translate(448 190) scale(1.12)">

          <defs>
            <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF0D5" />
              <stop offset="50%" stopColor="#DCA77A" />
              <stop offset="100%" stopColor="#98603E" />
            </linearGradient>

            <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFE8C9" stopOpacity=".4" />
              <stop offset="50%" stopColor="#FFE8C9" stopOpacity=".04" />
              <stop offset="100%" stopColor="#FFE8C9" stopOpacity=".35" />
            </linearGradient>

            <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A75D33" />
              <stop offset="30%" stopColor="#60301A" />
              <stop offset="100%" stopColor="#2A100A" />
            </linearGradient>

            <clipPath id={`${id}-carafe-clip`}>
              <path
                d="
                  M232 324
                  H386
                  L403 427
                  Q408 458 367 462
                  H253
                  Q212 458 217 427
                  Z
                "
              />
            </clipPath>
          </defs>

          {/* Contact shadow */}
          <ellipse
            cx="316"
            cy="472"
            rx="145"
            ry="16"
            fill="#2C160F"
            opacity=".55"
          />
        
          {/* Brewing stand */}
          <rect x="421" y="172" width="13" height="291" rx="6" fill="#67402D" />

          <rect x="370" y="205" width="63" height="12" rx="5" fill="#8B5738" />

          <circle cx="429" cy="211" r="8" fill="#A66D45" />

          {/* Ceramic dripper */}
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

          {[231, 253, 277, 310, 343, 367, 390].map((x) => (
            <path
              key={x}
              d={`M${x} 190 L${310 + (x - 310) * 0.35} 299`}
              stroke="#9B633F"
              strokeWidth="2"
              opacity=".3"
            />
          ))}

          <ellipse
            cx="310"
            cy="184"
            rx="106"
            ry="19"
            fill="#F4D3A9"
            stroke="#FFF0D6"
            strokeWidth="3"
          />

          <ellipse cx="310" cy="185" rx="88" ry="11" fill="#63361E" />

          <ellipse cx="310" cy="186" rx="78" ry="8" fill="#26140F" />

          <path d="M297 303 H323 L319 314 H301 Z" fill="#B8794B" />

          {/* Carafe handle */}
          <path
            d="
              M386 341
              C449 316 473 365 458 407
              C448 438 421 444 396 428
            "
            fill="none"
            stroke="#D3A477"
            strokeWidth="21"
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
          />

          {/* Glass carafe */}
          <path
            d="
              M230 323
              L388 323
              L404 427
              Q411 461 368 464
              H252
              Q209 461 216 427
              Z
            "
            fill={`url(#${id}-glass)`}
            stroke="#FFE6C5"
            strokeWidth="4"
          />

          {/* Coffee liquid */}
          <g clipPath={`url(#${id}-carafe-clip)`}>
            <rect
              x="207"
              y={liquidTop}
              width="207"
              height={liquidHeight + 10}
              fill={`url(#${id}-coffee)`}
              className="drizlo-liquid"
              style={{ transition: "y 0.25s linear, height 0.25s linear" }}
            />

            {fill > 0.005 && (
              <ellipse
                cx="310"
                cy={liquidTop + 2}
                rx="96"
                ry="9"
                fill="#C47A45"
                className={brewing ? "drizlo-liquid-active" : ""}
              />
            )}

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
          </g>

          {/* Glass reflection */}
          <path
            d="
              M238 338
              Q225 384 231 428
              Q234 446 250 452
            "
            fill="none"
            stroke="#FFF1D9"
            strokeWidth="9"
            opacity=".55"
            strokeLinecap="round"
          />

          {/* Falling droplets */}
          <g
            style={
              {
                "--drop-distance": `${dropDistance}px`,
              } as CSSProperties
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

          {/* Steam */}
          <g className={isFocus ? (brewing ? "is-brewing" : "") : "is-steaming"}>
            {[
              "M275 163 C256 141 293 120 272 97",
              "M311 160 C334 135 299 114 318 90",
              "M345 164 C328 142 359 119 343 101",
            ].map((d, index) => (
              <path
                key={index}
                className={`drizlo-steam drizlo-steam-${index + 1}`}
                d={d}
                fill="none"
                stroke="#FFE8CA"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
          </g>


        </g>

        {/* Warm atmosphere */}
        <rect width="1600" height="900" fill="#F4A56B" opacity=".045" />
      </svg>

      {/* Completion message */}
      {justCompleted && (
        <div className="drizlo-completion-message">
          <span className="drizlo-completion-icon">✦</span>
          <span>Beautifully done. Your coffee is ready.</span>
        </div>
      )}

      {/* Brewing status */}
      <div className="drizlo-scene-status" role="status">
        <span className={`drizlo-status-dot ${brewing ? "active" : ""}`} />

        <span>
          {!isFocus
            ? running ? "Enjoying your coffee..." : "Coffee break paused"
            : brewing
              ? "Brewing slowly..."
              : fill >= 1
                ? "Coffee is ready"
                : fill > 0
                  ? "Brewing paused"
                  : "Ready to brew"}
        </span>
      </div>

      {/* Completed cups — left-side icons only, no collection panel */}
      {cups > 0 && (
        <div className="drizlo-mug-stack" aria-label={`${completed} cups brewed`}>
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
                    d="
                        M35 17
                        C51 14 51 36 36 34
                      "
                    fill="none"
                    stroke="#F1D2A7"
                    strokeWidth="5"
                  />

                  <path
                    d="
                        M10 15
                        H37
                        L34 42
                        Q23 48 13 42
                        Z
                      "
                    fill="#F5D8AC"
                    stroke="#FFF0D7"
                    strokeWidth="2"
                  />

                  <ellipse cx="23.5" cy="15" rx="13.5" ry="4" fill="#FFF0D7" />

                  <ellipse cx="23.5" cy="15" rx="10" ry="2.5" fill="#7B4528" />
                </svg>
          ))}
          {completed > MAX_VISIBLE_CUPS && (
            <span className="drizlo-mug-overflow">+{completed - MAX_VISIBLE_CUPS}</span>
          )}
        </div>
      )}
    </div>
  );
}
