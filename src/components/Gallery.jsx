import React, { useState, useRef, useCallback, useEffect } from 'react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Load saved photos from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nada-nadia-gallery') || '[]');
      setPhotos(saved);
    } catch {
      setPhotos([]);
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('nada-nadia-gallery', JSON.stringify(photos));
    } catch {
      // storage full — silently ignore
    }
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
            name: file.name,
            rotation: (Math.random() - 0.5) * 6,
            caption: '',
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

  const handleDelete = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightbox?.id === id) setLightbox(null);
  };

  const updateCaption = (id, caption) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  // Random rotate classes for polaroid tilt
  const rotations = [-4, -2, 0, 2, 3, -3, 1, -1];

  return (
    <section id="gallery" className="py-24 px-4 bg-cream-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-maroon-400 text-xl mb-1">Momen Berharga</p>
          <h2 className="section-label">Galeri Kenangan</h2>
          <div className="ornament-line max-w-xs mx-auto mt-3">
            <span className="text-maroon-400 text-sm">📸</span>
          </div>
          <p className="font-lato text-sm text-maroon-400 mt-3 opacity-70">
            Upload foto petualangan & momen romantis kita bersama
          </p>
        </div>

        {/* Upload zone */}
        <div
          className={`dropzone rounded-2xl p-8 text-center cursor-pointer mb-10 transition-all duration-300 ${dragging ? 'dragover' : ''}`}
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
            <div className="w-16 h-16 rounded-full bg-maroon-500 bg-opacity-10 flex items-center justify-center text-3xl animate-pulse-heart">
              📷
            </div>
            <p className="font-playfair font-semibold text-maroon-500 text-lg">
              {dragging ? 'Lepaskan untuk upload!' : 'Upload Foto Kalian'}
            </p>
            <p className="font-lato text-sm text-maroon-400 opacity-60">
              Klik atau drag & drop foto ke sini • JPG, PNG, WebP
            </p>
            <button className="btn-romantic text-cream-100 font-lato font-semibold px-6 py-2.5 rounded-full text-sm mt-1">
              Pilih Foto
            </button>
          </div>
        </div>

        {/* Gallery grid — Polaroid style */}
        {photos.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-6xl mb-4">🖼️</p>
            <p className="font-dancing text-maroon-400 text-2xl">Belum ada foto...</p>
            <p className="font-lato text-maroon-400 text-sm mt-1">Upload foto kalian di atas!</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="masonry-item"
                style={{
                  transform: `rotate(${rotations[index % rotations.length]}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              >
                <div className="polaroid group relative">
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-maroon-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center hover:bg-maroon-600"
                    title="Hapus foto"
                  >
                    ✕
                  </button>

                  {/* Photo */}
                  <div
                    className="overflow-hidden cursor-zoom-in rounded-sm"
                    onClick={() => setLightbox(photo)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.name}
                      className="w-full object-cover hover:scale-105 transition-transform duration-500"
                      style={{ minHeight: '120px', maxHeight: '320px' }}
                    />
                  </div>

                  {/* Caption input */}
                  <input
                    type="text"
                    placeholder="Tulis caption..."
                    value={photo.caption}
                    onChange={(e) => updateCaption(photo.id, e.target.value)}
                    className="mt-2 w-full text-center font-dancing text-sm text-maroon-500 bg-transparent border-none outline-none placeholder-maroon-300 focus:placeholder-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <p className="text-center font-lato text-xs text-maroon-400 opacity-50 mt-6">
            {photos.length} foto tersimpan • Klik foto untuk memperbesar
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="polaroid">
              <img
                src={lightbox.src}
                alt={lightbox.name}
                className="w-full rounded-sm"
              />
              {lightbox.caption && (
                <p className="text-center font-dancing text-maroon-500 text-lg mt-2">
                  {lightbox.caption}
                </p>
              )}
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-maroon-500 text-white text-lg flex items-center justify-center hover:bg-maroon-600 transition-colors shadow-romantic"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
