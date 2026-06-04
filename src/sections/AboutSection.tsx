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
              I grew up watching supply chains break
            </p>
            <br></br>
            <p>
              Family runs FMCG distribution. I knew which leg of the chain
              bled cash before I knew what a P&L was. That gap is what
              made me a builder.
            </p>
            <br></br>
            <p>
              I don't start with tech. I start with what's broken.
            </p>
            <br></br>
            <p>
              Built Startup-Info — 15 E-Cell members use it, zero marketing.
Top 5 at IIT Roorkee. Finalist at Mind the Product.
I run The Autopsy — weekly teardowns of products that failed.
            </p>
            <br></br>
            <p>
              First-year CS (AI/ML) student moving like I'm already 
two years behind schedule.
            </p>
            <br></br>
            <p>
              Looking for a PM role or Founder's Office where I can own 
a problem end to end.
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
