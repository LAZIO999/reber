import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useOutfitStore, STORE_ITEMS } from '../store/useOutfitStore';
import { AnimatedOwlAsset } from './InteractiveOwl';
import { toast } from 'sonner';

export const OutfitStoreModal: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const { isStoreOpen, setStoreOpen, purchasedOutfits, equippedOutfit, equippedStyle, buyOutfit, equipOutfit, equipStyle } = useOutfitStore();

  return (
    <AnimatePresence>
      {isStoreOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setStoreOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          dir="rtl"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border-2 border-brand-green/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-green to-emerald-600 p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
              
              <button 
                onClick={() => setStoreOpen(false)}
                type="button"
                className="absolute top-4 left-4 p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors z-[60] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">متجر البومة</h2>
                  <div className="flex items-center gap-1.5 mt-1 text-emerald-50">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span className="font-bold text-sm">لديك {profile?.xp || 0} نقطة تعلم (XP)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-emerald-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 flex items-center justify-center gap-4 border border-emerald-100 dark:border-zinc-700/50">
                 <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-xl shadow-inner flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                    <AnimatedOwlAsset outfit={equippedOutfit} styleId={equippedStyle} className="w-16 h-16" />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">معاينة</p>
                   <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                     المظهر الحالي
                   </p>
                 </div>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {STORE_ITEMS.map((item) => {
                  const isPurchased = purchasedOutfits.includes(item.id) || (item.id === 'default');
                  const isEquipped = item.type === 'style' ? equippedStyle === item.id : equippedOutfit === item.id;
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl hover:border-brand-green/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label={item.name}>{item.icon}</span>
                        <div>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{item.name}</span>
                          <span className="text-xs text-zinc-400">{item.type === 'style' ? 'شكل' : 'ملبس'}</span>
                        </div>
                      </div>
                      
                      {isEquipped ? (
                        <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-bold shadow-sm whitespace-nowrap text-sm border border-emerald-200">
                          مستخدم ✓
                        </span>
                      ) : isPurchased ? (
                        <button 
                          onClick={() => {
                            if (item.type === 'style') {
                              equipStyle(item.id);
                            } else {
                              equipOutfit(item.id);
                            }
                            toast.success("عظيم! يبدو هذا رائعاً عليك! 🤩");
                          }}
                          className="bg-brand-blue text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors font-bold whitespace-nowrap shadow-sm text-sm"
                        >
                          استخدام
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (profile) {
                              const success = buyOutfit(item.id, item.price, profile.xp, (newXp) => updateProfile({ xp: newXp }));
                              if (success) {
                                toast.success(`رائع! شكراً على الـ ${item.name}! يبدو جميلاً جداً عليّ 😍`);
                              }
                            }
                          }}
                          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap shadow-sm text-sm transition-colors ${
                            (profile?.xp || 0) >= item.price
                              ? 'bg-brand-gold text-white hover:bg-yellow-500'
                              : 'bg-zinc-200 text-zinc-500 cursor-not-allowed opacity-70'
                          }`}
                          disabled={(profile?.xp || 0) < item.price}
                        >
                          شراء ({item.price} XP)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
