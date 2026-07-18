import React, { useEffect, useRef } from 'react';

// ============================================================
// EDIT TIMELINE DI SINI — tambah / hapus / ubah item sesuai
// kisah kalian!
// ============================================================
const TIMELINE_ITEMS = [
  {
    date: '15 April 2026',
    icon: '💑',
    title: 'Awal Kisah Kita',
    description:
      'Hari yang paling berkesan — hari di mana kita resmi menjadi sepasang kekasih. Terima kasih sudah mau menjadi bagian dari hidupku.',
  },
  {
    date: 'Mei 2026',
    icon: '🌻',
    title: 'Kencan Pertama',
    description:
      'Pergi bersama untuk pertama kali, tertawa, makan es krim, dan berjalan pelan menikmati hari yang sederhana tapi tak terlupakan.',
  },
  {
    date: 'Juni 2026',
    icon: '🏔️',
    title: 'Petualangan Pertama',
    description:
      'Akhirnya kita pergi adventure bersama! Mendaki, foto-foto, dan menikmati alam bersama-sama.',
  },
  {
    date: 'Juli 2026',
    icon: '🎂',
    title: 'Ulang Tahun Bersamamu',
    description:
      'Hari ulang tahun yang spesial karena ada kamu di sampingku. Setiap momen terasa lebih berharga.',
  },
  // ← tambahkan lebih banyak momen di sini!
];

const TimelineItem = ({ item, index, isLeft }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal flex items-start gap-4 mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Card */}
      <div className={`glass-card rounded-2xl p-5 shadow-card max-w-xs sm:max-w-sm flex-1 border border-cream-300 ${isLeft ? 'text-left' : 'text-right'}`}>
        <div className={`flex items-center gap-2 mb-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-2xl">{item.icon}</span>
          <span className="font-playfair font-semibold text-maroon-500 text-sm">{item.date}</span>
        </div>
        <h3 className="font-dancing font-bold text-maroon-600 text-2xl mb-1">{item.title}</h3>
        <p className="font-lato text-sm text-brown-800 leading-relaxed opacity-80">{item.description}</p>
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-maroon-500 flex items-center justify-center text-cream-100 text-lg shadow-romantic z-10 animate-pulse-heart border-4 border-cream-200">
          ♥
        </div>
      </div>

      {/* Spacer for alternate side */}
      <div className="flex-1 max-w-xs sm:max-w-sm hidden sm:block" />
    </div>
  );
};

const Timeline = () => {
  return (
    <section id="timeline" className="py-24 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-200 to-cream-100 opacity-50" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-dancing text-maroon-400 text-xl mb-1">Perjalanan Kita</p>
          <h2 className="section-label">Timeline Cinta</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 text-sm">✦</span>
          </div>
        </div>

        {/* Vertical line */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 timeline-line opacity-20 hidden sm:block" />

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
};

export default Timeline;
