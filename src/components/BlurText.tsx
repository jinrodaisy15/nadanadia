import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';

type BlurTextProps = {
  text?: string; delay?: number; className?: string; direction?: 'top' | 'bottom';
  threshold?: number; rootMargin?: string; stepDuration?: number; emphasis?: string;
  onAnimationComplete?: () => void;
};

// React Bits BlurText, adapted for long letters: word-level animation,
// bounded staggering, normal text wrapping, and no permanent GPU layers.
const BlurTextContent = memo(function BlurTextContent({
  text = '',
  delay = 22,
  className = '',
  direction = 'top',
  threshold = 0.05,
  rootMargin = '0px 0px -24px 0px',
  stepDuration = 0.18,
  emphasis = '',
  onAnimationComplete,
}: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const completedRef = useRef(false);
  const callbackRef = useRef(onAnimationComplete);
  const [inView, setInView] = useState(false);
  const [complete, setComplete] = useState(false);
  const reduceMotion = useReducedMotion();
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const emphasizedWords = emphasis && text.startsWith(emphasis) ? emphasis.trim().split(/\s+/).length : 0;
  const stagger = Math.min(delay / 1000, 0.65 / Math.max(1, words.length - 1));
  const from = useMemo(() => ({
    filter: 'blur(4px)', opacity: 0, y: direction === 'top' ? -8 : 8,
  }), [direction]);
  const frames = useMemo(() => ({
    filter: ['blur(4px)', 'blur(2px)', 'blur(0px)'],
    opacity: [0, 0.6, 1],
    y: [direction === 'top' ? -8 : 8, 0, 0],
  }), [direction]);

  useEffect(() => { callbackRef.current = onAnimationComplete; }, [onAnimationComplete]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setComplete(true);
    callbackRef.current?.();
  }, []);

  useEffect(() => {
    if (reduceMotion || words.length === 0 || !('IntersectionObserver' in window)) {
      setInView(true);
      finish();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold, rootMargin });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduceMotion, finish, words.length]);

  const renderWord = (word: string, index: number) => index < emphasizedWords ? <strong>{word}</strong> : word;

  return (
    <p ref={ref} className={`blur-text ${className}`} data-revealed={complete || reduceMotion ? 'true' : 'false'}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={index}>
            {complete || reduceMotion ? (
              <span className="inline-block">{renderWord(word, index)}</span>
            ) : !inView ? (
              <span className="inline-block opacity-0">{renderWord(word, index)}</span>
            ) : (
              <m.span
                className="inline-block"
                initial={from}
                animate={inView ? frames : from}
                transition={{ duration: stepDuration * 2, times: [0, 0.5, 1], delay: index * stagger, ease: 'easeOut' }}
                onAnimationComplete={inView && index === words.length - 1 ? finish : undefined}
              >
                {renderWord(word, index)}
              </m.span>
            )}
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </p>
  );
});

// Remount animation state when reusable content changes, without replaying on parent renders.
export default function BlurText(props: BlurTextProps) {
  return <BlurTextContent key={props.text} {...props} />;
}
