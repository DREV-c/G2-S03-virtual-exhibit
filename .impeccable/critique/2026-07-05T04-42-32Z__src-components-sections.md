---
target: src/components/sections
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-07-05T04-42-32Z
slug: src-components-sections
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Persistent telemetry HUD (scene, T+ clock, live register, integrity), active states, playhead, step dots — exemplary |
| 2 | Match System / Real World | 3 | Aerospace language mostly explained; SRI/OBC/BH acronyms land before full definition |
| 3 | User Control and Freedom | 3 | Scrubber prev/next + drag + keyboard, step dots, replay; no global reset but not needed |
| 4 | Consistency and Standards | 2 | Typography split: hero + OVERFLOW + diag word still render in the OLD fonts while every heading is Chakra Petch; plus ban-list patterns (side-stripe cards, gradient text) |
| 5 | Error Prevention | 3 | Inputs clamped; no destructive actions; n/a-heavy |
| 6 | Recognition Rather Than Recall | 3 | Inline hints ("Click any bit", "Tap a card"), legends, place labels |
| 7 | Flexibility and Efficiency | 3 | Keyboard nav on scrubber + steps, drag-scrub, replay, HUD scene dots |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and focused; every-section eyebrow+number scaffold and 3-up concept grid read slightly template |
| 9 | Error Recovery | 3 | No error surfaces; graceful reduced-motion fallbacks throughout |
| 10 | Help and Documentation | 3 | Contextual teaching copy at each decision point; no global help (fine for an exhibit) |
| **Total** | | **30/40** | **Good — solid foundation, address the consistency + slop tells** |

## Anti-Patterns Verdict

**Does this look AI-generated? Mostly no — but it carries 3–4 removable tells.**

**LLM assessment:** This is genuinely characterful work — a shared instability system, FuzzyText canvas titles, a real telemetry HUD, a committed cyan/amber/red aerospace palette, and a true narrative arc (calm → dread → catastrophe → sober postmortem). It does not read as generic dark-mode SaaS. The tells that remain are specific and structural: (1) **every** section carries BOTH a numbered marker (02/03/04/05/06) AND a tiny uppercase tracked mono eyebrow — the two "AI scaffolding" bans stacked on one element; (2) severity side-stripe borders on the briefing cards; (3) gradient-clipped text in the reduced-motion hero; (4) a 3-up icon-less concept card grid in About Binary. None are fatal; all are the fingerprints on an otherwise distinctive page.

**Deterministic scan (detect.mjs, 3 findings):**
- `gradient-text` — `Launch.module.css:46` (`.titleStatic`, reduced-motion hero). Confirmed; matches an absolute ban.
- `side-tab` — `MissionBriefing.module.css:155` (`.card` `border-left: 3px`, colored per severity). Confirmed real, NOT a false positive — and redundant with the `sevBadge` the card already shows.
- `layout-transition` — `MissionBriefing.module.css:36` (`transition: width` on the progress fill). Minor; `transform: scaleX` would be smoother.

**Detector caught what the review under-weighted:** the side-stripe severity border. **Review caught what the detector cannot:** the three hardcoded old font families inside the FuzzyText JSX props (canvas text, invisible to a CSS scan) — the highest-impact issue and a direct regression from the recent font swap.

## Overall Impression

Strong, atmospheric, and pedagogically clear — the instability-drives-everything idea genuinely works, and the Register Room centerpiece earns its density. The single biggest opportunity: **finish the font migration** so the most prominent moment on the page (the hero) stops contradicting the type system, then shave the 3 structural AI tells. This moves it from "good student exhibit" to "museum-grade."

## What's Working

1. **The telemetry HUD as a persistent system-status layer** — scene, T+ clock, live hex/decimal register, and integrity meter give constant orientation. This is the strongest single design decision.
2. **Emotional choreography via one shared instability value** — heat blooms, grain, fading stars and the integrity meter all rise together toward T+36.7. Motion serves meaning, not decoration.
3. **Accessibility baked in, not bolted on** — sr-only h1, `aria-pressed`/`aria-valuetext`, keyboard scrubbing, and a `reduced-motion` alternative for every animated element.

## Priority Issues

- **[P1] Hero + interactives still render in the OLD fonts.** Three FuzzyText instances hardcode families the swap was meant to remove: `Launch.jsx:27` (`"Space Grotesk"`, the hero), `RegisterRoom.jsx:182` (`"Space Grotesk"`, OVERFLOW), `DualSRIFailure.jsx:96` (`"JetBrains Mono"`, the diag word). Result: the biggest headline on the page is a different typeface than every section heading, and only the reduced-motion fallbacks are on-brand.
  - **Why it matters:** the hero is the first and strongest impression; the mismatch quietly undermines the whole type system and the "consistent voice for the museum merge" principle.
  - **Fix:** point those props at the new families (Chakra Petch for the two display titles, Spline Sans Mono for the diag word). FuzzyText takes a literal `fontFamily` string, so pass `'"Chakra Petch", sans-serif'` / `'"Spline Sans Mono", monospace'`.
  - **Suggested command:** /impeccable typeset

