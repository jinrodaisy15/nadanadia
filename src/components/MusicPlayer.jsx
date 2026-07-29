import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';

// ============================================================
// ⬇️ DAFTAR LAGU — Upload file ke public/music/ lalu daftarkan di sini
// ============================================================
const BASE = import.meta.env.BASE_URL;

const PLAYLIST = [
  { title: 'Tapi Diterima',       artist: 'Nadin Amizah', src: `${BASE}music/tapi-diterima.mp3` },
  { title: 'Semua Aku Dirayakan', artist: 'Nadin Amizah', src: `${BASE}music/semua-aku-dirayakan.mp3` },
  { title: 'Kekal',               artist: 'Nadin Amizah', src: `${BASE}music/kekal.mp3` },
];

// ─────────────────────────────────────────────────────────────
// Equalizer bars — pure CSS animation, no JS loop
// ─────────────────────────────────────────────────────────────
const EqBars = memo(({ playing }) => (
  <div className="flex items-end gap-0.5 h-4 flex-shrink-0" aria-hidden="true">
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className={`w-1 rounded-sm bg-cream-200 dark:bg-dark-text will-change-auto ${
          playing
            ? i === 0 ? 'animate-eq-bar1' : i === 1 ? 'animate-eq-bar2' : 'animate-eq-bar3'
            : ''
        }`}
        style={{ height: playing ? undefined : '4px' }}
      />
    ))}
  </div>
));
EqBars.displayName = 'EqBars';

