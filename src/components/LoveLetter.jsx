import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// ============================================================
// EDIT SURAT CINTA DI SINI
// ============================================================
const LOVE_LETTER = {
  greeting: 'Untuk Nadia Tersayangku,',
  paragraphs: [
    `Kalau ada satu hal yang ingin aku syukuri dalam hidupku, itu adalah momen di mana kamu hadir dan mengubah segalanya menjadi lebih berwarna. Kamu bukan sekadar pacar — kamu adalah rumah yang selalu ingin aku pulang.`,
    `Setiap petualangan yang kita lalui bersama, setiap tawa yang kita bagi, setiap momen kecil yang mungkin terasa biasa, semuanya menjadi kenangan yang sangat berharga ketika bersamamu. Kamu membuat hal sederhana terasa luar biasa.`,
    `Aku tidak tahu bagaimana caranya tidak mencintaimu. Kamu sudah terlalu dalam meresap di setiap bagian hidupku. Dan aku bahagia dengan itu — sangat bahagia.`,
    `Terima kasih sudah ada. Terima kasih sudah mau berjalan bersamaku, meski jalannya kadang tidak mulus. Aku berjanji akan selalu ada untukmu, dalam setiap babak cerita kita.`,
  ],
  closing: 'Dengan seluruh cintaku,',
  signature: 'Nada ♥',
};

// ─────────────────────────────────────────────────────────────
// Canvas confetti
// ─────────────────────────────────────────────────────────────
const runConfetti = (canvas) => {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8B1A1A', '#C0392B', '#F0A0A0', '#F5EDD8', '#E8B04A', '#fff'];
  const shapes = ['♥', '✦', '●', '★'];
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: 10 + Math.random() * 14,
    opacity: 1,
  }));

  let frame;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vy += 0.04;
      if (p.y > canvas.height * 0.75) p.opacity -= 0.02;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
};

