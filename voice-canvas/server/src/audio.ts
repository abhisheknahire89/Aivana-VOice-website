import alawmulaw from 'alawmulaw';

const OUT_RATE = 8000;
const GEMINI_OUT_RATE = 24000;

function resampleLinear(
  input: Int16Array,
  fromRate: number,
  toRate: number
): Int16Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outLength = Math.floor(input.length / ratio);
  const output = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = i * ratio;
    const idx = Math.floor(srcIndex);
    const frac = srcIndex - idx;
    const a = input[idx] ?? 0;
    const b = input[Math.min(idx + 1, input.length - 1)] ?? a;
    output[i] = Math.round(a + frac * (b - a));
  }
  return output;
}

export function pcm16ToMulaw(pcm: Int16Array): Buffer {
  const bytes = alawmulaw.mulaw.encode(pcm);
  return Buffer.from(bytes);
}

/** Gemini PCM 24kHz → μ-law 8kHz base64 for browser playback. */
export function geminiToMulawBase64(pcm24kBuffer: Buffer): string {
  const pcm = new Int16Array(
    pcm24kBuffer.buffer,
    pcm24kBuffer.byteOffset,
    pcm24kBuffer.length / 2
  );
  const pcm8k = resampleLinear(pcm, GEMINI_OUT_RATE, OUT_RATE);
  const mulawBuffer = pcm16ToMulaw(pcm8k);
  return mulawBuffer.toString('base64');
}
