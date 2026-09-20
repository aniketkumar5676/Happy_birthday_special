import React, { createContext, useContext, useState, useEffect } from 'react';
import { BirthdayData, ScreenId, AudioTrack } from '../types';
import { initialBirthdayData } from '../config/birthdayData';

interface BirthdayContextType {
  currentScreen: ScreenId;
  goToScreen: (screen: ScreenId) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  data: BirthdayData;
  updateData: (newData: Partial<BirthdayData>) => void;
  resetData: () => void;
  isPlayingMusic: boolean;
  setIsPlayingMusic: (playing: boolean) => void;
  togglePlayMusic: () => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;
  currentTrack: AudioTrack;
  setCurrentTrack: (track: AudioTrack) => void;
  availableTracks: AudioTrack[];
  addCustomTrack: (file: File) => void;
}

const defaultTracks: AudioTrack[] = [
  {
    id: 'acoustic-guitar',
    title: 'Acoustic Fingerstyle (Theme)',
    artist: 'Birthday Romance',
    src: '/audio/birthday-song.wav',
  },
];

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

const STORAGE_KEY = 'birthday_custom_data_v2';

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(1);
  const [data, setData] = useState<BirthdayData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...initialBirthdayData, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return initialBirthdayData;
  });

  // Persistent music state
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [availableTracks, setAvailableTracks] = useState<AudioTrack[]>(defaultTracks);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(defaultTracks[0]);

  // Sync to local storage
  const updateData = (newData: Partial<BirthdayData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save birthday data to storage', err);
      }
      return updated;
    });
  };

  const resetData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setData(initialBirthdayData);
  };

  const goToScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev < 7 ? ((prev + 1) as ScreenId) : prev));
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => (prev > 1 ? ((prev - 1) as ScreenId) : prev));
  };

  const togglePlayMusic = () => {
    setIsPlayingMusic((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const addCustomTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    const newTrack: AudioTrack = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Custom Upload',
      src: url,
    };
    setAvailableTracks((prev) => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
    setIsPlayingMusic(true);
  };

  return (
    <BirthdayContext.Provider
      value={{
        currentScreen,
        goToScreen,
        nextScreen,
        prevScreen,
        data,
        updateData,
        resetData,
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
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

export function useBirthday() {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
}
