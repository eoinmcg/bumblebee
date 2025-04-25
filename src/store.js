import { create } from 'zustand';

/**
 * Central storage for all game settings
 *
 * constants in uppercase
 * variables in lowercase
 * import into component / hook and use like:
 * const { MAX_X } = useGameStore();
 * 
 */
export const useGameStore = create((set, get) => ({
  // constants
  MAX_X: 30, // determines game width
  MAX_SPEED: 3,
  DEFAULT_CAMERA: {
    fov: 45,
    position: [0, 1, 10],
    near: 1,
    far: 500
  },
  COLS: {
    red: 0xff0000,
    green: 0x00ff00,
    darkgreen: 0x00aa00,
    brown: 0x4d2926,
    stone: 0x9D9D9D,
  },
  // variable
  mute: false,
  player: null,
  speed: 0,
  hiScore: getStorage('hiScore', 50),
  score: 0,
  lives: 2,
  plays: 0,
  addPlayer: (ref) => set({ player: ref }),
  getPlayer: () => get().player,
  setScore: (score) => set({ score }),
  getScore: () => get().score,
  setHiScore: (hiScore) => {
    set({ hiScore });
    setStorage('hiScore', hiScore);
  },
  getHiScore: () => get().hiScore,
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

function getStorage(key, fallback = false) {
  try {
    if (typeof localStorage === 'undefined') return fallback;

    const item = localStorage.getItem(key);
    if (item !== null) return JSON.parse(item);
    if (fallback) {
      localStorage.setItem(key, JSON.stringify(fallback));
    }
    return fallback;
  } catch (err) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // localStorage not available or quota exceeded, etc.
    console.warn(`Could not save "${key}" to localStorage:`, err);
    return false;
  }
}
