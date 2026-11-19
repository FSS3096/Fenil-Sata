import { GlassPanel } from "../components/GlassPanel";
import { MagneticButton } from "../components/MagneticButton";
import { SectionHeader } from "../components/SectionHeader";
import { projects } from "../data/portfolio";

export function ProjectsSection() {
  return (
    <section className="section projects-section" id="work">
      <SectionHeader
        index="05"
        label="Projects"
        title="Shipped tools, research memos, and product arguments with teeth."
        copy="Each project ties a problem, a product decision, and a number that shows whether it worked."
      />

      <div className="project-stack" data-stack>
        {projects.map((project, index) => (
          <div
            className="project-stick"
            key={project.title}
            style={{ "--i": index } as React.CSSProperties}
          >
            <GlassPanel
              className={`project-card ${project.image ? "project-has-image" : ""}`}
            >
              <div className="project-index">0{index + 1}</div>
              <div>
                <p className="project-eyebrow">
                  {project.eyebrow} / {project.year}
                </p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <strong>{project.impact}</strong>
              </div>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="project-actions">
                {project.liveUrl ? (
                  <MagneticButton
                    href={project.liveUrl}
                    variant="ghost"
                    className="project-action-button"
                  >
                    {project.actionLabel}
                  </MagneticButton>
                ) : null}
                {project.repoUrl ? (
                  <MagneticButton
                    href={project.repoUrl}
                    variant="quiet"
                    className="project-action-button"
                  >
                    GitHub
                  </MagneticButton>
                ) : null}
              </div>
              {project.image && (
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} />
                </div>
              )}
            </GlassPanel>
          </div>
        ))}
      </div>
    </section>
  );
}
