import { useState } from 'react';
import { motion, useTransform, useMotionValueEvent } from 'framer-motion';
import { useExhibit } from './ExhibitState.jsx';
import { SCENES } from './scenes.js';
import { toSigned16, hex16 } from './registerMath.js';
import styles from './TelemetryHUD.module.css';

// Persistent instrument console: scene + mission clock, live register snapshot, and
// a SYSTEM INTEGRITY meter fed by the one instability value (specs/screens/exhibit.md).
export default function TelemetryHUD({ activeIndex = 0 }) {
  const { instability, velocityMV, scroll } = useExhibit();

  const [clock, setClock] = useState('T+00.0s');
  const [vel, setVel] = useState(0);
  const [pct, setPct] = useState(100);

  useMotionValueEvent(scroll, 'change', (v) => {
    const t = Math.max(0, Math.min(39.1, v * 39.1));
    setClock('T+' + t.toFixed(1).padStart(4, '0') + 's');
  });
  useMotionValueEvent(velocityMV, 'change', (v) =>
    setVel((prev) => (prev === Math.round(v) ? prev : Math.round(v)))
  );
  useMotionValueEvent(instability, 'change', (v) => {
    const p = Math.round((1 - v) * 100);
    setPct((prev) => (prev === p ? prev : p));
  });

  const barWidth = useTransform(instability, [0, 1], ['100%', '5%']);
  const barColor = useTransform(
    instability,
    [0, 0.55, 1],
    ['#22c55e', '#f59e0b', '#ef4444']
  );

  const signed = toSigned16(vel);
  const scene = SCENES[activeIndex] ?? SCENES[0];

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.hud} role="region" aria-label="Mission telemetry">
      <div className={styles.cell}>
        <span className={styles.k}>Scene {String(activeIndex + 1).padStart(2, '0')}</span>
        <span className={styles.scene}>{scene.name}</span>
        <span className={styles.clock}>{clock}</span>
      </div>

      <div className={`${styles.cell} ${styles.center}`}>
        <div className={styles.register}>
          <span className={styles.k}>SRI H-Vel</span>
          <span className={styles.hex}>{hex16(vel)}</span>
          <span className={`${styles.dec} ${signed < 0 ? styles.neg : styles.pos}`}>
            {signed >= 0 ? '+' : ''}
            {signed}
          </span>
        </div>
      </div>

      <div className={`${styles.cell} ${styles.right}`}>
        <span className={styles.k}>Integrity</span>
        <div className={styles.meter}>
          <motion.div
            className={styles.meterFill}
            style={{ width: barWidth, background: barColor }}
          />
        </div>
        <span className={styles.pct}>{pct}%</span>
        <div className={styles.dots}>
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => go(s.id)}
              aria-label={`Go to ${s.name}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
