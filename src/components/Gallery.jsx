import React, { useState, useRef, useCallback, useEffect, memo } from 'react';

const DEFAULT_PHOTOS = [
  { id: 'bi1', src: 'photos/bi1.jpg', caption: 'First Time Date di Bank Indonesia 💑' },
  { id: 'bi2', src: 'photos/bi2.jpg', caption: 'bank indonesia juga, tapi di cermin hehe 🪞' },
  { id: 'bi3', src: 'photos/bi3.jpg', caption: 'cuteeee <3 💕' },
  { id: 'bi4', src: 'photos/bi4.jpg', caption: 'hehe ✨' },
  { id: 'bi5', src: 'photos/bi5.jpg', caption: 'Foto di cermin lagiii 📸' },
];

const TiltPolaroid = memo(({ photo, index, onOpen, onDelete, onUpdateCaption }) => {
  const [loaded, setLoaded] = useState(false);
  const [transform, setTransform] = useState('');
  const cardRef = useRef(null);

  const rotations = [-4, -2, 0, 2, 3, -3, 1, -1];
  const defaultRotation = rotations[index % rotations.length];

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Only desktop 3D tilt
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;
    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`);
  };

  const handleMouseLeave = () => {
    setTransform(`rotate(${defaultRotation}deg)`);
  };

  return (
    <div
      ref={cardRef}
      className="masonry-item transition-all duration-300 ease-out"
      style={{
        transform: transform || `rotate(${defaultRotation}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="polaroid dark:bg-dark-card dark:border dark:border-dark-border group relative rounded-sm shadow-photo hover:shadow-2xl">
        {/* Delete button (for uploaded custom photos) */}
        {!photo.isDefault && (
          <button
            onClick={() => onDelete(photo.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-maroon-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center hover:bg-maroon-600"
            title="Hapus foto"
          >
            ✕
          </button>
        )}

        {/* Photo Container */}
        <div
          className="overflow-hidden cursor-zoom-in rounded-sm relative bg-cream-300 dark:bg-dark-border min-h-[160px]"
          onClick={() => onOpen(photo)}
        >
          {/* Skeleton loader */}
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-cream-300 via-cream-200 to-cream-300 dark:from-dark-border dark:via-dark-card dark:to-dark-border animate-shimmer flex items-center justify-center">
              <span className="text-2xl opacity-40">📸</span>
            </div>
          )}

          <img
            src={photo.src}
            alt={photo.caption || 'Foto Nada & Nadia'}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full object-cover hover:scale-105 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ minHeight: '160px', maxHeight: '340px' }}
          />
        </div>

        {/* Caption input */}
        <input
          type="text"
          placeholder="Tulis caption..."
          value={photo.caption}
          onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
          className="mt-3 w-full text-center font-dancing text-base text-maroon-500 dark:text-dark-gold bg-transparent border-none outline-none placeholder-maroon-300 dark:placeholder-dark-subtext/50 focus:placeholder-transparent"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
});

