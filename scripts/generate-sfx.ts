import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

function writeWav(filename: string, samples: Float32Array) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), offset);
    offset += 2;
  }

  const outDir = path.resolve(process.cwd(), 'public/audio');
  fs.writeFileSync(path.join(outDir, filename), buffer);
  console.log(`Saved warm SFX ${filename}`);
}

// 1. Balloon Pop: warm rounded pop thud with damped high frequencies
function genBalloonPop(): Float32Array {
  const dur = 0.22;
  const total = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(total);
  let noiseFilter = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    const rawNoise = (Math.random() * 2 - 1) * Math.exp(-t * 50);
    noiseFilter += 0.2 * (rawNoise - noiseFilter); // Low-pass to remove harsh hiss
    const snap = Math.sin(2 * Math.PI * (280 * Math.exp(-t * 24)) * t) * Math.exp(-t * 22);
    const thud = Math.sin(2 * Math.PI * (110 * Math.exp(-t * 18)) * t) * Math.exp(-t * 14);
    out[i] = (noiseFilter * 0.35 + snap * 0.65 + thud * 0.6) * 0.8;
  }
  return out;
}

// 2. Candle blow whoosh: soft warm lowpass breath/whisper
function genCandleBlow(): Float32Array {
  const dur = 0.65;
  const total = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(total);
  let filter = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.sin((t / dur) * Math.PI) * Math.exp(-t * 1.6);
    const noise = Math.random() * 2 - 1;
    filter += (noise - filter) * 0.08; // Deep lowpass for soft warm breath
    out[i] = filter * env * 0.85;
  }
  return out;
}

// 3. Sparkle chime: warm music-box celesta bell tones (C5, E5, G5, C6 - much less treble than C7)
function genSparkle(): Float32Array {
  const dur = 0.85;
  const total = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(total);
  // Lowered frequencies for sweet warmth, no piercing high treble
  const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    let sum = 0;
    freqs.forEach((f, idx) => {
      const delay = idx * 0.09;
      if (t >= delay) {
        const localT = t - delay;
        // Pure sine with gentle decay
        sum += Math.sin(2 * Math.PI * f * localT) * Math.exp(-localT * 5.5) * 0.22;
      }
    });
    out[i] = sum;
  }
  return out;
}

// 4. Gift tap: soft warm wooden marimba knock
function genGiftTap(): Float32Array {
  const dur = 0.16;
  const total = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 380 * Math.exp(-t * 12);
    out[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 26) * 0.7;
  }
  return out;
}

writeWav('balloon-pop.wav', genBalloonPop());
writeWav('candle-blow.wav', genCandleBlow());
writeWav('sparkle.wav', genSparkle());
writeWav('gift-tap.wav', genGiftTap());
