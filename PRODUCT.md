# Product

## Register

brand

## Users

Museum visitors and CSARCH2 (Computer Architecture) students moving through a
shared virtual museum on their own screens, at their own pace, often on a first
scroll-through with no prior context on the Ariane disaster. Their job: to *feel*
and then *understand* how a single unchecked 64-bit → 16-bit conversion destroyed a
rocket four decades in the making — walking away able to explain binary
representation, signed integers, fixed-width register overflow, and why hardware
dual-redundancy did not save the flight. Secondary audience: the instructor
assessing the exhibit, and the other groups whose exhibits merge into the same
museum alongside this one.

## Product Purpose

An immersive, scroll-driven exhibit — **"FATAL CONVERS10N: The Ariane Flight V88
Catastrophe"** — that re-stages the 1996 Ariane 5 explosion as a teaching
instrument. It exists because the concepts (two's complement, overflow, redundancy
failure) are abstract on a slide but visceral when you watch the register that
killed the rocket wrap in front of you. Success is a visitor who scrolls the whole
narrative, operates the interactives (the overflow visualizer, the mission-briefing
scrubber, the dual-SRI panels, the post-mortem cards), and leaves able to retell
the failure chain in their own words — and an exhibit whose voice holds up when
dropped into the merged museum next to everyone else's.

## Brand Personality

**Forensic. Engineered. Ominous.** The voice of a mission-control console narrating
a catastrophe, and of an accident inquiry board writing it up afterward — precise,
sober, technically literal, respectful of a real disaster. Calm on the surface with
mounting dread underneath: the environment grows unstable as the story approaches
T+36.7 seconds. It never jokes, never gamifies, never celebrates the failure; the
gravity is the point.

## Anti-references

- **Dry textbook / lecture slides.** No wall of static prose, bulleted takeaways, or
  captioned diagrams sitting inert on the page. If a concept can be staged as a
  live, operable mechanism, it must be — a PowerPoint in a browser is the failure
  state.
- **Generic SaaS landing page.** No hero-metric template (big number + small label +
  supporting stats), no identical icon-heading-text card grid repeated down the
  page, no tiny uppercase tracked eyebrow above every section, no gradient text, no
  glassmorphism-by-default. The aerospace-telemetry aesthetic must read as *earned
  and specific*, not as a dark-mode marketing skin.
- Corollary to both: also avoid sci-fi-costume kitsch (neon-everything, Matrix rain,
  Star-Trek-HUD parody). The technical look has to mean something — it mirrors the
  real instrumentation of the flight, it is not decoration.

## Design Principles

1. **The failure is the teacher.** Every interaction re-stages the actual bug — the
   64→16 cast, the wrap to −32,768, the twin SRIs shutting down. Drama serves the
   lesson; the lesson is never a caption bolted onto spectacle.
2. **Instability is felt, not stated.** One shared instability value bleeds into the
   whole environment (heat blooms, grain, fading stars, the telemetry meter) so the
   visitor experiences system stress rising toward the catastrophe rather than
   reading that it happened.
3. **Forensic gravity.** Hold the tone of an inquiry board: literal, unhurried,
   unsentimental about a real loss. No jokes, no confetti, no victory framing.
4. **Earn attention through pacing.** One dominant idea per fold, a long deliberate
   scroll, choreographed reveals that fit what they reveal — never fade-in-on-scroll
   applied uniformly to every section.
5. **Survive the merge.** This exhibit will be absorbed into a shared museum. Keep a
   coherent, self-contained visual voice that stays legible and distinct when it
   sits next to other groups' work — consistency of voice over consistency with
   neighbours.

## Accessibility & Inclusion

Target **WCAG 2.2 AA**. Body text ≥ 4.5:1 against its (dark) background, large text
≥ 3:1; full keyboard operability for every interactive with a visible focus
indicator; a `prefers-reduced-motion` alternative for every animation (the ambient
instability system already honours this). Status is never encoded by colour alone —
the red/amber/green telemetry states must also carry text or shape so the
overflow/failure/nominal distinction survives colour-blindness. Interactives expose
their live values to assistive tech rather than relying on the visual readout.
