import { BirthdayData } from '../types';

/**
 * Birthday Configuration & Content Data
 * 
 * Edit any text here to customize the birthday experience!
 * All screens reference this file for their displayed text.
 */
export const initialBirthdayData: BirthdayData = {
  // Primary recipient name
  recipientName: 'Anshi',

  // Screen 1: Heart QR Code Card
  qrHeaderName: 'Anshi',
  qrInstruction: 'Tap to open',
  qrOpeningText: 'Opening...',

  // Screen 2: Cute Bears Greeting & Question
  greetingTitle: 'Happy Birthday, Anshi',
  questionText: 'Are you excited for what\'s next?',
  yesButtonText: 'Yes',
  noButtonText: 'No',

  // Screen 3: Pastel Watercolor Balloons
  balloonsHeader: 'Pop all 4 balloons',
  balloonWords: ['You', 'are', 'so', 'special'],

  // Screen 4: Birthday Cake & Candle
  candleHeader: 'Blow the candle',
  micPrompt: 'Blow into the mic',
  blowingPrompt: 'Blowing...',
  wishText: 'Close your eyes & & make a wish',

  // Screen 5: Rose Bouquet & Compliments
  bouquetHeader: 'Your Rose Bouquet 🌹',
  bouquetTag: 'Happy Birthday, Anshi 💕',
  compliments: [
    {
      id: '1',
      text: 'Best Youtuber of All time 🔥',
      position: 'top-left'
    },
    {
      id: '2',
      text: 'BGMI Jod Player 🔥',
      position: 'top-right'
    },
    {
      id: '3',
      text: 'A person with golden heart 💛',
      position: 'mid-left'
    },
    {
      id: '4',
      text: 'Most beautiful girl ❤️',
      position: 'bottom-left'
    },
    {
      id: '5',
      text: 'A person with most beautiful eyes 🌹',
      position: 'bottom-right'
    }
  ],

  // Screen 6: Heart Letter & Envelope
  envelopeTitle: 'A Message From My Heart',
  envelopeTapPrompt: 'Tap to open',
  letterTitle: 'A Message From My Heart 💕',
  letterSalutation: '',
  letterParagraphs: [
    'Happy Birthday to someone truly special! 🎂🎉',
    'DoraIsLive (Anshi), your kindness, positive energy, and the way you connect with everyone make you truly special. ❤️ I’m genuinely happy to see you growing and bringing smiles to so many people.',
    'May God bless you with endless happiness, love, success, and beautiful moments. ✨ Keep smiling, keep shining, and keep being the amazing person you are.',
    'Keep this beautiful journey going, and soon you’ll reach 1M subscribers! 🥹❤️ Wishing you a birthday filled with happiness and a year full of wonderful memories. 🎉🎂'
  ],
  letterSignOff: '',
  letterSignature: 'From Aniket',

  // Screen 7: Gift Box Reveal & Polaroid Card
  giftHeader: 'One Last Thing...',
  giftPrompt: 'Tap the gift',
  tapsNeeded: 3,
  finalMessage1: 'Lots of love for you 💕',
  finalMessage2: 'Once again, Happy Birthday Anshi!'
};
