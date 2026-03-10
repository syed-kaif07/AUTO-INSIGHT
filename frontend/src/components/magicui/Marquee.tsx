import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
}

const Marquee = ({ children, className, reverse = false, pauseOnHover = true, speed = 40 }: MarqueeProps) => (
  <div className={cn('flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]', className)}>
    <div
      className={cn('flex shrink-0 gap-12 items-center', pauseOnHover && 'hover:[animation-play-state:paused]')}
      style={{
        animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {children}
      {children}
    </div>
  </div>
);

export default Marquee;
