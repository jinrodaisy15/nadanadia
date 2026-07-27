import React, { useEffect, useRef, memo } from 'react';

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
];

const TimelineItem = memo(({ item, isLeft }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-x-0');
          el.classList.remove('opacity-0', isLeft ? '-translate-x-12' : 'translate-x-12');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isLeft]);

  return (
    <div
      ref={ref}
      className={`flex items-start gap-4 mb-12 opacity-0 transition-all duration-700 ease-out transform ${
        isLeft ? '-translate-x-12 flex-row' : 'translate-x-12 flex-row-reverse'
      }`}
    >
      {/* Card */}
      <div className={`glass-card dark:bg-dark-card/90 dark:border-dark-border rounded-2xl p-5 shadow-card dark:shadow-dark-card max-w-xs sm:max-w-sm flex-1 border border-cream-300 ${isLeft ? 'text-left' : 'text-right'}`}>
        <div className={`flex items-center gap-2 mb-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-2xl">{item.icon}</span>
          <span className="font-playfair font-semibold text-maroon-500 dark:text-dark-gold text-sm">{item.date}</span>
        </div>
        <h3 className="font-dancing font-bold text-maroon-600 dark:text-dark-text text-2xl mb-1">{item.title}</h3>
        <p className="font-lato text-sm text-brown-800 dark:text-dark-subtext leading-relaxed opacity-90">{item.description}</p>
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-maroon-500 dark:bg-dark-rose flex items-center justify-center text-cream-100 text-lg shadow-romantic z-10 animate-pulse-heart border-4 border-cream-200 dark:border-dark-card">
          ♥
        </div>
      </div>

      {/* Spacer for alternate side */}
      <div className="flex-1 max-w-xs sm:max-w-sm hidden sm:block" />
    </div>
  );
});

const Timeline = memo(() => {
  return (
    <section id="timeline" className="py-24 px-4 relative transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-200 to-cream-100 dark:from-dark-bg/80 dark:to-dark-bg opacity-50" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-dancing text-maroon-400 dark:text-dark-rose text-xl mb-1">Perjalanan Kita</p>
          <h2 className="section-label dark:text-dark-gold">Timeline Cinta</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-rose text-sm">✦</span>
          </div>
        </div>

        {/* Vertical line */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 timeline-line dark:bg-dark-gold opacity-20 hidden sm:block" />

          <div>
            {TIMELINE_ITEMS.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Timeline;
