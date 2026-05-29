import { useRef } from "react";
import { AboutSection } from "./sections/AboutSection";
import { AutopsySection } from "./sections/AutopsySection";
import { ContactSection } from "./sections/ContactSection";
import { HeroSection } from "./sections/HeroSection";
import { ProofWall } from "./sections/ProofWall";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { WinsSection } from "./sections/WinsSection";
import { useLenis } from "./hooks/useLenis";
import { useScrollAnimations } from "./hooks/useScrollAnimations";

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useLenis();
  useScrollAnimations(appRef);

  return (
    <div ref={appRef} className="app-shell">
      <HeroSection />
      <ProofWall />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <AutopsySection />
      <WinsSection />
      <ContactSection />
    </div>
  );
}
