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
  return (
    <div style={pageGradient}>
      <Launch />
      <MissionBriefing />
      <AboutBinary />       {/* owner: Person B */}
      <RegisterRoom />      {/* owner: Person B */}
      <DualSRIFailure />    {/* owner: Person C */}
      <Postmortem />        {/* owner: Person D */}
    </div>
  );
}