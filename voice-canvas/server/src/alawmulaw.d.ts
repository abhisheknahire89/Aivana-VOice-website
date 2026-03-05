declare module 'alawmulaw' {
  const mulaw: {
    encode(pcm: Int16Array): Uint8Array;
    decode(bytes: Uint8Array): Int16Array;
  };
  export default { mulaw };
}
