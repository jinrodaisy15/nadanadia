import React, { useEffect, useRef, memo } from 'react';

// ============================================================
// EDIT TIMELINE DI SINI
// description bisa berupa string biasa atau array string (untuk multi-paragraf)
// ============================================================
const TIMELINE_ITEMS = [
  {
    date: 'Desember 2025',
    icon: '🎄',
    title: 'Pertama Kali Ketemu — di Roblox',
    description: [
      'Yap, beneran Roblox. Awalnya cuma numpang satu server bareng, terus lupa gimana bisa ngobrol',
      'Yang jelas, Nadia yang duluan friendly, dan gue masih cuek seperti biasa. Dia juga sama cueknya, jadi kita bener-bener cuma dua orang random yang kebetulan sering satu map',
      'Sesimpel itu awalnya. Gak ada yang nyangka bisa sampe sini',
    ],
  },
  {
    date: '15–16 Februari 2026',
    icon: '🌻',
    title: 'Ketemu Pertama Kali — di Blok M',
    description: [
      'Masih canggung banget. Gue cuma beli dimsum bakar, dia makan siang sendirian dan gue tinggal sendirian di Blok M Hub wkwk',
      'Lama-lama kita mulai ngobrol lebih banyak di Blok M Hub. Gue coba pegang tangannya, dan dia kelihatan ilfeel haha, tapi akhirnya mau juga',
      'Kita jalan bareng sampe Taman Literasi, terus pulang dari Halte Transjakarta. Sederhana, tapi berkesan',
    ],
  },
  {
    date: 'Februari – April 2026',
    icon: '👉👈',
    title: 'Masa PDKT — "Trial 3 Bulan"',
    description: [
      'Mulai dari sini kita sering call tiap hari dan chat hampir setiap saat.',
      'Gue ngajak dia jalan-jalan dan makan di salah satu café di Tangerang. Terus jalan lagi, dan lagi.',
      'Rasanya ringan banget, kayak gak ada beban sama sekali. Kita sama-sama seneng.',
    ],
  },
  {
    date: '15 April 2026',
    icon: '💕',
    title: 'Jadian',
    description: [
      'Akhirnya resmi. Dari sini segalanya mulai berubah, kita makin sering ketemu, jalan bareng, makan bareng, pergi ke berbagai macam tempat seperti Museum, Kebun Binatang, Taman dan yang pasti BLOK M wkwk',
      'Kita jadi lebih kenal satu sama lain, dari sisi yang baik sampai yang tidak, Selalu ada pertengkaran, ada miskomunikasi, dan ego yang sama-sama besar',
      'Tapi kita selalu bisa baikan lagi, perbaiki Komunikasi, Saling memaafkan, Putus-Nyambung, dan yang paling penting Kita tetap bertahan, saling mendukung, dan belajar satu sama lain',
      'Gue beneran senang punya hubungan yang sehat seperti ini.',
    ],
  },
  {
    date: 'Sekarang',
    icon: '💙🤍',
    title: 'Sampai Detik Ini',
    description: [
      'Banyak yang sudah kita lalui, pertengkaran, miskomunikasi, putus-nyambung',
      'Kita terus berusaha jadi lebih baik, nurunin ego masing-masing, dan saling ngerti',
      'Gue yakin kita bisa jadi versi terbaik satu sama lain, Kita berhasil menjadi dewasa and Fix the Trial and Error in Relationship',
      'Dan gue beneran beruntung punya Nadiatusiyfa.... Kadang cuek, ngeselin, Manja, Lucu, cuma dia yang bikin gue se-cinta ini sama seseorang 💙🤍',
    ],
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Support both string and array of paragraphs
  const paragraphs = Array.isArray(item.description)
    ? item.description
    : [item.description];

  return (
    <div
      ref={ref}
      className={`${revealClass} flex items-start gap-4 mb-14 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {/* Card */}
      <div
        className={`glass-card rounded-2xl p-6 shadow-card flex-1
          border border-cream-300 dark:border-dark-border
          dark:shadow-dark-card
          ${isLeft ? 'text-left' : 'text-right'}`}
        style={{ maxWidth: '340px' }}
      >
        {/* Date + Icon */}
        <div className={`flex items-center gap-2 mb-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
          <span className="font-lato font-semibold text-maroon-400 dark:text-dark-accent text-xs uppercase tracking-wider">
            {item.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-dancing font-bold text-maroon-600 dark:text-dark-text text-2xl mb-3 leading-snug">
          {item.title}
        </h3>

        {/* Description — per paragraph */}
        <div className={`space-y-2 ${isLeft ? '' : 'text-right'}`}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-lato text-sm text-brown-800 dark:text-dark-muted leading-relaxed"
              style={{ opacity: 0.82 }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-maroon-500 dark:bg-dark-accent flex items-center justify-center text-cream-100 text-lg shadow-romantic z-10 animate-pulse-heart border-4 border-cream-200 dark:border-dark-surface">
          ♥
        </div>
      </div>

      {/* Spacer for alternate side */}
      <div className="flex-1 hidden sm:block" style={{ maxWidth: '340px' }} />
    </div>
  );
});
TimelineItem.displayName = 'TimelineItem';

// ─────────────────────────────────────────────────────────────
// Section header
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
      <p className="font-dancing text-maroon-400 dark:text-dark-accent text-xl mb-1">Our Adventure</p>
      <h2 className="section-label">Our Journey</h2>
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
