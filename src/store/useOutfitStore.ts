import { create } from 'zustand';

export const STORE_ITEMS = [
  { id: 'default', name: 'المظهر العادي', icon: '🦉', price: 0, type: 'outfit' },
  { id: 'klaw', name: 'قبعة أنيقة', icon: '🧢', price: 30, type: 'outfit' },
  { id: 'jamadani', name: 'وشاح أحمر', icon: '🧣', price: 60, type: 'outfit' },
  { id: 'bowtie', name: 'ربطة عنق', icon: '🎀', price: 100, type: 'outfit' },
  { id: 'shal', name: 'زي مميز', icon: '👔', price: 120, type: 'outfit' },
  { id: 'glasses', name: 'نظارات ذكية', icon: '👓', price: 150, type: 'outfit' },
  { id: 'headphones', name: 'سماعات رأس', icon: '🎧', price: 200, type: 'outfit' },
  { id: 'crown', name: 'تاج ذهبي', icon: '👑', price: 300, type: 'outfit' },
  { id: 'graduation_hat', name: 'قبعة تخرج', icon: '🎓', price: 400, type: 'outfit' },
  { id: 'style_pink', name: 'بومة زهرية', icon: '🌸', price: 500, type: 'style' },
  { id: 'style_dark', name: 'بومة ليلية', icon: '🦇', price: 600, type: 'style' },
  { id: 'style_gold', name: 'بومة ذهبية القوس', icon: '✨', price: 1000, type: 'style' },
];

interface OutfitStore {
  purchasedOutfits: string[];
  equippedOutfit: string;
  equippedStyle: string;
  isStoreOpen: boolean;
  setStoreOpen: (open: boolean) => void;
  buyOutfit: (id: string, price: number, currentXp: number, updateXp: (xp: number) => void) => boolean;
  equipOutfit: (id: string) => void;
  equipStyle: (id: string) => void;
}

export const useOutfitStore = create<OutfitStore>((set, get) => ({
  purchasedOutfits: JSON.parse(localStorage.getItem('owl_outfits') || '["default"]'),
  equippedOutfit: localStorage.getItem('owl_equipped_outfit') || 'default',
  equippedStyle: localStorage.getItem('owl_equipped_style') || 'default',
  isStoreOpen: false,
  setStoreOpen: (open) => set({ isStoreOpen: open }),
  
  buyOutfit: (id, price, currentXp, updateXp) => {
    if (currentXp >= price && !get().purchasedOutfits.includes(id)) {
      updateXp(currentXp - price);
      const newPurchases = [...get().purchasedOutfits, id];
      localStorage.setItem('owl_outfits', JSON.stringify(newPurchases));
      
      const item = STORE_ITEMS.find(i => i.id === id);
      if (item?.type === 'style') {
        localStorage.setItem('owl_equipped_style', id);
        set({ purchasedOutfits: newPurchases, equippedStyle: id });
      } else {
        localStorage.setItem('owl_equipped_outfit', id);
        set({ purchasedOutfits: newPurchases, equippedOutfit: id });
      }
      return true;
    }
    return false;
  },
  
  equipOutfit: (id) => {
    if (get().purchasedOutfits.includes(id)) {
      localStorage.setItem('owl_equipped_outfit', id);
      set({ equippedOutfit: id });
    }
  },

  equipStyle: (id) => {
    if (get().purchasedOutfits.includes(id) || id === 'default') {
      localStorage.setItem('owl_equipped_style', id);
      set({ equippedStyle: id });
    }
  }
}));
