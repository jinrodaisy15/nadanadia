import React, { useEffect, useRef } from 'react';

const HEARTS = ['❤️', '🩷', '💕', '💖', '💗', '💓', '🌸', '✨'];

const FloatingHearts = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createHeart = () => {
      const heart = document.createElement('span');
      const emoji = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.textContent = emoji;
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 18 + 10}px;
        left: ${Math.random() * 100}%;
        bottom: -40px;
        opacity: 0.7;
        animation: floatUp ${Math.random() * 4 + 5}s ease-in forwards;
        pointer-events: none;
        user-select: none;
      `;
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 10000);
    };

    const interval = setInterval(createHeart, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hearts-container"
      aria-hidden="true"
    />
  );
};

export default FloatingHearts;
