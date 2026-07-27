import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeColorMeta = document.getElementById('theme-color-meta');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#1B1B1B');
    } else {
      root.classList.remove('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#8B1A1A');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