- **[P2] Every section stacks both AI-scaffolding bans.** The `Scene` kicker renders `02 · MISSION BRIEFING · FLIGHT V88 TIMELINE` — a numbered marker AND a tiny uppercase tracked eyebrow, on all five inner sections. The code comment defends the numbers as a "typed sequence," but About Binary (03) is a concept interlude, not a timeline beat, so the sequence claim is thin, and doubling it with the tracked-caps eyebrow is the exact tell the bans name.
  - **Why it matters:** it's the most recognizable "AI made this" signature on an otherwise original page.
  - **Fix:** pick one cadence — either the number as a quiet index OR a named label, not both-as-uppercase-tracked. Consider letting the H2 carry the section and dropping the eyebrow entirely on the concept sections.
  - **Suggested command:** /impeccable typeset

- **[P2] Side-stripe severity borders on the briefing cards.** `MissionBriefing.module.css:155` — 3px colored `border-left` switched green/amber/red by severity. Absolute ban, and redundant: the card already renders a `sevBadge` ("Nominal/Fault/Critical") that carries the same signal with a text backup.
  - **Why it matters:** it's a top AI tell, and the color-only stripe fails the "no meaning by color alone" bar the badge already satisfies.
  - **Fix:** drop the left stripe; if the card needs a severity tint, tint the full border or the background wash, and lean on the badge.
  - **Suggested command:** /impeccable polish

- **[P2] Body-text contrast needs verification against the AA commitment.** `--muted-silver` (`rgba(201,209,217,0.62)`) carries most lede/caption/detail copy on near-black; several finer labels drop to `0.45–0.42` alpha. PRODUCT.md commits to WCAG 2.2 AA (≥4.5:1 body).
  - **Why it matters:** dim silver on space-black is exactly the "light gray for elegance" trap; sub-AA body text is the most common real accessibility failure.
  - **Fix:** measure the actual ratios; bump body copy toward `--ariane-silver` (full `#C9D1D9`) and reserve the low-alpha tints for large or decorative text only.
  - **Suggested command:** /impeccable audit

- **[P3] Reduced-motion hero uses gradient-clipped text.** `Launch.module.css:45–48` (`.titleStatic`). Only the accessible/reduced path, but still a banned decorative pattern.
  - **Fix:** solid cyan (or amber), emphasis via weight/size; keep the `10` accent as a solid color swap, not a gradient.
  - **Suggested command:** /impeccable polish

## Persona Red Flags

**Jordan (First-Timer):** Acronyms **SRI, OBC, BH** appear in the Mission Briefing and Register Room before any of them is expanded in plain language; a first-timer meets "horizontal bias BH" with no anchor. The `role="slider"` timeline is discoverable thanks to the visible Prev/Next, but the initial affordance ("this track is draggable") is carried only by the arrows.

**Sam (Accessibility-Dependent):** Strong overall — keyboard scrubbing, `aria-valuetext`, reduced-motion paths, focus-visible ring. Two flags: (1) the `--muted-silver`/low-alpha body contrast above; (2) `DualSRIFailure` puts `tabIndex={0}`+`onKeyDown` on the `.steps` group *and* renders each dot as a focusable `<button>`, so arrow-key handling and native button focus can double up — verify the keyboard model isn't confusing with a screen reader.

**Museum Visitor (project persona — CSARCH2 student on the merged museum):** The exhibit assumes a full uninterrupted scroll and a fixed bottom HUD; when merged next to other groups' exhibits, confirm the fixed HUD and 100vh sections don't fight a shared museum chrome. The narrative also assumes the visitor arrives at the top — deep-linking to `#register-room` drops them into the densest fold with no lede context.

## Minor Observations

- Register Room is the densest fold (register + cast pipeline + slider + odometer + overflow badge, ~7 visual zones at once). It works because it's the centerpiece and well-grouped, but it's the one place germane load peaks — watch it if you add anything.
- About Binary's three `.concept` blocks are a near-identical card row; fine, but the flattest moment on the page compositionally.
- `Placeholder.module.css` still hardcodes `Lora Variable` — leftover; unused by shipped sections but worth removing in cleanup.

## Questions to Consider

- What if the hero committed fully to Chakra Petch and the cyan→amber ramp were expressed as a per-letter *solid* color march (nominal→warning) instead of a gradient — meaningful, and off the ban list?
- Does every section need a kicker at all, or would the exhibit feel more confident letting two or three H2s stand alone?
- Is the section numbering telling the visitor something they need, or is it there because "exhibits have sections"? If you removed it, would anyone be lost?
