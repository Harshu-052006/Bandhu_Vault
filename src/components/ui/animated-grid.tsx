"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedGrid() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Interactive Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[100px] opacity-40 dark:opacity-30 pointer-events-none mix-blend-screen dark:mix-blend-lighten"
        animate={{
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.5 }}
        style={{
          background: 'radial-gradient(circle, #4f46e5 0%, transparent 60%)',
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full blur-[120px] opacity-40 dark:opacity-20"
        animate={{
          y: [0, -60, 0],
          x: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ background: '#4f46e5' /* Indigo */ }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full blur-[140px] opacity-30 dark:opacity-15"
        animate={{
          y: [0, 60, 0],
          x: [0, -50, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ background: '#0ea5e9' /* Sky Blue */ }}
      />

      {/* Fade out edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
    </div>
  );
}
