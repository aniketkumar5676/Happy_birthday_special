import React, { useState } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const Screen2ExcitedQuestion: React.FC = () => {
  const { data, nextScreen } = useBirthday();
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // Playful dodging algorithm for the "No" button
  const handleNoDodge = () => {
    const randomOffsets = [
      { x: 130, y: -40 },
      { x: -120, y: 60 },
      { x: 100, y: 120 },
      { x: -130, y: -70 },
      { x: 140, y: 80 },
      { x: -100, y: 110 },
      { x: 80, y: -100 },
    ];
    const nextOffset = randomOffsets[(dodgeCount + 1) % randomOffsets.length];
    setNoButtonOffset(nextOffset);
    setDodgeCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    playSound('sparkle');
    // Fire celebration confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fef08a', '#67e8f9'],
    });

    setTimeout(() => {
      nextScreen();
    }, 600);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-6 text-center select-none">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#831843] font-handwriting tracking-wide mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        {data.greetingTitle}
      </h1>

      {/* Cute Bears Celebrating Illustration Container */}
      <div className="relative w-72 sm:w-80 h-64 sm:h-72 my-2 flex items-center justify-center animate-in zoom-in-95 duration-500">
        {/* Floating background celebratory bunting flags */}
        <div className="absolute top-2 inset-x-4 flex justify-center gap-2">
          {['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7'].map((col, i) => (
            <div
              key={i}
              className="w-4 h-5 clip-triangle shadow-sm transform transition-transform"
              style={{
                backgroundColor: col,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                transform: `rotate(${((i - 2) * 8)}deg)`,
              }}
            />
          ))}
        </div>

        {/* Detailed High-Quality SVG Illustration of Milk & Mocha style cute birthday bears */}
        <svg
          viewBox="0 0 320 280"
          className="w-full h-full drop-shadow-md"
        >
          {/* Confetti & stars background */}
          <g opacity="0.8">
            <path d="M40 50 L45 55 L38 58 Z" fill="#ec4899" />
            <path d="M280 60 L285 52 L275 56 Z" fill="#38bdf8" />
            <polygon points="50,90 53,96 60,97 55,102 56,108 50,105 44,108 45,102 40,97 47,96" fill="#facc15" />
            <polygon points="270,100 273,106 280,107 275,112 276,118 270,115 264,118 265,112 260,107 267,106" fill="#facc15" />
            <circle cx="80" cy="40" r="3" fill="#f43f5e" />
            <circle cx="240" cy="45" r="3" fill="#a855f7" />
          </g>

          {/* Left Bear (Brown Bear / Mocha) */}
          <g transform="translate(60, 80)">
            {/* Party Cone Hat */}
            <polygon points="45,-15 30,22 60,22" fill="#38bdf8" />
            <circle cx="45" cy="-17" r="4" fill="#fbbf24" />
            <circle cx="38" cy="8" r="2.5" fill="#ffffff" />
            <circle cx="48" cy="14" r="2.5" fill="#ffffff" />

            {/* Left Ear */}
            <circle cx="20" cy="25" r="14" fill="#8d5b4c" />
            <circle cx="20" cy="25" r="8" fill="#b98574" />
            {/* Right Ear */}
            <circle cx="70" cy="25" r="14" fill="#8d5b4c" />
            <circle cx="70" cy="25" r="8" fill="#b98574" />

            {/* Head */}
            <ellipse cx="45" cy="45" rx="35" ry="30" fill="#a06757" />
            {/* Body */}
            <path d="M15,70 Q45,65 75,70 Q85,115 5,115 Z" fill="#a06757" />

            {/* Eyes (happy curves) */}
            <path d="M30,42 Q35,38 40,42" fill="none" stroke="#371b12" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50,42 Q55,38 60,42" fill="none" stroke="#371b12" strokeWidth="2.5" strokeLinecap="round" />
            {/* Snout */}
            <ellipse cx="45" cy="50" rx="10" ry="7" fill="#d7aba0" />
            <ellipse cx="45" cy="47" rx="3.5" ry="2.5" fill="#371b12" />
            <path d="M45,50 Q45,54 48,54" fill="none" stroke="#371b12" strokeWidth="1.8" />
            {/* Cheeks */}
            <ellipse cx="26" cy="48" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="64" cy="48" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
          </g>

          {/* Right Bear (White Bear / Milk) */}
          <g transform="translate(170, 80)">
            {/* Party Cone Hat */}
            <polygon points="45,-15 30,22 60,22" fill="#ec4899" />
            <circle cx="45" cy="-17" r="4" fill="#ffffff" />
            <circle cx="40" cy="6" r="2.5" fill="#fde047" />
            <circle cx="48" cy="14" r="2.5" fill="#fde047" />

            {/* Left Ear */}
            <circle cx="20" cy="25" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="20" cy="25" r="8" fill="#fda4af" />
            {/* Right Ear */}
            <circle cx="70" cy="25" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="70" cy="25" r="8" fill="#fda4af" />

            {/* Head */}
            <ellipse cx="45" cy="45" rx="35" ry="30" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1" />
            {/* Body */}
            <path d="M15,70 Q45,65 75,70 Q85,115 5,115 Z" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1" />

            {/* Eyes (happy joyful arches) */}
            <path d="M30,42 Q35,38 40,42" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50,42 Q55,38 60,42" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            {/* Snout */}
            <ellipse cx="45" cy="50" rx="9" ry="6" fill="#f1f5f9" />
            <ellipse cx="45" cy="47" rx="3.5" ry="2.5" fill="#334155" />
            <path d="M45,50 Q45,54 48,54" fill="none" stroke="#334155" strokeWidth="1.8" />
            {/* Cheeks */}
            <ellipse cx="26" cy="48" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="64" cy="48" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
          </g>

          {/* Birthday Cake in the center held by both */}
          <g transform="translate(100, 160)">
            {/* Cake Plate */}
            <ellipse cx="60" cy="65" rx="55" ry="12" fill="#e2e8f0" />
            <ellipse cx="60" cy="62" rx="50" ry="10" fill="#ffffff" />

            {/* Cake Base Layer */}
            <path d="M20,40 Q60,52 100,40 L100,58 Q60,70 20,58 Z" fill="#f472b6" />
            <ellipse cx="60" cy="40" rx="40" ry="12" fill="#fbcfe8" />

            {/* Cake Frosting Drips */}
            <path
              d="M20,40 Q30,50 35,42 Q45,52 55,42 Q65,52 75,42 Q85,50 100,40 L100,38 Q60,48 20,38 Z"
              fill="#ffffff"
            />

            {/* Cherries / Strawberry toppings */}
            <circle cx="35" cy="38" r="4" fill="#e11d48" />
            <circle cx="50" cy="41" r="4.5" fill="#e11d48" />
            <circle cx="65" cy="41" r="4.5" fill="#e11d48" />
            <circle cx="82" cy="38" r="4" fill="#e11d48" />

            {/* Lit Candle */}
            <rect x="58" y="16" width="4" height="18" fill="#38bdf8" rx="1.5" />
            {/* Candle wick */}
            <line x1="60" y1="16" x2="60" y2="12" stroke="#475569" strokeWidth="1" />
            {/* Flickering Flame */}
            <path
              d="M60,6 Q64,10 60,14 Q56,10 60,6 Z"
              fill="#f59e0b"
              className="animate-pulse"
            />
            <circle cx="60" cy="11" r="2" fill="#fef08a" />

            {/* "HAPPY BIRTHDAY" Banner on Cake */}
            <rect x="25" y="46" width="70" height="15" rx="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
            <text
              x="60"
              y="57"
              textAnchor="middle"
              fill="#be185d"
              fontSize="7.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="0.5"
            >
              HAPPY BIRTHDAY
            </text>
          </g>

          {/* Bear Paws holding cake */}
          <ellipse cx="118" cy="205" rx="7" ry="5" fill="#a06757" />
          <ellipse cx="202" cy="205" rx="7" ry="5" fill="#f8fafc" stroke="#e2e8f0" />
        </svg>
      </div>

      {/* Question Prompt */}
      <h2 className="text-xl sm:text-2xl font-serif-display font-medium text-[#4c0519] mt-3 mb-6">
        {data.questionText}
      </h2>

      {/* Buttons: Yes & Dodgeable No */}
      <div className="relative flex items-center justify-center gap-6 min-h-[60px] w-full max-w-xs">
        {/* Yes Button */}
        <button
          onClick={handleYesClick}
          className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#be185d] to-[#9d174d] text-white font-semibold text-base shadow-[0_8px_20px_rgba(190,24,93,0.35)] hover:scale-105 active:scale-95 transition-all hover:shadow-[0_10px_25px_rgba(190,24,93,0.45)] z-10"
        >
          {data.yesButtonText}
        </button>

        {/* Playful "No" Button */}
        <button
          onClick={handleNoDodge}
          onMouseEnter={handleNoDodge}
          onTouchStart={handleNoDodge}
          style={{
            transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
            transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="px-8 py-2.5 rounded-full bg-white text-[#be185d] font-semibold text-base border border-pink-200 shadow-sm hover:border-pink-300 select-none cursor-pointer"
        >
          {data.noButtonText}
        </button>
      </div>
    </div>
  );
};
