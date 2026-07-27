import React, { useState, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useScrollThrottle } from './hooks/useThrottle';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

// Lazy-loaded heavy components
const Gallery     = lazy(() => import('./components/Gallery'));
const LoveLetter  = lazy(() => import('./components/LoveLetter'));
const MusicPlayer = lazy(() => import('./components/MusicPlayer'));

// =====================================================================
// Error Boundary
// =====================================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-maroon-500 dark:text-dark-accent font-dancing text-xl">
          ♥ Terjadi kesalahan kecil — coba refresh halaman ♥
        </div>
      );
    }
    return this.props.children;
  }
}

// Section loading fallback
const SectionSkeleton = () => (
  <div className="py-24 px-4 max-w-4xl mx-auto space-y-4">
    <div className="skeleton h-8 w-48 mx-auto rounded-full" />
    <div className="skeleton h-12 w-72 mx-auto rounded-full" />
    <div className="skeleton h-64 w-full rounded-2xl" />
  </div>
);

// =====================================================================
// Dark Mode Toggle
// =====================================================================
const DarkToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center rounded-full
        text-maroon-500 dark:text-dark-text hover:bg-maroon-500 hover:bg-opacity-10
        dark:hover:bg-dark-accent dark:hover:bg-opacity-15
        transition-all duration-200 text-base"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

// =====================================================================
// Minimalist Navbar
// =====================================================================
const Navbar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);
  useScrollThrottle(onScroll, 80);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const links = [
    { href: '#hero',        label: 'Beranda' },
    { href: '#timeline',    label: 'Timeline' },
    { href: '#gallery',     label: 'Galeri' },
    { href: '#love-letter', label: 'Surat Cinta' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--surface)] bg-opacity-90 backdrop-blur-md border-b border-[var(--border)] py-3 shadow-sm'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-dancing font-bold text-maroon-500 dark:text-dark-text text-xl leading-none transition-opacity hover:opacity-70"
          aria-label="Nada ♥ Nadia"
        >
          N <span className="text-maroon-300 dark:text-dark-accent">♥</span> N
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-lato text-xs text-maroon-500 dark:text-dark-muted hover:text-maroon-700 dark:hover:text-dark-text transition-colors uppercase tracking-[0.15em] font-semibold"
            >
              {label}
            </a>
          ))}
          <DarkToggle />
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-1">
          <DarkToggle />
          <button
            className="w-8 h-8 flex items-center justify-center text-maroon-500 dark:text-dark-text hover:opacity-70 transition-opacity"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="text-lg leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu — slides down */}
      {menuOpen && (
        <div className="sm:hidden bg-[var(--surface)] border-t border-[var(--border)] px-5 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="font-lato text-xs text-maroon-500 dark:text-dark-muted hover:text-maroon-700 dark:hover:text-dark-text transition-colors uppercase tracking-[0.15em] font-semibold py-1"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
});
Navbar.displayName = 'Navbar';

// =====================================================================
// App
// =====================================================================
function AppContent() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* FloatingHearts removed for cleaner look */}
      <Navbar />

      <main>
        <Hero />

        <ErrorBoundary>
          <Timeline />
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton />}>
            <Gallery />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton />}>
            <LoveLetter />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />

      <ErrorBoundary>
        <Suspense fallback={null}>
          <MusicPlayer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
