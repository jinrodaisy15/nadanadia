import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Critical component loaded synchronously
import FloatingHearts from './components/FloatingHearts';
import Hero from './components/Hero';
import Footer from './components/Footer';

// Non-critical components loaded lazily (Code Splitting)
const Timeline = lazy(() => import('./components/Timeline'));
const Gallery = lazy(() => import('./components/Gallery'));
const LoveLetter = lazy(() => import('./components/LoveLetter'));
const MusicPlayer = lazy(() => import('./components/MusicPlayer'));

// Section divider component
const HeartDivider = ({ flip = false }) => (
  <div className={`flex items-center justify-center py-2 ${flip ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 400 40" className="w-full max-w-lg h-10 text-cream-300 dark:text-dark-gold/20" fill="currentColor">
      <path d="M0 20 Q50 0 100 20 Q150 40 200 20 Q250 0 300 20 Q350 40 400 20 L400 40 L0 40 Z" opacity="0.3"/>
    </svg>
  </div>
);

// Loading Fallback Spinner for Suspense
const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-maroon-400 border-t-transparent dark:border-dark-gold dark:border-t-transparent animate-spin" />
  </div>
);

// Sticky Navbar with Dark Mode Toggle & PWA install cue
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          ? 'glass-card dark:bg-dark-card/90 shadow-card dark:shadow-dark-card py-3 border-b border-cream-300 dark:border-dark-border'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="font-dancing font-bold text-maroon-500 dark:text-dark-gold text-2xl sm:text-3xl hover:scale-105 transition-transform">
          N <span className="text-maroon-300 dark:text-dark-rose">♥</span> N
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-lato text-xs sm:text-sm text-maroon-500 dark:text-dark-text hover:text-maroon-700 dark:hover:text-dark-gold transition-colors uppercase tracking-widest font-semibold"
            >
              {label}
            </a>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-cream-200 dark:bg-dark-border flex items-center justify-center text-lg hover:scale-110 transition-transform shadow-sm border border-maroon-300/30 dark:border-dark-gold/30"
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap (Romantis)'}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-3">
          {/* Theme Toggle Button Mobile */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-cream-200 dark:bg-dark-border flex items-center justify-center text-base"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="text-maroon-500 dark:text-dark-gold text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden glass-card dark:bg-dark-card border-t border-cream-300 dark:border-dark-border mt-2 px-6 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-lato text-sm text-maroon-500 dark:text-dark-text hover:text-maroon-700 dark:hover:text-dark-gold transition-colors uppercase tracking-widest font-semibold py-1"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

function MainApp() {
  return (
    <div className="relative min-h-screen bg-cream-200 dark:bg-dark-bg transition-colors duration-300">
      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Navbar */}
      <Navbar />

      {/* Page sections */}
      <main>
        <Hero />

        <div className="bg-maroon-500 dark:bg-dark-rose h-0.5 opacity-10" />

        <Suspense fallback={<SectionLoader />}>
          <Timeline />
        </Suspense>

        <HeartDivider />

        <Suspense fallback={<SectionLoader />}>
          <Gallery />
        </Suspense>

        <HeartDivider flip />

        <Suspense fallback={<SectionLoader />}>
          <LoveLetter />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating music player */}
      <Suspense fallback={null}>
        <MusicPlayer />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
