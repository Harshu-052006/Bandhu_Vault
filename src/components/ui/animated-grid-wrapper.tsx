"use client"

import dynamic from "next/dynamic";

export const AnimatedGridWrapper = dynamic(
  () => import("@/components/ui/animated-grid").then((mod) => mod.AnimatedGrid),
  { ssr: false }
);
