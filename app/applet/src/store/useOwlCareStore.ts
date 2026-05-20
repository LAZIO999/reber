import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OwlCareState {
  energy: number;
  lastUpdate: number;
  addEnergy: (amount: number) => void;
  updateEnergy: () => void;
}

export const useOwlCareStore = create<OwlCareState>()(
  persist(
    (set, get) => ({
      energy: 100,
      lastUpdate: Date.now(),
      addEnergy: (amount) => set((state) => ({ energy: Math.min(100, state.energy + amount), lastUpdate: Date.now() })),
      updateEnergy: () => {
        const { energy, lastUpdate } = get();
        const now = Date.now();
        // Decay: 5 energy per hour
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);
        if (hoursPassed > 0.1) {
          const newEnergy = Math.max(0, energy - hoursPassed * 5);
          if (Math.floor(newEnergy) !== Math.floor(energy)) {
            set({ energy: newEnergy, lastUpdate: now });
          }
        }
      }
    }),
    { name: 'owl-care-storage' }
  )
);
