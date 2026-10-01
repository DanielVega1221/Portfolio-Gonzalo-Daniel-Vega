import { Component, type ReactNode } from 'react';
import { profile } from '../data/profile';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  lang: 'es' | 'en';
}

// El boundary envuelve al Router, asi que no puede leer el idioma por
// contexto (una caida puede venir justo de ahi). Se resuelve desde la URL:
// /en/... cae en ingles, el resto en espanol.
function langFromUrl(): 'es' | 'en' {
  return typeof window !== 'undefined' && /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'es';
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    lang: langFromUrl(),
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, lang: langFromUrl() };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }

  render() {
    if (this.state.hasError) {
      const en = this.state.lang === 'en';
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#fffef0]">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-serif text-3xl text-[#1a1a1a]">
              {en ? 'Something went wrong' : 'Algo salió mal'}
            </h1>
            <p className="text-sm text-[#555] font-light">
              {en
                ? `An unexpected error interrupted the page. Reloading usually fixes it, and you can also email ${profile.email} if it keeps happening.`
                : `Un error inesperado interrumpió la página. Recargar suele resolverlo; si sigue pasando podés escribir a ${profile.email}.`}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, lang: this.state.lang });
                window.location.reload();
              }}
              className="font-mono text-xs uppercase tracking-wider border border-[#1a1a1a]/20 px-4 py-2 rounded-sm hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
            >
              {en ? 'Reload' : 'Recargar'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}