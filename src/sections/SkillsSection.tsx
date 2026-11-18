import { lazy, Suspense } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { SectionHeader } from "../components/SectionHeader";
import { skills } from "../data/portfolio";

const groups = Array.from(new Set(skills.map((skill) => skill.group)));
const SkillGalaxyScene = lazy(() =>
  import("../scenes/SkillGalaxyScene").then((module) => ({
    default: module.SkillGalaxyScene
  }))
);

export function SkillsSection() {
  return (
    <section className="section skills-section" id="skills">
      <SectionHeader
        index="04"
        label="Skills Galaxy"
        title="A product brain with enough technical gravity to ship."
        copy="Product strategy at the center, engineering and tools in orbit, and communication as the force that keeps a team moving."
      />

      <div className="skills-layout">
        <GlassPanel className="skills-copy">
          {groups.map((group) => (
            <div key={group}>
              <h3>{group}</h3>
              <div className="skill-chip-row" data-stagger="pop">
                {skills
                  .filter((skill) => skill.group === group)
                  .map((skill) => (
                    <span key={skill.label}>{skill.label}</span>
                  ))}
              </div>
            </div>
          ))}
        </GlassPanel>

        <div>
          <Suspense fallback={<div className="skill-galaxy skill-galaxy-fallback" />}>
            <SkillGalaxyScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
