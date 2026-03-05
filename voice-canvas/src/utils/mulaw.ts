const BIAS = 0x84;
const CLIP = 32635;

const EXPAND_TABLE = new Int16Array(256);

for (let i = 0; i < 256; i++) {
  const mulaw = ~i & 0xff;
  const sign = mulaw & 0x80;
  const exponent = (mulaw >> 4) & 0x07;
  const mantissa = mulaw & 0x0f;
  let sample = ((mantissa << 3) + BIAS) << exponent;
  sample -= BIAS;
  sample = sign ? BIAS - sample : sample - BIAS;
  EXPAND_TABLE[i] = Math.max(-CLIP, Math.min(CLIP, sample));
}

export function mulawDecode(mulawBytes: Uint8Array): Int16Array {
  const out = new Int16Array(mulawBytes.length);
  for (let i = 0; i < mulawBytes.length; i++) {
    out[i] = EXPAND_TABLE[mulawBytes[i]!]!;
  }
  return out;
}

export function mulawDecodeToFloat32(mulawBytes: Uint8Array): Float32Array {
  const out = new Float32Array(mulawBytes.length);
  for (let i = 0; i < mulawBytes.length; i++) {
    out[i] = EXPAND_TABLE[mulawBytes[i]!]! / 32768;
  }
  return out;
}
