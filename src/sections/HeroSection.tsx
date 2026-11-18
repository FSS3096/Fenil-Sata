import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, MousePointer2 } from "lucide-react";
import { HeroCharacter } from "../components/HeroCharacter";
import { MagneticButton } from "../components/MagneticButton";
import { links, proofMetrics } from "../data/portfolio";

export function HeroSection() {
  const trackRef = useRef<HTMLElement>(null);

  return (
    <section className="hero-section" id="top" ref={trackRef}>
      <div className="hero-sticky">
        <div className="hero-shell">
          <nav className="top-nav" aria-label="Primary navigation">
            <a href="#top" className="nav-brand" aria-label="Fenil Sata home">
              FS
            </a>
            <div className="nav-links">
              <a href="#work">Work</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>

          <HeroCharacter trackRef={trackRef} />

          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hero-role">Product thinker | Builder | NST '29</p>
              <h1>
                Fenil Sata builds things that matter.
              </h1>
              <p className="hero-lede">
                Second-year CS student. Live products reaching 600+ users. National and International competition
                podiums. One weekly series on why companies die.
              </p>
              <div className="hero-reveal">
                <div className="hero-actions">
                  <MagneticButton href="#work">View work</MagneticButton>
                  <MagneticButton href={links.resume} target="_blank" variant="ghost">
                    Resume
                  </MagneticButton>
                  <MagneticButton href="#autopsy" variant="ghost">
                    Read The Autopsy
                  </MagneticButton>
                </div>
                <div className="hero-socials" aria-label="Social links">
                  <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                  <a href={`mailto:${links.email}`} aria-label="Email Fenil">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <aside className="hero-points" aria-label="Proof points">
            <ul>
              {proofMetrics.map((metric, index) => (
                <li key={metric.value} style={{ "--i": index } as React.CSSProperties}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </aside>

          <p className="hero-hint" aria-hidden="true">
            <MousePointer2 size={14} />
            Move your cursor. He is watching.
          </p>

          <a className="scroll-cue" href="#proof" aria-label="Scroll to proof wall">
            <ArrowDown size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
