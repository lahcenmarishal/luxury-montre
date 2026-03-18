import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal();

  const getTransform = () => {
    if (isVisible) return "translate3d(0,0,0)";
    switch (direction) {
      case "left": return "translate3d(-60px,0,0)";
      case "right": return "translate3d(60px,0,0)";
      case "fade": return "translate3d(0,0,0)";
      default: return "translate3d(0,40px,0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
