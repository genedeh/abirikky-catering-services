"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 10 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 10;

  return {
    id: index,
    x: Math.cos(angle) * 28,
    y: Math.sin(angle) * 28,
  };
});

export function BasketBurst() {
  return (
    <span className="pointer-events-none absolute inset-0">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-green-500"
          initial={{ opacity: 1, scale: 0.7, x: "-50%", y: "-50%" }}
          animate={{
            opacity: 0,
            scale: 0,
            x: `calc(-50% + ${particle.x}px)`,
            y: `calc(-50% + ${particle.y}px)`,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </span>
  );
}
