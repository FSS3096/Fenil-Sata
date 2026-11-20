import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll choreography for every section below the hero. Sections opt in with data attributes,
 * so markup stays declarative:
 *
 *   data-gsap-reveal            fade + rise once
 *   data-anim="up|left|right|scale"  directional entrance once (data-delay in seconds)
 *   data-stagger="up|pop"       children enter one after another
 *   data-words                  headline words rise out of a mask (SectionHeader renders the spans)
 *   data-count + data-suffix    number counts up on entering view
 *   data-scrub-read             child paragraphs brighten as they cross the reading line
 *   data-clip                   image is uncovered by a wipe
 *   data-card                   scroll-scrubbed depth entrance (scale / tilt / rise)
 *   data-drift="n"              element drifts n px while it crosses the viewport
 *   data-line                   element draws itself (scaleX) as it crosses the viewport
 *   data-rise                   children grow upward from the baseline, one after another
 *   data-mark                   highlighter sweeps across the phrase as it is read
 *   data-fill                   a rail fills down as its card crosses the viewport
 *   data-stack                  children are sticky cards; each recedes as the next one arrives
 *   data-depth="n"              parallax in percent (desktop only)
 */
export function useScrollAnimations(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!scope.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      return;
    }

    const once = (trigger: Element, start = "top 86%") => ({ trigger, start, once: true });

    const context = gsap.context(() => {
      const all = <T extends HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);

      all("[data-gsap-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out", scrollTrigger: once(element, "top 88%") }
        );
      });

      all("[data-anim]").forEach((element) => {
        const kind = element.dataset.anim;
        const from =
          kind === "left"
            ? { x: -72 }
            : kind === "right"
              ? { x: 72 }
              : kind === "scale"
                ? { scale: 0.9, y: 28 }
                : { y: 44 };

        gsap.fromTo(
          element,
          { opacity: 0, ...from },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
            delay: Number(element.dataset.delay ?? 0),
            ease: "power3.out",
            scrollTrigger: once(element)
          }
        );
      });

      all("[data-stagger]").forEach((box) => {
        const pop = box.dataset.stagger === "pop";

        gsap.fromTo(
          Array.from(box.children),
          { opacity: 0, y: pop ? 18 : 40, scale: pop ? 0.82 : 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: pop ? "back.out(1.5)" : "power3.out",
            stagger: pop ? 0.035 : 0.1,
            scrollTrigger: once(box, "top 88%")
          }
        );
      });

      all("[data-words]").forEach((heading) => {
        gsap.fromTo(
          heading.querySelectorAll(".word > b"),
          { yPercent: 115, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.045,
            scrollTrigger: once(heading, "top 86%")
          }
        );
      });

      all("[data-count]").forEach((element) => {
        const end = Number(element.dataset.count);
        const suffix = element.dataset.suffix ?? "";
        const counter = { value: 0 };

        element.textContent = `0${suffix}`;
        gsap.to(counter, {
          value: end,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value)}${suffix}`;
          },
          scrollTrigger: once(element, "top 90%")
        });
      });

      all("[data-scrub-read]").forEach((block) => {
        Array.from(block.children).forEach((child) => {
          if (child.tagName === "BR") return;

          gsap.fromTo(
            child,
            { opacity: 0.2, x: -14 },
            {
              opacity: 1,
              x: 0,
              ease: "none",
              scrollTrigger: { trigger: child, start: "top 88%", end: "top 55%", scrub: true }
            }
          );
        });
      });

      all("[data-clip]").forEach((element) => {
        const image = element.querySelector("img");
        const reveal = gsap.timeline({ paused: true });

        reveal.fromTo(
          element,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut" },
          0
        );

        if (image) {
          reveal.fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
        }

        // Never wipe open an empty frame: wait until the picture has loaded and decoded.
        ScrollTrigger.create({
          ...once(element, "top 85%"),
          onEnter: () => {
            const ready = image && !image.complete ? image.decode() : Promise.resolve();

            ready.catch(() => undefined).then(() => reveal.play());
          }
        });
      });

      all("[data-rise]").forEach((box) => {
        gsap.fromTo(
          Array.from(box.children),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.18,
            scrollTrigger: once(box, "top 85%")
          }
        );
      });

      all("[data-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 90, scale: 0.94, rotateX: 7, opacity: 0.15, transformPerspective: 1000 },
          {
            y: 0,
            scale: 1,
            rotateX: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 96%", end: "top 48%", scrub: true }
          }
        );
      });

      all("[data-drift]").forEach((element) => {
        const distance = Number(element.dataset.drift ?? 24);

        gsap.fromTo(
          element,
          { y: distance },
          {
            y: -distance,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.6 }
          }
        );
      });

      all("[data-line]").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 90%", end: "top 55%", scrub: true }
          }
        );
      });

      all("[data-mark]").forEach((element) => {
        gsap.fromTo(
          element,
          { backgroundSize: "0% 78%" },
          {
            backgroundSize: "100% 78%",
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 68%", end: "bottom 45%", scrub: true }
          }
        );
      });

      all("[data-fill]").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest(".glass-panel") ?? element,
              start: "top 70%",
              end: "bottom 60%",
              scrub: true
            }
          }
        );
      });

      ScrollTrigger.matchMedia({
        "(min-width: 761px)": () => {
          all("[data-stack]").forEach((stack) => {
            const cards = Array.from(stack.children) as HTMLElement[];

            cards.slice(0, -1).forEach((wrapper, index) => {
              gsap.fromTo(
                wrapper.firstElementChild,
                { scale: 1, filter: "brightness(1)" },
                {
                  scale: 0.94,
                  // darken instead of fading so a card never shows the one beneath it
                  filter: "brightness(0.9)",
                  ease: "none",
                  scrollTrigger: { trigger: cards[index + 1], start: "top 88%", end: "top 24%", scrub: true }
                }
              );
            });
          });
        },
        "(min-width: 1024px)": () => {
          all("[data-depth]").forEach((element) => {
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
        }
      });
    }, scope);

    // Web fonts and images change layout height; recompute trigger positions once settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [scope]);
}
