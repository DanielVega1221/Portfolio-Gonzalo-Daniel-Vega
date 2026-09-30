import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Home from './pages/Home';
import PageMeta from './components/PageMeta';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Journal = lazy(() => import('./pages/Journal'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const JournalDetail = lazy(() => import('./components/JournalDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-5 h-5 border-2 border-[#a84432] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function buildRoutes(prefix: string) {
  return (
    <Route path={prefix} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="proyectos" element={<LazyPage><Portfolio /></LazyPage>} />
      <Route path="proyectos/:id" element={<LazyPage><ProjectDetail /></LazyPage>} />
      <Route path="journal" element={<LazyPage><Journal /></LazyPage>} />
      <Route path="journal/:id" element={<LazyPage><JournalDetail /></LazyPage>} />
      <Route path="sobre-mi" element={<LazyPage><About /></LazyPage>} />
      <Route path="dialogo" element={<LazyPage><Contact /></LazyPage>} />
      <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
    </Route>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <PageMeta />
          <Routes>
            {buildRoutes('')}
            {buildRoutes('/en')}
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}