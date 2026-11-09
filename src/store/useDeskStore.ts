import { create } from "zustand";

type ModalType = "music" | "philosophy" | "notepad" | "corkboard" | "gamer" | null;
type ThemeMode = "auto" | "day" | "sunset" | "night";

interface WeatherData {
  temp: number;
  condition: string;
}

interface DeskState {
  activeModal: ModalType;
  selectedPhotoId: string | null;
  themeMode: ThemeMode;
  weatherData: WeatherData | null;
  isPlayingAudio: boolean;
  currentTrackIndex: number;
  setActiveModal: (modal: ModalType) => void;
  setSelectedPhotoId: (id: string | null) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setWeatherData: (data: WeatherData | null) => void;
  setIsPlayingAudio: (playing: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
}

export const useDeskStore = create<DeskState>((set) => ({
  activeModal: null,
  selectedPhotoId: null,
  themeMode: "auto",
  weatherData: null,
  isPlayingAudio: false,
  currentTrackIndex: 0,
  setActiveModal: (modal) => set({ activeModal: modal }),
  setSelectedPhotoId: (id) => set({ selectedPhotoId: id }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setWeatherData: (data) => set({ weatherData: data }),
  setIsPlayingAudio: (playing) => set({ isPlayingAudio: playing }),
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
}));
