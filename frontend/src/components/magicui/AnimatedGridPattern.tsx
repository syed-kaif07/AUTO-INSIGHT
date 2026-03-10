import { cn } from '@/lib/utils';

interface AnimatedGridPatternProps {
  className?: string;
}

const AnimatedGridPattern = ({ className }: AnimatedGridPatternProps) => (
  <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
    <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      opacity: 0.5,
      /* Static instead of animated for performance */
    }} />
  </div>
);

export default AnimatedGridPattern;
