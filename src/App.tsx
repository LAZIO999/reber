import React, { useEffect, Suspense, lazy } from "react";
import {
  createHashRouter,
  RouterProvider,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Shell } from "./components/layout/Shell";
import { XPAnimationManager } from "./components/XPAnimationManager";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useNotificationSystem } from "./hooks/useNotificationSystem";

// Lazy load pages
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Auth = lazy(() => import("./pages/Auth").then(m => ({ default: m.Auth })));
const Onboarding = lazy(() => import("./pages/Onboarding").then(m => ({ default: m.Onboarding })));
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })));
const LessonSelection = lazy(() => import("./pages/LessonSelection").then(m => ({ default: m.LessonSelection })));
const Lessons = lazy(() => import("./pages/Lessons").then(m => ({ default: m.Lessons })));
const SavedWords = lazy(() => import("./pages/SavedWords").then(m => ({ default: m.SavedWords })));
const SavedWordsReview = lazy(() => import("./pages/SavedWordsReview").then(m => ({ default: m.SavedWordsReview })));
const AiChat = lazy(() => import("./pages/AiChat").then(m => ({ default: m.AiChat })));
const Leaderboard = lazy(() => import("./pages/Leaderboard").then(m => ({ default: m.Leaderboard })));
const Stories = lazy(() => import("./pages/Stories").then(m => ({ default: m.Stories })));
const Games = lazy(() => import("./pages/Games").then(m => ({ default: m.Games })));
const MatchingGame = lazy(() => import("./pages/MatchingGame").then(m => ({ default: m.MatchingGame })));
const WordScramble = lazy(() => import("./pages/WordScramble").then(m => ({ default: m.WordScramble })));
const Flashcards = lazy(() => import("./pages/Flashcards").then(m => ({ default: m.Flashcards })));
const SentenceBuilder = lazy(() => import("./pages/SentenceBuilder").then(m => ({ default: m.SentenceBuilder })));
const WordBattle = lazy(() => import("./pages/WordBattle").then(m => ({ default: m.WordBattle })));
const RoleplayGame = lazy(() => import("./pages/RoleplayGame").then(m => ({ default: m.RoleplayGame })));

function PageLoader() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
    </div>
  );
}

function PageTransitionWrapper() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full h-full"
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { initialize, user, profile, loading, initialized } = useAuthStore();
  const { isDark } = useThemeStore();
  useNotificationSystem();

  useEffect(() => {
    initialize();

    // Initialize dark mode class on mount
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [initialize, isDark]);

  if (!initialized || (user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const router = createHashRouter([
    {
      path: "/auth",
      element: !user ? <Suspense fallback={<PageLoader />}><Auth /></Suspense> : <Navigate to="/" replace />,
    },
    {
      path: "/onboarding",
      element: user && !profile ? <Suspense fallback={<PageLoader />}><Onboarding /></Suspense> : <Navigate to="/" replace />,
    },
    {
      element: user ? <Shell /> : <Navigate to="/auth" replace />,
      children: [
        {
          element: <PageTransitionWrapper />,
          children: [
            { path: "/", element: <Home /> },
            { path: "profile", element: <Profile /> },
            { path: "saved", element: <SavedWords /> },
            { path: "saved/review", element: <SavedWordsReview /> },
            { path: "lessons", element: <LessonSelection /> },
            { path: "lessons/:id", element: <Lessons /> },
            { path: "ai-chat", element: <AiChat /> },
            { path: "leaderboard", element: <Leaderboard /> },
            { path: "stories", element: <Stories /> },
            { path: "games", element: <Games /> },
            { path: "games/matching", element: <MatchingGame /> },
            { path: "games/scramble", element: <WordScramble /> },
            { path: "games/cards", element: <Flashcards /> },
            { path: "games/sentence-builder", element: <SentenceBuilder /> },
            { path: "battles", element: <WordBattle /> },
            { path: "roleplay", element: <RoleplayGame /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <RouterProvider router={router} />
      <XPAnimationManager />
      <Toaster richColors closeButton position="top-center" duration={2500} />
    </div>
  );
}
