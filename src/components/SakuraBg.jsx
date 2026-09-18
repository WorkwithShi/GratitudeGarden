import React, { useMemo } from "react";
import "./SakuraBg.css";

const PETAL_COUNT = 22;

export default function SakuraBg({ theme = "dawn", isPetalsPaused = false }) {
  // Generate fixed random configuration for petals once
  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }).map((_, i) => {
      const petalNum = (i % 10) + 1;
      const left = (i / PETAL_COUNT) * 100 + (Math.random() * 8 - 4);
      const duration = 16 + Math.random() * 12; // 16s to 28s slow, peaceful drift
      const delay = -(Math.random() * 28); // negative delay so petals are immediately drifting
      const size = 16 + Math.random() * 22; // 16px to 38px
      const sway = 25 + Math.random() * 35; // gentle sway distance
      const swayEnd = -(15 + Math.random() * 30);
      const opacity = 0.35 + Math.random() * 0.35; // soft, dreamy opacity
      const blur = size < 20 ? 0.6 : 0; // tiny petals slightly soft-focused
      const zIndex = size > 32 ? 15 : 2;

      return {
        id: i,
        src: `/petals/petal${petalNum}.png`,
        left,
        duration,
        delay,
        size,
        sway,
        swayEnd,
        opacity,
        blur,
        zIndex,
      };
    });
  }, []);

  return (
    <div className="sakura-container" aria-hidden="true">
      {/* Night starlight twinkle layer */}
      {theme === "night" && <div className="night-stars" />}

      {/* Floating Sakura Petals (peaceful, natural drift without cursor reaction) */}
      {!isPetalsPaused &&
        petals.map((p) => (
          <img
            key={p.id}
            src={p.src}
            alt=""
            className="sakura-petal-item"
            style={{
              left: `${Math.max(0, Math.min(98, p.left))}%`,
              width: `${p.size}px`,
              height: "auto",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              zIndex: p.zIndex,
              filter: p.blur ? `blur(${p.blur}px)` : "none",
              "--petal-opacity": p.opacity,
              "--sway": `${p.sway}px`,
              "--sway-end": `${p.swayEnd}px`,
            }}
          />
        ))}
    </div>
  );
}
