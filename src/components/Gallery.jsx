import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { useMultiIntersection } from '../hooks/useIntersectionObserver';

// ============================================================
// ⬇️ TAMBAHKAN FOTO KAMU DI SINI
// Upload ke: docs/photos/ lalu tambahkan nama file di sini
// ============================================================
const BASE = import.meta.env.BASE_URL; // '/nadanadia/'

const STATIC_PHOTOS = [
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
const PhotoSkeleton = memo(() => (
  <div className="masonry-item">
    <div className="skeleton" style={{ height: `${Math.random() * 80 + 140}px`, borderRadius: '4px' }} />
  </div>
));
PhotoSkeleton.displayName = 'PhotoSkeleton';

// ─────────────────────────────────────────────────────────────
// Single polaroid card with 3D tilt
// ─────────────────────────────────────────────────────────────
const PolaroidCard = memo(({ photo, index, onOpen, revealRef }) => {
  const cardRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  // 3D tilt on desktop
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
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
        onKeyDown={(e) => e.key === 'Enter' && onOpen(photo)}
      >
        {/* Skeleton shown while loading */}
        {!loaded && (
          <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '2px' }} />
        )}
        <img
          src={photo.src}
          alt={photo.caption || 'Kenangan bersama'}
          loading="lazy"
          className={`w-full object-cover rounded-sm transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0 w-0 h-0'}`}
          style={{ minHeight: loaded ? '100px' : '0', maxHeight: '320px' }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        {loaded && photo.caption && (
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
const Lightbox = memo(({ photos, currentIndex, onClose, onPrev, onNext }) => {
  const photo = photos[currentIndex];
  const touchStartX = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  // Swipe gesture
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      dx < 0 ? onNext() : onPrev();
    }
    touchStartX.current = null;
  }, [onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-92 p-4 animate-fade-in"
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
          <img
            src={photo.src}
            alt={photo.caption || 'Kenangan bersama'}
            className="w-full rounded-sm object-contain"
            style={{ maxHeight: '75vh' }}
          />
          {photo.caption && (
            <p className="mt-3 text-center font-dancing text-maroon-500 text-lg">
              {photo.caption}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
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
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const headerRef = useRef(null);
  const { setRef } = useMultiIntersection({ staggerMs: 80, threshold: 0.08 });

  // Header reveal
  useEffect(() => {
    const el = headerRef.current;
    if (!el || !('IntersectionObserver' in window)) { el?.classList.add('visible'); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openLightbox = useCallback((photo) => {
    const idx = STATIC_PHOTOS.indexOf(photo);
    if (idx !== -1) setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() =>
    setLightboxIndex(i => Math.max(0, i - 1)), []);
  const goNext = useCallback(() =>
    setLightboxIndex(i => Math.min(STATIC_PHOTOS.length - 1, i + 1)), []);

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
