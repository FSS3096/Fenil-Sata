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
        copy="The skill system is treated like a galaxy: product strategy at the center, engineering and tools in orbit, leadership as the force that keeps teams moving."
      />

      <div className="skills-layout">
        <GlassPanel className="skills-copy" data-gsap-reveal>
          {groups.map((group) => (
            <div key={group}>
              <h3>{group}</h3>
              <div className="skill-chip-row">
                {skills
                  .filter((skill) => skill.group === group)
                  .map((skill) => (
                    <span key={skill.label}>{skill.label}</span>
                  ))}
              </div>
            </div>
          ))}
        </GlassPanel>

        <div data-gsap-reveal>
          <Suspense fallback={<div className="skill-galaxy skill-galaxy-fallback" />}>
            <SkillGalaxyScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
