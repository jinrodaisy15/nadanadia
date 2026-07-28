import React, { useEffect, useRef } from 'react';
import CountdownTimer from './CountdownTimer';

const Hero = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll('.reveal').forEach((node, i) => {
      setTimeout(() => node.classList.add('visible'), i * 200 + 100);
    });
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="hero-bg min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
      aria-label="Hero section"
    >
      {/* Corner decorations */}
      <div className="absolute top-6 left-6 text-maroon-400 text-3xl opacity-40 animate-pulse-heart">❤️</div>
      <div className="absolute top-6 right-6 text-maroon-400 text-3xl opacity-40 animate-pulse-heart" style={{ animationDelay: '0.5s' }}>❤️</div>
      <div className="absolute bottom-6 left-6 text-maroon-300 text-2xl opacity-30 animate-pulse-heart" style={{ animationDelay: '0.8s' }}>🌸</div>
      <div className="absolute bottom-6 right-6 text-maroon-300 text-2xl opacity-30 animate-pulse-heart" style={{ animationDelay: '1.2s' }}>🌸</div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-maroon-500 opacity-5 blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-maroon-400 opacity-5 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

        {/* Tagline */}
        <p className="reveal font-dancing text-maroon-400 dark:text-dark-accent text-xl sm:text-2xl mb-2 tracking-wide">
          ✦ Hadiah Buat kamu ✦
        </p>

        {/* Names */}
        <h1 className="reveal font-dancing font-bold leading-none text-maroon-600 dark:text-dark-text"
          style={{ fontSize: 'clamp(4rem, 14vw, 8rem)' }}>
          Nada
        </h1>

        <div className="reveal flex items-center gap-4 my-[-12px]">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-maroon-400" />
          <span className="text-maroon-400 text-2xl animate-pulse-heart">♥</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-maroon-400" />
        </div>

        <h1 className="reveal font-dancing font-bold leading-none text-maroon-500 dark:text-dark-accent"
          style={{ fontSize: 'clamp(4rem, 14vw, 8rem)' }}>
          Nadia
        </h1>

        {/* Anniversary date badge */}
        <div className="reveal mt-8 mb-6">
          <div className="stamp glass-card inline-flex items-center gap-3 px-6 py-3 rounded-2xl shadow-romantic">
            <span className="text-maroon-400 text-xl">📅</span>
            <div className="text-left">
              <p className="font-lato text-xs text-maroon-400 uppercase tracking-widest">Nih inget Tanggal Jadian kita, lupa mulu lu nyet 😭</p>
              <p className="font-playfair font-semibold text-maroon-600 text-lg">15 April 2026</p>
            </div>
          </div>
        </div>

        {/* Ornament */}
        <div className="reveal ornament-line w-full max-w-xs mb-8">
          <span className="font-dancing text-maroon-400 text-sm whitespace-nowrap">      </span>
        </div>

        {/* Countdown Timer */}
        <div className="reveal w-full">
          <CountdownTimer />
        </div>

        {/* Scroll cue */}
        <div className="reveal mt-12 flex flex-col items-center gap-2 opacity-60">
          <span className="font-lato text-xs text-maroon-400 uppercase tracking-widest">Coba Scroll ke Bawah ya Cantikkk!</span>
          <div className="flex flex-col gap-1">
            <span className="text-maroon-400 text-xs animate-bounce">▼</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
