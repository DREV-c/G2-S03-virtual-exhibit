import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import FuzzyText from '../reactbits/FuzzyText.jsx';
import BorderGlow from '../reactbits/BorderGlow.jsx';
import Noise from '../reactbits/Noise.jsx';
import Counter from '../reactbits/Counter.jsx';
import Scene, { sceneStyles } from './Scene.jsx';
import { useExhibit } from '../exhibit/ExhibitState.jsx';
import styles from './DualSRIFailure.module.css';

const STEPS = [
  { label: 'T+30.0s · Normal Flight', bus: 'data',
    desc: 'Two identical computers (SRIs) are tracking the rocket\'s tilt and guiding the main flight computer. Having two is a safety backup—if one breaks, the other takes over.' },
  { label: 'T+36.70s · Math Error in Backup', bus: 'data',
    desc: 'Because of a software bug, the backup computer tries to squeeze a huge number into a tiny space. It crashes, throwing a "math error", and completely shuts down.' },
  { label: 'T+36.72s · Warning Signal Sent', bus: 'diag',
    desc: 'Instead of sending the rocket\'s tilt, the broken backup computer sends out an error code. Unfortunately, this error code looks exactly like normal flight data to the main computer.' },
  { label: 'T+36.75s · Same Bug Hits Primary', bus: 'diag',
    desc: 'Since the primary computer runs the exact same software on the exact same flight path, it hits the exact same bug just a fraction of a second later. It crashes too.' },
  { label: 'T+36.80s · Complete Failure', bus: 'silent',
    desc: 'Both computers are dead. The main rocket computer reads the error code as a huge, sudden turn, and violently steers the rocket off course to "fix" it, tearing the rocket apart.' },
];

function stateFor(which, step) {
  if (step >= 4) return 'dark';
  if (which === 2) return step >= 1 ? 'fault' : 'ok';
  return step >= 3 ? 'fault' : 'ok';
}

function Panel({ which, step, mirror, reducedMotion }) {
  const st = stateFor(which, step);
  const name = `SRI ${which}`;
  
  // Choose glow colors based on state
  const glowColors = st === 'ok' 
    ? ['#22c55e', '#10b981', '#059669'] 
    : st === 'fault' 
      ? ['#ef4444', '#dc2626', '#b91c1c'] 
      : ['#334155', '#1e293b', '#0f172a'];
      
  return (
    <BorderGlow 
      className={clsx(styles.panel, styles[`p_${st}`], mirror && styles.mirror)}
      glowColor={st === 'ok' ? '142 70 50' : st === 'fault' ? '0 84 60' : '210 20 20'}
      colors={glowColors}
      animated={!reducedMotion && st !== 'dark'}
      borderRadius={16}
      backgroundColor="#0f172a"
      glowIntensity={st === 'dark' ? 0.2 : 0.8}
    >
      <div className={styles.panelHead}>
        <span className={clsx(styles.light, styles[`light_${st}`])} />
        <span className={styles.panelName}>{name}</span>
        <span className={styles.panelRole}>{which === 1 ? 'Primary' : 'Backup'}</span>
      </div>
      <div className={styles.panelBody}>
        <div className={clsx(styles.panelScreen, st === 'fault' && styles.screenGlitch, st === 'dark' && styles.screenOff)}>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>CPU</span>
              <span className={st === 'ok' ? styles.metricValueOk : (st === 'fault' ? styles.metricValueFault : styles.metricValueDark)}>
                {st === 'ok' ? '12%' : (st === 'fault' ? 'HALT' : 'OFF')}
              </span>
              {st === 'ok' && <div className={styles.cpuBar}><div className={styles.cpuBarFill} /></div>}
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>MEM</span>
              <span className={st === 'ok' ? styles.metricValueOk : (st === 'fault' ? styles.metricValueFault : styles.metricValueDark)}>
                {st === 'ok' ? (which === 1 ? '0x4A' : '0x4B') : 'ERR'}
              </span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>CYC</span>
              <span className={st === 'ok' ? styles.metricValueOk : (st === 'fault' ? styles.metricValueFault : styles.metricValueDark)}>
                {st === 'ok' ? (
                  <Counter 
                    value={49200 + step * 10} 
                    fontSize={10} 
                    padding={0} 
                    textColor="currentColor" 
                    gradientFrom="transparent" 
                    gradientTo="transparent" 
                  />
                ) : '--'}
              </span>
            </div>
          </div>
          {st === 'ok' && (
            <>
              <span className={styles.attitude}>+0.03°</span>
              <span className={styles.panelState}>sending tilt data</span>
            </>
          )}
          {st === 'fault' && (
            <>
              <span className={styles.faultReg}>0x8000</span>
              <span className={clsx(styles.panelState, styles.faultText)}>
                math error · system crashed
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
    </BorderGlow>
  );
}

export default function DualSRIFailure() {
  const [step, setStep] = useState(0);
  const { reducedMotion, setBurnStage } = useExhibit();
  const meta = STEPS[step];

  // Map failure step to burn stage
  const STEP_TO_STAGE = [1, 2, 3, 3, 4];
  useEffect(() => {
    setBurnStage(STEP_TO_STAGE[step] ?? 1);
  }, [step, setBurnStage]);

  const isFault = step >= 1 && step <= 3;
  const noiseAlpha = isFault ? 40 : 10;

  const go = (i) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(step + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(step - 1); }
  };

  return (
    <Scene id="dual-sri" kicker="The redundancy paradox — fifty milliseconds apart">
      <div className={styles.sceneWrapper}>
        {!reducedMotion && (
          <div className={styles.noiseWrapper}>
            <Noise patternAlpha={noiseAlpha} patternScaleX={2} patternScaleY={2} />
          </div>
        )}
        <div className={styles.intro}>
          <h2 className={sceneStyles.title}>Two computers, one bug</h2>
          <p className={sceneStyles.lede}>
            The Ariane 5 rocket carried two navigation computers. The idea was simple: if one breaks, the backup takes over. But there was a catch, they both ran the <em>exact same code</em>. Step through the timeline to see why having a clone doesn't help if they both share the same bug.
          </p>
        </div>

      <div className={clsx(styles.stage, isFault && styles.alarmGrid)}>
        <Panel which={1} step={step} mirror={false} reducedMotion={reducedMotion} />

        <div className={styles.bus}>
          <span className={styles.busLabel}>DATA CABLE</span>
          <div className={clsx(styles.busLine, styles[`busLine_${meta.bus}`])}>
            {meta.bus === 'data' && <span className={styles.busData}>+0.03° · tilt</span>}
            {meta.bus === 'diag' &&
              (reducedMotion ? (
                <span className={styles.busDiagStatic}>0x8B7E · ERROR?</span>
              ) : (
                <FuzzyText
                  fontFamily='"Spline Sans Mono", monospace'
                  fontSize={14}
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
                  0x8B7E ERROR?
                </FuzzyText>
              ))}
            {meta.bus === 'silent' && <span className={styles.busSilent}>— no signal —</span>}
          </div>
          {meta.bus === 'diag' && (
            <span className={styles.busNote}>The main computer thinks this error code is a real steering command.</span>
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
      </div>
    </Scene>
  );
}
