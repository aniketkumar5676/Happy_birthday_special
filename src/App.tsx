/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BirthdayProvider, useBirthday } from './context/BirthdayContext';
import { FloatingHeartsBackground } from './components/FloatingHeartsBackground';
import { PersistentAudioPlayer } from './components/PersistentAudioPlayer';
import { NavigationDots } from './components/NavigationDots';

import { Screen1QrCard } from './components/screens/Screen1QrCard';
import { Screen2ExcitedQuestion } from './components/screens/Screen2ExcitedQuestion';
import { Screen3Balloons } from './components/screens/Screen3Balloons';
import { Screen4Candle } from './components/screens/Screen4Candle';
import { Screen5RoseBouquet } from './components/screens/Screen5RoseBouquet';
import { Screen6EnvelopeLetter } from './components/screens/Screen6EnvelopeLetter';
import { Screen7GiftSurprise } from './components/screens/Screen7GiftSurprise';

const BirthdayContent: React.FC = () => {
  const { currentScreen } = useBirthday();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Ambient Dreamy Floating Hearts Background */}
      <FloatingHeartsBackground />

      {/* Persistent Audio Player across all navigation screens */}
      <PersistentAudioPlayer />

      {/* Main Interactive Screen Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto pb-14">
        {currentScreen === 1 && <Screen1QrCard />}
        {currentScreen === 2 && <Screen2ExcitedQuestion />}
        {currentScreen === 3 && <Screen3Balloons />}
        {currentScreen === 4 && <Screen4Candle />}
        {currentScreen === 5 && <Screen5RoseBouquet />}
        {currentScreen === 6 && <Screen6EnvelopeLetter />}
        {currentScreen === 7 && <Screen7GiftSurprise />}
      </main>

      {/* Navigation pagination and quick controls */}
      <NavigationDots />
    </div>
  );
};

export default function App() {
  return (
    <BirthdayProvider>
      <BirthdayContent />
    </BirthdayProvider>
  );
}
