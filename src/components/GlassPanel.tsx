import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function GlassPanel<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: GlassPanelProps<T>) {
  const Component = as ?? "div";

  return (
    <Component className={`glass-panel ${className}`} {...props}>
      {children}
    </Component>
  );
}
