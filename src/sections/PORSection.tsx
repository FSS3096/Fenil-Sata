import { GlassPanel } from "../components/GlassPanel";
import { SectionHeader } from "../components/SectionHeader";
import { ArthakramScene } from "../scenes/ArthakramScene";
import { porData } from "../data/portfolio";

export function PORSection() {
  return (
    <section className="section por-section" id="por">
      <SectionHeader
        index="03"
        label="Position of Responsibility"
        title="Not just participating — owning the room."
        copy="Leadership forged through product teardowns, consulting frameworks, and the discipline of presenting ideas that invite scrutiny."
      />

      <div className="por-layout" data-gsap-reveal>
        <GlassPanel className="por-details">
          <div className="por-role-header">
            <div className="por-badge">POR</div>
            <div>
              <h3>{porData.title}</h3>
              <span className="por-org">{porData.organization}</span>
            </div>
          </div>

          <div className="por-contributions">
            {porData.contributions.map((item) => (
              <div className="por-contribution-item" key={item}>
                <span className="por-bullet" aria-hidden />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="por-tags">
            {porData.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </GlassPanel>

        <div className="por-visual">
          <ArthakramScene />
        </div>
      </div>
    </section>
  );
}
