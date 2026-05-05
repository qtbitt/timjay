const ctx = new AudioContext();
const cache = new Map<string, AudioBuffer>();

const masterGain = ctx.createGain();
masterGain.connect(ctx.destination);

let _listenerX = 0;
let _listenerY = 0;
let _muted = false;
let _volume = 1;

export function setListenerPosition(x: number, y: number): void {
  _listenerX = x;
  _listenerY = y;
}

export function setMasterVolume(volume: number): void {
  _volume = Math.max(0, volume);
  if (!_muted) masterGain.gain.value = _volume;
}

export function getMasterVolume(): number {
  return _volume;
}

export function setMasterMute(muted: boolean): void {
  _muted = muted;
  masterGain.gain.value = muted ? 0 : _volume;
}

export function isMasterMuted(): boolean {
  return _muted;
}

async function loadBuffer(src: string): Promise<AudioBuffer> {
  if (cache.has(src)) return cache.get(src)!;
  const res = await fetch(src);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arrayBuffer);
  cache.set(src, buffer);
  return buffer;
}

export interface PlaySoundOptions {
  volume?: number;
  radius?: number;
  position?: { x: number; y: number };
}

export async function playSound(
  src: string,
  options?: PlaySoundOptions,
): Promise<void> {
  if (ctx.state === "suspended") await ctx.resume();

  const buffer = await loadBuffer(src);
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();

  if (options?.position && options.radius != null) {
    const dx = options.position.x - _listenerX;
    const dy = options.position.y - _listenerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const vol = Math.max(0, 1 - dist / options.radius);
    gain.gain.value = (options.volume ?? 1) * vol;
  } else {
    gain.gain.value = options?.volume ?? 1;
  }

  source.connect(gain);
  gain.connect(masterGain);
  source.start();
}
