import { useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useExhibit } from './ExhibitState.jsx';
import styles from './HullBackdrop.module.css';

/* Weathered rocket-hull backdrop (specs/behaviors/hull-backdrop.md).
 * Rule-based inline SVG — asymmetric plates with per-plate diagonal gradients, thin
 * seams, rivets generated from seam intersections, gravity rust, off-centre scorch,
 * smoke, ~8% stencils, exactly two hazard accents. Scorch + smoke opacity subscribe
 * to the shared `instability`; they cool to calm at Postmortem for free (instability
 * returns to 0 there). Percentage-based via `preserveAspectRatio="xMidYMid slice"`. */

const VB_W = 1600;
const VB_H = 1000;
const SEAM = 7; // gap that reveals --hull-seam between plates

// Full-cover, non-overlapping plates. Each row spans the width with different split
// points so seams stagger into T-junctions — asymmetric, nothing evenly spaced.
const ROWS = [
  { y: 0, h: 190, cuts: [430, 1010] },
  { y: 190, h: 280, cuts: [250, 1010] },
  { y: 470, h: 220, cuts: [640, 1120] },
  { y: 690, h: 310, cuts: [430, 1010] },
];

// Per-plate diagonal gradient stop pairs (never vertical, never identical). Cycled
// with a per-plate direction flip so light appears to fall differently across plates.
const GRADS = [
  ['#47494b', '#393b3d'],
  ['#404245', '#4d4f52'],
  ['#353739', '#45484a'],
  ['#4b4d50', '#3a3c3f'],
  ['#424447', '#4c4e51'],
];

const STENCILS = [
  { plate: 0, text: 'A5 / PNL-04A' },
  { plate: 1, text: 'STG-2 // 88R' },
  { plate: 2, text: 'PNL-11 · REV C' },
  { plate: 9, text: 'NO STEP' },
  { plate: 8, text: 'ACCESS 07' },
];

// Gravity rust: thin wavy runs starting at a seam, falling down under multiply.
const RUST = [
  'M150 4 q18 90 -6 190 q-20 84 8 300 q10 80 -4 180',
  'M470 190 q14 70 26 150 q16 96 -6 210',
  'M1150 4 q-16 110 10 240 q18 96 -4 220',
  'M980 470 q10 60 -8 150 q-12 70 6 160',
];

