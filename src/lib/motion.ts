import type { Variants } from "framer-motion";

export const revealViewport = {
  once: true,
  amount: 0.28
};

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: smoothEase }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};
