import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!scope.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((element) => {
            const depth = Number(element.dataset.depth ?? 18);

            gsap.to(element, {
              yPercent: -depth,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
              }
            });
          });

          const aboutVisual = scope.current?.querySelector(".about-visual");

          if (aboutVisual) {
            gsap.to(aboutVisual, {
              y: -70,
              rotate: -1,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-section",
                start: "top 72%",
                end: "bottom 25%",
                scrub: 0.8
              }
            });
          }
        }
      });
    }, scope);

    return () => context.revert();
  }, [scope]);
}
