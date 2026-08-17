"use client"

import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/motion"
import React from "react"

export function StaggerContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
