import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarField from './background/StarField.jsx';
import Launch from './sections/Launch.jsx';
import MissionBriefing from './sections/MissionBriefing.jsx';
import AboutBinary from './sections/AboutBinary.jsx';
import RegisterRoom from './sections/RegisterRoom.jsx';
import DualSRIFailure from './sections/DualSRIFailure.jsx';
import Postmortem from './sections/Postmortem.jsx';

// Gradient spans the full scroll height so color bands line up with
// section boundaries as the page scrolls. Re-check % stops once every
// section has real content — they'll drift as content grows.
const pageGradient = {
  background: `linear-gradient(
    to bottom,
    #0a1128 0%,
    #4b3f8f 22%,
    #6a8fd8 45%,
    #a9c6f0 70%,
    #cfe6f7 100%
  )`,
};

export default function FatalConversion() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const starOpacity = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0]);

  return (
    <div ref={containerRef} style={{ position: 'relative', ...pageGradient }}>
      <motion.div style={{ position: 'fixed', inset: 0, opacity: starOpacity, zIndex: 0, pointerEvents: 'none' }}>
        <StarField />
      </motion.div>

      <div style={pageGradient}>
        <Launch />
        <MissionBriefing />
        <AboutBinary />       {/* owner: Person B */}
        <RegisterRoom />      {/* owner: Person B */}
        <DualSRIFailure />    {/* owner: Person C */}
        <Postmortem />        {/* owner: Person D */}
      </div>
    </div>
  );
}