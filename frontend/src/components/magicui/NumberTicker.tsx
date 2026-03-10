import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

const NumberTicker = ({ value, direction = 'up', delay = 0, className = '', decimalPlaces = 0, prefix = '', suffix = '' }: NumberTickerProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const springValue = useSpring(direction === 'down' ? value : 0, {
    bounce: 0,
    duration: 2000,
  });
  const displayValue = useTransform(springValue, (v) =>
    `${prefix}${Intl.NumberFormat('en-US', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(Number(v.toFixed(decimalPlaces)))}${suffix}`
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        springValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, springValue, value, direction, delay]);

  return <motion.span ref={ref} className={className}>{displayValue}</motion.span>;
};

export default NumberTicker;
