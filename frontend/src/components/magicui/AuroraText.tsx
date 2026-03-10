import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface AuroraTextProps {
  children: ReactNode;
  className?: string;
}

const AuroraText = ({ children, className }: AuroraTextProps) => (
  <span className={cn('relative inline-block bg-clip-text text-transparent bg-[length:200%_200%] animate-[aurora_6s_ease-in-out_infinite]', className)}
    style={{
      backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 25%, #6366F1 50%, #8B5CF6 75%, #D946EF 100%)',
    }}
  >
    {children}
  </span>
);

export default AuroraText;
