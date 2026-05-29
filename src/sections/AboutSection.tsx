import { GlassPanel } from "../components/GlassPanel";
import { OptimizedPicture } from "../components/OptimizedPicture";
import { SectionHeader } from "../components/SectionHeader";
import { portraits, timeline } from "../data/portfolio";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="section-grid">
        <div>
          <SectionHeader
            index="02"
            label="About / The Edge"
            title="Most PM students theorise about supply chains. I grew up watching one break."
            copy="The portfolio keeps the original edge: family FMCG distribution, public product autopsies, and an instinct for building from operational scars rather than slide theory."
          />

          <div className="story-copy" data-gsap-reveal>
            <p>
              My family runs an FMCG distribution business. Before I ever opened a
              product management textbook, I watched SKUs pile up because a dealer
              missed a delivery window. I saw what happens when the last mile breaks.
              That is not theory. That is a scar.
            </p>
            <p>
              I started The Autopsy because I noticed something: everyone talks about
              what makes products succeed. Nobody talks honestly about why they die. I
              do. Every Tuesday. In public. Because building in public forces you to be
              right, or be corrected fast.
            </p>
          </div>
        </div>

        <div className="about-visual" data-depth="12">
          <GlassPanel className="timeline-shell">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.title}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <small>{item.meta}</small>
              </div>
            ))}
          </GlassPanel>
          <div className="floating-image-card">
            <OptimizedPicture image={portraits.secondary} alt="Fenil Sata portrait" />
          </div>
        </div>
      </div>
    </section>
  );
}