// ─────────────────────────────────────────────────────────────
// Progress bar — reads from audio directly via RAF, NO setState
// ─────────────────────────────────────────────────────────────
const ProgressBar = memo(({ audioRef, onSeek }) => {
  const barRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    const fill = bar?.querySelector('[data-fill]');
    if (!bar || !fill) return;

    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = `${pct}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={barRef}
      className="relative h-2 bg-maroon-400 bg-opacity-40 rounded-full cursor-pointer active:scale-y-150 transition-transform"
      onClick={onSeek}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress lagu"
    >
      <div
        data-fill
        className="absolute top-0 left-0 h-full bg-cream-200 rounded-full"
        style={{ width: '0%' }}
      />
    </div>
  );
});
ProgressBar.displayName = 'ProgressBar';

// ─────────────────────────────────────────────────────────────
// Time display — reads from audio directly via RAF
// ─────────────────────────────────────────────────────────────
const TimeDisplay = memo(({ audioRef }) => {
  const currentRef = useRef(null);
  const totalRef = useRef(null);
  const rafRef = useRef(null);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        if (currentRef.current) currentRef.current.textContent = fmt(audio.currentTime);
        if (totalRef.current)   totalRef.current.textContent   = fmt(audio.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex justify-between text-cream-300 text-xs font-lato opacity-50 tabular-nums">
      <span ref={currentRef}>0:00</span>
      <span ref={totalRef}>0:00</span>
    </div>
  );
});
TimeDisplay.displayName = 'TimeDisplay';

// ─────────────────────────────────────────────────────────────
// Shuffle helper
// ─────────────────────────────────────────────────────────────
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// ─────────────────────────────────────────────────────────────
// MusicPlayer
// ─────────────────────────────────────────────────────────────
const MusicPlayer = () => {
  const audioRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [volume,     setVolume]     = useState(0.8);
  const [minimized,  setMinimized]  = useState(true);
  const [hasError,   setHasError]   = useState(false);
  const [showList,   setShowList]   = useState(false);
  const [repeat,     setRepeat]     = useState('none');
  const [shuffle,    setShuffle]    = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState(() => PLAYLIST.map((_, i) => i));

  const currentTrack = useMemo(() => PLAYLIST[trackIndex] || PLAYLIST[0], [trackIndex]);

  // Load track on index change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasError(false);
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) audio.play().catch(() => setHasError(true));
  }, [trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Minimal event listeners — only ended & error (no timeupdate!)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onError = () => setHasError(true);
    const onEnded = () => handleTrackEnd();
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeat, shuffle, shuffleOrder, trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') { audioRef.current?.play().catch(() => {}); return; }
    if (shuffle) {
      const curPos = shuffleOrder.indexOf(trackIndex);
      const nextPos = (curPos + 1) % shuffleOrder.length;
      if (nextPos === 0 && repeat === 'none') { setIsPlaying(false); return; }
      setTrackIndex(shuffleOrder[nextPos]);
    } else {
      const next = trackIndex + 1;
      if (next >= PLAYLIST.length) {
        if (repeat === 'all') setTrackIndex(0);
        else setIsPlaying(false);
      } else {
        setTrackIndex(next);
      }
    }
  }, [repeat, shuffle, shuffleOrder, trackIndex]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasError(false);
      } catch {
        setHasError(true);
      }
    }
  }, [isPlaying]);

  const goTo = useCallback((idx) => {
    setTrackIndex(idx);
    setIsPlaying(true);
    setShowList(false);
  }, []);

  const goPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    if (shuffle) {
      const curPos = shuffleOrder.indexOf(trackIndex);
      setTrackIndex(shuffleOrder[(curPos - 1 + shuffleOrder.length) % shuffleOrder.length]);
    } else {
      setTrackIndex(i => Math.max(0, i - 1));
    }
  }, [shuffle, shuffleOrder, trackIndex]);

  const goNext = useCallback(() => {
    if (shuffle) {
      const curPos = shuffleOrder.indexOf(trackIndex);
      setTrackIndex(shuffleOrder[(curPos + 1) % shuffleOrder.length]);
    } else {
      setTrackIndex(i => Math.min(PLAYLIST.length - 1, i + 1));
    }
  }, [shuffle, shuffleOrder, trackIndex]);

  const toggleRepeat = useCallback(() => {
    setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none');
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(s => {
      if (!s) setShuffleOrder(shuffleArray(PLAYLIST.map((_, i) => i)));
      return !s;
    });
  }, []);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  }, []);

  const handleVolume = useCallback((e) => {
    setVolume(parseFloat(e.target.value));
  }, []);

  const repeatIcon = repeat === 'one' ? '🔂' : '🔁';
  const repeatLabel = repeat === 'none' ? 'Repeat off' : repeat === 'all' ? 'Repeat all' : 'Repeat one';

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" playsInline />

      <div
        className={`fixed z-50 music-player rounded-2xl shadow-card transition-all duration-300
          /* Mobile: full width at bottom, max-w constrained */
          bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6
          ${minimized
            ? 'rounded-none sm:rounded-2xl sm:w-14 sm:h-14 h-14 flex items-center justify-center px-4 sm:px-0'
            : 'rounded-t-2xl sm:rounded-2xl w-full sm:w-72'
          }`}
        role="region"
        aria-label="Music Player"
      >
        {minimized ? (
          /* Minimized: show as bottom bar on mobile, floating button on desktop */
          <button
            onClick={() => setMinimized(false)}
            className="flex items-center gap-3 sm:gap-0 sm:justify-center w-full sm:w-14 sm:h-14 h-14"
            title="Buka music player"
            aria-label="Buka music player"
          >
            <span className={`text-2xl flex-shrink-0 ${isPlaying ? 'animate-pulse-heart' : ''}`}>
              {isPlaying ? '🎵' : '🎶'}
            </span>
            {/* On mobile, show track info in minimized bar */}
            {isPlaying && (
              <span className="sm:hidden font-lato text-cream-200 text-xs truncate flex-1 text-left opacity-80">
                {currentTrack.title} — {currentTrack.artist}
              </span>
            )}
            {!isPlaying && (
              <span className="sm:hidden font-dancing text-cream-300 text-sm opacity-60">
                Putar musik ♥
              </span>
            )}
          </button>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <EqBars playing={isPlaying} />
                <div className="min-w-0 flex-1">
                  <p className="font-dancing text-cream-100 text-sm font-semibold truncate">
                    {hasError ? 'Tidak ada musik' : currentTrack.title}
                  </p>
                  <p className="font-lato text-cream-300 text-xs opacity-50 truncate">
                    {hasError ? 'File tidak ditemukan' : currentTrack.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {PLAYLIST.length > 1 && (
                  <button
                    onClick={() => setShowList(s => !s)}
                    className={`text-sm w-8 h-8 flex items-center justify-center rounded-full transition-all
                      ${showList ? 'bg-cream-200 bg-opacity-20 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                    aria-label="Toggle playlist"
                  >☰</button>
                )}
                <button
                  onClick={() => setMinimized(true)}
                  className="text-cream-300 w-8 h-8 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Minimalkan player"
                >▼</button>
              </div>
            </div>

            {/* Playlist dropdown */}
            {showList && PLAYLIST.length > 1 && (
              <div className="bg-maroon-600 dark:bg-dark-card rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                {PLAYLIST.map((track, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-full text-left px-3 py-2.5 text-xs font-lato transition-colors
                      ${i === trackIndex
                        ? 'bg-maroon-500 dark:bg-dark-border text-cream-100'
                        : 'text-cream-300 opacity-70 hover:opacity-100 hover:bg-maroon-500 dark:hover:bg-dark-border'
                      }`}
                  >
                    <span className="mr-1">{i === trackIndex && isPlaying ? '▶' : '○'}</span>
                    {track.title}
                  </button>
                ))}
              </div>
            )}

            {/* Progress bar (DOM-only, no React state) */}
            {!hasError && <ProgressBar audioRef={audioRef} onSeek={handleSeek} />}

            {/* Time (DOM-only, no React state) */}
            {!hasError && <TimeDisplay audioRef={audioRef} />}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`text-sm w-9 h-9 flex items-center justify-center rounded-full transition-all
                  ${shuffle ? 'bg-cream-200 bg-opacity-20 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                aria-label={shuffle ? 'Matikan shuffle' : 'Aktifkan shuffle'}
              >🔀</button>

              {/* Prev */}
              <button
                onClick={goPrev}
                className="w-9 h-9 rounded-full bg-cream-200 bg-opacity-15 hover:bg-opacity-25 active:scale-90 flex items-center justify-center text-cream-100 text-base transition-all border border-cream-200 border-opacity-15"
                aria-label="Lagu sebelumnya"
              >⏮</button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                id="music-play-btn"
                className="w-12 h-12 rounded-full bg-cream-200 bg-opacity-20 hover:bg-opacity-30 active:scale-90 flex items-center justify-center text-cream-100 text-2xl transition-all border border-cream-200 border-opacity-20"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Next */}
              <button
                onClick={goNext}
                className="w-9 h-9 rounded-full bg-cream-200 bg-opacity-15 hover:bg-opacity-25 active:scale-90 flex items-center justify-center text-cream-100 text-base transition-all border border-cream-200 border-opacity-15"
                aria-label="Lagu berikutnya"
              >⏭</button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`text-sm w-9 h-9 flex items-center justify-center rounded-full transition-all
                  ${repeat !== 'none' ? 'bg-cream-200 bg-opacity-20 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                aria-label={repeatLabel}
              >
                {repeatIcon}
                {repeat === 'one' && <span className="text-xs ml-0.5">1</span>}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <span className="text-cream-300 text-xs opacity-50" aria-hidden="true">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolume}
                className="flex-1 h-2 accent-cream-200 cursor-pointer"
                aria-label="Volume"
              />
              <span className="text-cream-300 text-xs opacity-50" aria-hidden="true">🔊</span>
            </div>

            {/* Error hint */}
            {hasError && (
              <p className="text-center text-cream-300 text-xs opacity-60 font-lato">
                🎵 File musik tidak ditemukan
              </p>
            )}
          </div>
        )}
      </div>

      {/* Spacer so footer not hidden behind mobile music bar */}
      <div className="h-14 sm:h-0 block" aria-hidden="true" />
    </>
  );
};

export default MusicPlayer;
