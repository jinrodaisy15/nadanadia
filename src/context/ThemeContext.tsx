import { useState, useEffect, useCallback, useMemo, type PropsWithChildren } from 'react';
import { ThemeContext } from './theme';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('nn-theme');
      if (stored === 'dark' || stored === 'light') return stored === 'dark';
    } catch {
      /* localStorage tidak tersedia */
    }
    // Belum ada preferensi tersimpan — ikuti sistem
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('nn-theme', isDark ? 'dark' : 'light');
    } catch { /* ignore */ }

    // Update theme-color meta
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', isDark ? '#1B1212' : '#8B1A1A');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);
  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

