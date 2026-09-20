export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ComplimentItem {
  id: string;
  text: string;
  position: 'top-left' | 'top-right' | 'mid-left' | 'bottom-left' | 'bottom-right';
}

export interface BirthdayData {
  recipientName: string;
  // Screen 1: QR Card
  qrHeaderName: string;
  qrInstruction: string;
  qrOpeningText: string;

  // Screen 2: Birthday Greeting & Question
  greetingTitle: string;
  questionText: string;
  yesButtonText: string;
  noButtonText: string;

  // Screen 3: Balloon Pop
  balloonsHeader: string;
  balloonWords: [string, string, string, string];

  // Screen 4: Candle Blow
  candleHeader: string;
  micPrompt: string;
  blowingPrompt: string;
  wishText: string;

  // Screen 5: Rose Bouquet
  bouquetHeader: string;
  bouquetTag: string;
  compliments: ComplimentItem[];

  // Screen 6: Letter
  envelopeTitle: string;
  envelopeTapPrompt: string;
  letterTitle: string;
  letterSalutation: string;
  letterParagraphs: string[];
  letterSignOff: string;
  letterSignature: string;

  // Screen 7: Gift Box & Final Note
  giftHeader: string;
  giftPrompt: string;
  tapsNeeded: number;
  finalMessage1: string;
  finalMessage2: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
}
