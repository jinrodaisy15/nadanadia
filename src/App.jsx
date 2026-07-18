import React, { useState, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import LoveLetter from './components/LoveLetter';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';

// Simple section divider component
const HeartDivider = ({ flip = false }) => (
  <div className={`flex items-center justify-center py-2 ${flip ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 400 40" className="w-full max-w-lg h-10 text-cream-300" fill="currentColor">
      <path d="M0 20 Q50 0 100 20 Q150 40 200 20 Q250 0 300 20 Q350 40 400 20 L400 40 L0 40 Z" opacity="0.3"/>
    </svg>
  </div>
);

// Sticky Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
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
          ? 'glass-card shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="font-dancing font-bold text-maroon-500 text-2xl hover:text-maroon-600 transition-colors">
          N <span className="text-maroon-300">♥</span> N
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-lato text-sm text-maroon-500 hover:text-maroon-700 transition-colors uppercase tracking-wider font-semibold"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-maroon-500 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden glass-card border-t border-cream-300 mt-1 px-4 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-lato text-sm text-maroon-500 hover:text-maroon-700 transition-colors uppercase tracking-wider font-semibold py-1"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Navbar */}
      <Navbar />

      {/* Page sections */}
      <main>
        <Hero />

        <div className="bg-maroon-500 h-0.5 opacity-10" />

        <Timeline />

        <HeartDivider />

        <Gallery />

        <HeartDivider flip />

        <LoveLetter />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating music player */}
      <MusicPlayer />
    </div>
  );
}

export default App;
