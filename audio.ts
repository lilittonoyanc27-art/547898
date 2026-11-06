/**
 * Sound effects synthesizer and Text-To-Speech for Pasapalabra
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  muted: false,

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  },

  playCorrect(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chime

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  },

  playWrong(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Classic dual low buzzer
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(146.83, now); // D3
    osc2.frequency.setValueAtTime(138.59, now); // C#3 dissonant buzz

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.42);
    osc2.stop(now + 0.42);
  },

  playPasapalabra(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.22);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  },

  playTick(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  },

  playPeek(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Pleasant double hint chime (A5, C#6)
    [880, 1108.73].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.38);
    });
  },

  playVictory(): void {
    if (this.muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fanfare chords
    const chords = [
      { f: 523.25, time: 0.0 },   // C5
      { f: 659.25, time: 0.15 },  // E5
      { f: 783.99, time: 0.3 },   // G5
      { f: 1046.50, time: 0.5 },  // C6 long
      { f: 1318.51, time: 0.5 }   // E6 harmonized
    ];

    chords.forEach(({ f, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + time);

      const dur = time === 0.5 ? 0.9 : 0.2;
      gain.gain.setValueAtTime(0.2, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  }
};

/**
 * Text-to-Speech narration
 */
export function speakText(text: string, lang: 'es-ES' | 'hy-AM' = 'es-ES'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
