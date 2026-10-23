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
  const steep = focus ? Math.min(1, Math.max(0, progress)) : 1;
  const active = focus && running;
  const amber = 0.08 + steep * 0.84;
  const cups = Math.min(6, completed);

  return (
    <div className={`drizlo-tea-scene${active ? " is-steeping" : ""}`}>
      <svg
        className="drizlo-tea-environment"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`A cozy window-side tea cup, ${Math.round(steep * 100)} percent steeped`}
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
          {Array.from({ length: 24 }, (_, i) => (
            <path
              key={i}
              d={`M${370 + i * 42} ${115 + (i % 5) * 36} l-19 53`}
              stroke="#e1e6e4"
              strokeWidth="2"
              opacity={0.14 + (i % 3) * 0.05}
            />
          ))}
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
          <rect
            x="708"
            y="480"
            width="206"
            height="208"
            fill={`url(#${uid}-tea)`}
            opacity={amber}
            className="drizlo-tea-liquid"
          />
          <ellipse
            cx="810"
            cy="486"
            rx="100"
            ry="10"
            fill="#f7d18e"
            opacity={amber * 0.62}
          />
          <g
            className="drizlo-tea-diffusion"
            opacity={Math.max(0.12, 1 - steep * 0.75)}
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

        {/* Tea bag suspended in cup. */}
        <path
          d="M812 395 Q815 432 811 514"
          fill="none"
          stroke="#eee0c9"
          strokeWidth="2.5"
        />
        <g className="drizlo-tea-bag">
          <path
            d="M790 512 L834 512 L831 569 Q810 582 792 569Z"
            fill="#d5c0a0"
            fillOpacity=".7"
            stroke="#e9d8bd"
            strokeWidth="2"
          />
          <path
            d="M792 544 Q811 539 833 546 L831 569 Q810 582 792 569Z"
            fill="#805137"
            opacity=".8"
          />
          <path
            d="M793 512 L812 525 L834 512"
            fill="none"
            stroke="#eee0c9"
            strokeWidth="2"
          />
        </g>
        <path
          d="M812 395 L844 394 L847 417 L816 418Z"
          fill="#e8b783"
          stroke="#f3d6aa"
          strokeWidth="2"
        />
        <circle cx="831" cy="406" r="3" fill="#9b6042" />

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
            ? "Your tea is ready. Enjoy your break."
            : active
              ? "Steeping slowly, one moment at a time."
              : "A warm moment awaits."}
      </div>
    </div>
  );
}
