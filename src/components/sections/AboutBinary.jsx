import { useState } from 'react';
import clsx from 'clsx';
import Scene, { sceneStyles } from './Scene.jsx';
import styles from './AboutBinary.module.css';

const CONCEPTS = [
  {
    k: 'Base-2 place value',
    b: (
      <>
        Every position is a power of two. <code>1011</code>₂ ={' '}
        8&nbsp;+&nbsp;0&nbsp;+&nbsp;2&nbsp;+&nbsp;1 = <strong>11</strong>. More bits,
        bigger numbers — but only up to a limit.
      </>
    ),
  },
  {
    k: "Two's complement",
    b: (
      <>
        To store negatives, the top bit carries a <em>negative</em> weight. In 8 bits
        that weight is −128, so <code>1000&nbsp;0000</code> = <strong>−128</strong> and{' '}
        <code>0111&nbsp;1111</code> = <strong>+127</strong>.
      </>
    ),
  },
  {
    k: 'Fixed-width registers',
    b: (
      <>
        A register holds a fixed number of bits. Exceed the largest value and the
        carry has nowhere to go — it lands on the sign bit and the number flips
        negative. That is overflow.
      </>
    ),
  },
];

export default function AboutBinary() {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]); // 0x41 = 65
  const toggle = (i) => setBits((b) => b.map((x, j) => (j === i ? (x ? 0 : 1) : x)));

  const unsigned = bits.reduce((a, b, i) => a + b * 2 ** (7 - i), 0);
  const signed = bits[0] ? unsigned - 256 : unsigned;
  const hex = '0x' + unsigned.toString(16).toUpperCase().padStart(2, '0');

  return (
    <Scene id="about-binary" index="03" kicker="Binary Basics · how machines hold a number">
      <h2 className={sceneStyles.title}>How a computer holds a number</h2>
      <p className={sceneStyles.lede}>
        Before the rocket, the fundamentals. A register is just a fixed row of bits,
        and the way those bits are read decides whether a pattern means a big positive
        number or a big negative one.
      </p>

      <div className={styles.concepts}>
        {CONCEPTS.map((c) => (
          <div key={c.k} className={styles.concept}>
            <h3 className={styles.conceptK}>{c.k}</h3>
            <p className={styles.conceptB}>{c.b}</p>
          </div>
        ))}
      </div>

      <div className={styles.lab}>
        <div className={styles.labHead}>
          <span className={styles.labTitle}>Try it — an 8-bit register</span>
          <span className={styles.labHint}>Click any bit. The top bit is the sign.</span>
        </div>

        <div className={styles.bits}>
          {bits.map((b, i) => (
            <div key={i} className={styles.bitCol}>
              <span className={styles.place}>{i === 0 ? '−128' : 2 ** (7 - i)}</span>
              <button
                type="button"
                className={clsx(
                  styles.bit,
                  i === 0 && styles.signBit,
                  b === 1 && (i === 0 ? styles.signOn : styles.on)
                )}
                onClick={() => toggle(i)}
                aria-pressed={b === 1}
                aria-label={`Bit ${7 - i}, weight ${i === 0 ? -128 : 2 ** (7 - i)}, currently ${b}`}
              >
                {b}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.readouts}>
          <div className={styles.ro}>
            <span className={styles.roK}>Unsigned</span>
            <span className={styles.roV}>{unsigned}</span>
          </div>
          <div className={styles.ro}>
            <span className={styles.roK}>Signed (two's complement)</span>
            <span className={clsx(styles.roV, signed < 0 ? styles.neg : styles.pos)}>
              {signed}
            </span>
          </div>
          <div className={styles.ro}>
            <span className={styles.roK}>Hex</span>
            <span className={styles.roV}>{hex}</span>
          </div>
        </div>

        <p className={styles.foot}>
          Flip only the top bit and the unsigned value barely changes — but the{' '}
          <span className={styles.signedWord}>signed</span> reading leaps past zero
          into the negatives. Hold that thought: the SRI used sixteen of these bits,
          not eight.
        </p>
      </div>
    </Scene>
  );
}
