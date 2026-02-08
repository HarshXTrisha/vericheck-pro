import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-red-100 rounded-3xl shrink-0">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-slate-900 mb-4">
                  Something Went Wrong
                </h1>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  The application encountered an unexpected error. This has been logged and we'll look into it.
                </p>
                {this.state.error && (
                  <div className="bg-slate-50 p-4 rounded-xl mb-6 font-mono text-xs text-slate-600 overflow-auto">
                    {this.state.error.toString()}
                  </div>
                )}
                <button
                  onClick={this.handleReset}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Application
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
