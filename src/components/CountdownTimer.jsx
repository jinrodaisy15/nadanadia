import React, { useState, useEffect } from 'react';

// ============================================================
// TANGGAL JADIAN — ubah di sini jika perlu
// ============================================================
const ANNIVERSARY_DATE = new Date('2026-04-15T00:00:00');

const pad = (n) => String(n).padStart(2, '0');

const CountdownTimer = () => {
  const [elapsed, setElapsed] = useState(null);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now   = new Date();
      const diff  = now - ANNIVERSARY_DATE; // ms since anniversary

      if (diff < 0) {
        // Before anniversary — countdown TO the date
        const abs = Math.abs(diff);
        const days    = Math.floor(abs / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((abs % (1000 * 60)) / 1000);
        return { mode: 'countdown', days, hours, minutes, seconds };
      } else {
        // After anniversary — show time together
        const totalSeconds = Math.floor(diff / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const days  = Math.floor(totalHours / 24);
        const years  = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const rDays  = days % 30;
        return { mode: 'together', years, months, days: rDays, hours, minutes, seconds };
      }
    };

    setElapsed(calculate());
    const id = setInterval(() => {
      setElapsed(calculate());
      setTick(t => !t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!elapsed) return null;

  const BoxItem = ({ value, label }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="counter-box rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-romantic">
        <span className="font-playfair font-bold text-2xl sm:text-3xl text-cream-100 tabular-nums">
          {pad(value)}
        </span>
      </div>
      <span className="text-xs font-lato text-maroon-500 dark:text-dark-muted uppercase tracking-widest font-semibold">
        {label}
      </span>
    </div>
  );

  const Colon = () => (
    <span className={`font-playfair text-2xl sm:text-3xl text-maroon-400 dark:text-dark-accent font-bold mb-5 transition-opacity duration-300 ${tick ? 'opacity-100' : 'opacity-30'}`}>
      :
    </span>
  );

  return (
    <div className="text-center">
      {elapsed.mode === 'countdown' ? (
        <>
          <p className="font-dancing text-maroon-400 dark:text-dark-accent text-xl mb-4">
            Menuju Hari Spesial Kita...
          </p>
          <div className="flex items-end justify-center gap-2 sm:gap-4 flex-wrap">
            <BoxItem value={elapsed.days}    label="Hari" />
            <Colon />
            <BoxItem value={elapsed.hours}   label="Jam" />
            <Colon />
            <BoxItem value={elapsed.minutes} label="Menit" />
            <Colon />
            <BoxItem value={elapsed.seconds} label="Detik" />
          </div>
        </>
      ) : (
        <>
          <p className="font-dancing text-maroon-400 text-xl mb-4">
            Kita telah bersama selama...
          </p>
          <div className="flex items-end justify-center gap-2 sm:gap-4 flex-wrap">
            {elapsed.years > 0 && (
              <>
                <BoxItem value={elapsed.years}  label="Tahun" />
                <Colon />
              </>
            )}
            {elapsed.months > 0 && (
              <>
                <BoxItem value={elapsed.months} label="Bulan" />
                <Colon />
              </>
            )}
            <BoxItem value={elapsed.days}    label="Hari" />
            <Colon />
            <BoxItem value={elapsed.hours}   label="Jam" />
            <Colon />
            <BoxItem value={elapsed.minutes} label="Menit" />
            <Colon />
            <BoxItem value={elapsed.seconds} label="Detik" />
          </div>
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
