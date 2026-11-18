import { motion } from "framer-motion";
import { proofMetrics } from "../data/portfolio";
import { revealUp, revealViewport, staggerContainer } from "../lib/motion";

// "600+" -> count up to 600 and keep the "+"; values like "Top 5" stay as written.
function countAttrs(value: string) {
  const match = /^(\d+)(\+?)$/.exec(value);
  return match ? { "data-count": match[1], "data-suffix": match[2] } : {};
}

export function ProofSection() {
  return (
    <section className="section proof-section" id="proof">
      <motion.div
        className="proof-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {proofMetrics.map((metric) => (
          <motion.article className="proof-card" variants={revealUp} key={metric.value}>
            <p {...countAttrs(metric.value)}>{metric.value}</p>
            <span>{metric.label}</span>
            <i className="proof-line" data-line aria-hidden="true" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

// Backward-compatible alias
export const ProofWall = ProofSection;
