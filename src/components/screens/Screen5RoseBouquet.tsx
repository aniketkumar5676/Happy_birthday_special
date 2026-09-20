import React from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { ChevronRight } from 'lucide-react';

export const Screen5RoseBouquet: React.FC = () => {
  const { data, nextScreen } = useBirthday();

  const handleBubbleClick = (e: React.MouseEvent) => {
    playSound('sparkle');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x, y },
      colors: ['#e11d48', '#f43f5e', '#fda4af'],
    });
  };

  const handleBouquetClick = () => {
    playSound('sparkle');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#e11d48', '#be123c', '#fb7185', '#ffe4e6'],
    });
    setTimeout(() => {
      nextScreen();
    }, 900);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between px-3 py-3 select-none overflow-hidden min-h-[calc(100dvh-6.5rem)]">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#831843] font-serif-display tracking-tight text-center mt-2 animate-in fade-in duration-500">
        {data.bouquetHeader}
      </h1>

      {/* Center Interactive Bouquet Area with Compliment Bubbles */}
      <div className="relative w-full max-w-md h-[400px] sm:h-[440px] my-auto flex items-center justify-center">
        {/* Compliment 1: Top-Left */}
        <div
          onClick={handleBubbleClick}
          className="absolute top-4 left-2 sm:left-4 z-20 cursor-pointer animate-float"
          style={{ animationDuration: '4s' }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs sm:text-sm font-semibold text-slate-800 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5">
            <span>{data.compliments[0]?.text || 'Best partner in crime 😈'}</span>
          </div>
        </div>

        {/* Compliment 2: Top-Right */}
        <div
          onClick={handleBubbleClick}
          className="absolute top-4 right-2 sm:right-4 z-20 cursor-pointer animate-float"
          style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs sm:text-sm font-semibold text-slate-800 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5">
            <span>{data.compliments[1]?.text || 'You crack me up 🤣'}</span>
          </div>
        </div>

        {/* Compliment 3: Mid-Left */}
        <div
          onClick={handleBubbleClick}
          className="absolute top-1/2 -translate-y-12 left-0 sm:left-2 z-20 cursor-pointer animate-float"
          style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs sm:text-sm font-semibold text-slate-800 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5">
            <span>{data.compliments[2]?.text || 'Adventures only with you'}</span>
          </div>
        </div>

        {/* Compliment 4: Bottom-Left */}
        <div
          onClick={handleBubbleClick}
          className="absolute bottom-6 left-2 sm:left-4 z-20 cursor-pointer animate-float"
          style={{ animationDuration: '4.2s', animationDelay: '1.5s' }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs sm:text-sm font-semibold text-slate-800 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5">
            <span>{data.compliments[3]?.text || 'Light up the room 🌟'}</span>
          </div>
        </div>

        {/* Compliment 5: Bottom-Right */}
        <div
          onClick={handleBubbleClick}
          className="absolute bottom-6 right-2 sm:right-4 z-20 cursor-pointer animate-float"
          style={{ animationDuration: '3.6s', animationDelay: '0.4s' }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs sm:text-sm font-semibold text-slate-800 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5">
            <span>{data.compliments[4]?.text || 'My favorite trouble 💕'}</span>
          </div>
        </div>

        {/* Center Lush Rose Bouquet */}
        <div
          onClick={handleBouquetClick}
          className="relative w-64 sm:w-72 h-64 sm:h-72 flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-all duration-300"
          title="Tap your bouquet!"
        >
          {/* Subtle floral glow behind bouquet */}
          <div className="absolute inset-4 rounded-full bg-rose-300/30 blur-2xl group-hover:bg-rose-400/40 transition-colors" />

          {/* SVG Rose Bouquet Artwork */}
          <svg
            viewBox="0 0 240 260"
            className="w-full h-full drop-shadow-2xl overflow-visible"
          >
            {/* Wrapping Paper Cone */}
            <path
              d="M120,240 L50,130 Q120,160 190,130 Z"
              fill="#262626"
            />
            {/* Paper Inner Wrap (dark kraft/wine) */}
            <path
              d="M120,240 L60,120 Q120,140 180,120 Z"
              fill="#404040"
            />
            {/* White Paper Accent Edge */}
            <path
              d="M50,130 Q120,155 190,130 L185,125 Q120,150 55,125 Z"
              fill="#ffffff"
              opacity="0.9"
            />

            {/* Lush Red Roses Cluster */}
            <g transform="translate(120, 110)">
              {/* Surrounding deep green leaves */}
              <ellipse cx="-55" cy="-30" rx="14" ry="8" fill="#15803d" transform="rotate(-30, -55, -30)" />
              <ellipse cx="55" cy="-30" rx="14" ry="8" fill="#15803d" transform="rotate(30, 55, -30)" />
              <ellipse cx="-40" cy="-60" rx="12" ry="7" fill="#166534" transform="rotate(-45, -40, -60)" />
              <ellipse cx="40" cy="-60" rx="12" ry="7" fill="#166534" transform="rotate(45, 40, -60)" />
              <ellipse cx="0" cy="-75" rx="12" ry="7" fill="#15803d" />

              {/* Back Row Roses */}
              {/* Rose 1 */}
              <g transform="translate(-35, -50) scale(0.75)">
                <circle cx="0" cy="0" r="22" fill="#9f1239" />
                <path d="M-12,-8 C-10,-18 10,-18 12,-8 C14,4 -14,4 -12,-8 Z" fill="#be123c" />
                <path d="M-6,-4 C-4,-10 6,-10 6,-4 C7,2 -7,2 -6,-4 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="4" fill="#fb7185" />
              </g>

              {/* Rose 2 */}
              <g transform="translate(35, -50) scale(0.75)">
                <circle cx="0" cy="0" r="22" fill="#9f1239" />
                <path d="M-12,-8 C-10,-18 10,-18 12,-8 C14,4 -14,4 -12,-8 Z" fill="#be123c" />
                <path d="M-6,-4 C-4,-10 6,-10 6,-4 C7,2 -7,2 -6,-4 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="4" fill="#fb7185" />
              </g>

              {/* Rose 3 (Center Top) */}
              <g transform="translate(0, -60) scale(0.85)">
                <circle cx="0" cy="0" r="24" fill="#881337" />
                <path d="M-15,-8 C-12,-22 12,-22 15,-8 C16,6 -16,6 -15,-8 Z" fill="#be123c" />
                <path d="M-8,-4 C-6,-12 8,-12 8,-4 C9,3 -9,3 -8,-4 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="5" fill="#fda4af" />
              </g>

              {/* Mid Row Roses */}
              {/* Rose 4 */}
              <g transform="translate(-45, -15) scale(0.85)">
                <circle cx="0" cy="0" r="24" fill="#9f1239" />
                <path d="M-14,-8 C-12,-20 12,-20 14,-8 C15,6 -15,6 -14,-8 Z" fill="#be123c" />
                <path d="M-7,-4 C-5,-12 7,-12 7,-4 C8,3 -8,3 -7,-4 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="5" fill="#fda4af" />
              </g>

              {/* Rose 5 */}
              <g transform="translate(45, -15) scale(0.85)">
                <circle cx="0" cy="0" r="24" fill="#9f1239" />
                <path d="M-14,-8 C-12,-20 12,-20 14,-8 C15,6 -15,6 -14,-8 Z" fill="#be123c" />
                <path d="M-7,-4 C-5,-12 7,-12 7,-4 C8,3 -8,3 -7,-4 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="5" fill="#fda4af" />
              </g>

              {/* Main Center Front Big Rose */}
              <g transform="translate(0, -18) scale(1.1)">
                <circle cx="0" cy="0" r="26" fill="#881337" />
                <path d="M-18,-6 C-14,-22 14,-22 18,-6 C20,10 -20,10 -18,-6 Z" fill="#9f1239" />
                <path d="M-12,-4 C-10,-16 10,-16 12,-4 C14,6 -14,6 -12,-4 Z" fill="#be123c" />
                <path d="M-7,-2 C-5,-10 7,-10 7,-2 C8,4 -8,4 -7,-2 Z" fill="#e11d48" />
                <circle cx="0" cy="-1" r="5" fill="#fda4af" />
              </g>

              {/* Lower Roses filling */}
              <g transform="translate(-20, 10) scale(0.85)">
                <circle cx="0" cy="0" r="22" fill="#be123c" />
                <path d="M-10,-5 C-8,-14 8,-14 10,-5 C12,4 -12,4 -10,-5 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="4" fill="#fda4af" />
              </g>

              <g transform="translate(20, 10) scale(0.85)">
                <circle cx="0" cy="0" r="22" fill="#be123c" />
                <path d="M-10,-5 C-8,-14 8,-14 10,-5 C12,4 -12,4 -10,-5 Z" fill="#e11d48" />
                <circle cx="0" cy="-2" r="4" fill="#fda4af" />
              </g>
            </g>

            {/* Red Satin Ribbon Bow */}
            <g transform="translate(120, 195)">
              {/* Bow Ribbon loops */}
              <path
                d="M0,-2 C-25,-18 -40,10 -8,2 Z"
                fill="#be123c"
              />
              <path
                d="M0,-2 C25,-18 40,10 8,2 Z"
                fill="#be123c"
              />
              {/* Ribbon Knot */}
              <circle cx="0" cy="0" r="7" fill="#e11d48" />
              {/* Ribbon Tails */}
              <path
                d="M-3,5 Q-15,30 -22,48 L-14,46 Q-6,26 2,6 Z"
                fill="#9f1239"
              />
              <path
                d="M3,5 Q15,30 22,48 L14,46 Q6,26 -2,6 Z"
                fill="#9f1239"
              />
            </g>
          </svg>

          {/* Bouquet Ribbon Tag Card: "Happy Birthday, Anshi 💕" */}
          <div className="absolute top-1/2 -right-2 sm:-right-4 translate-y-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-pink-200/80 shadow-sm text-[11px] font-semibold text-rose-800 rotate-6 pointer-events-none">
            {data.bouquetTag}
          </div>
        </div>
      </div>

      {/* Romantic Cherry Blossom Trees / Heart Branches at Bottom Corners */}
      <div className="w-full flex items-end justify-between pointer-events-none px-2 text-rose-300/70">
        {/* Left Tree Branch SVG */}
        <svg viewBox="0 0 100 80" className="w-24 sm:w-32 h-20 fill-current">
          <path d="M10,80 Q25,45 40,30 Q55,18 70,25" stroke="#f472b6" strokeWidth="2.5" fill="none" />
          <circle cx="35" cy="28" r="5" />
          <circle cx="48" cy="20" r="6" />
          <circle cx="62" cy="18" r="5.5" />
          <circle cx="72" cy="26" r="6" />
          <circle cx="45" cy="35" r="4.5" />
          <circle cx="58" cy="32" r="5" />
        </svg>

        {/* Action Button to Next Page */}
        <button
          onClick={() => nextScreen()}
          className="pointer-events-auto flex items-center gap-1.5 px-6 py-2 rounded-full bg-white/90 border border-pink-200 text-rose-700 font-semibold text-xs sm:text-sm shadow-sm hover:bg-rose-50 hover:border-pink-300 transition-all active:scale-95 mb-2"
        >
          <span>Read My Letter</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Right Tree Branch SVG */}
        <svg viewBox="0 0 100 80" className="w-24 sm:w-32 h-20 fill-current transform scale-x-[-1]">
          <path d="M10,80 Q25,45 40,30 Q55,18 70,25" stroke="#f472b6" strokeWidth="2.5" fill="none" />
          <circle cx="35" cy="28" r="5" />
          <circle cx="48" cy="20" r="6" />
          <circle cx="62" cy="18" r="5.5" />
          <circle cx="72" cy="26" r="6" />
          <circle cx="45" cy="35" r="4.5" />
          <circle cx="58" cy="32" r="5" />
        </svg>
      </div>
    </div>
  );
};
