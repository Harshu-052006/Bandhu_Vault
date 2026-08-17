import { Variants } from "framer-motion";

// Custom easing for a snappy start and soft landing (ease-out)
export const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Transition definitions
export const microTransition = { duration: 0.2, ease: customEase };
export const layoutTransition = { duration: 0.4, ease: customEase };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: microTransition 
  },
  exit: { 
    opacity: 0, 
    transition: { ...microTransition, duration: 0.15 } 
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: layoutTransition 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { ...layoutTransition, duration: 0.2 } 
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: layoutTransition 
  },
  exit: { 
    opacity: 0, 
    y: 5,
    transition: microTransition
  }
};

export const accordionVariant: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { height: layoutTransition, opacity: layoutTransition } 
  },
  exit: { 
    height: 0, 
    opacity: 0, 
    transition: { height: layoutTransition, opacity: microTransition } 
  }
};

export const badgeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};
