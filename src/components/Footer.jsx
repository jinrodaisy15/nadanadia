import React, { memo } from 'react';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-maroon-600 dark:bg-dark-card py-16 px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-8 text-cream-100 dark:text-dark-gold text-6xl">❤️</div>
        <div className="absolute bottom-4 right-8 text-cream-100 dark:text-dark-gold text-6xl">❤️</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cream-100 dark:text-dark-gold text-9xl opacity-10">♥</div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Names */}
        <h2 className="font-dancing text-cream-100 dark:text-dark-gold font-bold" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>
          Nada <span className="text-maroon-200 dark:text-dark-rose">♥</span> Nadia
        </h2>

        {/* Date */}
        <p className="font-playfair italic text-cream-300 dark:text-dark-subtext text-lg mt-2 opacity-80">
          Sejak 15 April 2026
        </p>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-cream-300 dark:bg-dark-gold opacity-30" />
          <span className="text-cream-300 dark:text-dark-gold opacity-60 text-sm">✦ ♥ ✦</span>
          <div className="h-px w-16 bg-cream-300 dark:bg-dark-gold opacity-30" />
        </div>

        {/* Quote */}
        <p className="font-dancing text-cream-200 dark:text-dark-subtext text-xl opacity-80 max-w-md mx-auto">
          "Kamu adalah alasanku percaya pada cinta yang sesungguhnya."
        </p>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { href: '#hero',        label: 'Beranda' },
            { href: '#timeline',    label: 'Timeline' },
            { href: '#gallery',     label: 'Galeri' },
            { href: '#love-letter', label: 'Surat Cinta' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-lato text-sm text-cream-300 dark:text-dark-subtext opacity-60 hover:opacity-100 hover:text-cream-100 dark:hover:text-dark-gold transition-all duration-200 uppercase tracking-widest"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-lato text-xs text-cream-300 dark:text-dark-subtext opacity-40 mt-8">
          Made with ♥ — {currentYear}
        </p>
      </div>
    </footer>
  );
});

export default Footer;