const Gallery = memo(() => {
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nada-nadia-gallery') || '[]');
      if (saved.length > 0) return saved;
    } catch {}
    return DEFAULT_PHOTOS.map(p => ({ ...p, isDefault: true }));
  });

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('nada-nadia-gallery', JSON.stringify(photos));
    } catch {}
  }, [photos]);

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            src: e.target.result,
            caption: '',
            isDefault: false
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightboxIndex !== null && photos[lightboxIndex]?.id === id) setLightboxIndex(null);
  }, [lightboxIndex, photos]);

  const updateCaption = useCallback((id, caption) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  }, []);

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoomScale(1);
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  }, [lightboxIndex, photos.length]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoomScale(1);
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  }, [lightboxIndex, photos.length]);

  // Touch gestures for Lightbox mobile (Swipe left / right + Double tap zoom)
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPhoto();
      else prevPhoto();
    }
    setTouchStart(null);
  };

  const toggleZoom = () => {
    setZoomScale(prev => prev === 1 ? 1.8 : 1);
  };

  return (
    <section id="gallery" className="py-24 px-4 bg-cream-200 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-maroon-400 dark:text-dark-rose text-xl mb-1">Momen Berharga</p>
          <h2 className="section-label dark:text-dark-gold">Galeri Kenangan</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 dark:text-dark-rose text-sm">📸</span>
          </div>
          <p className="font-lato text-sm text-maroon-400 dark:text-dark-subtext mt-3 opacity-80">
            Kenangan indah yang akan selalu kita ingat 💕
          </p>
        </div>

        {/* Upload zone */}
        <div
          className={`dropzone dark:border-dark-rose/40 dark:bg-dark-card/40 rounded-2xl p-8 text-center cursor-pointer mb-10 transition-all duration-300 ${
            dragging ? 'dragover border-maroon-500 dark:border-dark-gold' : ''
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-maroon-500/10 dark:bg-dark-rose/20 flex items-center justify-center text-3xl animate-pulse-heart">
              📷
            </div>
            <p className="font-playfair font-semibold text-maroon-500 dark:text-dark-gold text-lg">
              {dragging ? 'Lepaskan untuk upload!' : 'Tambah Foto Kenangan Baru'}
            </p>
            <p className="font-lato text-sm text-maroon-400 dark:text-dark-subtext opacity-70">
              Klik atau drag & drop foto ke sini • JPG, PNG, WebP
            </p>
            <button className="btn-romantic dark:bg-dark-rose dark:hover:bg-dark-rose/90 text-cream-100 font-lato font-semibold px-6 py-2.5 rounded-full text-sm mt-1 shadow-md">
              Pilih Foto
            </button>
          </div>
        </div>

        {/* Gallery grid */}
        {photos.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-6xl mb-4">🖼️</p>
            <p className="font-dancing text-maroon-400 dark:text-dark-rose text-2xl">Belum ada foto...</p>
            <p className="font-lato text-maroon-400 dark:text-dark-subtext text-sm mt-1">Upload foto kalian di atas!</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <TiltPolaroid
                key={photo.id}
                photo={photo}
                index={index}
                onOpen={() => setLightboxIndex(index)}
                onDelete={handleDelete}
                onUpdateCaption={updateCaption}
              />
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <p className="text-center font-lato text-xs text-maroon-400 dark:text-dark-subtext opacity-60 mt-8">
            {photos.length} foto • Klik untuk memperbesar (Swipe di HP untuk next/prev)
          </p>
        )}
      </div>

      {/* Lightbox Modal with Touch Swipe Gestures */}
      {currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 selection:bg-none"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-maroon-500/80 dark:bg-dark-card/80 text-white text-2xl items-center justify-center hover:scale-110 transition-all z-50 shadow-lg"
              title="Foto sebelumnya"
            >
              ‹
            </button>
          )}

          {/* Lightbox Content */}
          <div
            className="relative max-w-2xl w-full transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={toggleZoom}
          >
            <div className="polaroid dark:bg-dark-card dark:border dark:border-dark-border p-3 sm:p-4 rounded-md shadow-2xl">
              <div className="overflow-hidden rounded-sm bg-black/10 flex items-center justify-center">
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.caption}
                  className="w-full max-h-[70vh] object-contain transition-transform duration-300 cursor-zoom-in"
                  style={{ transform: `scale(${zoomScale})` }}
                />
              </div>
              {currentPhoto.caption && (
                <p className="text-center font-dancing text-maroon-500 dark:text-dark-gold text-lg sm:text-xl mt-3">
                  {currentPhoto.caption}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-maroon-500 dark:bg-dark-rose text-white text-lg flex items-center justify-center hover:bg-maroon-600 transition-colors shadow-romantic"
            >
              ✕
            </button>
          </div>

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-maroon-500/80 dark:bg-dark-card/80 text-white text-2xl items-center justify-center hover:scale-110 transition-all z-50 shadow-lg"
              title="Foto selanjutnya"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
});

export default Gallery;
