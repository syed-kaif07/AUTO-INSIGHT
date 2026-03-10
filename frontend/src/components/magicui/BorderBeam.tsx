import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

const BorderBeam = ({ className, size = 200, duration = 12, colorFrom = '#8B5CF6', colorTo = '#6366F1' }: BorderBeamProps) => (
  <div
    className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
    style={{
      background: `conic-gradient(from calc(var(--border-beam-angle, 0) * 1deg), transparent 80%, ${colorFrom}, ${colorTo}, transparent 100%)`,
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'xor',
      padding: '1.5px',
      animation: `border-beam-spin ${duration}s linear infinite`,
      willChange: 'transform',
      transform: 'translateZ(0)',
    }}
  />
);

export default BorderBeam;
