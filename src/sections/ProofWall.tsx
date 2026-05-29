import { motion } from "framer-motion";
import { proofMetrics } from "../data/portfolio";
import { revealUp, revealViewport, staggerContainer } from "../lib/motion";

export function ProofWall() {
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
            <p>{metric.value}</p>
            <span>{metric.label}</span>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
