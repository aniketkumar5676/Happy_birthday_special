import React, { useMemo } from 'react';

export const FloatingHeartsBackground: React.FC = () => {
  const hearts = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.sin(i) * 10 + 5) % 95}%`,
      size: 10 + (i % 4) * 6,
      duration: 7 + (i % 5) * 3,
      delay: (i % 6) * 1.5,
      opacity: 0.15 + (i % 4) * 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#fdf2f7] via-[#fce7f3] to-[#fbcfe8]">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-rose-300 select-none animate-float"
          style={{
            left: h.left,
            bottom: '-20px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            animationIterationCount: 'infinite',
          }}
        >
          ❤
        </div>
      ))}
    </div>
  );
};
