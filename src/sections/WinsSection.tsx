import { Podium } from "../components/Podium";
import { SectionHeader } from "../components/SectionHeader";
import { Ticker } from "../components/Ticker";
import { wins } from "../data/portfolio";

// Split so the two strips carry different halves and run in opposite directions.
const half = Math.ceil(wins.length / 2);

export function WinsSection() {
  return (
    <section className="section wins-section" id="wins">
      <div className="wins-top">
        <SectionHeader title="Competition pressure, public thinking, and proof of execution." />
        <Podium />
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
