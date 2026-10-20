import { useState } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { SectionHeader } from "../components/SectionHeader";
import { PORScene } from "../scenes/PORScene";
import { porList } from "../data/portfolio";

export function PORSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentPor = porList[activeIdx];

  return (
    <section className="section por-section" id="por">
      <SectionHeader
        index="03"
        label="Position of Responsibility"
        title="Not just participating — owning the room."
        copy="Leadership forged through cross-functional execution at the Chief of Staff level, startup mentoring, product teardowns, and consulting frameworks."
      />

      <div className="por-selector" data-gsap-reveal>
        {porList.map((por, idx) => (
          <button
            key={por.organization}
            type="button"
            className={`por-selector-btn ${idx === activeIdx ? "active" : ""}`}
            onClick={() => setActiveIdx(idx)}
          >
            <span className="por-selector-role">{por.title}</span>
            <span className="por-selector-org">{por.shortOrg}</span>
          </button>
        ))}
      </div>

      <div className="por-layout" data-gsap-reveal>
        <GlassPanel className="por-details">
          <div className="por-role-header">
            <div className="por-badge">POR</div>
            <div>
              <div className="por-title-row">
                <h3>{currentPor.title}</h3>
                <span className="por-period">{currentPor.period}</span>
              </div>
              <span className="por-org">{currentPor.organization}</span>
            </div>
          </div>

          <div className="por-contributions">
            {currentPor.contributions.map((item) => (
              <div className="por-contribution-item" key={item}>
                <span className="por-bullet" aria-hidden />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="por-tags">
            {currentPor.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </GlassPanel>

        <div className="por-visual">
          <PORScene
            key={activeIdx === 1 ? "arthakram" : "ecell"}
            org={activeIdx === 1 ? "arthakram" : "ecell"}
          />
        </div>
      </div>
    </section>
  );
}
