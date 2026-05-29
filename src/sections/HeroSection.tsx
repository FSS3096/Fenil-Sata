import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { MagneticButton } from "../components/MagneticButton";
import { OptimizedPicture } from "../components/OptimizedPicture";
import { links, portraits } from "../data/portfolio";

const HeroScene = lazy(() =>
  import("../scenes/HeroScene").then((module) => ({ default: module.HeroScene }))
);

export function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <Suspense fallback={<div className="hero-canvas hero-canvas-fallback" />}>
        <HeroScene />
      </Suspense>
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

        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-role">Product thinker | Builder | NST '29</p>
            <h1>
              Fenil Sata builds things that <span>matter.</span>
            </h1>
            <p className="hero-lede">
              First-year CS student. Two live products. Three competition podiums.
              One weekly series on why companies die.
            </p>
            <div className="hero-actions">
              <MagneticButton href="#work">View work</MagneticButton>
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
          </motion.div>

          <motion.div
            className="portrait-orbit"
            initial={{ opacity: 0, scale: 0.92, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="portrait-frame" data-depth="8">
              <div className="scanline" />
              <OptimizedPicture
                image={portraits.hero}
                alt="Fenil Sata professional portrait"
                loading="eager"
                className="portrait-img"
              />
              <div className="portrait-hud portrait-hud-top">AI/ML | Product</div>
              <div className="portrait-hud portrait-hud-bottom">Founder office signal</div>
            </div>
          </motion.div>
        </div>

        <a className="scroll-cue" href="#proof" aria-label="Scroll to proof wall">
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
