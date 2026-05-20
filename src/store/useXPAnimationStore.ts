import { create } from "zustand";

interface XPState {
  xpToAnimate: number | null;
  levelUp: number | null;
  triggerId: number; // To differentiate consecutive animations
  showXPAnimation: (amount: number, levelUp?: number | null) => void;
  clearAnimation: () => void;
}

export const useXPAnimationStore = create<XPState>((set) => ({
  xpToAnimate: null,
  levelUp: null,
  triggerId: 0,
  showXPAnimation: (amount, levelUp = null) => {
    set((state) => ({
      xpToAnimate: amount,
      levelUp,
      triggerId: state.triggerId + 1,
    }));
  },
  clearAnimation: () => set({ xpToAnimate: null, levelUp: null }),
}));
