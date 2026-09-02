"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { useAppReady } from "@/components/providers/AppReadyProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type HeroSketchPortraitProps = {
  src?: string;
  /** Optional light-mode override; falls back to `src` when empty. */
  lightSrc?: string;
  alt?: string;
};

function subscribeHydrated() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getHydratedServerSnapshot() {
  return false;
}

/**
 * Square hero sketch with print reveal + scan beam.
 * Use a transparent PNG (WebP works too) — one asset can serve both themes.
 */
export function HeroSketchPortrait({
  src,
  lightSrc,
  alt = "Portrait sketch",
}: HeroSketchPortraitProps) {
  const { ready: appReady } = useAppReady();
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribeHydrated,
    getHydratedSnapshot,
    getHydratedServerSnapshot
  );
  const [printComplete, setPrintComplete] = useState(false);

  const darkUrl = src?.trim() ?? "";
  const lightUrl = lightSrc?.trim() || darkUrl;

  const imageUrl =
    hydrated && resolvedTheme === "light" ? lightUrl : darkUrl;

  const canReveal = hydrated && appReady;
  const shouldAnimate = canReveal && !prefersReducedMotion;
  const shouldPrint = shouldAnimate && !printComplete;

  if (!darkUrl) {
    return null;
  }

  const revealClass = shouldPrint
    ? "hero-sketch-portrait__reveal--active"
    : canReveal && prefersReducedMotion
      ? "hero-sketch-portrait__reveal--static"
      : printComplete
        ? "hero-sketch-portrait__reveal--static"
        : "hero-sketch-portrait__reveal--idle";

  const beamClass = shouldPrint
    ? "hero-sketch-portrait__beam--print"
    : printComplete
      ? "hero-sketch-portrait__beam--sweep"
      : "";

  return (
    <div
      key={imageUrl}
      aria-hidden
      className="hero-sketch-portrait hero-sketch-portrait__frame pointer-events-none relative mx-auto block shrink-0 overflow-hidden"
    >
      <div
        className={`hero-sketch-portrait__reveal ${revealClass}`}
        onAnimationEnd={(event) => {
          if (event.animationName === "hero-sketch-print") {
            setPrintComplete(true);
          }
        }}
      >
        <div className="hero-sketch-portrait__canvas">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 640px) 32vw, 200px"
            className="hero-sketch-portrait__image object-cover object-[center_12%]"
            priority
          />
        </div>
      </div>
      {shouldAnimate ? (
        <div
          className={`hero-sketch-portrait__beam ${beamClass}`.trim()}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
