
import React, { ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-200 font-sans">
          <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 flex flex-col items-center max-w-md w-full shadow-2xl">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h1 className="text-2xl font-serif font-bold text-red-400 mb-2 text-center">Critical Failure</h1>
            <p className="text-stone-500 text-center mb-6 text-sm">
              The application encountered an unexpected error and could not continue.
            </p>
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 w-full overflow-auto mb-6 max-h-32">
              <code className="text-xs text-red-300 font-mono block whitespace-pre-wrap">
                {this.state.error?.message || "Unknown Error"}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
