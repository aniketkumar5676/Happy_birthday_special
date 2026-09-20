import React, { useState } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface BalloonConfig {
  id: number;
  wordIndex: number;
  gradient: string;
  ribbonColor: string;
  glowColor: string;
  rotation: string;
  delay: string;
}

const balloonsData: BalloonConfig[] = [
  // 1: Top-Left (Soft Sky Blue / White)
  {
    id: 0,
    wordIndex: 0,
    gradient: 'from-sky-100/90 via-blue-200/80 to-sky-300/70',
    ribbonColor: '#7dd3fc',
    glowColor: 'rgba(125,211,252,0.4)',
    rotation: '-rotate-3',
    delay: '0s',
  },
  // 2: Top-Right (Pastel Pink)
  {
    id: 1,
    wordIndex: 1,
    gradient: 'from-pink-100/90 via-rose-200/85 to-pink-300/75',
    ribbonColor: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    rotation: 'rotate-3',
    delay: '0.4s',
  },
  // 3: Bottom-Left (Pastel Mint Green)
  {
    id: 2,
    wordIndex: 2,
    gradient: 'from-emerald-100/90 via-teal-200/85 to-emerald-300/75',
    ribbonColor: '#5eead4',
    glowColor: 'rgba(94,234,212,0.4)',
    rotation: '-rotate-2',
    delay: '0.8s',
  },
  // 4: Bottom-Right (Pastel Lavender / Purple)
  {
    id: 3,
    wordIndex: 3,
    gradient: 'from-purple-100/90 via-indigo-200/85 to-purple-300/75',
    ribbonColor: '#c084fc',
    glowColor: 'rgba(192,132,252,0.4)',
    rotation: 'rotate-2',
    delay: '1.2s',
  },
];

export const Screen3Balloons: React.FC = () => {
  const { data, nextScreen } = useBirthday();
  const [poppedState, setPoppedState] = useState<boolean[]>([false, false, false, false]);

  const poppedCount = poppedState.filter(Boolean).length;
  const isAllPopped = poppedCount === 4;

  const handlePop = (index: number, e: React.MouseEvent) => {
    if (poppedState[index]) return;

    playSound('balloon-pop');

    // Confetti burst from balloon position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#38bdf8', '#a855f7', '#34d399'],
    });

    const newPopped = [...poppedState];
    newPopped[index] = true;
    setPoppedState(newPopped);

    if (newPopped.filter(Boolean).length === 4) {
      playSound('sparkle');
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        nextScreen();
      }, 1800);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between px-3 py-4 select-none min-h-[calc(100dvh-6.5rem)]">
      {/* Top Header & Counter Row */}
      <div className="w-full max-w-md flex items-center justify-between mt-2">
        <div className="w-20" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#be185d] font-sans-clean tracking-tight text-center flex-1">
          {data.balloonsHeader}
        </h1>
        {/* Popped Counter Pill */}
        <div className="w-24 flex justify-end">
          <div className="bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200 text-xs font-bold text-[#9d174d] shadow-sm flex items-center gap-1.5">
            <span className="text-yellow-500">✨</span>
            <span>{poppedCount}/4 POPPED</span>
          </div>
        </div>
      </div>

      {/* Balloons 2x2 Grid */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-x-8 gap-y-10 my-auto py-4">
        {balloonsData.map((b, idx) => {
          const isPopped = poppedState[idx];
          const word = data.balloonWords[b.wordIndex];

          return (
            <div
              key={b.id}
              className="relative h-44 sm:h-48 flex items-center justify-center"
            >
              {/* If Popped: Revealed Secret Word */}
              {isPopped ? (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-300">
                  <span className="text-3xl sm:text-4xl font-bold text-[#831843] font-handwriting italic drop-shadow-sm">
                    {word}
                  </span>
                </div>
              ) : (
                /* Intact Watercolor Floating Balloon */
                <div
                  onClick={(e) => handlePop(idx, e)}
                  style={{
                    animationDelay: b.delay,
                  }}
                  className={`relative w-28 sm:w-32 h-36 sm:h-40 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 animate-float ${b.rotation}`}
                >
                  {/* Balloon Oval Body */}
                  <div
                    className={`w-full h-32 sm:h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.gradient} backdrop-blur-sm border border-white/60 shadow-lg relative overflow-hidden`}
                    style={{
                      boxShadow: `0 12px 28px ${b.glowColor}, inset 0 -8px 14px rgba(255,255,255,0.6)`,
                    }}
                  >
                    {/* Glossy highlight reflection */}
                    <div className="absolute top-3 left-3 w-7 h-11 rounded-[50%] bg-white/60 rotate-[-25deg] blur-[1px]" />
                    <div className="absolute top-2.5 left-4 w-2.5 h-4 rounded-full bg-white/80 rotate-[-20deg]" />

                    {/* Subtle Watercolor texture ring */}
                    <div className="absolute inset-0 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border-[2px] border-white/30 pointer-events-none" />
                  </div>

                  {/* Balloon Knot */}
                  <div
                    className="w-3.5 h-2.5 -mt-1 rounded-sm shadow-sm"
                    style={{ backgroundColor: b.ribbonColor }}
                  />

                  {/* Flowing Ribbon Bow SVG */}
                  <svg
                    viewBox="0 0 50 60"
                    className="w-8 h-10 -mt-1 text-slate-400 overflow-visible"
                  >
                    {/* Bow Loops */}
                    <path
                      d="M25,5 C15,0 12,12 25,7 C38,12 35,0 25,5 Z"
                      fill={b.ribbonColor}
                      opacity="0.9"
                    />
                    <circle cx="25" cy="6" r="2.5" fill={b.ribbonColor} />
                    {/* Waving Ribbon Tails */}
                    <path
                      d="M25,7 Q18,22 28,38 Q33,48 24,58"
                      fill="none"
                      stroke={b.ribbonColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M25,7 Q30,20 20,35 Q15,45 22,55"
                      fill="none"
                      stroke={b.ribbonColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secret Message Complete Reveal Banner */}
      <div className="w-full max-w-md min-h-[50px] flex items-center justify-center text-center">
        {isAllPopped && (
          <div className="animate-in fade-in zoom-in duration-500">
            <p className="text-3xl sm:text-4xl font-bold text-[#831843] font-handwriting tracking-wide">
              {data.balloonWords.join(' ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
