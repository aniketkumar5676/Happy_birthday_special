import React, { useState, useEffect, useRef } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { ChevronRight, Heart } from 'lucide-react';

export const Screen6EnvelopeLetter: React.FC = () => {
  const { data, nextScreen } = useBirthday();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  // Full letter formatted text with clean spacing
  const letterBlocks: string[] = [];
  if (data.letterSalutation?.trim()) {
    letterBlocks.push(data.letterSalutation.trim());
    letterBlocks.push('');
  }
  data.letterParagraphs.forEach((p) => {
    if (p.trim()) {
      letterBlocks.push(p.trim());
      letterBlocks.push('');
    }
  });
  if (data.letterSignOff?.trim()) {
    letterBlocks.push(data.letterSignOff.trim());
  }
  if (data.letterSignature?.trim()) {
    letterBlocks.push(data.letterSignature.trim());
  }
  const fullText = letterBlocks.join('\n');

  const typingIndexRef = useRef<number>(0);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    playSound('sparkle');
  };

  // Typewriter effect after letter unfolds
  useEffect(() => {
    if (!isOpen) return;

    typingIndexRef.current = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    const speedMs = 18;
    const timer = setInterval(() => {
      typingIndexRef.current += 1;
      const currentSub = fullText.slice(0, typingIndexRef.current);
      setDisplayedText(currentSub);

      if (typingIndexRef.current >= fullText.length) {
        clearInterval(timer);
        setIsTypingDone(true);
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#fda4af', '#f43f5e', '#ec4899'],
        });
      }
    }, speedMs);

    return () => clearInterval(timer);
  }, [isOpen, fullText]);

  // Fast skip option
  const handleFastForward = () => {
    setDisplayedText(fullText);
    setIsTypingDone(true);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between px-3 py-3 select-none min-h-[calc(100dvh-6rem)]">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#831843] font-serif-display italic tracking-tight text-center mt-1">
        {isOpen ? data.letterTitle : data.envelopeTitle}
      </h1>

      {/* Main Container: Either Envelope or Unfolded Letter */}
      <div className="w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center">
        {!isOpen ? (
          /* Sealed Luxury 3D Envelope */
          <div
            onClick={handleOpenEnvelope}
            className="relative cursor-pointer group flex flex-col items-center animate-in zoom-in-95 duration-500 hover:scale-105 active:scale-95 transition-transform"
          >
            {/* 3D Envelope Graphic */}
            <div className="relative w-72 sm:w-80 h-48 sm:h-52 bg-gradient-to-b from-[#fdf2f8] to-[#fce7f3] rounded-2xl shadow-[0_16px_40px_rgba(244,114,182,0.3)] border border-[#fbcfe8] overflow-hidden flex items-center justify-center">
              {/* Gold border piping */}
              <div className="absolute inset-1.5 rounded-xl border border-amber-300/60 pointer-events-none" />

              {/* Envelope Body Fold Lines */}
              <svg viewBox="0 0 300 200" className="w-full h-full">
                {/* Back flap */}
                <polygon points="0,0 150,110 300,0" fill="#fbcfe8" opacity="0.4" />
                {/* Left fold */}
                <polygon points="0,0 0,200 150,110" fill="#fdf2f8" stroke="#f472b6" strokeWidth="0.5" opacity="0.6" />
                {/* Right fold */}
                <polygon points="300,0 300,200 150,110" fill="#fdf2f8" stroke="#f472b6" strokeWidth="0.5" opacity="0.6" />
                {/* Bottom flap fold */}
                <polygon points="0,200 300,200 150,110" fill="#fff1f2" stroke="#fb7185" strokeWidth="0.8" />
                {/* Top flap (closed) */}
                <polygon
                  points="0,0 300,0 150,110"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))"
                />
                {/* Gold trim on flap */}
                <polyline points="0,0 150,108 300,0" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>

              {/* Wax Seal Heart in the Center */}
              <div className="absolute top-[48%] -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-tr from-[#9f1239] to-[#e11d48] shadow-lg flex items-center justify-center border-2 border-amber-300">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
            </div>

            {/* Tap to open prompt */}
            <div className="mt-8 text-pink-700 font-serif-display italic text-base tracking-wide animate-pulse-slow">
              {data.envelopeTapPrompt}
            </div>
          </div>
        ) : (
          /* Opened Unfolded Letter Sheet - Clean, Highly Readable, Non-Cursive Warm Serif */
          <div
            onClick={!isTypingDone ? handleFastForward : undefined}
            className="relative w-full bg-[#fffdfa] rounded-2xl shadow-[0_16px_40px_rgba(244,114,182,0.22)] border border-pink-200/80 p-5 sm:p-6 text-slate-800 flex flex-col justify-between max-h-[58vh] sm:max-h-[62vh] overflow-y-auto animate-in zoom-in-95 duration-500"
          >
            {/* Top Seal Stamp */}
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-md flex items-center justify-center border border-pink-200">
              <Heart className="w-3.5 h-3.5 text-white fill-current" />
            </div>

            {/* Letter Body with Clear, Readable Literary Typography */}
            <div className="font-letter text-[15px] sm:text-[16.5px] leading-[1.75] sm:leading-[1.85] text-stone-900 pr-6 whitespace-pre-line font-normal">
              {displayedText}
              {!isTypingDone && (
                <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse" />
              )}
            </div>

            {/* Cute Kitten Friends Illustration at Bottom Right */}
            <div className="w-full flex items-end justify-between mt-4 pt-2 border-t border-pink-100/60">
              <div className="text-[11px] text-pink-500/80 font-sans-clean font-medium">
                {!isTypingDone ? '(tap to reveal all)' : ''}
              </div>

              {/* Cute Kittens SVG */}
              <div className="w-14 h-12 relative select-none">
                <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm">
                  {/* Left Kitten (Grey/Tricolor) */}
                  <g transform="translate(15, 20)">
                    <polygon points="10,5 5,-5 20,0" fill="#94a3b8" />
                    <polygon points="35,0 50,-5 45,5" fill="#94a3b8" />
                    <circle cx="28" cy="16" r="18" fill="#cbd5e1" />
                    <circle cx="22" cy="14" r="2.5" fill="#1e293b" />
                    <circle cx="34" cy="14" r="2.5" fill="#1e293b" />
                    <ellipse cx="28" cy="19" rx="2" ry="1.5" fill="#f43f5e" />
                    <circle cx="18" cy="18" r="3" fill="#fda4af" opacity="0.6" />
                    <circle cx="38" cy="18" r="3" fill="#fda4af" opacity="0.6" />
                  </g>
                  {/* Right Kitten (Cream Ginger) */}
                  <g transform="translate(48, 18)">
                    <polygon points="10,5 5,-5 20,0" fill="#fb923c" />
                    <polygon points="35,0 50,-5 45,5" fill="#fb923c" />
                    <circle cx="28" cy="16" r="18" fill="#fed7aa" />
                    <path d="M20,15 Q23,12 26,15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
                    <path d="M30,15 Q33,12 36,15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
                    <ellipse cx="28" cy="18" rx="2" ry="1.5" fill="#f43f5e" />
                    <circle cx="18" cy="18" r="3" fill="#fda4af" opacity="0.6" />
                    <circle cx="38" cy="18" r="3" fill="#fda4af" opacity="0.6" />
                  </g>
                  <path d="M48,10 C46,6 40,8 44,14 C48,18 52,14 56,14 C60,8 54,6 52,10 Z" fill="#f43f5e" transform="scale(0.6) translate(36, -8)" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button to Final Surprise Screen - elevated with bottom padding to avoid footer overlap */}
      <div className="w-full max-w-xs flex justify-center pb-6">
        {isOpen && (
          <button
            onClick={() => nextScreen()}
            className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <span>One Last Surprise</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
