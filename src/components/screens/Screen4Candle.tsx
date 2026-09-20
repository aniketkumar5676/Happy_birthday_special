import React, { useState, useEffect, useRef } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Mic, Wind } from 'lucide-react';

export const Screen4Candle: React.FC = () => {
  const { data, nextScreen } = useBirthday();
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowLevel, setBlowLevel] = useState<number>(0);
  const [isBlowingState, setIsBlowingState] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const consecutiveHitsRef = useRef<number>(0);
  const isBlownRef = useRef<boolean>(false);

  // Trigger candle blowout
  const triggerBlowOut = () => {
    if (isBlownRef.current) return;
    isBlownRef.current = true;
    setIsBlown(true);
    setIsBlowingState(true);
    playSound('candle-blow');

    setTimeout(() => {
      setIsBlowingState(false);
      playSound('sparkle');

      // Golden sparklers confetti
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#fef08a', '#f472b6', '#ffffff'],
      });

      // Stop microphone
      stopMic();

      setTimeout(() => {
        nextScreen();
      }, 2800);
    }, 400);
  };

  const stopMic = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
    setBlowLevel(0);
  };

  // High-sensitivity microphone breath & wind turbulence detection
  const startMicDetection = async () => {
    if (isBlownRef.current) return;

    try {
      setMicError(null);
      stopMic();

      // Request stream with echo cancellation and noise suppression explicitly disabled
      // so raw breath puff turbulence reaches the analyser!
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
      } catch {
        // Fallback for browsers that reject specific constraints
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2; // fast response to breath puffs

      const micSource = audioCtx.createMediaStreamSource(stream);
      micSource.connect(analyser);

      const timeData = new Uint8Array(analyser.fftSize);
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      setIsListeningMic(true);

      const checkAudio = () => {
        if (isBlownRef.current) return;

        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);

        // 1. Time-domain waveform deviation:
        // Silence = 128. Blowing air violently shifts the diaphragm
        let maxDeviation = 0;
        for (let i = 0; i < timeData.length; i++) {
          const dev = Math.abs(timeData[i] - 128);
          if (dev > maxDeviation) maxDeviation = dev;
        }

        // 2. Low-frequency energy (wind noise is predominantly 30Hz - 450Hz, bins 1 to 12)
        let lowFreqSum = 0;
        const lowBins = Math.min(12, freqData.length);
        for (let i = 1; i <= lowBins; i++) {
          lowFreqSum += freqData[i];
        }
        const avgLowFreq = lowFreqSum / lowBins;

        // Combined blow score (0 to 100)
        // High deviation + low-frequency energy indicates air blow
        const timeScore = (maxDeviation / 70) * 60;
        const freqScore = (avgLowFreq / 90) * 40;
        const combined = Math.min(100, Math.round(timeScore + freqScore));

        setBlowLevel(combined);

        // Sensitive threshold for detecting sustained breath/blowing
        if (combined > 38 || maxDeviation > 28) {
          consecutiveHitsRef.current += 1;
          if (consecutiveHitsRef.current >= 3) {
            triggerBlowOut();
            return;
          }
        } else {
          consecutiveHitsRef.current = Math.max(0, consecutiveHitsRef.current - 1);
        }

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animFrameRef.current = requestAnimationFrame(checkAudio);
    } catch (err: unknown) {
      console.warn('Microphone not accessible:', err);
      setMicError('Mic access denied or unavailable. Tap cake or button to blow!');
      setIsListeningMic(false);
    }
  };

  // Attempt auto-activation if user clicked before or when ready
  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div
      className={`relative w-full flex-1 flex flex-col items-center justify-between px-3 py-4 select-none transition-colors duration-1000 ${
        isBlown
          ? 'bg-[#3b2a32]/85 backdrop-brightness-50 text-white'
          : 'bg-transparent text-slate-800'
      }`}
    >
      {/* Header */}
      <div className="text-center pt-1">
        <h1
          className={`text-2xl sm:text-3xl font-bold font-serif-display tracking-tight transition-colors duration-700 ${
            isBlown ? 'text-pink-100/80' : 'text-[#831843]'
          }`}
        >
          {data.candleHeader}
        </h1>
        <p
          className={`text-xs sm:text-sm mt-1 transition-colors duration-700 ${
            isBlown ? 'text-pink-200/70' : 'text-slate-600'
          }`}
        >
          {!isBlown
            ? isListeningMic
              ? 'Blow into your microphone (or tap the cake) to extinguish the flame!'
              : 'Make a wish, then blow into your mic or tap the candle!'
            : 'Your wish has been made! ✨'}
        </p>
      </div>

      {/* Birthday Cake & Candle Interactive Visual */}
      <div className="relative flex flex-col items-center justify-center my-auto py-2">
        {/* Interactive Cake Area */}
        <div
          onClick={triggerBlowOut}
          className="relative cursor-pointer group flex flex-col items-center active:scale-95 transition-transform"
          title="Click or blow to extinguish the candle!"
        >
          {/* Flame & Smoke Container */}
          <div className="relative h-16 w-16 flex items-center justify-center">
            {!isBlown ? (
              /* Lit Flickering Flame */
              <div
                className={`relative flex flex-col items-center ${
                  blowLevel > 15 ? 'animate-pulse scale-90 -rotate-6' : 'animate-candle-flame'
                } transition-transform duration-100`}
                style={{
                  transform: blowLevel > 10 ? `scale(${Math.max(0.6, 1 - blowLevel / 120)}) rotate(${(blowLevel % 10) - 5}deg)` : undefined,
                }}
              >
                {/* Outer warm glow */}
                <div
                  className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md transition-opacity duration-150"
                  style={{ opacity: blowLevel > 20 ? 0.3 : 1 }}
                />
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
            className="w-64 sm:w-76 h-36 -mt-2 drop-shadow-xl overflow-visible"
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
            <div className="bg-black/45 backdrop-blur-md px-6 py-4 rounded-3xl border border-pink-300/30 text-center shadow-2xl mx-4">
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif-display italic font-semibold text-pink-100 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
                {data.wishText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mic Blow Action Controls & Real-time Breath Meter */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 pb-6">
        {!isBlown && (
          <>
            {/* Real-time Breath / Air Meter when listening */}
            {isListeningMic && (
              <div className="w-full max-w-xs flex flex-col items-center gap-1 animate-in fade-in duration-300">
                <div className="flex items-center justify-between w-full text-[11px] text-rose-700 font-medium px-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-rose-500 animate-pulse" />
                    Blowing Sensor
                  </span>
                  <span>{blowLevel > 10 ? `${blowLevel}%` : 'Blow at mic...'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden border border-pink-200">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.min(100, blowLevel * 1.5)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  if (!isListeningMic) {
                    startMicDetection();
                  } else {
                    // Quick manual blow trigger if already listening
                    triggerBlowOut();
                  }
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 ${
                  isListeningMic
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'
                    : 'bg-white/95 text-rose-700 hover:bg-rose-50 border border-pink-200'
                }`}
              >
                <Mic className={`w-4 h-4 ${isListeningMic ? 'text-white animate-bounce' : 'text-rose-500'}`} />
                <span>
                  {isBlowingState
                    ? 'Blowing out...'
                    : isListeningMic
                    ? 'Mic Listening: Blow now! 🌬️'
                    : 'Enable Mic to Blow 🎤'}
                </span>
              </button>

              {/* Direct Tap-to-Blow Button for guaranteed instant blowout */}
              <button
                onClick={triggerBlowOut}
                className="px-4 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-800 font-medium text-xs sm:text-sm border border-pink-200/80 transition-all hover:scale-105 active:scale-95"
              >
                Tap to Blow 🎂
              </button>
            </div>

            {micError && (
              <p className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-center">
                {micError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
