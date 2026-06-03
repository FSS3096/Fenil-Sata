import { GlassPanel } from "../components/GlassPanel";
import { OptimizedPicture } from "../components/OptimizedPicture";
import { SectionHeader } from "../components/SectionHeader";
import { autopsyItems, links, portraits } from "../data/portfolio";

export function AutopsySection() {
  return (
    <section className="section autopsy-section" id="autopsy">
      <div className="autopsy-grid">
        <div>
          <SectionHeader
            index="06"
            label="The Autopsy"
            title="Every week, I pick a company that failed and cut it open."
            copy="Not to mock it. To understand it. Because the best product lessons are not in launches. They are in autopsies."
            invert
          />
          <a href={links.autopsy} target="_blank" rel="noreferrer" className="autopsy-link">
            Read all teardowns on LinkedIn
          </a>
        </div>

        <div className="autopsy-cards" data-gsap-reveal>
          {autopsyItems.map((item) => (
            <GlassPanel className="autopsy-card" key={item.company}>
              <h3>{item.company}</h3>
              <p>Cause of death: {item.cause}</p>
              <span>{item.detail}</span>
            </GlassPanel>
          ))}
        </div>

        <div className="autopsy-image" data-depth="16">
          <OptimizedPicture
            image={portraits.atmospheric}
            alt="Quibi and Byju's product failure infographic from The Autopsy series"
          />
        </div>
      </div>
    </section>
  );
}
