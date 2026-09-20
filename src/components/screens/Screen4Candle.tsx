import React, { useState, useEffect, useRef } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Mic } from 'lucide-react';

export const Screen4Candle: React.FC = () => {
  const { data, nextScreen } = useBirthday();
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [isBlowingState, setIsBlowingState] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Trigger candle blowout
  const triggerBlowOut = () => {
    if (isBlown) return;
    setIsBlowingState(true);
    playSound('candle-blow');

    setTimeout(() => {
      setIsBlown(true);
      setIsBlowingState(false);
      playSound('sparkle');

      // Golden sparklers confetti
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#fef08a', '#f472b6', '#ffffff'],
      });

      // Stop mic if running
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }

      setTimeout(() => {
        nextScreen();
      }, 2800);
    }, 450);
  };

  // Optional microphone listening
  const startMicDetection = async () => {
    try {
      setIsListeningMic(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const micSource = audioCtx.createMediaStreamSource(stream);
      micSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;

        // If threshold exceeded (blowing creates a high level across low-mid spectrum)
        if (avg > 42) {
          triggerBlowOut();
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.debug('Microphone access not granted or unavailable, tap to blow:', err);
      setIsListeningMic(false);
      // Fallback: simple tap
      triggerBlowOut();
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      className={`relative min-h-[92vh] flex flex-col items-center justify-between px-4 py-8 select-none transition-colors duration-1000 ${
        isBlown
          ? 'bg-[#3b2a32]/80 backdrop-brightness-50 text-white'
          : 'bg-transparent text-slate-800'
      }`}
    >
      {/* Header */}
      <h1
        className={`text-2xl sm:text-3xl font-bold font-serif-display tracking-tight text-center mt-2 transition-colors duration-700 ${
          isBlown ? 'text-pink-100/70' : 'text-[#831843]'
        }`}
      >
        {data.candleHeader}
      </h1>

      {/* Birthday Cake & Candle Visual */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Interactive Cake Area */}
        <div
          onClick={triggerBlowOut}
          className="relative cursor-pointer group flex flex-col items-center"
          title="Click to blow the candle!"
        >
          {/* Flame & Smoke Container */}
          <div className="relative h-16 w-16 flex items-center justify-center">
            {!isBlown ? (
              /* Lit Flickering Flame */
              <div className="relative flex flex-col items-center animate-candle-flame">
                {/* Outer warm glow */}
                <div className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md" />
                {/* Flame Teardrop */}
                <div
                  className="w-4 h-9 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_15px_#f59e0b]"
                />
                {/* Inner white-hot core */}
                <div className="absolute bottom-1 w-2 h-4 rounded-full bg-white/90 blur-[0.5px]" />
              </div>
            ) : (
              /* Curly Smoke Wisp Animation */
              <div className="relative flex flex-col items-center animate-smoke">
                <svg
                  viewBox="0 0 30 60"
                  className="w-8 h-16 text-slate-300 fill-none stroke-current"
                >
                  <path
                    d="M15,55 Q10,40 18,30 Q25,20 12,5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  <path
                    d="M16,50 Q22,35 15,22 Q8,10 16,2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Candle Stem */}
          <div className="relative w-4 h-24 -mt-1 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-700 rounded-sm shadow-sm flex flex-col items-center">
            {/* Candle wick */}
            <div className="absolute -top-2 w-0.5 h-2 bg-slate-800 rounded-t" />
            {/* Wax drip details */}
            <div className="w-full h-full opacity-60 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
          </div>

          {/* Birthday Cake SVG */}
          <svg
            viewBox="0 0 340 180"
            className="w-72 sm:w-80 h-40 -mt-2 drop-shadow-xl overflow-visible"
          >
            {/* Saucer / Plate */}
            <ellipse cx="170" cy="140" rx="145" ry="30" fill="#e2e8f0" />
            <ellipse cx="170" cy="136" rx="138" ry="26" fill="#f8fafc" />

            {/* Cake Base (Chocolate Body) */}
            <path
              d="M55,80 Q170,110 285,80 L285,120 Q170,150 55,120 Z"
              fill="#5c382b"
            />
            {/* Cake top base */}
            <ellipse cx="170" cy="80" rx="115" ry="35" fill="#6d4334" />

            {/* Fluffy Vanilla Cream Layer with Drips */}
            <path
              d="M55,80 
                 Q75,98 90,82 
                 Q115,108 135,85 
                 Q155,105 175,82 
                 Q195,110 215,85 
                 Q240,105 260,82 
                 Q275,98 285,80 
                 L285,65 Q170,35 55,65 Z"
              fill="#fffdfa"
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
            />
            <ellipse cx="170" cy="65" rx="115" ry="32" fill="#ffffff" />

            {/* Subtle candle hole indentation */}
            <ellipse cx="170" cy="65" rx="7" ry="3" fill="#e2e8f0" />
          </svg>
        </div>

        {/* Wish Revealed Animation after blowout */}
        {isBlown && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-1000">
            <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-pink-300/30 text-center shadow-2xl">
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif-display italic font-semibold text-pink-100 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
                {data.wishText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mic Blow Action Button */}
      <div className="w-full max-w-xs flex flex-col items-center pb-4">
        {!isBlown && (
          <button
            onClick={() => {
              if (!isListeningMic) {
                startMicDetection();
              } else {
                triggerBlowOut();
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 text-slate-700 hover:text-rose-600 font-medium text-sm shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all"
          >
            <Mic className={`w-4 h-4 ${isListeningMic ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
            <span>
              {isBlowingState
                ? data.blowingPrompt
                : isListeningMic
                ? 'Blow now into mic (or tap here)'
                : data.micPrompt}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
