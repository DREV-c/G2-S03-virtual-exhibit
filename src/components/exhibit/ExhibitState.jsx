import { createContext, useContext, useMemo, useRef } from 'react';
import {
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';

/**
 * One instability value drives everything (specs/principles.md).
 * The master `instability` in [0,1] = max(scroll-driven ambient, event-driven).
 * Consumers subscribe to motion values directly, so rapid changes (slider, scrub)
 * never re-render the section canvases.
 */
const ExhibitContext = createContext(null);

// Ambient instability as a function of whole-page scroll progress: calm through the
// intro, rising into the Register Room / SRI failure, then down to 0 at Postmortem
// (clean black calm). The big spike at the wrap is event-driven, not scroll-driven.
const SCROLL_IN = [0, 0.28, 0.5, 0.62, 0.72, 0.82, 0.92, 1];
const SCROLL_OUT = [0.04, 0.1, 0.3, 0.55, 0.62, 0.45, 0.1, 0];

export function ExhibitProvider({ scrollYProgress, children }) {
  const prefersReduced = useReducedMotion();

  // Fallback scroll source for SSR / when no target is bound yet.
  const fallback = useMotionValue(0);
  const scroll = scrollYProgress ?? fallback;

  const scrollInstability = useTransform(scroll, SCROLL_IN, SCROLL_OUT, {
    clamp: true,
  });
  const eventInstability = useMotionValue(0);
  const instability = useTransform(
    [scrollInstability, eventInstability],
    ([a, b]) => Math.max(a, b)
  );

  // Live register snapshot as a motion value (velocity 0..65535). The HUD subscribes
  // without forcing provider re-renders.
  const velocityMV = useMotionValue(0);

  const eventAnim = useRef(null);

  const value = useMemo(() => {
    const stopEventAnim = () => {
      if (eventAnim.current) {
        eventAnim.current.stop();
        eventAnim.current = null;
      }
    };

    return {
      instability,
      scrollInstability,
      eventInstability,
      velocityMV,
      scroll,
      reducedMotion: !!prefersReduced,

      /** Transient overflow spike: jump to `peak`, decay to 0 over `duration` s. */
      spike(peak = 1, duration = 0.8) {
        stopEventAnim();
        if (prefersReduced) {
          // Designed reduced-motion path: a brief flat flash, no decay animation.
          eventInstability.set(peak);
          eventAnim.current = animate(eventInstability, 0, {
            duration: 0.24,
            delay: 0.18,
            ease: 'linear',
          });
          return;
        }
        eventInstability.set(peak);
        eventAnim.current = animate(eventInstability, 0, {
          duration,
          ease: [0.2, 0.7, 0.3, 1],
        });
      },

      /** Hold the event channel at a level (immediate). */
      setEvent(v) {
        stopEventAnim();
        eventInstability.set(Math.max(0, Math.min(1, v)));
      },

      /** Ease the event channel to a level (the timeline scrubber uses this). */
      easeEventTo(v, duration = 0.45) {
        stopEventAnim();
        const target = Math.max(0, Math.min(1, v));
        eventAnim.current = animate(eventInstability, target, {
          duration: prefersReduced ? 0 : duration,
          ease: 'easeOut',
        });
      },

      /** Ease the event channel back to 0 (scrubber release). */
      releaseEvent(duration = 0.6) {
        stopEventAnim();
        eventAnim.current = animate(eventInstability, 0, {
          duration: prefersReduced ? 0 : duration,
          ease: 'easeOut',
        });
      },
    };
  }, [
    instability,
    scrollInstability,
    eventInstability,
    velocityMV,
    scroll,
    prefersReduced,
  ]);

  return (
    <ExhibitContext.Provider value={value}>{children}</ExhibitContext.Provider>
  );
}

export function useExhibit() {
  const ctx = useContext(ExhibitContext);
  if (!ctx) {
    throw new Error('useExhibit must be used within <ExhibitProvider>');
  }
  return ctx;
}
