import { useMemo } from 'react';

interface MeteorsProps {
  number?: number;
}

const Meteors = ({ number = 12 }: MeteorsProps) => {
  const meteors = useMemo(() =>
    Array.from({ length: number }, (_, i) => ({
      id: i,
      top: `${Math.random() * 50}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    })), [number]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map(m => (
        <span
          key={m.id}
          className="absolute top-0 w-0.5 h-0.5 rounded-full bg-primary rotate-[215deg] animate-[meteor_3s_linear_infinite] before:content-[''] before:absolute before:top-1/2 before:w-[50px] before:h-[1px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-primary/60 before:to-transparent"
          style={{ top: m.top, left: m.left, animationDelay: m.delay, animationDuration: m.duration }}
        />
      ))}
    </div>
  );
};

export default Meteors;
