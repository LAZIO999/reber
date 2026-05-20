import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, Trash2, CheckCircle2 } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";
import { cn } from "../lib/utils";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white dark:bg-zinc-950 border-l-2 border-border-main z-[101] shadow-2xl flex flex-col pt-safe"
            dir="rtl"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-border-main">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-text-main text-lg leading-tight">الإشعارات</h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{unreadCount} غير مقروء</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-bg-main rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-b border-border-main flex justify-between items-center bg-bg-main">
                 <button 
                  onClick={markAllAsRead} 
                  className="text-xs font-bold text-brand-blue hover:text-brand-blue/80 px-2 py-1 flex items-center gap-1"
                 >
                   <CheckCircle2 className="w-3 h-3" /> تعليم كـ مقروء
                 </button>
                 <button 
                  onClick={clearAll} 
                  className="text-xs font-bold text-brand-red hover:text-brand-red/80 px-2 py-1 flex items-center gap-1"
                 >
                   <Trash2 className="w-3 h-3" /> مسح الكل
                 </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-4">
                  <Bell className="w-12 h-12 text-text-muted mb-2" />
                  <p className="font-black text-text-main">لا توجد إشعارات حالياً</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        markAsRead(notif.id);
                        if (notif.type === "lesson") navigate("/lessons");
                        else if (notif.type === "quest") {
                          onClose();
                          // Custom logic for quest if applicable
                        }
                      }}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all relative overflow-hidden group cursor-pointer",
                        notif.isRead 
                          ? "bg-bg-main border-transparent" 
                          : "bg-card-bg border-brand-blue/30 shadow-sm"
                      )}
                    >
                      {!notif.isRead && (
                        <div className="absolute top-4 left-4 w-2 h-2 bg-brand-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      )}
                      <h4 className="font-black text-text-main text-sm mb-1 pl-4">{notif.title}</h4>
                      <p className="text-xs font-medium text-text-secondary leading-relaxed">{notif.message}</p>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="absolute bottom-3 left-3 p-1.5 bg-white dark:bg-zinc-800 rounded-lg text-text-muted hover:text-brand-red shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-border-main"
                      >
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
