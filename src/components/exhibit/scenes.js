// Canonical scene list — shared by the orchestrator (scroll tracking) and the HUD
// (scene label + nav dots). Order and ids must match the section anchors.
export const SCENES = [
  { id: 'launch', name: 'Launch' },
  { id: 'mission-briefing', name: 'Mission Briefing' },
  { id: 'about-binary', name: 'Binary Basics' },
  { id: 'register-room', name: 'Register Room' },
  { id: 'dual-sri', name: 'Dual SRI Failure' },
  { id: 'postmortem', name: 'Postmortem' },
];
