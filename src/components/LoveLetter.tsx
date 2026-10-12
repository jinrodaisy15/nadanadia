import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import BlurText from './BlurText';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// ============================================================
// EDIT SURAT CINTA DI SINI
// ============================================================
type LoveLetterContent = { greeting: string; paragraphs: readonly string[]; closing: string; signature: string };

const LOVE_LETTER: LoveLetterContent = {
  greeting: 'happy birthday, perempuan kesayanganku! 🎂❤️',
  paragraphs: [
    `selamat bertambah usia yaa, sayanggg. cieee, makin tua aja nih pacar aku WKWKWK 😭❤️ tapi gapapa, mau umur kamu bertambah berapa pun, semoga aku masih jadi orang yang bisa nemenin kamu di banyak ulang tahun berikutnya, yaa. aamiinnn paling serius! 🫵🏻🤍`,
    `sayang, terima kasih udah hadir di hidup aku dan jadi bagian dari banyak cerita yang sekarang punya tempat tersendiri di hati aku. dari obrolan random kita, candaan receh yang kadang nggak lucu-lucu amat, momen kita ketawa bareng, sampai hal-hal sederhana yang mungkin kelihatannya biasa aja, semuanya punya keindahan tersendiri buat aku. ternyata bahagia nggak selalu harus tentang hal besar, kadang cukup bisa menghabiskan waktu sama kamu aja udah jadi salah satu bagian manis dari hari-hari aku. 🥹🫶🏻`,
    `aku tahu kita nggak selalu punya hari yang sempurna. kadang kita beda pendapat, salah paham, atau belum bisa mengerti satu sama lain dengan baik. tapi aku berharap semua yang udah kita lewati bisa membuat kita semakin belajar mengenal, memahami, dan menyayangi satu sama lain. aku nggak minta kita jadi pasangan yang sempurna, aku cuma berharap kita bisa terus bertumbuh bersama dan tetap punya alasan untuk memilih satu sama lain. ❤️`,
    `di umur kamu yang baru ini, aku berdoa semoga kamu selalu sehat, bahagia, dilancarkan segala urusannya, dimudahkan rezekinya, dan satu per satu impian kamu bisa terwujud. semoga hal-hal yang kamu khawatirkan diganti dengan ketenangan, doa-doa yang kamu simpan diam-diam menemukan jalannya, dan kamu selalu dikelilingi orang-orang yang tulus menyayangi kamu. jangan terlalu keras sama diri sendiri yaa, sayang. kamu juga pantas istirahat, merasa tenang, dan bahagia. 🤍`,
    `dan buat kita, semoga masih ada banyak cerita yang bisa kita tulis bareng. lebih banyak tempat yang kita kunjungi, makanan yang kita cobain, foto-foto yang nanti kita lihat sambil bilang "ih, dulu kita begini banget yaa", dan tawa-tawa kecil yang suatu hari bakal kita rindukan. semoga kalau nanti kita melihat ke belakang, kita bisa tersenyum karena ternyata ada begitu banyak momen indah yang pernah kita lewati bersama. 🫶🏻`,
    `sekali lagi, happy birthday, sayangkuuu! makasih udah lahir ke dunia, makasih udah jadi kamu, dan makasih karena aku punya kesempatan buat mengenal dan menyayangi kamu. semoga hari ini kamu bahagia, semoga hari-hari kamu ke depannya jauh lebih baik, dan semoga aku masih bisa ikut merayakan banyak kebahagiaan kamu berikutnya.`,
    `i love you, my favorite girl. jangan lupa bahagia, jangan lupa makan, jangan suka ngambek terus yaa—eh yang terakhir bercanda, WKWKWK 😭💗`,
  ],
  closing: "you deserve all the beautiful things in this world, sayang. happy birthday, and i'm so glad you were born. 🎂💐❤️",
  signature: 'Nada ♥',
};

