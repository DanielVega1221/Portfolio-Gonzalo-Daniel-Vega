import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#fffef0]">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-serif text-3xl text-[#1a1a1a]">Algo salió mal / Something went wrong</h1>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="font-mono text-xs uppercase tracking-wider border border-[#1a1a1a]/20 px-4 py-2 rounded-sm hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
            >
              Recargar / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}