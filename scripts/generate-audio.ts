import fs from 'fs';
import path from 'path';

// Generate a warm, mellow, romantic fingerstyle acoustic guitar melody with gentle, low-treble tone
const SAMPLE_RATE = 44100;
const DURATION_SECONDS = 54; // ~54 seconds loopable melody

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

interface Pluck {
  time: number;
  midi: number;
  velocity: number;
  duration: number;
  pan: number; // -1 to 1
}

const plucks: Pluck[] = [];
// 70 BPM slow romantic tempo
const BEAT = 60 / 70;

// Chords with warm mid-low voicing (no piercing high treble)
const chords = [
  // Measure 1: D major
  { bass: 50, trebles: [57, 62, 66], melody: [62, 66, 69, 66] },
  // Measure 2: F#m / A
  { bass: 45, trebles: [54, 57, 61], melody: [61, 66, 64, 61] },
  // Measure 3: G major (warm open)
  { bass: 43, trebles: [55, 59, 62], melody: [62, 67, 66, 62] },
  // Measure 4: A7sus4 -> A7
  { bass: 45, trebles: [57, 61, 64], melody: [64, 67, 66, 61] },

  // Measure 5: D major (melodic ascent)
  { bass: 50, trebles: [57, 62, 66], melody: [66, 69, 71, 69] },
  // Measure 6: Bm
  { bass: 47, trebles: [54, 59, 62], melody: [69, 67, 66, 62] },
  // Measure 7: G major (heartfelt)
  { bass: 43, trebles: [55, 59, 62], melody: [62, 64, 66, 67] },
  // Measure 8: A major (birthday motif warm variation)
  { bass: 45, trebles: [57, 61, 64], melody: [69, 71, 69, 66] },

  // Measure 9: D major
  { bass: 50, trebles: [57, 62, 66], melody: [66, 66, 69, 66] },
  // Measure 10: G major
  { bass: 43, trebles: [55, 59, 62], melody: [71, 69, 67, 64] },
  // Measure 11: Em7 -> A
  { bass: 40, trebles: [52, 59, 64], melody: [64, 67, 66, 62] },
  // Measure 12: D major warm closing cadence
  { bass: 50, trebles: [57, 62, 66], melody: [66, 62, 57, 50] },
];

let curTime = 0.5;
for (let cIdx = 0; cIdx < chords.length; cIdx++) {
  const chord = chords[cIdx];
  const mStart = curTime;

  // Pluck bass note on beat 1 (rich, full warmth)
  plucks.push({
    time: mStart,
    midi: chord.bass,
    velocity: 0.82,
    duration: 3.4,
    pan: -0.15,
  });

  // Fingerpicking arpeggios (warm thumb & finger alternation)
  plucks.push({ time: mStart + BEAT * 0.5, midi: chord.trebles[0], velocity: 0.48, duration: 2.2, pan: -0.08 });
  plucks.push({ time: mStart + BEAT * 1.0, midi: chord.trebles[1], velocity: 0.52, duration: 2.2, pan: 0.08 });
  plucks.push({ time: mStart + BEAT * 1.5, midi: chord.trebles[2], velocity: 0.46, duration: 2.0, pan: 0.15 });

  // Secondary soft bass harmonic
  plucks.push({ time: mStart + BEAT * 2.0, midi: chord.bass + 7, velocity: 0.55, duration: 2.5, pan: -0.1 });
  plucks.push({ time: mStart + BEAT * 2.5, midi: chord.trebles[0], velocity: 0.44, duration: 1.8, pan: -0.08 });
  plucks.push({ time: mStart + BEAT * 3.0, midi: chord.trebles[1], velocity: 0.50, duration: 2.0, pan: 0.1 });
  plucks.push({ time: mStart + BEAT * 3.5, midi: chord.trebles[2], velocity: 0.46, duration: 1.8, pan: 0.18 });

  // Expressive melody line (warm vocal register, gentle velocity)
  for (let m = 0; m < chord.melody.length; m++) {
    plucks.push({
      time: mStart + BEAT * m + (m % 2 === 1 ? 0.015 : 0),
      midi: chord.melody[m],
      velocity: 0.65 + (m === 0 ? 0.06 : 0),
      duration: 3.0,
      pan: 0.08 * (m - 1.5),
    });
  }

  curTime += BEAT * 4;
}

const totalSamples = Math.floor(SAMPLE_RATE * DURATION_SECONDS);
const leftChannel = new Float32Array(totalSamples);
const rightChannel = new Float32Array(totalSamples);

// Physical String Synthesis with heavy high-frequency damping (less treble)
class WarmAcousticString {
  freq: number;
  buffer: Float32Array;
  ptr: number = 0;
  feedback: number;
  prevSample: number = 0;