export default function HullBackdrop() {
  const { instability, reducedMotion } = useExhibit();

  const { plates, rivets } = useMemo(() => {
    const plates = [];
    for (const row of ROWS) {
      const xs = [0, ...row.cuts, VB_W];
      for (let c = 0; c < xs.length - 1; c++) {
        plates.push({ x: xs[c], y: row.y, w: xs[c + 1] - xs[c], h: row.h });
      }
    }
    // Rivets at unique plate corners (i.e. seam intersections), pulled slightly inside.
    const seen = new Map();
    for (const p of plates) {
      for (const [cx, cy] of [
        [p.x, p.y],
        [p.x + p.w, p.y],
        [p.x, p.y + p.h],
        [p.x + p.w, p.y + p.h],
      ]) {
        const rx = Math.min(VB_W - 22, Math.max(22, cx));
        const ry = Math.min(VB_H - 22, Math.max(22, cy));
        seen.set(`${Math.round(rx)},${Math.round(ry)}`, [rx, ry]);
      }
    }
    return { plates, rivets: [...seen.values()] };
  }, []);

  // Instability-driven active heat. Low instability at Postmortem => auto cool-down.
  const scorchMV = useTransform(instability, [0.08, 0.5, 1], [0.12, 0.55, 0.85]);
  const smokeMV = useTransform(instability, [0.15, 0.55, 1], [0.05, 0.15, 0.22]);
  const scorchStyle = reducedMotion ? { opacity: 0.4 } : { opacity: scorchMV };
  const smokeStyle = reducedMotion ? { opacity: 0.12 } : { opacity: smokeMV };

  return (
    <div className={styles.hull} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {plates.map((_, i) => {
            const [a, b] = GRADS[i % GRADS.length];
            const flip = i % 2 === 0; // alternate diagonal direction
            return (
              <linearGradient
                key={i}
                id={`plate-${i}`}
                x1={flip ? '0' : '0'}
                y1={flip ? '0' : '1'}
                x2="1"
                y2={flip ? '1' : '0'}
              >
                <stop offset="0" stopColor={a} />
                <stop offset="1" stopColor={b} />
              </linearGradient>
            );
          })}
          <pattern
            id="hazard"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="20" height="20" fill="#222" />
            <rect width="10" height="20" className={styles.hazardAmber} />
          </pattern>
          <radialGradient id="scorch" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" className={styles.scorchStop} stopOpacity="0.9" />
            <stop offset="1" className={styles.scorchStop} stopOpacity="0" />
          </radialGradient>
          <filter id="rust-blur" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="smoke-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="48" />
          </filter>
        </defs>

        {/* Background fill */}
        <rect width={VB_W} height={VB_H} className={styles.fill} />

        {/* Hull plates + panel gradients, inset by the seam gap so --hull-fill reads
            as the seam. A thin top highlight gives each plate depth. */}
        <g className={styles.plates}>
          {plates.map((p, i) => {
            const x = p.x + SEAM / 2;
            const y = p.y + SEAM / 2;
            const w = p.w - SEAM;
            const h = p.h - SEAM;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} fill={`url(#plate-${i})`} />
                <rect x={x} y={y} width={w} height={h} fill="none" className={styles.seam} strokeWidth="1.5" />
                <line x1={x} y1={y + 0.75} x2={x + w} y2={y + 0.75} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              </g>
            );
          })}
        </g>

        {/* Rivets — only at seam intersections */}
        <g className={styles.rivets}>
          {rivets.map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="8" fill="#1d1e20" />
              <circle cx={cx} cy={cy} r="4.2" fill="#4e5052" />
              <circle cx={cx - 1.4} cy={cy - 1.4} r="1.4" fill="#8d8f90" />
            </g>
          ))}
        </g>

        {/* Scorch — off-centre radial heat, escalates with instability */}
        <motion.g style={scorchStyle} className={styles.scorch}>
          <ellipse cx="1180" cy="360" rx="360" ry="300" fill="url(#scorch)" />
          <ellipse cx="360" cy="820" rx="300" ry="240" fill="url(#scorch)" />
          <ellipse cx="820" cy="560" rx="420" ry="300" fill="url(#scorch)" />
        </motion.g>

        {/* Rust — thin gravity runs, multiply blend */}
        <g className={styles.rust} filter="url(#rust-blur)">
          {RUST.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={['#8f5d39', '#9d6032', '#b56b3f', '#8f5d39'][i]}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Smoke — very large soft blobs, unify the field, escalate with instability */}
        <motion.g style={smokeStyle} className={styles.smoke} filter="url(#smoke-blur)">
          <ellipse cx="700" cy="300" rx="520" ry="360" />
          <ellipse cx="1200" cy="700" rx="480" ry="360" />
          <ellipse cx="300" cy="720" rx="420" ry="320" />
        </motion.g>

        {/* Stencil labels — ~8%, uppercase, wide tracking */}
        <g className={styles.stencils}>
          {STENCILS.map((s, i) => {
            const p = plates[s.plate];
            return (
              <text
                key={i}
                x={p.x + 34}
                y={p.y + 58}
                className={styles.stencilText}
              >
                {s.text}
              </text>
            );
          })}
        </g>

        {/* Hazard accents — exactly two (upper-left + lower-right) */}
        <g className={styles.hazard}>
          <rect x="64" y="250" width="200" height="30" fill="url(#hazard)" />
          <rect x="1336" y="936" width="200" height="30" fill="url(#hazard)" />
        </g>
      </svg>
    </div>
  );
}
