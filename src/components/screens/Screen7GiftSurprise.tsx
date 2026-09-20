import React, { useState } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Share2, Heart } from 'lucide-react';

export const Screen7GiftSurprise: React.FC = () => {
  const { data, goToScreen } = useBirthday();
  const [tapCount, setTapCount] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isWiggling, setIsWiggling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGiftTap = () => {
    if (isRevealed) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    playSound('gift-tap');

    // Trigger wiggle
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 300);

    // Mini confetti burst per tap
    confetti({
      particleCount: 15 * nextCount,
      spread: 40,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047'],
    });

    if (nextCount >= data.tapsNeeded) {
      setTimeout(() => {
        setIsRevealed(true);
        playSound('sparkle');
        // Grand finale confetti blast
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#e11d48', '#f43f5e', '#fbbf24', '#38bdf8', '#a855f7'],
        });
      }, 350);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-between px-4 py-8 select-none">
      {/* Header */}
      <div className="text-center mt-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#831843] font-serif-display italic tracking-tight">
          {data.giftHeader}
        </h1>
        {!isRevealed && (
          <p className="text-base text-pink-700/80 font-serif-display italic mt-1 animate-pulse">
            {data.giftPrompt}
          </p>
        )}
      </div>

      {/* Main Interactive Stage: Gift Box OR Revealed Polaroid Card */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex items-center justify-center">
        {!isRevealed ? (
          /* Wrapped Gift Box with Tap Counter */
          <div className="relative flex items-center justify-center">
            {/* Tap Badge (1, 2, 3) */}
            {tapCount > 0 && (
              <div className="absolute -top-3 -right-4 w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-bold text-base flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-200 z-20">
                {tapCount}
              </div>
            )}

            {/* Clickable Gift Box SVG */}
            <div
              onClick={handleGiftTap}
              className={`relative cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 ${
                isWiggling ? 'scale-110 rotate-6' : 'animate-float'
              }`}
            >
              {/* Soft pink glow underneath */}
              <div className="absolute -inset-4 rounded-full bg-rose-400/25 blur-xl pointer-events-none" />

              <svg
                viewBox="0 0 200 200"
                className="w-48 sm:w-56 h-48 sm:h-56 drop-shadow-2xl overflow-visible"
              >
                {/* Gift Box Base */}
                <rect
                  x="40"
                  y="85"
                  width="120"
                  height="95"
                  rx="14"
                  fill="#fbcfe8"
                  stroke="#f472b6"
                  strokeWidth="2"
                />
                {/* Vertical Ribbon Stripes */}
                <rect x="88" y="85" width="24" height="95" fill="#f43f5e" />
                {/* Gold piping along ribbon */}
                <line x1="88" y1="85" x2="88" y2="180" stroke="#fbbf24" strokeWidth="1.5" />
                <line x1="112" y1="85" x2="112" y2="180" stroke="#fbbf24" strokeWidth="1.5" />

                {/* Gift Box Lid */}
                <rect
                  x="30"
                  y="65"
                  width="140"
                  height="26"
                  rx="8"
                  fill="#f472b6"
                  stroke="#fb7185"
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                />
                {/* Lid Ribbon */}
                <rect x="88" y="65" width="24" height="26" fill="#f43f5e" />
                <line x1="88" y1="65" x2="88" y2="91" stroke="#fbbf24" strokeWidth="1.5" />
                <line x1="112" y1="65" x2="112" y2="91" stroke="#fbbf24" strokeWidth="1.5" />

                {/* Ribbon Bow SVG */}
                <g transform="translate(100, 65)">
                  {/* Left Bow Loop */}
                  <path
                    d="M0,0 C-40,-35 -50,-5 0,-4 Z"
                    fill="#fb7185"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M0,0 C40,-35 50,-5 0,-4 Z"
                    fill="#fb7185"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  {/* Center Bow Knot */}
                  <circle cx="0" cy="-2" r="9" fill="#e11d48" stroke="#fbbf24" strokeWidth="1.5" />
                  {/* Hanging Ribbon Tails */}
                  <path
                    d="M-3,5 Q-20,25 -26,45 L-16,42 Q-6,20 2,6 Z"
                    fill="#be123c"
                  />
                  <path
                    d="M3,5 Q20,25 26,45 L16,42 Q6,20 -2,6 Z"
                    fill="#be123c"
                  />
                </g>
              </svg>
            </div>
          </div>
        ) : (
          /* Revealed Polaroid Celebration Card */
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-3xl p-5 shadow-[0_20px_50px_rgba(244,114,182,0.35)] border border-pink-100 flex flex-col items-center text-center animate-in zoom-in-75 duration-700">
            {/* Top-Right Heart Badge */}
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>

            {/* Line Friends Cony & Brown Birthday Artwork SVG */}
            <div className="w-full aspect-[1/0.88] bg-pink-50/50 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-pink-100/60">
              <svg viewBox="0 0 300 240" className="w-full h-full">
                {/* Floating "HBD" letter balloons and sparkles */}
                <g opacity="0.9">
                  <path d="M50 35 L56 22 L62 35 Z" fill="#f43f5e" />
                  <polygon points="150,15 154,23 162,24 156,30 158,38 150,33 142,38 144,30 138,24 146,23" fill="#facc15" />
                  <polygon points="240,25 243,31 250,32 245,37 246,43 240,40 234,43 235,37 230,32 237,31" fill="#ec4899" />
                  <circle cx="80" cy="20" r="3" fill="#38bdf8" />
                  <circle cx="220" cy="18" r="3.5" fill="#a855f7" />
                </g>

                {/* "H B D" Colorful Banners */}
                <g transform="translate(110, 45)">
                  {/* H */}
                  <rect x="0" y="0" width="22" height="26" rx="5" fill="#fb7185" />
                  <text x="11" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">H</text>
                  {/* B */}
                  <rect x="28" y="-4" width="22" height="26" rx="5" fill="#38bdf8" />
                  <text x="39" y="15" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">B</text>
                  {/* D */}
                  <rect x="56" y="0" width="22" height="26" rx="5" fill="#facc15" />
                  <text x="67" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">D</text>
                </g>

                {/* Left Character: Cony (White Rabbit) */}
                <g transform="translate(75, 90)">
                  {/* Long Bunny Ears */}
                  <ellipse cx="25" cy="5" rx="8" ry="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                  <ellipse cx="25" cy="5" rx="4.5" ry="16" fill="#fbcfe8" />
                  <ellipse cx="45" cy="5" rx="8" ry="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                  <ellipse cx="45" cy="5" rx="4.5" ry="16" fill="#fbcfe8" />

                  {/* Round Bunny Head */}
                  <circle cx="35" cy="40" r="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                  {/* Body */}
                  <ellipse cx="35" cy="85" rx="24" ry="26" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Joyful Closed Eyes */}
                  <path d="M22,38 Q26,33 30,38" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40,38 Q44,33 48,38" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Pink Cute Cheeks */}
                  <ellipse cx="18" cy="45" rx="5.5" ry="3.5" fill="#f43f5e" opacity="0.4" />
                  <ellipse cx="52" cy="45" rx="5.5" ry="3.5" fill="#f43f5e" opacity="0.4" />
                  {/* Tiny Bunny Nose & Mouth */}
                  <circle cx="35" cy="42" r="2.5" fill="#1e293b" />
                  <path d="M35,44.5 Q35,49 32,49 M35,44.5 Q35,49 38,49" stroke="#1e293b" strokeWidth="1.5" fill="none" />

                  {/* Cony holding a mini strawberry cake */}
                  <g transform="translate(10, 68)">
                    <rect x="0" y="10" width="34" height="15" rx="3" fill="#fbcfe8" />
                    <rect x="0" y="8" width="34" height="4" rx="2" fill="#ffffff" />
                    <circle cx="17" cy="6" r="3" fill="#e11d48" />
                    <line x1="17" y1="3" x2="17" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Right Character: Brown (Bear) */}
                <g transform="translate(160, 90)">
                  {/* Round Bear Ears */}
                  <circle cx="16" cy="22" r="10" fill="#78350f" />
                  <circle cx="16" cy="22" r="5.5" fill="#92400e" />
                  <circle cx="54" cy="22" r="10" fill="#78350f" />
                  <circle cx="54" cy="22" r="5.5" fill="#92400e" />

                  {/* Round Head */}
                  <circle cx="35" cy="42" r="32" fill="#8d4925" />
                  {/* Body */}
                  <ellipse cx="35" cy="85" rx="24" ry="26" fill="#8d4925" />

                  {/* Cute Dot Eyes */}
                  <circle cx="25" cy="38" r="2.8" fill="#1e293b" />
                  <circle cx="45" cy="38" r="2.8" fill="#1e293b" />
                  {/* White Snout */}
                  <ellipse cx="35" cy="46" rx="9" ry="7" fill="#fef3c7" />
                  <ellipse cx="35" cy="43" rx="3" ry="2" fill="#1e293b" />
                  <path d="M35,45 L35,49" stroke="#1e293b" strokeWidth="1.5" />

                  {/* Brown holding a wrapped yellow present */}
                  <g transform="translate(20, 65)">
                    <rect x="0" y="0" width="28" height="24" rx="4" fill="#fde047" stroke="#eab308" strokeWidth="1" />
                    <line x1="14" y1="0" x2="14" y2="24" stroke="#e11d48" strokeWidth="3" />
                    <line x1="0" y1="12" x2="28" y2="12" stroke="#e11d48" strokeWidth="3" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Revealed Text Messages */}
            <div className="mt-4 space-y-1">
              <h2 className="text-xl font-bold font-serif-display text-[#831843]">
                {data.finalMessage1}
              </h2>
              <p className="text-sm font-medium text-slate-700 font-sans-clean">
                {data.finalMessage2}
              </p>
            </div>

            {/* Action Buttons: Replay & Share */}
            <div className="w-full flex items-center justify-center gap-3 mt-5 pt-3 border-t border-pink-100 text-xs">
              <button
                onClick={() => goToScreen(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-100/90 hover:bg-pink-200 text-rose-800 font-medium transition-all hover:scale-105 active:scale-95"
                title="Replay from beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all hover:scale-105 active:scale-95"
                title="Copy website link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
};
