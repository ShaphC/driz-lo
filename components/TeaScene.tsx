"use client";

import { useId } from "react";
import "./TeaScene.css";

type TeaSceneProps = {
  progress: number;
  running: boolean;
  mode: "focus" | "break";
  completed: number;
  justCompleted?: boolean;
};

export default function TeaScene({
  progress,
  running,
  mode,
  completed,
  justCompleted = false,
}: TeaSceneProps) {
  const uid = useId().replace(/:/g, "");
  const focus = mode === "focus";
  const phaseProgress = Math.min(1, Math.max(0, progress));
  const steep = focus ? phaseProgress : 1;
  // Fill while focusing; drink the tea throughout the break.
  const fill = focus ? phaseProgress : 1 - phaseProgress;
  const active = focus && running;
  const amber = focus ? steep * 0.92 : 0.92;
  const liquidHeight = (focus ? 1 : fill) * 206;
  const liquidTop = 686 - liquidHeight;
  const cups = Math.min(6, completed);
  // During breaks, the sachet descends until its bottom reaches the cup base.
  const bagDrop = focus ? 0 : phaseProgress * 115;
  const bagTop = 512 + bagDrop;

  return (
    <div className={`drizlo-tea-scene${active ? " is-steeping" : ""}`}>
      <svg
        className="drizlo-tea-environment"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`A cozy window-side tea cup, ${focus ? "hot water steeping" : `${Math.round(fill * 100)} percent full`}`}
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x2="0" y2="1">
            <stop offset="0" stopColor="#425267" />
            <stop offset=".6" stopColor="#8799a1" />
            <stop offset="1" stopColor="#c3ac9a" />
          </linearGradient>
          <linearGradient id={`${uid}-wall`} x2="1" y2="1">
            <stop offset="0" stopColor="#4b3c3b" />
            <stop offset="1" stopColor="#251f28" />
          </linearGradient>
          <linearGradient id={`${uid}-table`} x2="0" y2="1">
            <stop offset="0" stopColor="#b98b69" />
            <stop offset=".23" stopColor="#8a5e48" />
            <stop offset="1" stopColor="#422e30" />
          </linearGradient>
          <linearGradient id={`${uid}-glass`} x2="1" y2="0">
            <stop offset="0" stopColor="#e4f4ee" stopOpacity=".3" />
            <stop offset=".5" stopColor="#f8e8d6" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff6e9" stopOpacity=".33" />
          </linearGradient>
          <linearGradient id={`${uid}-tea`} x2="0" y2="1">
            <stop offset="0" stopColor="#dba655" />
            <stop offset=".52" stopColor="#bc7432" />
            <stop offset="1" stopColor="#6e3a25" />
          </linearGradient>
          <radialGradient id={`${uid}-bloom`}>
            <stop offset="0" stopColor="#bd6b2e" stopOpacity=".85" />
            <stop offset="1" stopColor="#b95e28" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-cup-clip`}>
            <path d="M710 470 Q710 462 723 462 H897 Q910 462 910 475 L898 652 Q894 682 810 683 Q726 682 722 652 Z" />
          </clipPath>
          <clipPath id={`${uid}-window`}>
            <rect x="340" y="72" width="1000" height="572" />
          </clipPath>
          <filter
            id={`${uid}-soft`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="15" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill={`url(#${uid}-wall)`} />
        <rect
          x="315"
          y="45"
          width="1050"
          height="624"
          rx="6"
          fill="#29262b"
          stroke="#795a4b"
          strokeWidth="20"
        />
        <g clipPath={`url(#${uid}-window)`}>
          <rect
            x="340"
            y="72"
            width="1000"
            height="572"
            fill={`url(#${uid}-sky)`}
          />
          <circle
            cx="1090"
            cy="244"
            r="175"
            fill="#f7cfa8"
            opacity=".13"
            filter={`url(#${uid}-soft)`}
          />
          <path
            d="M340 462 Q480 389 622 447 T910 436 T1340 446 V644 H340Z"
            fill="#5b6870"
            opacity=".62"
          />
          <path
            d="M340 528 Q520 465 700 518 T1030 496 T1340 522 V644 H340Z"
            fill="#3f555b"
            opacity=".7"
          />
          <g fill="#d8ded9" opacity=".28">
            <ellipse cx="565" cy="215" rx="130" ry="15" />
            <ellipse cx="1040" cy="173" rx="165" ry="19" />
          </g>
          {/* Rain falls behind the window frame, independently of the timer. */}
          <g className="drizlo-tea-rain" aria-hidden="true">
            {Array.from({ length: 52 }, (_, i) => {
              const x = 355 + ((i * 137) % 970);
              const y = 85 + ((i * 83) % 540);
              const length = 22 + ((i * 11) % 35);
              return (
                <line
                  key={i}
                  className="drizlo-tea-raindrop"
                  x1={x}
                  y1={y}
                  x2={x - 8}
                  y2={y + length}
                  stroke="#e8f2f0"
                  strokeWidth={i % 4 === 0 ? 2.3 : 1.4}
                  opacity={0.16 + (i % 4) * 0.065}
                  style={{
                    animationDelay: `${-((i * 0.73) % 4.8)}s`,
                    animationDuration: `${2.8 + (i % 6) * 0.43}s`,
                  }}
                />
              );
            })}
          </g>
        </g>
        <path d="M820 55V659" stroke="#604840" strokeWidth="24" />
        <path d="M330 654H1350" stroke="#604840" strokeWidth="24" />
        <path d="M0 680 H1600 V900 H0Z" fill={`url(#${uid}-table)`} />
        <path d="M0 696 H1600" stroke="#e2ae80" strokeWidth="7" opacity=".43" />
        <path
          d="M0 770 Q800 740 1600 782"
          fill="none"
          stroke="#c89c79"
          strokeWidth="2"
          opacity=".17"
        />
        <ellipse
          cx="811"
          cy="708"
          rx="182"
          ry="29"
          fill="#241b1d"
          opacity=".33"
        />
        <ellipse
          cx="810"
          cy="692"
          rx="141"
          ry="17"
          fill="#dfb48b"
          opacity=".33"
        />

        {/* Cup handle behind the cup */}
        <path
          d="M902 504 C1003 479 1010 640 903 639"
          fill="none"
          stroke="#e5d5c5"
          strokeWidth="24"
          opacity=".55"
        />
        <path
          d="M908 517 C981 508 981 617 909 623"
          fill="none"
          stroke="#594f50"
          strokeWidth="13"
          opacity=".75"
        />

        {/* Liquid and diffusion remain clipped to the cup. */}
        <g clipPath={`url(#${uid}-cup-clip)`}>
          <path d="M710 470 H910 V686 H710Z" fill="#c5d8cf" opacity=".24" />
          {/* Clear hot water is already in the cup when focus begins. */}
          <rect
            x="708"
            y={liquidTop}
            width="206"
            height={liquidHeight}
            fill="#a9d4d0"
            opacity={focus ? 0.32 : 0.12}
          />
          <rect
            x="708"
            y={liquidTop}
            width="206"
            height={liquidHeight}
            fill={`url(#${uid}-tea)`}
            opacity={amber}
            className="drizlo-tea-liquid"
          />
          {(focus || fill > 0.005) && (
            <ellipse
              cx="810"
              cy={liquidTop + 2}
              rx="99"
              ry="9"
              fill={focus && steep < 0.15 ? "#d8f1e8" : "#f7d18e"}
              opacity={focus ? 0.78 : 0.65}
            />
          )}

          <g
            className="drizlo-tea-diffusion"
            opacity={focus ? Math.max(0.12, 1 - steep * 0.75) : 0}
          >
            <ellipse
              cx="808"
              cy="569"
              rx={28 + steep * 64}
              ry={48 + steep * 63}
              fill={`url(#${uid}-bloom)`}
            />
            <ellipse
              cx="785"
              cy="605"
              rx="45"
              ry="67"
              fill={`url(#${uid}-bloom)`}
              opacity=".55"
            />
            <ellipse
              cx="842"
              cy="613"
              rx="35"
              ry="61"
              fill={`url(#${uid}-bloom)`}
              opacity=".4"
            />
          </g>
          <path
            d="M730 490 Q729 574 744 650"
            stroke="#fff5e5"
            strokeWidth="8"
            opacity=".16"
            fill="none"
          />
          <path
            d="M882 490 Q886 563 878 646"
            stroke="#fff5e5"
            strokeWidth="5"
            opacity=".17"
            fill="none"
          />
        </g>
        <path
          d="M710 470 Q710 462 723 462 H897 Q910 462 910 475 L898 652 Q894 682 810 683 Q726 682 722 652 Z"
          fill={`url(#${uid}-glass)`}
          stroke="#e9d8c9"
          strokeWidth="8"
          strokeOpacity=".67"
        />
        <ellipse
          cx="810"
          cy="469"
          rx="102"
          ry="15"
          fill="none"
          stroke="#f5e4d2"
          strokeWidth="9"
          opacity=".75"
        />

        {/* The string follows the sachet while its paper tag stays on the rim. */}
        <path
          d={`M812 ${bagTop + 1} Q${810 - bagDrop * 0.12} ${487 + bagDrop * 0.43} 840 478 Q872 463 905 468 Q915 469 918 481 L922 500`}
          fill="none"
          stroke="#f4e4cf"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Square sachet settles on the bottom of the cup when the break ends. */}
        <g transform={`translate(0 ${bagDrop})`}>
          <g className={focus ? "drizlo-tea-bag" : undefined}>
            <path
              d="M790 512 H834 V563 Q834 567 830 567 H794 Q790 567 790 563Z"
              fill="#d5c0a0"
              fillOpacity=".76"
              stroke="#e9d8bd"
              strokeWidth="2"
            />
            <path
              d="M792 542 Q812 537 832 544 V563 Q832 565 829 565 H795 Q792 565 792 562Z"
              fill="#805137"
              opacity=".8"
            />
            <path
              d="M792 512 L812 524 L832 512"
              fill="none"
              stroke="#eee0c9"
              strokeWidth="2"
            />
          </g>
        </g>
        {/* Paper tag hangs outside the right side of the cup. */}
        <g className="drizlo-tea-tag">
          <path
            d="M909 500 L935 497 L938 523 L913 526Z"
            fill="#e8b783"
            stroke="#f3d6aa"
            strokeWidth="2.5"
          />
          <circle cx="923" cy="504" r="2.7" fill="#9b6042" />
          <path
            d="M917 515 L931 513"
            stroke="#b77d55"
            strokeWidth="1.5"
            opacity=".7"
          />
        </g>

        {(focus || fill > 0.005) && (
          <g
            className="drizlo-tea-steam"
            fill="none"
            stroke="#f8e9dc"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path
              className="drizlo-tea-steam-one"
              d="M762 438 Q740 415 759 391 T761 341"
            />
            <path
              className="drizlo-tea-steam-two"
              d="M817 443 Q841 413 819 384 T820 326"
            />
            <path
              className="drizlo-tea-steam-three"
              d="M866 438 Q847 406 869 380 T868 335"
            />
          </g>
        )}
      </svg>

      {completed > 0 && (
        <div
          className="drizlo-tea-cups"
          aria-label={`${completed} focus sessions completed`}
        >
          {Array.from({ length: cups }, (_, i) => (
            <span key={i} aria-hidden="true">
              🍵
            </span>
          ))}
          {completed > 6 && (
            <span className="drizlo-tea-cups-extra">+{completed - 6}</span>
          )}
        </div>
      )}
      <div className="drizlo-tea-status" aria-live="polite">
        {justCompleted
          ? "A lovely cup of focus."
          : mode === "break"
            ? "Enjoy your tea, one sip at a time."
            : active
              ? "Steeping slowly, one moment at a time."
              : "A warm moment awaits."}
      </div>
    </div>
  );
}
