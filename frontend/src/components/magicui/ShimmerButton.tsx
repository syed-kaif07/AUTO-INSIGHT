import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const ShimmerButton = ({ children, className, onClick, type = 'button' }: ShimmerButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className={cn(
      'group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-7 py-3.5 font-semibold text-white',
      'bg-gradient-to-r from-primary to-accent',
      className
    )}
    style={{ willChange: 'transform', transform: 'translateZ(0)', transition: 'transform 0.3s ease' }}
  >
    {/* Glow pseudo-element via opacity instead of box-shadow transition */}
    <span className="absolute inset-0 rounded-xl opacity-100 pointer-events-none" style={{
      boxShadow: '0 0 20px rgba(139,92,246,0.3)',
    }} />
    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" style={{
      boxShadow: '0 0 40px rgba(139,92,246,0.5)',
    }} />
    <span className="absolute inset-0 overflow-hidden rounded-xl">
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ willChange: 'transform' }} />
    </span>
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

export default ShimmerButton;
