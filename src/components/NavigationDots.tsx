import React from 'react';
import { useBirthday } from '../context/BirthdayContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenId } from '../types';

export const NavigationDots: React.FC = () => {
  const { currentScreen, goToScreen, prevScreen, nextScreen } = useBirthday();

  const screens: { id: ScreenId; label: string }[] = [
    { id: 1, label: 'QR Heart' },
    { id: 2, label: 'Birthday Greeting' },
    { id: 3, label: 'Pop Balloons' },
    { id: 4, label: 'Blow Candle' },
    { id: 5, label: 'Rose Bouquet' },
    { id: 6, label: 'Love Letter' },
    { id: 7, label: 'Gift Box' },
  ];

  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(244,114,182,0.2)] border border-pink-200/80 text-xs select-none">
      {/* Back button (if screen > 1) */}
      {currentScreen > 1 && (
        <button
          onClick={prevScreen}
          className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Screen step dots */}
      <div className="flex items-center gap-1 px-1">
        {screens.map((s) => (
          <button
            key={s.id}
            onClick={() => goToScreen(s.id)}
            title={`Go to ${s.label}`}
            className={`transition-all duration-300 rounded-full ${
              currentScreen === s.id
                ? 'w-5 h-2 bg-rose-500 shadow-sm'
                : 'w-2 h-2 bg-pink-200 hover:bg-pink-300'
            }`}
          />
        ))}
      </div>

      {/* Next button (if screen < 7) */}
      {currentScreen < 7 && (
        <button
          onClick={nextScreen}
          className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