// ─────────────────────────────────────────────────────────────
// Canvas confetti
// ─────────────────────────────────────────────────────────────
const runConfetti = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8B1A1A', '#C0392B', '#F0A0A0', '#F5EDD8', '#E8B04A', '#fff'];
  const shapes = ['♥', '✦', '●', '★'];
  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 8,
    color: colors[Math.floor(Math.random() * colors.length)] ?? '#fff',
    shape: shapes[Math.floor(Math.random() * shapes.length)] ?? '♥',
    size: 10 + Math.random() * 14,
    opacity: 1,
  }));

  let frame = 0;
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
  return () => {
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
};

// ─────────────────────────────────────────────────────────────
// Envelope SVG
// ─────────────────────────────────────────────────────────────
const EnvelopeSVG = memo(({ isOpen }: { isOpen: boolean }) => (
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
  // The full letter mounts once after the envelope opens; paragraphs reveal on scroll.
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed');
  const [celebrate, setCelebrate] = useState(false);
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useIntersectionObserver({ threshold: 0.2 });

  useEffect(() => {
    if (phase !== 'opening') return;
    const timer = setTimeout(() => setPhase('open'), reduceMotion ? 0 : 700);
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (!celebrate || reduceMotion) return;
    return runConfetti(canvasRef.current);
  }, [celebrate, reduceMotion]);

  const handleLetterComplete = useCallback(() => setCelebrate(true), []);

  return (
    <section id="love-letter" className="py-24 px-4 relative">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />

      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div ref={sectionRef} className="reveal text-center mb-12">
          <h2 className="font-dancing text-maroon-400 dark:text-dark-accent text-2xl sm:text-3xl">coba buka deh, baca baik baik yhhh hihihi</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-accent text-sm">💌</span>
          </div>
        </div>

        {/* Envelope */}
        <div className="flex flex-col items-center mb-8">
          <button
            type="button"
            className={`rounded-lg transition-transform duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-maroon-400 ${phase === 'closed' ? 'cursor-pointer hover:scale-105 motion-safe:animate-sway' : ''}`}
            onClick={() => setPhase('opening')}
            disabled={phase !== 'closed'}
            aria-expanded={phase === 'open'}
            aria-controls="birthday-letter"
            aria-label="Klik untuk membuka surat cinta"
          >
            <EnvelopeSVG isOpen={phase !== 'closed'} />
          </button>
          {phase === 'closed' && (
            <p className="mt-4 font-dancing text-maroon-400 dark:text-dark-accent text-lg animate-pulse-heart">
              ✦ Klik untuk membuka ✦
            </p>
          )}
        </div>

        {/* Reserve all paragraph space immediately, avoiding shifts while reading. */}
        {phase === 'open' && <LazyMotion features={domAnimation} strict>
        <div id="birthday-letter">
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

              {LOVE_LETTER.paragraphs.map((para, i) => (
                  <BlurText
                    key={i}
                    text={para}
                    className="font-lato text-brown-800 dark:text-dark-muted leading-8 text-base mb-4"
                    emphasis={i === 5 ? 'sekali lagi, happy birthday, sayangkuuu!' : ''}
                  />
              ))}

              <div className="mt-8 text-right">
                  <BlurText
                    text={LOVE_LETTER.closing}
                    className="font-lato text-brown-800 dark:text-dark-muted text-base leading-8 font-bold"
                    onAnimationComplete={handleLetterComplete}
                  />
                  <p className="font-dancing text-maroon-500 dark:text-dark-accent text-3xl font-bold mt-1">
                    {LOVE_LETTER.signature}
                  </p>
                  <div className="flex justify-center gap-3 mt-6 opacity-40" aria-hidden="true">
                    {['♥', '✦', '♥', '✦', '♥'].map((s, i) => (
                      <span key={i} className="text-maroon-400 dark:text-dark-accent text-sm">{s}</span>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
        </LazyMotion>}
      </div>
    </section>
  );
};

export default LoveLetter;
