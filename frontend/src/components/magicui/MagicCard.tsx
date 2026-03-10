import { useRef, useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  gradientColor?: string;
}

const MagicCard = ({ children, className, gradientColor = 'rgba(139, 92, 246, 0.15)' }: MagicCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  // Throttle mousemove to rAF for 60fps
  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) { rafRef.current = 0; return; }
      const rect = ref.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      rafRef.current = 0;
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => { setOpacity(0); cancelAnimationFrame(rafRef.current); rafRef.current = 0; }}
      className={cn(
        'relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/[0.03] border border-white/[0.08]',
        className
      )}
      style={{ willChange: 'transform', transform: 'translateZ(0)', transition: 'transform 0.3s ease, border-color 0.3s ease' }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit]"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${gradientColor}, transparent 40%)`,
          transition: 'opacity 0.3s ease',
          willChange: 'opacity',
        }}
      />
      {children}
    </div>
  );
};

export default MagicCard;