// ─────────────────────────────────────────────────────────────
// Typewriter — completely self-contained, no prop callbacks
// Receives: text, startSignal (boolean), onFinished (stable ref)
// ─────────────────────────────────────────────────────────────
const TypewriterParagraph = memo(({ text, active, showCursor, onFinished }) => {
  const [displayed, setDisplayed] = useState('');
  const doneRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  // Keep ref in sync without adding to deps
  useEffect(() => { onFinishedRef.current = onFinished; }, [onFinished]);

  useEffect(() => {
    if (!active) return;
    // Reset for this paragraph
    setDisplayed('');
    doneRef.current = false;
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          // Small delay before triggering next paragraph
          setTimeout(() => onFinishedRef.current?.(), 300);
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [active, text]); // only re-run when `active` flips to true or text changes

  const isDone = displayed.length >= text.length;

  return (
    <p
      className="font-lato text-brown-800 dark:text-dark-muted leading-8 text-base mb-4"
      style={{ textIndent: '2em', minHeight: '32px' }}
    >
      {displayed}
      {showCursor && !isDone && (
        <span className="typewriter-cursor" aria-hidden="true" />
      )}
    </p>
  );
});
TypewriterParagraph.displayName = 'TypewriterParagraph';

// ─────────────────────────────────────────────────────────────
// Envelope SVG
// ─────────────────────────────────────────────────────────────
const EnvelopeSVG = memo(({ isOpen }) => (
  <div className="relative w-32 h-24 mx-auto select-none" style={{ perspective: '800px' }}>
    <svg viewBox="0 0 128 88" fill="none" className="absolute inset-0 w-full h-full drop-shadow-xl">
      <rect width="128" height="88" rx="6" fill="#8B1A1A" />
      <path d="M0 88 L46 54 M128 88 L82 54" stroke="#F5EDD8" strokeWidth="2" opacity="0.5" />
      {!isOpen && <path d="M0 0 L64 44 L128 0" stroke="#F5EDD8" strokeWidth="2" fill="none" />}
    </svg>
    {/* Animated flap */}
    <div
      className="absolute top-0 left-0 w-full origin-top transition-transform duration-700 ease-in-out"
      style={{
        transform: isOpen ? 'rotateX(-175deg)' : 'rotateX(0deg)',
        transformStyle: 'preserve-3d',
        zIndex: 2,
      }}
    >
      <svg viewBox="0 0 128 44" fill="none" className="w-full h-auto">
        <path d="M0 0 L64 44 L128 0 Z" fill="#6B1010" />
        <path d="M0 0 L64 44 L128 0" stroke="#F5EDD8" strokeWidth="1.5" opacity="0.3" />
      </svg>
    </div>
    {/* Heart seal */}
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full
        bg-gradient-to-br from-maroon-500 to-maroon-600 flex items-center justify-center
        text-cream-100 text-lg shadow-romantic z-10 transition-all duration-500
        ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-pulse-heart'}`}
    >
      ♥
    </div>
  </div>
));
EnvelopeSVG.displayName = 'EnvelopeSVG';

// ─────────────────────────────────────────────────────────────
// Main LoveLetter Component
// ─────────────────────────────────────────────────────────────
const LoveLetter = () => {
  // phase: 'closed' | 'open' | 'typing' | 'done'
  const [phase, setPhase] = useState('closed');
  // which paragraph index is currently being typed
  const [activeIdx, setActiveIdx] = useState(0);
  const canvasRef = useRef(null);
  const sectionRef = useIntersectionObserver({ threshold: 0.2 });

  const handleEnvelopeClick = useCallback(() => {
    if (phase !== 'closed') return;
    // Start opening animation
    setPhase('open');
    // After envelope opens, start letter slide + typing
    setTimeout(() => {
      setPhase('typing');
      setActiveIdx(0);
    }, 900);
  }, [phase]);

  // Called when paragraph i finishes typing
  const handleParagraphDone = useCallback((idx) => {
    const next = idx + 1;
    if (next < LOVE_LETTER.paragraphs.length) {
      setActiveIdx(next);
    } else {
      setPhase('done');
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) runConfetti(canvas);
      }, 200);
    }
  }, []);

  const isLetterVisible = phase === 'typing' || phase === 'done';

  return (
    <section id="love-letter" className="py-24 px-4 relative">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />

      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div ref={sectionRef} className="reveal text-center mb-12">
          <p className="font-dancing text-maroon-400 dark:text-dark-accent text-xl mb-1">Dari Hati</p>
          <h2 className="section-label">Surat Cinta</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-accent text-sm">💌</span>
          </div>
        </div>

        {/* Envelope */}
        <div className="flex flex-col items-center mb-8">
          <div
            className={`transition-all duration-500 ${phase === 'closed' ? 'cursor-pointer hover:scale-105 animate-sway' : ''}`}
            onClick={handleEnvelopeClick}
            role={phase === 'closed' ? 'button' : 'presentation'}
            tabIndex={phase === 'closed' ? 0 : -1}
            onKeyDown={(e) => e.key === 'Enter' && handleEnvelopeClick()}
            aria-label={phase === 'closed' ? 'Klik untuk membuka surat cinta' : undefined}
          >
            <EnvelopeSVG isOpen={phase !== 'closed'} />
          </div>
          {phase === 'closed' && (
            <p className="mt-4 font-dancing text-maroon-400 dark:text-dark-accent text-lg animate-pulse-heart">
              ✦ Klik untuk membuka ✦
            </p>
          )}
        </div>

        {/* Letter paper — slides in when opened */}
        <div
          className={`transition-all duration-700 ease-out ${
            isLetterVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div className="letter-paper rounded-2xl p-8 sm:p-12 shadow-card relative overflow-hidden border border-cream-300 dark:border-dark-border">
            {/* Corner ornaments */}
            {['tl', 'tr', 'bl', 'br'].map(pos => (
              <div
                key={pos}
                className={`absolute text-maroon-300 dark:text-dark-accent opacity-25 text-2xl pointer-events-none
                  ${pos === 'tl' ? 'top-4 left-4'   : ''}
                  ${pos === 'tr' ? 'top-4 right-4'  : ''}
                  ${pos === 'bl' ? 'bottom-4 left-4'  : ''}
                  ${pos === 'br' ? 'bottom-4 right-4' : ''}
                `}
                aria-hidden="true"
              >✦</div>
            ))}

            {/* Wax seal */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-maroon-500 dark:bg-dark-accent flex items-center justify-center text-cream-100 text-xl shadow-romantic border-2 border-maroon-400 dark:border-dark-border">
                ♥
              </div>
            </div>

            {/* Letter content */}
            <div className="relative z-10">
              <p className="font-dancing text-maroon-500 dark:text-dark-text text-2xl mb-6 font-semibold">
                {LOVE_LETTER.greeting}
              </p>

              {/* Render each paragraph; only `active` one types, previous ones show full text */}
              {LOVE_LETTER.paragraphs.map((para, i) => {
                // Before typing starts, show nothing
                if (phase === 'closed' || phase === 'open') return null;
                // If paragraph index hasn't been reached yet, don't render
                if (i > activeIdx && phase !== 'done') return null;

                // If we're done, show all paragraphs as plain text
                if (phase === 'done' || i < activeIdx) {
                  return (
                    <p
                      key={i}
                      className="font-lato text-brown-800 dark:text-dark-muted leading-8 text-base mb-4"
                      style={{ textIndent: '2em' }}
                    >
                      {para}
                    </p>
                  );
                }

                // Current active paragraph — typewriter
                return (
                  <TypewriterParagraph
                    key={i}
                    text={para}
                    active={true}
                    showCursor={true}
                    onFinished={() => handleParagraphDone(i)}
                  />
                );
              })}

              {/* Closing — only shown when done */}
              {phase === 'done' && (
                <div className="mt-8 text-right animate-fade-in">
                  <p className="font-lato text-brown-800 dark:text-dark-muted text-sm">{LOVE_LETTER.closing}</p>
                  <p className="font-dancing text-maroon-500 dark:text-dark-accent text-3xl font-bold mt-1">
                    {LOVE_LETTER.signature}
                  </p>
                  <div className="flex justify-center gap-3 mt-6 opacity-40" aria-hidden="true">
                    {['♥', '✦', '♥', '✦', '♥'].map((s, i) => (
                      <span key={i} className="text-maroon-400 dark:text-dark-accent text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
