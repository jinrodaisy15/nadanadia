import React, { useState, useRef, useEffect, memo, useCallback } from 'react';

const PLAYLIST = [
  { id: 1, title: 'Lagu Kita ♥', src: '/nadanadia/music/music.mp3' },
  { id: 2, title: 'Melodi Cinta 🌸', src: '/nadanadia/music/music2.mp3' },
  { id: 3, title: 'Kisah Romantis ✨', src: '/nadanadia/music/music3.mp3' },
];

const MusicPlayer = memo(() => {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'one' | 'playlist'
  const [minimized, setMinimized] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex] || PLAYLIST[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onError = () => {
      // If audio file doesn't exist, handle gracefully without crashing UI
      setHasError(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
    };
  }, [currentTrackIndex, volume]);

  const nextTrack = useCallback(() => {
    setHasError(false);
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * PLAYLIST.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }
  }, [isShuffle]);

  const prevTrack = useCallback(() => {
    setHasError(false);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, []);

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'playlist' || currentTrackIndex < PLAYLIST.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
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
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleRepeatMode = () => {
    const modes = ['off', 'playlist', 'one'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onEnded={handleEnded}
      />

      <div
        className={`fixed bottom-6 right-6 z-50 music-player dark:bg-dark-card dark:border dark:border-dark-border rounded-2xl shadow-card transition-all duration-300 ${
          minimized ? 'w-14 h-14' : 'w-72 p-4'
        }`}
      >
        {minimized ? (
          <button
            onClick={() => setMinimized(false)}
            className="w-14 h-14 flex items-center justify-center text-cream-100 dark:text-dark-gold"
            title="Buka music player"
          >
            <span className={`text-2xl ${isPlaying ? 'animate-pulse-heart' : ''}`}>
              {isPlaying ? '🎵' : '🎶'}
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-3 text-cream-100 dark:text-dark-text">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`text-lg ${isPlaying ? 'animate-pulse-heart' : ''}`}>🎵</span>
                <span className="font-dancing text-cream-100 dark:text-dark-gold text-base font-semibold truncate max-w-[150px]">
                  {currentTrack.title}
                </span>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="text-cream-300 dark:text-dark-subtext hover:text-cream-100 text-xs opacity-60 hover:opacity-100 transition-opacity p-1"
                title="Minimalkan"
              >
                ▼
              </button>
            </div>

            {hasError ? (
              <p className="text-xs text-cream-300 dark:text-dark-subtext opacity-70 text-center py-1">
                Taruh file musik di <code>public/music/music.mp3</code>
              </p>
            ) : null}

            {/* Progress bar */}
            <div
              className="relative h-1.5 bg-maroon-400/40 dark:bg-dark-border rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-cream-200 dark:bg-dark-gold rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Time */}
            <div className="flex justify-between text-cream-300 dark:text-dark-subtext text-xs font-lato opacity-70">
              <span>{formatTime(progress * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-3">
              {/* Shuffle button */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`text-xs p-1.5 rounded-full transition-colors ${
                  isShuffle ? 'text-cream-100 font-bold bg-maroon-400/40 dark:text-dark-gold' : 'text-cream-300/50 dark:text-dark-subtext/40'
                }`}
                title={isShuffle ? 'Shuffle Aktif' : 'Shuffle Matikan'}
              >
                🔀
              </button>

              {/* Prev button */}
              <button
                onClick={prevTrack}
                className="text-cream-100 dark:text-dark-gold hover:scale-110 text-lg transition-transform"
                title="Lagu Sebelumnya"
              >
                ⏮
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="play-btn w-10 h-10 rounded-full bg-cream-200/20 dark:bg-dark-gold/20 hover:bg-cream-200/30 flex items-center justify-center text-cream-100 dark:text-dark-gold text-xl transition-all border border-cream-200/30 shadow-md"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Next button */}
              <button
                onClick={nextTrack}
                className="text-cream-100 dark:text-dark-gold hover:scale-110 text-lg transition-transform"
                title="Lagu Selanjutnya"
              >
                ⏭
              </button>

              {/* Repeat button */}
              <button
                onClick={toggleRepeatMode}
                className={`text-xs p-1.5 rounded-full transition-colors relative ${
                  repeatMode !== 'off' ? 'text-cream-100 font-bold bg-maroon-400/40 dark:text-dark-gold' : 'text-cream-300/50 dark:text-dark-subtext/40'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                🔁
                {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[9px]">1</span>}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2">
              <span className="text-cream-300 dark:text-dark-subtext text-xs opacity-60">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 accent-cream-200 dark:accent-dark-gold cursor-pointer"
              />
              <span className="text-cream-300 dark:text-dark-subtext text-xs opacity-60">🔊</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default MusicPlayer;
