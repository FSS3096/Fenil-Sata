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
          { opacity: 0, y: 42, filter: "blur(14px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((element) => {
        const depth = Number(element.dataset.depth ?? 18);

        gsap.to(element, {
          yPercent: -depth,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        });
      });

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const aboutVisual = scope.current?.querySelector(".about-visual");

          if (aboutVisual) {
            gsap.to(aboutVisual, {
              y: -90,
              rotate: -1.5,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-section",
                start: "top 72%",
                end: "bottom 25%",
                scrub: 1
              }
            });
          }
        }
      });
    }, scope);

    return () => context.revert();
  }, [scope]);
}
