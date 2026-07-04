import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import styles from './MissionBriefing.module.css';

const TICKS = [
  { t: 'T+0', color: '#2fae4e' },
  { t: 'T+30', color: '#2fae4e' },
  {
    t: 'T+36.7',
    color: '#e63946',
    label: 'T+36.70 s — Operand Error (SRI 2)',
    detail:
      'The backup inertial reference unit throws an operand error while converting a 64-bit float to a 16-bit signed integer.',
  },
  { t: 'T+36.8', color: '#6a8fd8' },
  { t: 'T+39.0', color: '#f4a300' },
  { t: 'T+39.1', color: '#e63946' },
];

export default function MissionBriefing() {
  const [active, setActive] = useState(2);
  const activeTick = TICKS[active];

  return (
    <section id="mission-briefing" className={styles.section}>
      <h2 className={styles.heading}>Mission Briefing</h2>
      <p className={styles.body}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <h3 className={styles.subheading}>V88 Launch Sequence</h3>

      <div className={styles.track}>
        <div className={styles.ticks}>
          {TICKS.map((tick, i) => (
            <div key={tick.t} className={styles.tickWrap}>
              <div className={styles.segment} style={{ background: tick.color }} />
              <button
                onClick={() => setActive(i)}
                aria-label={`View detail for ${tick.t}`}
                className={clsx(styles.tick, { [styles.tickActive]: active === i })}
                style={{ borderColor: tick.color }}
              />
              <span className={styles.tickLabel}>{tick.t}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTick.label && (
            <motion.div
              key={activeTick.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={styles.detail}
            >
              <p className={styles.detailLabel}>{activeTick.label}</p>
              <p className={styles.detailText}>{activeTick.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}