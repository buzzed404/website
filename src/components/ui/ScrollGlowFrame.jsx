import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ScrollGlowFrame({ children, radius = 14, strokeWidth = 2.5, className = "" }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 0.9", "end 0.35"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const inset = strokeWidth / 2;
  const rectW = Math.max(size.width - strokeWidth, 0);
  const rectH = Math.max(size.height - strokeWidth, 0);
  const r = Math.min(radius, rectW / 2, rectH / 2);
  const perimeter = 2 * (rectW + rectH) - 8 * r + 2 * Math.PI * r;

  const dashoffset = useTransform(progress, (p) => perimeter * (1 - Math.min(Math.max(p, 0), 1)));

  return (
    <div ref={wrapRef} className={`scroll-glow-frame ${className}`}>
      {children}
      {size.width > 0 && (
        <svg className="scroll-glow-frame__svg" viewBox={`0 0 ${size.width} ${size.height}`} fill="none" aria-hidden="true">
          <motion.rect
            x={inset}
            y={inset}
            width={rectW}
            height={rectH}
            rx={r}
            stroke="var(--color-accent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ strokeDasharray: perimeter, strokeDashoffset: dashoffset }}
          />
        </svg>
      )}
    </div>
  );
}
