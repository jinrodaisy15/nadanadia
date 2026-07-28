import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';

// ============================================================
// ⬇️ DAFTAR LAGU — Upload file ke public/music/ lalu daftarkan di sini
// ============================================================
const BASE = import.meta.env.BASE_URL;

const PLAYLIST = [
  { title: 'semua-aku-dirayakan', artist: 'Nadin Amizah', src: `${BASE}music/music.mp3` },
  // { title: 'Lagu Kedua',    artist: 'Artist',        src: `${BASE}music/song2.mp3` },
  // { title: 'Lagu Ketiga',   artist: 'Artist',        src: `${BASE}music/song3.mp3` },
];

// ─────────────────────────────────────────────────────────────
// Equalizer bars (animated when playing)
// ─────────────────────────────────────────────────────────────
const EqBars = memo(({ playing }) => (
  <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className={`w-1 rounded-sm bg-cream-200 dark:bg-dark-text transition-all ${playing
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
// Shuffle array helper
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [minimized, setMinimized] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showList, setShowList] = useState(false);
  const [repeat, setRepeat] = useState('none'); // 'none' | 'one' | 'all'
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState(() => PLAYLIST.map((_, i) => i));

  const currentTrack = useMemo(() => PLAYLIST[trackIndex] || PLAYLIST[0], [trackIndex]);

  // Load track on index change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasError(false);
    setProgress(0);
    setDuration(0);
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setHasError(true));
    }
  }, [trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onTimeUpdate = () => { if (audio.duration) setProgress(audio.currentTime / audio.duration); };
    const onMeta = () => setDuration(audio.duration);
    const onError = () => setHasError(true);
    const onEnded = () => handleTrackEnd();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeat, shuffle, shuffleOrder, trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') {
      audioRef.current?.play().catch(() => { });
      return;
    }
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
    // If > 3s played, restart current
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
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  }, []);

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const fmt = useCallback((s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }, []);

  const repeatIcon = repeat === 'none' ? '🔁' : repeat === 'all' ? '🔁' : '🔂';
  const repeatLabel = repeat === 'none' ? 'Repeat off' : repeat === 'all' ? 'Repeat all' : 'Repeat one';

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <div
        className={`fixed bottom-6 right-6 z-50 music-player rounded-2xl shadow-card transition-all duration-300
          ${minimized ? 'w-14 h-14' : 'w-72'}`}
        role="region"
        aria-label="Music Player"
      >
        {minimized ? (
          <button
            onClick={() => setMinimized(false)}
            className="w-14 h-14 flex items-center justify-center"
            title="Buka music player"
            aria-label="Buka music player"
          >
            <span className={`text-2xl ${isPlaying ? 'animate-pulse-heart' : ''}`}>
              {isPlaying ? '🎵' : '🎶'}
            </span>
          </button>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <EqBars playing={isPlaying} />
                <div className="min-w-0">
                  <p className="font-dancing text-cream-100 text-sm font-semibold truncate max-w-[140px]">
                    {hasError ? 'Tidak ada musik' : currentTrack.title}
                  </p>
                  <p className="font-lato text-cream-300 text-xs opacity-50 truncate max-w-[140px]">
                    {hasError ? 'Tambahkan music.mp3' : currentTrack.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Playlist toggle */}
                {PLAYLIST.length > 1 && (
                  <button
                    onClick={() => setShowList(s => !s)}
                    className={`text-xs transition-opacity ${showList ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    title="Playlist"
                    aria-label="Toggle playlist"
                  >
                    ☰
                  </button>
                )}
                {/* Minimize */}
                <button
                  onClick={() => setMinimized(true)}
                  className="text-cream-300 text-xs opacity-50 hover:opacity-100 transition-opacity"
                  title="Minimalkan"
                  aria-label="Minimalkan player"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Playlist dropdown */}
            {showList && PLAYLIST.length > 1 && (
              <div className="bg-maroon-600 dark:bg-dark-card rounded-xl overflow-hidden max-h-32 overflow-y-auto">
                {PLAYLIST.map((track, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-full text-left px-3 py-2 text-xs font-lato transition-colors hover:bg-maroon-500 dark:hover:bg-dark-border
                      ${i === trackIndex ? 'bg-maroon-500 dark:bg-dark-border text-cream-100' : 'text-cream-300 opacity-70'}`}
                  >
                    {i === trackIndex && isPlaying ? '▶ ' : '  '}{track.title}
                  </button>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {!hasError && (
              <div
                className="relative h-1.5 bg-maroon-400 bg-opacity-40 rounded-full cursor-pointer"
                onClick={handleSeek}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label="Progress lagu"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-cream-200 rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            )}

            {/* Time */}
            {!hasError && (
              <div className="flex justify-between text-cream-300 text-xs font-lato opacity-50">
                <span>{fmt(progress * duration)}</span>
                <span>{fmt(duration)}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`text-sm transition-opacity ${shuffle ? 'opacity-100 text-cream-100' : 'opacity-40 text-cream-300 hover:opacity-70'}`}
                title={shuffle ? 'Shuffle on' : 'Shuffle off'}
                aria-label={shuffle ? 'Matikan shuffle' : 'Aktifkan shuffle'}
              >
                🔀
              </button>

              {/* Prev */}
              {PLAYLIST.length > 1 && (
                <button
                  onClick={goPrev}
                  className="play-btn w-8 h-8 rounded-full bg-cream-200 bg-opacity-15 hover:bg-opacity-25 flex items-center justify-center text-cream-100 text-sm transition-all border border-cream-200 border-opacity-15"
                  aria-label="Lagu sebelumnya"
                >
                  ⏮
                </button>
              )}

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                id="music-play-btn"
                className="play-btn w-10 h-10 rounded-full bg-cream-200 bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-cream-100 text-xl transition-all border border-cream-200 border-opacity-20"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Next */}
              {PLAYLIST.length > 1 && (
                <button
                  onClick={goNext}
                  className="play-btn w-8 h-8 rounded-full bg-cream-200 bg-opacity-15 hover:bg-opacity-25 flex items-center justify-center text-cream-100 text-sm transition-all border border-cream-200 border-opacity-15"
                  aria-label="Lagu berikutnya"
                >
                  ⏭
                </button>
              )}

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`text-sm transition-opacity ${repeat !== 'none' ? 'opacity-100 text-cream-100' : 'opacity-40 text-cream-300 hover:opacity-70'}`}
                title={repeatLabel}
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
                className="flex-1 h-1 accent-cream-200 cursor-pointer"
                aria-label="Volume"
              />
              <span className="text-cream-300 text-xs opacity-50" aria-hidden="true">🔊</span>
            </div>

            {/* No-music hint */}
            {hasError && (
              <p className="text-center text-cream-300 text-xs opacity-60 font-lato">
                🎵 Upload lagu ke <code className="opacity-80">public/music/</code>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
