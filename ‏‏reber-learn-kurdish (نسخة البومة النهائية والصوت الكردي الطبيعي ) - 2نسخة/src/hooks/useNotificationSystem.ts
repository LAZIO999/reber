import { useEffect, useRef } from "react";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export function useNotificationSystem() {
  const { addNotification } = useNotificationStore();
  const { profile } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!profile || hasInitialized.current) return;
    hasInitialized.current = true;

    // Word review reminder
    setTimeout(() => {
      addNotification({
        title: "وقت التدريب!",
        message: "استمر في سلسلة تعلمك وراجع الكلمات المحفوظة الآن.",
        type: "lesson",
      });
      toast.success("تذكير: حان وقت مراجعة كلماتك المحفوظة!", { duration: 2500 });
    }, 60000 * 5); // 5 minutes

  }, [profile, addNotification]);
}
