import { useState, useRef, useCallback, useEffect, memo, type RefCallback, type MouseEvent, type TouchEvent } from 'react';
import { useMultiIntersection } from '../hooks/useIntersectionObserver';

// ============================================================
// ⬇️ TAMBAHKAN FOTO KAMU DI SINI
// Upload ke: public/photos/ lalu tambahkan nama file di sini
// ============================================================
const BASE = import.meta.env.BASE_URL; // '/nadanadia/'

type Photo = { src: string; caption: string };
type PolaroidCardProps = { photo: Photo; index: number; onOpen: (photo: Photo) => void; revealRef: RefCallback<HTMLDivElement> };
type LightboxProps = { photos: readonly Photo[]; currentIndex: number; onClose: () => void; onPrev: () => void; onNext: () => void };

const STATIC_PHOTOS: readonly Photo[] = [
  { src: `${BASE}photos/bi1.jpg`, caption: 'First Time Date di Bank Indonesia 💑' },
  { src: `${BASE}photos/bi2.jpg`, caption: 'bank indonesia juga, tapi di cermin hehe' },
  { src: `${BASE}photos/bi3.jpg`, caption: 'cuteeee <3' },
  { src: `${BASE}photos/bi4.jpg`, caption: 'hehe' },
  { src: `${BASE}photos/bi5.jpg`, caption: 'Foto di cermin lagiii' },
  // { src: `${BASE}photos/foto6.jpg`, caption: 'Caption di sini' },
];

const ROTATIONS = [-4, -2, 0, 2, 3, -3, 1, -1, 4, -1, 2, -2];

// ─────────────────────────────────────────────────────────────
// Skeleton placeholder
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// Single polaroid card with 3D tilt
// ─────────────────────────────────────────────────────────────
const PolaroidCard = memo(({ photo, index, onOpen, revealRef }: PolaroidCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length] ?? 0;

  // 3D tilt on desktop
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia?.('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `rotate(${rotation}deg) perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.04)`;
  }, [rotation]);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `rotate(${rotation}deg)`;
      cardRef.current.style.transition = 'transform 0.4s ease';
    }
  }, [rotation]);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.1s ease';
    }
  }, []);

  return (
    <div
      ref={revealRef}
      className="masonry-item reveal"
    >
      <div
        ref={cardRef}
        className="polaroid cursor-zoom-in group relative"
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={() => onOpen(photo)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        role="button"
        tabIndex={0}
        aria-label={`Buka foto: ${photo.caption || 'foto kenangan'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(photo); }
        }}
      >
        {/* Skeleton shown while loading */}
        {!loaded && !failed && (
          <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '2px' }} />
        )}
        {/* Fallback jika gambar gagal dimuat */}
        {failed ? (
          <div
            className="w-full flex flex-col items-center justify-center gap-2 bg-cream-100 dark:bg-dark-card rounded-sm"
            style={{ height: '180px' }}
            aria-label="Foto tidak dapat dimuat"
          >
            <span className="text-3xl" aria-hidden="true">🖼️</span>
            <span className="font-lato text-xs text-maroon-400 dark:text-dark-muted opacity-60">
              Foto tidak dapat dimuat
            </span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.caption || 'Kenangan bersama'}
            loading="lazy"
            className={`w-full object-cover rounded-sm transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0 w-0 h-0'}`}
            style={{ minHeight: loaded ? '100px' : '0', maxHeight: '320px' }}
            onLoad={() => setLoaded(true)}
            onError={() => { setFailed(true); setLoaded(true); }}
          />
        )}
        {loaded && !failed && photo.caption && (
          <p className="mt-2 text-center font-dancing text-sm text-maroon-500 dark:text-dark-accent px-1">
            {photo.caption}
          </p>
        )}
      </div>
    </div>
  );
});
PolaroidCard.displayName = 'PolaroidCard';