  constructor(freq: number, velocity: number) {
    this.freq = Math.max(45, Math.min(1100, freq));
    const period = Math.round(SAMPLE_RATE / this.freq);
    this.buffer = new Float32Array(period);

    // Warm finger-pad excitation (strong lowpass filtering of random noise, eliminating harsh clicks)
    let filteredNoise = 0;
    for (let i = 0; i < period; i++) {
      const white = (Math.random() * 2 - 1) * velocity;
      // High damping of noise: 90% smoothing = zero harsh treble click
      filteredNoise = 0.1 * white + 0.9 * filteredNoise;
      this.buffer[i] = filteredNoise;
    }

    // Feedback decay: lower frequencies sustain nicely, higher frequencies decay fast
    this.feedback = 0.988 - 0.000045 * freq;
  }

  next(): number {
    const len = this.buffer.length;
    const current = this.buffer[this.ptr];
    const nextIdx = (this.ptr + 1) % len;
    const nextVal = this.buffer[nextIdx];

    // 3-point FIR filter (rolling off treble on each string reflection)
    const filtered = (0.25 * this.prevSample + 0.5 * current + 0.25 * nextVal) * this.feedback;
    this.prevSample = current;
    this.buffer[this.ptr] = filtered;
    this.ptr = nextIdx;

    return current;
  }
}

console.log(`Synthesizing ${plucks.length} mellow acoustic plucks...`);
for (const p of plucks) {
  const startSample = Math.floor(p.time * SAMPLE_RATE);
  if (startSample >= totalSamples) continue;

  const freq = midiToFreq(p.midi);
  const str = new WarmAcousticString(freq, p.velocity);
  const durSamples = Math.min(totalSamples - startSample, Math.floor(p.duration * SAMPLE_RATE));

  const leftVol = Math.cos(((p.pan + 1) * Math.PI) / 4);
  const rightVol = Math.sin(((p.pan + 1) * Math.PI) / 4);

  for (let s = 0; s < durSamples; s++) {
    const val = str.next();
    // Soft attack curve (no abrupt click)
    const env = s < 120 ? s / 120 : 1.0;
    leftChannel[startSample + s] += val * leftVol * env * 0.38;
    rightChannel[startSample + s] += val * rightVol * env * 0.38;
  }
}

// Low-pass filter pass to roll off all piercing treble (> 2.2 kHz)
function applyWarmLowPass(channel: Float32Array, cutoffHz: number) {
  const dt = 1 / SAMPLE_RATE;
  const rc = 1 / (2 * Math.PI * cutoffHz);
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < channel.length; i++) {
    prev += alpha * (channel[i] - prev);
    channel[i] = prev;
  }
}

// Apply acoustic body low-pass filter (2200 Hz) to eliminate harsh treble
applyWarmLowPass(leftChannel, 2200);
applyWarmLowPass(rightChannel, 2200);

// Add acoustic guitar body warmth (gentle low-mid warmth at 220Hz)
function applyBodyWarmth(channel: Float32Array) {
  let y1 = 0;
  let y2 = 0;
  const r = 0.94;
  const theta = (2 * Math.PI * 220) / SAMPLE_RATE;
  const a1 = -2 * r * Math.cos(theta);
  const a2 = r * r;
  const gain = 0.08;

  for (let i = 0; i < channel.length; i++) {
    const x = channel[i];
    const res = x - a1 * y1 - a2 * y2;
    y2 = y1;
    y1 = res;
    channel[i] += res * gain;
  }
}

applyBodyWarmth(leftChannel);
applyBodyWarmth(rightChannel);

// Warm, dark stereo room acoustic reverb (damped treble in reflections)
const reverbDelayL = Math.floor(SAMPLE_RATE * 0.042);
const reverbDelayR = Math.floor(SAMPLE_RATE * 0.056);
const reverbFeedback = 0.24;

let filterL = 0;
for (let i = reverbDelayL; i < totalSamples; i++) {
  filterL += 0.3 * (leftChannel[i - reverbDelayL] - filterL); // dark damping
  leftChannel[i] += filterL * reverbFeedback;
}
let filterR = 0;
for (let i = reverbDelayR; i < totalSamples; i++) {
  filterR += 0.3 * (rightChannel[i - reverbDelayR] - filterR);
  rightChannel[i] += filterR * reverbFeedback;
}

// Master normalize to comfortable listening level
let maxAmp = 0.001;
for (let i = 0; i < totalSamples; i++) {
  if (Math.abs(leftChannel[i]) > maxAmp) maxAmp = Math.abs(leftChannel[i]);
  if (Math.abs(rightChannel[i]) > maxAmp) maxAmp = Math.abs(rightChannel[i]);
}

const masterGain = 0.82 / maxAmp;
for (let i = 0; i < totalSamples; i++) {
  leftChannel[i] *= masterGain;
  rightChannel[i] *= masterGain;
}

// Write 16-bit PCM WAV
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = SAMPLE_RATE * blockAlign;
const dataSize = totalSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // 16-bit
// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const l = Math.max(-1, Math.min(1, leftChannel[i]));
  const r = Math.max(-1, Math.min(1, rightChannel[i]));
  buffer.writeInt16LE(Math.floor(l * 32767), offset);
  buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const outDir = path.resolve(process.cwd(), 'public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, 'birthday-song.wav');
fs.writeFileSync(outFile, buffer);
console.log(`Generated warm acoustic song ${outFile} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
