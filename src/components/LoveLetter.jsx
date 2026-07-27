import React, { useState, useEffect, useRef, memo } from 'react';

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

// Canvas confetti particle burst generator
const launchConfetti = (canvas) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const particles = [];
  const colors = ['#8B1A1A', '#C0392B', '#E8A0BF', '#E6C687', '#FF69B4', '#FFD700', '#F8F0DC'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.25,
    });
  }

  let animationFrame;
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach((p) => {
      if (p.opacity <= 0) return;
      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rSpeed;
      p.opacity -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(render);
    }
  };

  render();
};

const LoveLetter = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const canvasRef = useRef(null);

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Launch Confetti
    setTimeout(() => {
      if (canvasRef.current) launchConfetti(canvasRef.current);
    }, 400);

    // Typewriter Effect
    setIsTyping(true);
    setTypedParagraphs(['', '', '', '']);

    let currentPara = 0;
    let currentChar = 0;

    const interval = setInterval(() => {
      if (currentPara >= LOVE_LETTER.paragraphs.length) {
        clearInterval(interval);
        setIsTyping(false);
        return;
      }

      const fullText = LOVE_LETTER.paragraphs[currentPara];
      if (currentChar < fullText.length) {
        const nextChar = fullText[currentChar];
        setTypedParagraphs((prev) => {
          const updated = [...prev];
          updated[currentPara] = (updated[currentPara] || '') + nextChar;
          return updated;
        });
        currentChar++;
      } else {
        currentPara++;
        currentChar = 0;
      }
    }, 18);
  };

  return (
    <section id="love-letter" className="py-24 px-4 relative transition-colors duration-300">
      <div className="max-w-2xl mx-auto relative">
        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-40 w-full h-full"
        />

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-maroon-400 dark:text-dark-rose text-xl mb-1">Dari Hati</p>
          <h2 className="section-label dark:text-dark-gold">Surat Cinta</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-rose text-sm">💌</span>
          </div>
        </div>

        {/* Interactive Envelope Container */}
        <div className="flex flex-col items-center">
          {!isOpen ? (
            /* CLOSED ENVELOPE WITH WAX SEAL */
            <div className="relative w-full max-w-md bg-maroon-500 dark:bg-dark-card rounded-2xl p-8 shadow-romantic border-2 border-maroon-400 dark:border-dark-border text-center flex flex-col items-center gap-6 animate-sway">
              <div className="w-20 h-20 rounded-full bg-maroon-600 dark:bg-dark-border flex items-center justify-center text-4xl shadow-inner border border-maroon-300/30">
                💌
              </div>
              <div>
                <h3 className="font-dancing text-3xl text-cream-100 dark:text-dark-gold font-bold mb-2">
                  Surat Spesial Untukmu
                </h3>
                <p className="font-lato text-sm text-cream-200/80 dark:text-dark-subtext">
                  Ada pesan manis yang tersimpan di dalam amplop ini...
                </p>
              </div>
              <button
                onClick={handleOpenLetter}
                className="btn-romantic bg-cream-100 dark:bg-dark-rose hover:bg-cream-200 dark:hover:bg-dark-rose/90 text-maroon-600 dark:text-cream-100 font-dancing text-xl font-bold px-8 py-3 rounded-full shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2"
              >
                <span>Buka Surat</span>
                <span className="text-2xl">💌</span>
              </button>
            </div>
          ) : (
            /* OPENED LETTER PAPER */
            <div className="w-full letter-paper dark:bg-dark-card/95 dark:border-dark-border rounded-2xl p-6 sm:p-12 shadow-card relative overflow-hidden border border-cream-300 animate-slide-up">
              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 text-maroon-300 dark:text-dark-rose opacity-40 text-2xl">✦</div>
              <div className="absolute top-4 right-4 text-maroon-300 dark:text-dark-rose opacity-40 text-2xl">✦</div>
              <div className="absolute bottom-4 left-4 text-maroon-300 dark:text-dark-rose opacity-40 text-2xl">✦</div>
              <div className="absolute bottom-4 right-4 text-maroon-300 dark:text-dark-rose opacity-40 text-2xl">✦</div>

              {/* Wax seal decoration */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-maroon-500 dark:bg-dark-rose flex items-center justify-center text-cream-100 text-xl shadow-romantic border-2 border-maroon-400 dark:border-dark-gold">
                  ♥
                </div>
              </div>

              {/* Letter content with typewriter effect */}
              <div className="relative z-10">
                <p className="font-dancing text-maroon-500 dark:text-dark-gold text-2xl sm:text-3xl mb-6 font-semibold">
                  {LOVE_LETTER.greeting}
                </p>

                <div className="space-y-4">
                  {typedParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="font-lato text-brown-800 dark:text-dark-text leading-8 text-base sm:text-lg transition-all"
                      style={{ textIndent: '2em' }}
                    >
                      {para}
                      {isTyping && i === typedParagraphs.filter(p => p.length > 0).length - 1 && (
                        <span className="inline-block w-2 h-4 bg-maroon-500 dark:bg-dark-gold ml-1 animate-pulse" />
                      )}
                    </p>
                  ))}
                </div>

                <div className="mt-8 text-right">
                  <p className="font-lato text-brown-800 dark:text-dark-subtext text-sm">{LOVE_LETTER.closing}</p>
                  <p className="font-dancing text-maroon-500 dark:text-dark-gold text-3xl font-bold mt-1">
                    {LOVE_LETTER.signature}
                  </p>
                </div>

                {/* Bottom heart row */}
                <div className="flex justify-center gap-3 mt-8 opacity-50">
                  {['♥', '✦', '♥', '✦', '♥'].map((s, i) => (
                    <span key={i} className="text-maroon-400 dark:text-dark-rose text-base">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default LoveLetter;
