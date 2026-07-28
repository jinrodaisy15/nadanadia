import React, { useEffect, useRef, memo } from 'react';

// ============================================================
// EDIT TIMELINE DI SINI — tambah / hapus / ubah item sesuai kisah kalian!
// ============================================================
const TIMELINE_ITEMS = [
  {
    date: 'Gatau Lupa Tanggalnya, Keknya antara 24-25 Desember 2025 deh pas Natalan',
    icon: '🎄',
    title: 'First Time Ketemu di Roblox, iya ROBLOX',
    description:
      'GATAUUU WEHH, LUPA KETEMU GEGARA APA, POKOKNYA NADIA FRIENDLY DULUANN GEHHH WKWKWK😭 Kita bener bener baru kenal dan kita ngobrol soal Background awal masing masing disini, Gue cuek dan dia pun sama cueknya, kita gak saling peduli dan kita kebetulan sering se-Server ketika main di Map yang sama, dan KITA GAK PEDULI COY, se Random itu',
  },
  {
    date: '15-16 Februari 2026',
    icon: '🌻',
    title: 'Ketemuan Pertama Kali di Blok M',
    description:
      'Disini masih canggung, Ngobrol kadang kadang aja dan gue masih cuek bat sumpah, Dia makan siang sendirian dan gue cuma beli Dimsum Bakar doang anjir, akhirnya kita Ngobrol banyak di Blok M Hub dan gue pegang tangan dia, dan dia kelihatan Ilfeel wkwk, tapi akhirnya mau juga pegangan tangan sama gue di Taman Literasi dan sampe Pulang di Halte Transjakarta hehe',
  },
  {
    date: 'Februari - April 2026',
    icon: '👉👈',
    title: 'Masa PDKT (Trial 3 Bulan ceunah!!)',
    description:
      'Nah ini, Kita Mulai Call tiap hari, Chatan intens Setiap Hari,Sampe gue ngajak dia Jalan dan Makan Di salah satu Cafe Di tangerang, dan terus berlanjut dan kabar kabaran setiap hari, kita sama sama seneng banget disini seolah tanpa beban',
  },

  {
    date: '15 April 2026',
    icon: '💕',
    title: 'Jadian',
    description:
      'Akhirnya Kita resmi Jadian, yeayy.. Awal mula Kisah kita Mulai , Dimana di sinilah segalanya Berubah, Kita jadi sering ketemu, Jalan Bareng, Makan Bareng, dan lain lain, Kita jadi lebih tau Kehidupan masing-masing, Dari yang baik dan buruk, Kita jadi sering berantem dan Miss Comunication, tapi kita tetep bisa baikan dan saling ngertiin satu sama lain, namun masalah yang datang bertubi tubi dan tidak henti menguji kesabaran kita, Nurunin Ego yang sama sama besar, Ngajakin-Putus Nyambung, Nangis, Sedih dan Kadang gak ada Waktu satu sama lain, Namun kita tetap bertahan dan tetep saling ngedukung satu sama lain, dan gue beneran seneng bisa punya hubungan yang sehat sama dia',
  },

  {
    date: 'Sekarang',
    icon: '💙🤍',
    title: 'Sampai Detik ini',
    description:
      'Walau banyak pertengkaran dan miss Comunication, namun Kita tetap bertahan dan tetep saling ngedukung satu sama lain, dan gue beneran seneng bisa punya hubungan yang sehat sama dia, Kita bener-bener Berusaha Fix The Trial and Error in our Relationship, dan gue yakin kita bisa jadi pribadi yang lebih baik lagi kedepannya, dan gue bakalan tetep ada buat Nadia, dan Gue beruntung banget nemu orang kayak Nadia, Walaupun dia cuek, nyolot, tapi dia tetep Nadiatusiyfa gue, cuma dia yang bikin gue se cinta mampus sama orang wkwk💙🤍',
  },

  // ← tambahkan lebih banyak momen di sini!
];

// ─────────────────────────────────────────────────────────────
// TimelineItem — slide dari kiri (genap) atau kanan (ganjil)
// ─────────────────────────────────────────────────────────────
const TimelineItem = memo(({ item, index, isLeft }) => {
  const ref = useRef(null);
  const revealClass = isLeft ? 'reveal-left' : 'reveal-right';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${revealClass} flex items-start gap-4 mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {/* Card */}
      <div
        className={`glass-card rounded-2xl p-5 shadow-card max-w-xs sm:max-w-sm flex-1
          border border-cream-300 dark:border-dark-border
          dark:shadow-dark-card
          ${isLeft ? 'text-left' : 'text-right'}`}
      >
        <div className={`flex items-center gap-2 mb-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-2xl" aria-hidden="true">{item.icon}</span>
          <span className="font-playfair font-semibold text-maroon-500 dark:text-dark-accent text-sm">
            {item.date}
          </span>
        </div>
        <h3 className="font-dancing font-bold text-maroon-600 dark:text-dark-text text-2xl mb-1">
          {item.title}
        </h3>
        <p className="font-lato text-sm text-brown-800 dark:text-dark-muted leading-relaxed opacity-80">
          {item.description}
        </p>
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-maroon-500 dark:bg-dark-accent flex items-center justify-center text-cream-100 text-lg shadow-romantic z-10 animate-pulse-heart border-4 border-cream-200 dark:border-dark-surface">
          ♥
        </div>
      </div>

      {/* Spacer for alternate side */}
      <div className="flex-1 max-w-xs sm:max-w-sm hidden sm:block" />
    </div>
  );
});
TimelineItem.displayName = 'TimelineItem';

// ─────────────────────────────────────────────────────────────
// Section header sub-component
// ─────────────────────────────────────────────────────────────
const SectionHeader = memo(() => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal text-center mb-16">
      <p className="font-dancing text-maroon-400 dark:text-dark-accent text-xl mb-1">Perjalanan Kita</p>
      <h2 className="section-label">Timeline Cinta</h2>
      <div className="ornament-line max-w-xs mx-auto mt-3">
        <span className="text-maroon-400 dark:text-dark-accent text-sm">✦</span>
      </div>
    </div>
  );
});
SectionHeader.displayName = 'SectionHeader';

// ─────────────────────────────────────────────────────────────
// Main Timeline Section
// ─────────────────────────────────────────────────────────────
const Timeline = () => (
  <section id="timeline" className="py-24 px-4 relative">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-cream-200 to-cream-100 dark:from-dark-surface dark:to-dark-bg opacity-50 pointer-events-none" />

    <div className="relative z-10 max-w-3xl mx-auto">
      <SectionHeader />

      {/* Vertical line */}
      <div className="relative">
        <div
          className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 timeline-line opacity-20 hidden sm:block"
          aria-hidden="true"
        />
        <div>
          {TIMELINE_ITEMS.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Timeline;
