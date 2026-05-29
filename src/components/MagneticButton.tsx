import { MouseEventHandler, ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "quiet";
  showArrow?: boolean;
  "aria-label"?: string;
};

type MagneticAnchorProps = SharedProps & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type MagneticButtonProps = SharedProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type Props = MagneticAnchorProps | MagneticButtonProps;

const variants = {
  primary: "magnetic-button magnetic-button-primary",
  ghost: "magnetic-button magnetic-button-ghost",
  quiet: "magnetic-button magnetic-button-quiet"
};

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  showArrow = true,
  "aria-label": ariaLabel,
  ...props
}: Props) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const move = (node: HTMLElement | null, event: React.MouseEvent) => {
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate3d(${x * 0.12}px, ${y * 0.18}px, 0)`;
  };

  const reset = (node: HTMLElement | null) => {
    if (node) {
      node.style.transform = "translate3d(0, 0, 0)";
    }
  };

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? <ArrowUpRight aria-hidden size={16} strokeWidth={1.8} /> : null}
    </>
  );

  if ("href" in props && props.href) {
    const external = props.href.startsWith("http");

    return (
      <motion.a
        ref={anchorRef}
        className={`${variants[variant]} ${className}`}
        href={props.href}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.98 }}
        onMouseMove={(event) => move(anchorRef.current, event)}
        onMouseLeave={() => reset(anchorRef.current)}
        onClick={props.onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {content}
      </motion.a>
    );
  }

  const buttonProps = props as MagneticButtonProps;

  return (
    <motion.button
      ref={buttonRef}
      className={`${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      whileTap={{ scale: 0.98 }}
      onMouseMove={(event) => move(buttonRef.current, event)}
      onMouseLeave={() => reset(buttonRef.current)}
      onClick={buttonProps.onClick}
    >
      {content}
    </motion.button>
  );
}
