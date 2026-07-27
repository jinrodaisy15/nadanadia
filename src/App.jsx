import React, { useState, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useScrollThrottle } from './hooks/useThrottle';
import FloatingHearts from './components/FloatingHearts';
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

// =====================================================================
// Section loading fallback
// =====================================================================
const SectionSkeleton = () => (
  <div className="py-24 px-4 max-w-4xl mx-auto space-y-4">
    <div className="skeleton h-8 w-48 mx-auto rounded-full" />
    <div className="skeleton h-12 w-72 mx-auto rounded-full" />
    <div className="skeleton h-64 w-full rounded-2xl" />
  </div>
);

// =====================================================================
// Dark Mode Toggle Button
// =====================================================================
const DarkToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? '☀️ Light mode' : '🌙 Dark mode'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold font-lato
        bg-maroon-500 bg-opacity-10 hover:bg-opacity-20 text-maroon-500 dark:text-dark-text
        dark:bg-dark-accent dark:bg-opacity-20 dark:hover:bg-opacity-30
        border border-maroon-500 border-opacity-20 dark:border-dark-accent dark:border-opacity-30
        transition-all duration-200"
    >
      <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

// =====================================================================
// Navbar
// =====================================================================
const Navbar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useScrollThrottle(onScroll, 80);

  const links = [
    { href: '#hero',        label: 'Beranda' },
    { href: '#timeline',    label: 'Timeline' },
    { href: '#gallery',     label: 'Galeri' },
    { href: '#love-letter', label: 'Surat Cinta' },
  ];

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-card shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-dancing font-bold text-maroon-500 dark:text-dark-text text-2xl hover:text-maroon-600 transition-colors"
        >
          N <span className="text-maroon-300 dark:text-dark-accent">♥</span> N
        </a>

        {/* Desktop links + dark toggle */}
        <div className="hidden sm:flex items-center gap-5">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-lato text-sm text-maroon-500 dark:text-dark-text hover:text-maroon-700 dark:hover:text-dark-accent transition-colors uppercase tracking-wider font-semibold"
            >
              {label}
            </a>
          ))}
          <DarkToggle />
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <DarkToggle />
          <button
            className="text-maroon-500 dark:text-dark-text text-2xl"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden glass-card border-t border-cream-300 dark:border-dark-border mt-1 px-4 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="font-lato text-sm text-maroon-500 dark:text-dark-text hover:text-maroon-700 transition-colors uppercase tracking-wider font-semibold py-1"
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
      <FloatingHearts />
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
