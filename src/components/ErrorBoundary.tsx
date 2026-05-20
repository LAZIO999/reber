import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-arabic bg-slate-50 dark:bg-zinc-950">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-brand-red">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-text-secondary">
              عذراً، حدث خطأ ما
            </h1>
            <p className="text-text-muted">
              نعتذر عن هذا الخلل. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-blue text-white font-black text-lg px-8 py-4 rounded-xl border-b-4 border-[#1899D6] hover:translate-y-[2px] hover:border-b-2 active:border-b-0 active:translate-y-[4px] transition-all"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
