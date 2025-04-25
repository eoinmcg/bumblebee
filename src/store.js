import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  MAX_X: 50, // determines gamw width
  MAX_SPEED: 2,
  DEFAULT_CAMERA: {
    fov: 45,
    position: [0, 1, 10],
    near: 1,
    far: 500
  },
  COLS: {
    red: 0xff0000,
    green: 0x00ff00,
    brown: 0x4d2926,
    stone: 0x9D9D9D,
  },
  mute: false,
  player: null,
  speed: 0,
  score: 0,
  level: 0,
  lives: 2,
  plays: 0,
  addPlayer: (ref) => set({ player: ref }),
  getPlayer: () => get().player,
  setScore: (score) => set({ score }),
  getScore: () => get().score,
  setLevel: (level) => set({ level }),
  getLevel: () => get().level,
  setSpeed: (speed) => set({ speed }),
  getSpeed: () => get().speed,
  setLives: (lives) => set({ lives }),
  getLives: () => get().lives,
  toggleMute: () => set((state) => ({ mute: !state.mute })),
  setMute: (mute) => set({ mute }),
  getMute: () => get().mute,
  setPlays: (plays) => set({ plays }),
  getPlays: () => get().plays,
}));

export const getGameState = useGameStore.getState
export const subscribe = useGameStore.subscribe
