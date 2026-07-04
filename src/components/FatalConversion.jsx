import { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { ExhibitProvider } from './exhibit/ExhibitState.jsx';
import Backdrop from './exhibit/Backdrop.jsx';
import TelemetryHUD from './exhibit/TelemetryHUD.jsx';
import { SCENES } from './exhibit/scenes.js';
import Launch from './sections/Launch.jsx';
import MissionBriefing from './sections/MissionBriefing.jsx';
import AboutBinary from './sections/AboutBinary.jsx';
import RegisterRoom from './sections/RegisterRoom.jsx';
import DualSRIFailure from './sections/DualSRIFailure.jsx';
import Postmortem from './sections/Postmortem.jsx';
import styles from './FatalConversion.module.css';

export default function FatalConversion() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [active, setActive] = useState(0);

  // Track the scene crossing viewport-center to label the HUD.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = SCENES.findIndex((s) => s.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    SCENES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <ExhibitProvider scrollYProgress={scrollYProgress}>
      <Backdrop />
      <div ref={containerRef} className={styles.flow}>
        <Launch />
        <MissionBriefing />
        <AboutBinary />
        <RegisterRoom />
        <DualSRIFailure />
        <Postmortem />
      </div>
      <TelemetryHUD activeIndex={active} />
    </ExhibitProvider>
  );
}
