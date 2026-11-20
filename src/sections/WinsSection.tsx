import { lazy, Suspense, useEffect } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Ticker } from "../components/Ticker";
import { wins } from "../data/portfolio";

const loadStage = () => import("../scenes/WinsStage").then((module) => ({ default: module.WinsStage }));
const WinsStage = lazy(loadStage);

// Split so the two strips carry different halves and run in opposite directions.
const half = Math.ceil(wins.length / 2);

export function WinsSection() {
  // fetch the particle scene while the browser is idle so it is ready before the section scrolls in
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 2500));
    const handle = idle(() => void loadStage());

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <section className="section wins-section" id="wins">
      <div className="wins-top">
        <SectionHeader title="Competition pressure, public thinking, and proof of execution." />
        <Suspense fallback={<div className="wins-canvas" />}>
          <WinsStage />
        </Suspense>
      </div>

      <Ticker items={wins.slice(0, half)} speed={-4} />
      <Ticker items={wins.slice(half)} speed={4} className="ticker-alt" />

      {/* The strips are decorative motion; screen readers get the real list. */}
      <ul className="sr-only">
        {wins.map((win) => (
          <li key={win}>{win}</li>
        ))}
      </ul>
    </section>
  );
}
