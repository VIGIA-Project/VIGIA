import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '@mui/material';
import { counterUp } from '../../config/animations.config';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  sx?: object;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  suffix = '',
  sx = {},
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, shouldReduceMotion]);

  return (
    <motion.div variants={counterUp} initial="hidden" animate="visible">
      <Typography
        sx={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 700,
          fontSize: '2.5rem',
          color: '#0A2F86',
          lineHeight: 1.1,
          ...sx,
        }}
      >
        {displayValue}{suffix}
      </Typography>
    </motion.div>
  );
};

export default AnimatedCounter;
