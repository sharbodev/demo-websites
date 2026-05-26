"use client";

import React from "react";
import { motion } from "framer-motion";

export const TimelineContent = ({
  children,
  className,
  as = "div",
  customVariants,
  animationNum,
  timelineRef,
  style,
}: any) => {
  const Component = (motion as any)[as] || motion.div;
  
  const defaultVariants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={customVariants || defaultVariants}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};
