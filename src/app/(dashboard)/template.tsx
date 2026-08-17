"use client"

import { motion } from "framer-motion"
import { slideUp } from "@/lib/motion"

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col w-full flex-1"
    >
      {children}
    </motion.div>
  )
}