// ─────────────────────────────────────────────────────────────
// Fullscreen lightbox with swipe gesture
// ─────────────────────────────────────────────────────────────
const Lightbox = memo(({ photos, currentIndex, onClose, onPrev, onNext }: LightboxProps) => {
  const photo = photos[currentIndex];
  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
      if (e.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
        const first = buttons?.[0];
        const last = buttons?.[buttons.length - 1];
        if (!dialogRef.current?.contains(document.activeElement)) { e.preventDefault(); first?.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose, onPrev, onNext]);

  // Swipe gesture
  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);
  const onTouchEnd = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  }, [onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fade-in"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Lightbox foto"
    >
      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white flex items-center justify-center text-xl z-10 transition-all"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Foto sebelumnya"
        >
          ‹
        </button>
      )}

      {/* Photo */}
      <div
        className="relative max-w-2xl w-full animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="polaroid dark:bg-amber-50" style={{ transform: 'none' }}>
          {failedSrc === photo.src ? (
            <div className="flex h-48 items-center justify-center text-maroon-500" role="status">Foto tidak dapat dimuat</div>
          ) : <img
            src={photo.src}
            alt={photo.caption || 'Kenangan bersama'}
            className="w-full rounded-sm object-contain"
            style={{ maxHeight: '75vh' }}
            onError={() => setFailedSrc(photo.src)}
          />}
          {photo.caption && (
            <p className="mt-3 text-center font-dancing text-maroon-500 text-lg">
              {photo.caption}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-maroon-500 hover:bg-maroon-600 text-white flex items-center justify-center shadow-romantic transition-colors"
          aria-label="Tutup lightbox"
        >
          ✕
        </button>

        {/* Counter */}
        <p className="text-center text-white text-xs mt-3 opacity-50 font-lato">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white flex items-center justify-center text-xl z-10 transition-all"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Foto berikutnya"
        >
          ›
        </button>
      )}
    </div>
  );
});
Lightbox.displayName = 'Lightbox';

// ─────────────────────────────────────────────────────────────
// Main Gallery Section
// ─────────────────────────────────────────────────────────────
const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { setRef } = useMultiIntersection({ staggerMs: 80, threshold: 0.08 });

  // Header reveal
  useEffect(() => {
    const el = headerRef.current;
    if (!el || !('IntersectionObserver' in window)) { el?.classList.add('visible'); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openLightbox = useCallback((photo: Photo) => {
    const idx = STATIC_PHOTOS.indexOf(photo);
    if (idx !== -1) setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() =>
    setLightboxIndex(i => i === null ? null : Math.max(0, i - 1)), []);
  const goNext = useCallback(() =>
    setLightboxIndex(i => i === null || STATIC_PHOTOS.length === 0 ? null : Math.min(STATIC_PHOTOS.length - 1, i + 1)), []);

  return (
    <section id="gallery" className="py-24 px-4 bg-cream-200 dark:bg-dark-surface">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-12">
          <p className="font-dancing text-maroon-400 dark:text-dark-accent text-xl mb-1">Momen Berharga</p>
          <h2 className="section-label">Galeri Kenangan</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-accent text-sm">📸</span>
          </div>
          <p className="font-lato text-sm text-maroon-400 dark:text-dark-muted mt-3 opacity-70">
            Kenangan indah yang akan selalu kita ingat 💕
          </p>
        </div>

        {/* Masonry grid */}
        {STATIC_PHOTOS.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-6xl mb-4">🖼️</p>
            <p className="font-dancing text-maroon-400 dark:text-dark-accent text-2xl">Foto segera hadir...</p>
            <p className="font-lato text-maroon-400 dark:text-dark-muted text-sm mt-1">
              Tambahkan foto di array STATIC_PHOTOS
            </p>
          </div>
        ) : (
          <>
            <div className="masonry-grid">
              {STATIC_PHOTOS.map((photo, index) => (
                <PolaroidCard
                  key={photo.src}
                  photo={photo}
                  index={index}
                  onOpen={openLightbox}
                  revealRef={setRef}
                />
              ))}
            </div>
            <p className="text-center font-lato text-xs text-maroon-400 dark:text-dark-muted opacity-50 mt-6">
              {STATIC_PHOTOS.length} foto • Klik untuk memperbesar • Swipe di mobile
            </p>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={STATIC_PHOTOS}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
};

export default Gallery;
