import React from 'react';

// ============================================================
// EDIT SURAT CINTA DI SINI — ganti teks sesuai perasaanmu!
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

const LoveLetter = () => {
  return (
    <section id="love-letter" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-maroon-400 text-xl mb-1">Dari Hati</p>
          <h2 className="section-label">Surat Cinta</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 text-sm">💌</span>
          </div>
        </div>

        {/* Envelope decorative top */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-16 animate-sway">
            <svg viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="96" height="64" rx="6" fill="#8B1A1A" />
              <path d="M0 0 L48 36 L96 0" stroke="#F5EDD8" strokeWidth="2" fill="none" />
              <path d="M0 64 L36 38" stroke="#F5EDD8" strokeWidth="1.5" opacity="0.5" />
              <path d="M96 64 L60 38" stroke="#F5EDD8" strokeWidth="1.5" opacity="0.5" />
            </svg>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-pulse-heart">💌</div>
          </div>
        </div>

        {/* Letter paper */}
        <div className="letter-paper rounded-2xl p-8 sm:p-12 shadow-card relative overflow-hidden border border-cream-300">
          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 text-maroon-300 opacity-30 text-2xl">✦</div>
          <div className="absolute top-4 right-4 text-maroon-300 opacity-30 text-2xl">✦</div>
          <div className="absolute bottom-4 left-4 text-maroon-300 opacity-30 text-2xl">✦</div>
          <div className="absolute bottom-4 right-4 text-maroon-300 opacity-30 text-2xl">✦</div>

          {/* Wax seal decoration */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-maroon-500 flex items-center justify-center text-cream-100 text-xl shadow-romantic border-2 border-maroon-400">
              ♥
            </div>
          </div>

          {/* Letter content */}
          <div className="relative z-10">
            <p className="font-dancing text-maroon-500 text-2xl mb-6 font-semibold">
              {LOVE_LETTER.greeting}
            </p>

            <div className="space-y-4">
              {LOVE_LETTER.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-lato text-brown-800 leading-8 text-base"
                  style={{ textIndent: '2em' }}
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="font-lato text-brown-800 text-sm">{LOVE_LETTER.closing}</p>
              <p className="font-dancing text-maroon-500 text-3xl font-bold mt-1">
                {LOVE_LETTER.signature}
              </p>
            </div>

            {/* Bottom heart row */}
            <div className="flex justify-center gap-3 mt-6 opacity-40">
              {['♥', '✦', '♥', '✦', '♥'].map((s, i) => (
                <span key={i} className="text-maroon-400 text-sm">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
