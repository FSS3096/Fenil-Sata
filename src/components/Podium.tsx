import { useState } from "react";

// Steps climb left to right. Heights follow placement, and every line is from the resume.
const STEPS = [
  { rank: "Top 5", where: "IIT Roorkee", detail: "Of 300 teams at Investopedia, E'Summit 2026.", height: 52 },
  { rank: "3rd", where: "Global Circuit Hackathon", detail: "ECG signal intelligence, virtual hackathon.", height: 74 },
  { rank: "2nd", where: "BITS Pilani", detail: "The Desk, a live valuation game.", height: 100 }
] as const;

/** Interactive podium: hover, focus or tap a step to lift it and read the detail. */
export function Podium() {
  const [active, setActive] = useState<number>(STEPS.length - 1);

  return (
    <div className="podium" data-rise role="group" aria-label="Competition results">
      {STEPS.map((step, index) => (
        <button
          key={step.rank}
          type="button"
          className="podium-step"
          data-active={active === index}
          style={{ "--h": `${step.height}%` } as React.CSSProperties}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={() => setActive(index)}
        >
          <span className="podium-rank">{step.rank}</span>
          <span className="podium-where">{step.where}</span>
          <span className="podium-detail">{step.detail}</span>
        </button>
      ))}
    </div>
  );
}
