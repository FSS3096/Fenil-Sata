import { Award } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { SectionHeader } from "../components/SectionHeader";
import { wins } from "../data/portfolio";

export function WinsSection() {
  return (
    <section className="section wins-section" id="wins">
      <SectionHeader
        index="06"
        label="Wins"
        title="Competition pressure, public thinking, and proof of execution."
      />

      <div className="wins-grid" data-gsap-reveal>
        {wins.map((win) => (
          <GlassPanel className="win-pill" key={win}>
            <Award size={18} aria-hidden />
            <span>{win}</span>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
