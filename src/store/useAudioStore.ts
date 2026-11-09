import { create } from "zustand";
import { Howl } from "howler";

interface AudioStoreState {
  rainVolume: number;
  vinylVolume: number;
  isMuted: boolean;
  rainSound: Howl | null;
  vinylSound: Howl | null;
  uiSounds: {
    tick: Howl | null;
    page: Howl | null;
    squish: Howl | null;
  };
  initAudio: () => void;
  setRainVolume: (volume: number) => void;
  setVinylVolume: (volume: number) => void;
  toggleMute: () => void;
  playHoverTick: () => void;
  playBookOpen: () => void;
  playSquish: () => void;
  startRain: () => void;
  stopRain: () => void;
  startVinyl: () => void;
  stopVinyl: () => void;
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  rainVolume: 0.35,
  vinylVolume: 0.2,
  isMuted: false,
  rainSound: null,
  vinylSound: null,
  uiSounds: {
    tick: null,
    page: null,
    squish: null,
  },

  initAudio: () => {
    if (typeof window === "undefined" || get().rainSound) return;

    const rain = new Howl({
      src: ["/sounds/rain-loop.mp3"],
      loop: true,
      volume: get().rainVolume,
      html5: false,
    });

    const vinyl = new Howl({
      src: ["/sounds/vinyl-crackle.mp3"],
      loop: true,
      volume: get().vinylVolume,
      html5: false,
    });

    const tick = new Howl({
      src: ["/sounds/ui-tick.mp3"],
      volume: 0.15,
      html5: false,
    });

    const page = new Howl({
      src: ["/sounds/page-flip.mp3"],
      volume: 0.4,
      html5: false,
    });

    const squish = new Howl({
      src: ["/sounds/squeak.mp3"],
      volume: 0.6,
      html5: false,
    });

    set({
      rainSound: rain,
      vinylSound: vinyl,
      uiSounds: { tick, page, squish },
    });
  },

  setRainVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ rainVolume: clamped });
    const { rainSound, isMuted } = get();
    if (rainSound) {
      rainSound.volume(isMuted ? 0 : clamped);
      if (clamped > 0 && !rainSound.playing() && !isMuted) {
        rainSound.play();
      } else if (clamped === 0 && rainSound.playing()) {
        rainSound.pause();
      }
    }
  },

  setVinylVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ vinylVolume: clamped });
    const { vinylSound, isMuted } = get();
    if (vinylSound) {
      vinylSound.volume(isMuted ? 0 : clamped);
      if (clamped > 0 && !vinylSound.playing() && !isMuted) {
        vinylSound.play();
      } else if (clamped === 0 && vinylSound.playing()) {
        vinylSound.pause();
      }
    }
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    const { rainSound, vinylSound, rainVolume, vinylVolume } = get();
    if (rainSound) rainSound.volume(nextMuted ? 0 : rainVolume);
    if (vinylSound) vinylSound.volume(nextMuted ? 0 : vinylVolume);
  },

  playHoverTick: () => {
    const { uiSounds, isMuted } = get();
    if (isMuted) return;
    if (uiSounds.tick) {
      uiSounds.tick.stop();
      uiSounds.tick.play();
    }
  },

  playBookOpen: () => {
    const { uiSounds, isMuted } = get();
    if (isMuted) return;
    if (uiSounds.page) {
      uiSounds.page.stop();
      uiSounds.page.play();
    }
  },

  playSquish: () => {
    const { uiSounds, isMuted } = get();
    if (isMuted) return;
    if (uiSounds.squish) {
      uiSounds.squish.stop();
      uiSounds.squish.play();
    }
  },

  startRain: () => {
    const { rainSound, isMuted, rainVolume } = get();
    if (rainSound && !rainSound.playing() && !isMuted) {
      rainSound.volume(rainVolume);
      rainSound.play();
    }
  },

  stopRain: () => {
    const { rainSound } = get();
    if (rainSound && rainSound.playing()) {
      rainSound.fade(rainSound.volume(), 0, 800);
      setTimeout(() => rainSound.pause(), 850);
    }
  },

  startVinyl: () => {
    const { vinylSound, isMuted, vinylVolume } = get();
    if (vinylSound && !vinylSound.playing() && !isMuted) {
      vinylSound.volume(vinylVolume);
      vinylSound.play();
    }
  },

  stopVinyl: () => {
    const { vinylSound } = get();
    if (vinylSound && vinylSound.playing()) {
      vinylSound.fade(vinylSound.volume(), 0, 800);
      setTimeout(() => vinylSound.pause(), 850);
    }
  },
}));

