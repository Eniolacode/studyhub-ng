import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-center text-slate-100">
          <div className="rounded-[32px] border border-rose-900/50 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 max-w-md">
            <AlertCircle className="mx-auto h-16 w-16 text-rose-500 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="text-slate-400 mb-6 leading-relaxed">
              An unexpected error occurred. We've been notified and are looking into it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Refresh Platform
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <pre className="mt-8 overflow-auto rounded-xl bg-black/50 p-4 text-left text-xs text-rose-300">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
