import { GlassPanel } from "../components/GlassPanel";
import { OptimizedPicture } from "../components/OptimizedPicture";
import { SectionHeader } from "../components/SectionHeader";
import { portraits, timeline } from "../data/portfolio";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="section-grid">
        <div className="about-sticky">
          <SectionHeader
            title="Most PM students theorise about supply chains. I grew up watching one break."
            copy="Family FMCG distribution, public product autopsies, and an instinct for building from operational scars rather than slide theory."
          />
        </div>

        <div>
          {/* <mark> phrases get a highlighter sweep as they cross the reading line. */}
          <div className="story-copy" data-scrub-read>
            <p>
              I grew up watching <mark data-mark>supply chains break</mark>.
            </p>
            <p>
              Family runs FMCG distribution. I knew which leg of the chain bled cash before I knew what a P&amp;L was.
              That gap is what made me a builder.
            </p>
            <p>
              I don't start with tech. <mark data-mark>I start with what's broken.</mark>
            </p>
            <p>
              Built Startup-Info: <mark data-mark>30+ E-Cell members use it, zero marketing.</mark> Built The Product
              Guys with 600+ visitors. 2nd at BITS Pilani, 3rd in Global Circuit Hackathon, Top 5 at IIT Roorkee. I run
              The Autopsy: weekly teardowns of products that failed.
            </p>
            <p>Second-year CS (AI/ML) student moving like I'm already two years behind schedule.</p>
            <p>
              Looking for a PM role or Founder's Office where I can{" "}
              <mark data-mark>own a problem end to end.</mark>
            </p>
          </div>

          <div className="about-visual">
            <GlassPanel className="timeline-shell">
              <div className="timeline-rail" aria-hidden="true">
                <i data-fill />
              </div>
              {timeline.map((item) => (
                <div className="timeline-item" key={item.title}>
                  <span>{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <small>{item.meta}</small>
                </div>
              ))}
            </GlassPanel>
            <div className="floating-image-card" data-clip>
              <OptimizedPicture image={portraits.secondary} alt="Fenil Sata with the Arthakram team" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
