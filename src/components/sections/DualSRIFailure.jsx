import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import FuzzyText from '../reactbits/FuzzyText.jsx';
import Scene, { sceneStyles } from './Scene.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import MetalSurface from '../exhibit/MetalSurface.jsx';
import styles from './DualSRIFailure.module.css';

const STEPS = [
  { label: 'T+30.0s · Nominal', bus: 'data',
    desc: 'Both inertial reference systems compute attitude and stream it to the on-board computer. This is redundancy as designed: two units, one truth.' },
  { label: 'T+36.70s · Operand error — SRI 2', bus: 'data',
    desc: 'SRI 2 hits the conversion overflow first. Its handler is forbidden from inventing a value, so it shuts the whole unit down.' },
  { label: 'T+36.72s · Diagnostics on the bus', bus: 'diag',
    desc: 'Instead of attitude, SRI 2 writes a failure diagnostic word to the databus — same channel, same shape as real flight data.' },
  { label: 'T+36.75s · Same fault — SRI 1', bus: 'diag',
    desc: 'SRI 1 runs identical software on identical data. Fifty milliseconds later it overflows and dies in exactly the same way.' },
  { label: 'T+36.80s · Both offline', bus: 'silent',
    desc: 'Both systems are down. The OBC — now steering on a diagnostic word it read as an angle — commands the nozzles hard over.' },
];

function stateFor(which, step) {
  if (step >= 4) return 'dark';
  if (which === 2) return step >= 1 ? 'fault' : 'ok';
  return step >= 3 ? 'fault' : 'ok';
}

function Panel({ which, step, mirror, reducedMotion }) {
  const st = stateFor(which, step);
  const name = `SRI ${which}`;
  return (
    <div className={clsx(styles.panel, styles[`p_${st}`], mirror && styles.mirror)}>
      <MetalSurface />
      <div className={styles.panelHead}>
        <span className={clsx(styles.light, styles[`light_${st}`])} />
        <span className={styles.panelName}>{name}</span>
        <span className={styles.panelRole}>{which === 1 ? 'active' : 'backup'}</span>
      </div>
      <div className={styles.panelBody}>
        {st === 'ok' && (
          <>
            <span className={styles.attitude}>+0.03°</span>
            <span className={styles.panelState}>streaming attitude</span>
          </>
        )}
        {st === 'fault' && (
          <>
            <span className={styles.faultReg}>0x8000</span>
            <span className={clsx(styles.panelState, styles.faultText)}>
              operand error · unit halted
            </span>
          </>
        )}
        {st === 'dark' && (
          <>
            <span className={styles.darkReg}>——</span>
            <span className={styles.panelState}>offline</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function DualSRIFailure() {
  const [step, setStep] = useState(0);
  const { reducedMotion } = useExhibit();
  const meta = STEPS[step];

  const go = (i) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(step + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(step - 1); }
  };

  return (
    <Scene id="dual-sri" kicker="The redundancy paradox — fifty milliseconds apart">
      <h2 className={sceneStyles.title}>Two computers, one bug</h2>
      <p className={sceneStyles.lede}>
        The Ariane 5 carried two inertial reference systems so that if one failed, the
        other would carry on. But both ran the <em>same</em> code on the{' '}
        <em>same</em> data. Step through the failure and watch redundancy buy nothing.
      </p>

      <div className={styles.stage}>
        <Panel which={1} step={step} mirror={false} reducedMotion={reducedMotion} />

        <div className={styles.bus}>
          <span className={styles.busLabel}>DATABUS</span>
          <div className={styles.busLine}>
            {meta.bus === 'data' && <span className={styles.busData}>+0.03° · attitude</span>}
            {meta.bus === 'diag' &&
              (reducedMotion ? (
                <span className={styles.busDiagStatic}>0x8B7E · diag?</span>
              ) : (
                <FuzzyText
                  fontFamily='"Spline Sans Mono", monospace'
                  fontSize={18}
                  fontWeight={500}
                  color="#F59E0B"
                  enableHover={false}
                  glitchMode
                  glitchInterval={700}
                  glitchDuration={130}
                  fuzzRange={12}
                  baseIntensity={0.2}
                  className={styles.busFuzz}
                >
                  0x8B7E diag?
                </FuzzyText>
              ))}
            {meta.bus === 'silent' && <span className={styles.busSilent}>— no signal —</span>}
          </div>
          {meta.bus === 'diag' && (
            <span className={styles.busNote}>data or diagnostic? the OBC can't tell.</span>
          )}
        </div>

        <Panel which={2} step={step} mirror reducedMotion={reducedMotion} />
      </div>

      <div className={styles.controls}>
        <div
          className={styles.steps}
          role="group"
          aria-label="Failure sequence step"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => go(step - 1)}
            disabled={step === 0}
            aria-label="Previous step"
          >
            ‹
          </button>
          <div className={styles.stepDots}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                type="button"
                className={clsx(styles.stepDot, i === step && styles.stepDotActive)}
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}: ${s.label}`}
                aria-current={i === step ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => go(step + 1)}
            disabled={step === STEPS.length - 1}
            aria-label="Next step"
          >
            ›
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className={styles.caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            <span className={styles.capLabel}>{meta.label}</span>
            <p className={styles.capText}>{meta.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Scene>
  );
}
