import React, { useState } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import { Loader2 } from 'lucide-react';

export const Screen1QrCard: React.FC = () => {
  const { data, nextScreen, setIsPlayingMusic } = useBirthday();
  const [isOpening, setIsOpening] = useState(false);

  const handleCardClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    playSound('sparkle');
    // Start persistent music playback
    setIsPlayingMusic(true);

    setTimeout(() => {
      nextScreen();
    }, 1500);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Outer Heart Card Container */}
      <div
        onClick={handleCardClick}
        className={`relative w-full max-w-[340px] aspect-[1/1.12] bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-[0_20px_50px_rgba(244,114,182,0.25)] border border-pink-100 flex flex-col items-center justify-between cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
          isOpening ? 'scale-105 shadow-[0_25px_60px_rgba(244,114,182,0.4)]' : ''
        }`}
      >
        {/* Recipient Name Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#831843] tracking-wide font-serif-display mt-1">
          {data.qrHeaderName}
        </h1>

        {/* Big Red Heart Container with QR Code */}
        <div className="relative w-56 h-52 flex items-center justify-center my-auto">
          {/* Glossy Red Heart SVG */}
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-[#e11d48] drop-shadow-md fill-current transition-transform duration-300"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* QR Code Graphics Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative bg-white/95 p-2 rounded-xl shadow-inner border border-rose-100/50">
              {/* Detailed Stylized SVG QR Code */}
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 text-slate-900 fill-current"
              >
                {/* Corner Finder Patterns */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />

                {/* Modules grid */}
                <rect x="36" y="8" width="5" height="5" />
                <rect x="46" y="8" width="5" height="5" />
                <rect x="56" y="8" width="5" height="5" />
                <rect x="36" y="18" width="5" height="5" />
                <rect x="46" y="18" width="8" height="5" />
                <rect x="58" y="18" width="5" height="5" />

                <rect x="8" y="36" width="5" height="5" />
                <rect x="18" y="36" width="5" height="5" />
                <rect x="28" y="36" width="5" height="5" />
                <rect x="38" y="36" width="6" height="6" />
                <rect x="48" y="36" width="5" height="5" />
                <rect x="58" y="36" width="7" height="6" />
                <rect x="72" y="36" width="5" height="5" />
                <rect x="84" y="36" width="8" height="5" />

                <rect x="8" y="46" width="6" height="5" />
                <rect x="22" y="46" width="5" height="5" />
                <rect x="34" y="46" width="8" height="8" />
                <rect x="48" y="46" width="5" height="5" />
                <rect x="62" y="46" width="6" height="5" />
                <rect x="76" y="46" width="5" height="5" />
                <rect x="86" y="46" width="6" height="5" />

                <rect x="8" y="56" width="5" height="5" />
                <rect x="18" y="56" width="6" height="5" />
                <rect x="30" y="56" width="5" height="5" />
                <rect x="42" y="56" width="7" height="5" />
                <rect x="54" y="56" width="5" height="5" />
                <rect x="68" y="56" width="6" height="6" />
                <rect x="80" y="56" width="5" height="5" />

                <rect x="36" y="68" width="6" height="5" />
                <rect x="48" y="68" width="5" height="5" />
                <rect x="60" y="68" width="5" height="5" />
                <rect x="72" y="68" width="6" height="5" />
                <rect x="84" y="68" width="5" height="5" />

                <rect x="38" y="78" width="5" height="5" />
                <rect x="48" y="78" width="8" height="6" />
                <rect x="64" y="78" width="5" height="5" />
                <rect x="76" y="78" width="7" height="5" />
                <rect x="88" y="78" width="5" height="5" />

                <rect x="36" y="88" width="5" height="5" />
                <rect x="46" y="88" width="6" height="5" />
                <rect x="58" y="88" width="7" height="5" />
                <rect x="72" y="88" width="5" height="5" />
                <rect x="84" y="88" width="6" height="5" />
              </svg>

              {/* Laser Scanning Line Animation */}
              <div className="absolute inset-x-1.5 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_#f43f5e] animate-scan-laser pointer-events-none rounded-full" />
            </div>
          </div>
        </div>

        {/* Small Bottom Accent Heart */}
        <div className="flex items-center justify-center gap-1.5 text-pink-300">
          <span className="text-xs">❤</span>
        </div>
      </div>

      {/* Action Indicator Text below card */}
      <div className="mt-8 flex flex-col items-center justify-center">
        {isOpening ? (
          <div className="flex items-center gap-2 text-rose-600 font-medium text-base animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            <span>{data.qrOpeningText}</span>
          </div>
        ) : (
          <button
            onClick={handleCardClick}
            className="text-pink-700/80 hover:text-rose-600 font-medium text-base tracking-wide transition-colors animate-pulse-slow hover:scale-105 active:scale-95"
          >
            {data.qrInstruction}
          </button>
        )}
      </div>
    </div>
  );
};
