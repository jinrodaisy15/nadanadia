import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlaybackState, RepeatMode, Track } from '../types/music';

export function useAudioPlayer(playlist: readonly Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mounted = useRef(false);
  const wantsPlayback = useRef(false);
  const requestId = useRef({ value: 0 });
  const [trackIndex, setTrackIndex] = useState(0);
  const [playback, setPlayback] = useState<PlaybackState>('paused');
  const [volume, setVolume] = useState(0.8);
  const [repeat, setRepeat] = useState<RepeatMode>('none');
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);
  const currentTrack = playlist[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    const requests = requestId.current;
    mounted.current = true;
    return () => {
      mounted.current = false;
      requests.value++;
      audio?.pause();
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.getAttribute('src')) return;
    wantsPlayback.current = true;
    const request = ++requestId.current.value;
    setPlayback('loading');
    try {
      await audio.play();
      if (mounted.current && request === requestId.current.value && wantsPlayback.current) {
        setPlayback('playing');
      }
    } catch (error: unknown) {
      if (!mounted.current || request !== requestId.current.value) return;
      wantsPlayback.current = false;
      setPlayback(error instanceof DOMException && error.name === 'AbortError' ? 'paused' : 'error');
    }
  }, []);

  // Invalidate pending play promises before loading another source.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const requests = requestId.current;
    requests.value++;
    audio.pause();
    setPlayback('paused');
    if (!currentTrack) {
      wantsPlayback.current = false;
      audio.removeAttribute('src');
      audio.load();
      if (playlist.length > 0) setTrackIndex(0);
      return;
    }
    audio.src = currentTrack.src;
    audio.load();
    if (wantsPlayback.current) void play();
    return () => {
      requests.value++;
      audio.pause();
    };
  }, [currentTrack, playlist.length, play]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const pause = useCallback(() => {
    wantsPlayback.current = false;
    requestId.current.value++;
    audioRef.current?.pause();
    setPlayback('paused');
  }, []);

  const togglePlay = useCallback(() => {
    if (wantsPlayback.current) pause();
    else void play();
  }, [pause, play]);

  const goTo = useCallback((index: number) => {
    if (!Number.isInteger(index) || !playlist[index]) return;
    wantsPlayback.current = true;
    if (index === trackIndex) void play();
    else setTrackIndex(index);
  }, [playlist, trackIndex, play]);

  const restartCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || audio.readyState === 0) return;
    const wasEnded = audio.ended;
    audio.currentTime = 0;
    if (wasEnded) void play();
  }, [currentTrack, play]);

  const adjacentIndex = useCallback((direction: 1 | -1) => {
    if (!shuffleOrder?.length) return undefined;
    const position = shuffleOrder.indexOf(trackIndex);
    if (position < 0) return undefined;
    return shuffleOrder[(position + direction + shuffleOrder.length) % shuffleOrder.length];
  }, [shuffleOrder, trackIndex]);

  const goPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (audio && (audio.currentTime > 3 || audio.ended)) { restartCurrent(); return; }
    const previous = adjacentIndex(-1);
    if (previous !== undefined && playlist[previous]) setTrackIndex(previous);
    else if (trackIndex > 0) setTrackIndex(trackIndex - 1);
    else restartCurrent();
  }, [currentTrack, playlist, adjacentIndex, trackIndex, restartCurrent]);

  const goNext = useCallback(() => {
    if (!currentTrack) return;
    const next = adjacentIndex(1);
    if (next !== undefined && playlist[next]) {
      if (next === trackIndex) restartCurrent();
      else setTrackIndex(next);
    } else if (trackIndex + 1 < playlist.length) setTrackIndex(trackIndex + 1);
    else if (repeat === 'all' && playlist.length > 1) setTrackIndex(0);
    else restartCurrent();
  }, [currentTrack, adjacentIndex, playlist, trackIndex, repeat, restartCurrent]);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (repeat === 'one') {
      audio.currentTime = 0;
      void play();
      return;
    }
    const order = shuffleOrder ?? playlist.map((_, index) => index);
    const position = order.indexOf(trackIndex);
    const next = order[position + 1] ?? (repeat === 'all' ? order[0] : undefined);
    if (next === undefined || !playlist[next]) {
      wantsPlayback.current = false;
      setPlayback('ended');
    } else if (next === trackIndex) {
      audio.currentTime = 0;
      void play();
    } else {
      wantsPlayback.current = true;
      setTrackIndex(next);
    }
  }, [currentTrack, repeat, play, shuffleOrder, playlist, trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onError = () => {
      wantsPlayback.current = false;
      requestId.current.value++;
      setPlayback('error');
    };
    const onPlaying = () => {
      if (wantsPlayback.current) setPlayback('playing');
      else audio.pause();
    };
    const onPause = () => {
      if (!audio.ended) setPlayback(state => state === 'error' ? state : 'paused');
    };
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
    };
  }, [handleEnded]);

  const toggleShuffle = useCallback(() => {
    if (shuffleOrder) { setShuffleOrder(null); return; }
    // Start with the current track so every remaining song plays before stopping.
    const rest = playlist.map((_, index) => index).filter(index => index !== trackIndex);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const left = rest[i];
      const right = rest[j];
      if (left !== undefined && right !== undefined) { rest[i] = right; rest[j] = left; }
    }
    setShuffleOrder(currentTrack ? [trackIndex, ...rest] : []);
  }, [shuffleOrder, playlist, trackIndex, currentTrack]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0 || !Number.isFinite(seconds)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, seconds));
  }, []);

  return {
    audioRef, trackIndex, currentTrack, playback,
    isPlaying: playback === 'playing', hasError: playback === 'error',
    volume, setVolume: (value: number) => { if (Number.isFinite(value)) setVolume(Math.max(0, Math.min(1, value))); },
    repeat, toggleRepeat: () => setRepeat(value => value === 'none' ? 'all' : value === 'all' ? 'one' : 'none'),
    shuffle: shuffleOrder !== null, toggleShuffle, togglePlay, goTo, goPrev, goNext, seek,
  };
}
