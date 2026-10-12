import { useState, useEffect, memo, type RefObject } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import type { Track } from '../types/music';

// ============================================================
// ⬇️ DAFTAR LAGU — Upload file ke public/music/ lalu daftarkan di sini
// ============================================================
const BASE = import.meta.env.BASE_URL;

const PLAYLIST: readonly Track[] = [
  { title: 'Tapi Diterima',       artist: 'Nadin Amizah', src: `${BASE}music/tapi-diterima.mp3` },
  { title: 'Semua Aku Dirayakan', artist: 'Nadin Amizah', src: `${BASE}music/semua-aku-dirayakan.mp3` },
  { title: 'Kekal',               artist: 'Nadin Amizah', src: `${BASE}music/kekal.mp3` },
];

// ─────────────────────────────────────────────────────────────
// Equalizer bars — pure CSS animation, no JS loop
// ─────────────────────────────────────────────────────────────
const EqBars = memo(({ playing }: { playing: boolean }) => (
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
// Audio progress uses media events, so no RAF loops run while paused.
const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

type AudioProgressProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  seek: (seconds: number) => void;
};

const AudioProgress = memo(function AudioProgress({ audioRef, seek }: AudioProgressProps) {
  const [time, setTime] = useState({ current: 0, duration: 0 });
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setTime({
      current: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    });
    const events = ['timeupdate', 'durationchange', 'loadedmetadata', 'emptied', 'seeked'] as const;
    events.forEach(event => audio.addEventListener(event, sync));
    sync();
    return () => events.forEach(event => audio.removeEventListener(event, sync));
  }, [audioRef]);
  const percent = time.duration > 0 ? Math.max(0, Math.min(100, time.current / time.duration * 100)) : 0;
  return <>
    <div
      className="relative h-2 bg-maroon-400 bg-opacity-40 rounded-full cursor-pointer active:scale-y-150 transition-transform"
      role="slider" tabIndex={0} aria-label="Progress lagu"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}
      aria-valuetext={`${formatTime(time.current)} / ${formatTime(time.duration)}`}
      onClick={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width > 0) seek((event.clientX - rect.left) / rect.width * time.duration);
      }}
      onKeyDown={event => {
        const target = event.key === 'ArrowRight' ? time.current + 5
          : event.key === 'ArrowLeft' ? time.current - 5
          : event.key === 'Home' ? 0 : event.key === 'End' ? time.duration : undefined;
        if (target !== undefined) { event.preventDefault(); seek(target); }
      }}
    >
      <div className="absolute top-0 left-0 h-full bg-cream-200 rounded-full" style={{ width: `${percent}%` }} />
    </div>
    <div className="flex justify-between text-cream-300 text-xs font-lato opacity-50 tabular-nums">
      <span>{formatTime(time.current)}</span><span>{formatTime(time.duration)}</span>
    </div>
  </>;
});

const MusicPlayer = () => {
  const {
    audioRef, currentTrack, trackIndex, isPlaying, hasError, volume, setVolume,
    repeat, shuffle, togglePlay, goTo, goPrev, goNext, toggleRepeat, toggleShuffle, seek,
  } = useAudioPlayer(PLAYLIST);
  const [minimized, setMinimized] = useState(true);
  const [showList, setShowList] = useState(false);
  const repeatIcon = repeat === 'one' ? '🔂' : '🔁';
  const repeatLabel = repeat === 'none' ? 'Repeat off' : repeat === 'all' ? 'Repeat all' : 'Repeat one';

  if (!currentTrack) return null;
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
                    {hasError ? 'Coba putar kembali' : currentTrack.artist}
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
                    key={track.src}
                    onClick={() => { goTo(i); setShowList(false); }}
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

            {/* Progress and time update from native media events. */}
            {!hasError && <AudioProgress audioRef={audioRef} seek={seek} />}

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
                onChange={event => setVolume(event.currentTarget.valueAsNumber)}
                className="flex-1 h-2 accent-cream-200 cursor-pointer"
                aria-label="Volume"
              />
              <span className="text-cream-300 text-xs opacity-50" aria-hidden="true">🔊</span>
            </div>

            {/* Error hint */}
            {hasError && (
              <p className="text-center text-cream-300 text-xs opacity-60 font-lato">
                🎵 Musik belum bisa diputar. Coba lagi atau pilih lagu lain.
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
