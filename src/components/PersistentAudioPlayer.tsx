import React, { useEffect, useRef, useState } from 'react';
import { useBirthday } from '../context/BirthdayContext';
import { Play, Pause, Volume2, VolumeX, Music2, Upload, ChevronUp, ChevronDown } from 'lucide-react';

export const PersistentAudioPlayer: React.FC = () => {
  const {
    isPlayingMusic,
    setIsPlayingMusic,
    togglePlayMusic,
    musicVolume,
    setMusicVolume,
    isMuted,
    setIsMuted,
    toggleMute,
    currentTrack,
    setCurrentTrack,
    availableTracks,
    addCustomTrack,
  } = useBirthday();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Sync volume & mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : musicVolume;
    }
  }, [musicVolume, isMuted]);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug('Autoplay policy caught:', err);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (val / 100) * duration;
      setProgress(val);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addCustomTrack(e.target.files[0]);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden Persistent Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Hidden File Input for Custom Audio */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Floating Music Widget (Top Right or Floating Dock) */}
      <div className="fixed top-3 right-3 z-50 transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-md border border-pink-200/80 shadow-md rounded-2xl overflow-hidden transition-all duration-300 text-xs">
          {/* Collapsed Pill Row */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            {/* Spinning Disc / Note Icon */}
            <button
              onClick={togglePlayMusic}
              title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
              className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlayingMusic ? (
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-1 rounded-full bg-pink-400/40 animate-ping" />
                  <Pause className="w-4 h-4 relative z-10" />
                </div>
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Now Playing Title & Equalizer waves */}
            <div
              className="flex flex-col cursor-pointer max-w-[130px] sm:max-w-[170px]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-pink-900 truncate">
                  {currentTrack.title}
                </span>
                {isPlayingMusic && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-rose-500 rounded-full h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-rose-500 rounded-full h-2/3 animate-[pulse_0.9s_ease-in-out_infinite_0.2s]" />
                    <span className="w-0.5 bg-rose-500 rounded-full h-4/5 animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-pink-500 font-medium truncate">
                {isPlayingMusic ? 'Playing melody • Click to expand' : 'Paused • Click to play'}
              </span>
            </div>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-1 rounded-full text-pink-700 hover:bg-pink-100 transition-colors"
            >
              {isMuted || musicVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Expand / Collapse Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full text-pink-500 hover:bg-pink-100 transition-colors"
              aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Drawer Details */}
          {isExpanded && (
            <div className="px-3.5 pb-3 pt-1 border-t border-pink-100 flex flex-col gap-2.5">
              {/* Scrub bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-pink-400 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={toggleMute}
                  className="text-pink-600 hover:text-pink-800"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    setMusicVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[10px] text-pink-600 w-7 text-right">
                  {Math.round((isMuted ? 0 : musicVolume) * 100)}%
                </span>
              </div>

              {/* Song selection / Upload Custom Song */}
              <div className="pt-1 flex flex-col gap-1.5 border-t border-pink-100">
                <div className="flex items-center justify-between text-[11px] font-medium text-pink-900">
                  <span className="flex items-center gap-1">
                    <Music2 className="w-3 h-3 text-rose-500" /> Track
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[10px] text-rose-600 hover:text-rose-800 font-semibold bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 transition-colors"
                  >
                    <Upload className="w-2.5 h-2.5" /> Upload Custom MP3
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                  {availableTracks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTrack(t);
                        setIsPlayingMusic(true);
                      }}
                      className={`flex items-center justify-between px-2 py-1 rounded text-left transition-colors ${
                        currentTrack.id === t.id
                          ? 'bg-rose-100/90 text-rose-900 font-semibold border border-rose-300/60'
                          : 'hover:bg-pink-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate pr-2">{t.title}</span>
                      {currentTrack.id === t.id && (
                        <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
