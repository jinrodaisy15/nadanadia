import React, { useState, useRef, useEffect } from 'react';

// ============================================================
// Taruh file musik di: public/music/music.mp3
// ============================================================
const MUSIC_SRC = '/music/music.mp3';
const MUSIC_TITLE = 'Lagu Kita'; // ganti judul lagu di sini

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [minimized, setMinimized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onError = () => setHasError(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
    };
  }, []);

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

  if (hasError) {
    return (
      <div className="fixed bottom-6 right-6 z-50 music-player rounded-2xl px-4 py-3 text-cream-100 text-xs font-lato opacity-70">
        🎵 Taruh musik di <code>public/music/music.mp3</code>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} preload="metadata" />

      <div
        className={`fixed bottom-6 right-6 z-50 music-player rounded-2xl shadow-card transition-all duration-300 ${
          minimized ? 'w-14 h-14' : 'w-64 p-4'
        }`}
      >
        {minimized ? (
          /* Mini mode — just the play/pause circle */
          <button
            onClick={() => setMinimized(false)}
            className="w-14 h-14 flex items-center justify-center"
            title="Buka music player"
          >
            <span className="text-2xl animate-pulse-heart">{isPlaying ? '🎵' : '🎶'}</span>
          </button>
        ) : (
          /* Full mode */
          <div className="flex flex-col gap-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${isPlaying ? 'animate-pulse-heart' : ''}`}>🎵</span>
                <span className="font-dancing text-cream-100 text-sm font-semibold truncate max-w-[120px]">
                  {MUSIC_TITLE}
                </span>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="text-cream-300 hover:text-cream-100 text-xs opacity-60 hover:opacity-100 transition-opacity"
                title="Minimalkan"
              >
                ▼
              </button>
            </div>

            {/* Progress bar */}
            <div
              className="relative h-1.5 bg-maroon-400 bg-opacity-40 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-cream-200 rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Time */}
            <div className="flex justify-between text-cream-300 text-xs font-lato opacity-60">
              <span>{formatTime(progress * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                id="music-play-btn"
                className="play-btn w-10 h-10 rounded-full bg-cream-200 bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-cream-100 text-xl transition-all border border-cream-200 border-opacity-20"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <span className="text-cream-300 text-xs opacity-60">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 accent-cream-200 cursor-pointer"
              />
              <span className="text-cream-300 text-xs opacity-60">🔊</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
