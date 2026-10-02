# STiTy landing page — design record

Extends `STiTy/DESIGN.md` (tokens, voice, Pretendard, mascot rules). This file only records what the
landing page adds or changes.

## Brief
- **Who:** event organizers, lab visitors and professors, students thinking of joining the SKKAI Audio AI session.
- **Scene:** a laptop or phone, daytime, someone sent a link after a talk or a poster session.
- **Promise:** within five seconds, see a Korean sentence become English while it is still being spoken, with the 0.2 s number beside it.
- **Action:** open the live demo; secondary, read the code; organizers contact the team.
- **Category default refused:** dark gradient "AI translator" hero with a glowing waveform and three feature cards.
  The predictable opposite (cream editorial serif) is refused too.

## Direction: Speech balloon (superseded 2026-10-02, kept for history)
- **Thesis:** STiTy's whole product is speech balloons, and its mascots are already cartoon characters. The page is a comics page where the balloons are the real product output.
- **Own world:** ink outlines, speech balloons with tails, yellow narrator caption boxes, Ben-Day dots on the one "waiting" panel, sound-effect lettering.
- User called this out twice: the panel/ground boxing didn't flow continuously, then "the comic approach is really bad." Replaced below.

## Direction: TDS (roll seed cecdcbf45b5daf6e, option B "Transit wayfinding" fused with the real app)
- **Thesis:** the landing page should look like the real STiTy app, not an invented comic aesthetic layered on top of it. `STiTy/DESIGN.md` already defines a full Toss-style system (TDS) — this surface was quietly deviating from it. Pulling the landing page back onto those exact tokens is what "not comic" actually means here, not a new invented palette.
- **Own world:** flat white/paper surfaces, 1px grey-200 borders, soft navy-tinted contact shadows (`--shadow-1/2/3`) on floating things only, blue-600 as the single committed accent, olive-500 reserved for small live/KO marks exactly as the app uses it (never a section fill or bubble fill).
- **Story:** unchanged — it translates while you talk (hero) → why speed matters, as a 3-panel strip → how it commits early → measured numbers → used at real events → bring it to your event.
- **First viewport:** headline, actions and three facts on the left; on the right the 3D phone sits directly on flat paper with a soft contact shadow, S/i and T/T/y mascot crews flanking it, no drawn panel or texture behind it.
- **Signature moment:** unchanged — the scroll story, phone pinned through six steps, mechanically untouched.
- **Strip panels:** the "why" 3-panel strip now reuses the app's real `bubble-mine`/`bubble-peer` spec (grey peer bubble bottom-left tail, blue mine bubble bottom-right tail, 4px corner) instead of drawn speech balloons with ink tails. The "waiting" panel uses `olive-weak` (the app's own live-signal tint) instead of a Ben-Day dot halftone.
- **Said no to:** glow, gradients, fake product UI, invented stats, testimonials, logo strips, scroll fade-ups, ink outlines, comic-line borders, speech-balloon tails, caption-yellow, sound-effect lettering, halftone/dot textures.

## Tokens for this surface
- Colors are **not** landing-specific — they're `STiTy/DESIGN.md`'s own tokens: `--paper #F6F8FB`≈grey-50, `--ink #191F28`=grey-900, `--blue #4268BD`=blue-600 (single accent), `--blue-mark #6080C8`=blue-500 (marks/focus only), `--olive #7A9030`=olive-500 (live/KO marks only, never a fill).
- Elevation: `--shadow-1/2/3`, faint navy (`#0F172A` family), for floating elements only (buttons, mascot/phone contact shadows). Flat by default otherwise — no borders-as-decoration.
- Radius scale: `--r-sm 8 / --r-md 12 / --r-lg 14 (bubbles) / --r-xl 16 / --r-2xl 20`, matching the app's `rounded.*` scale. `--comic-line` and `--r-balloon` removed.
- Display: Pretendard 800, -0.035em, `word-break: keep-all`. One face for the whole page (fixed by the parent brand, not changed here).
- Motion: the product's own tokens (`--dur-fast 120ms`, `--dur-base 200ms`, `--dur-slow 320ms`, `cubic-bezier(0.22,0.61,0.36,1)`). Phone pose is keyframed per step (`src/story/frames.ts`) and damped. Reduced motion keeps the phone still and upright; screens still change per step.

## Assets (all free, no paid generation)
- `assets/m-*.webp`: mascots cut from `STiTy/assets/logo/individual.png` (crop + key + feet cleanup).
- `assets/logo.webp`: keyed from `STiTy_logo_plain_noshadow.png`.
- `assets/event-*.webp`: cropped from `STiTy/assets/image/final_poster.png` (faces already blurred there).

## Proof used and where it comes from
- Latency and COMET: `STiTy/bench/runs/*/summary.json`, FLEURS, runs dated 2026-09-28.
- 0.2 s turn gap: Stivers et al., PNAS 2009. 3–5 s for common STT: team survey on the 2025-2 poster.
- Events: Time debate club session 2025-11-06, IBM Qiskit Fall Fest 2025 with SKKU 2025-11-21 (poster).

## Decision log
- 2026-10-02: user asked to proceed without the direction gate; Rebecca picked option C with the product fusion above.
- Links for the demo and contact are not known yet; they live in `LINKS` in `src/content.ts`. A null link hides its button.
- 2026-10-02: user asked for an Apple-style 3D phone that moves with scroll, a React codebase and GitHub Pages hosting. Rebuilt in Vite + React + TS; phone is code-built in react-three-fiber, screen is real React UI placed with three's CSS3DRenderer (drei `<Html>` did not render under React 19). Static build with `base: "./"`.
- 2026-10-02: user asked for Korean only and a fuller layout. English and the language switch removed. Added the comic panel + mascots behind the phone, per-step detail blocks (facts, listening modes, commit signals, 0.2 s vs 3–5 s bar, speaker legend, event photo; desktop only), the mascot crew in the invite, and tighter section spacing.
- slop_lint WARN `three-up-grid` on `phone-screen.css` is the app's own 3-way segmented control (스피커/이어폰/둘 다), not a feature-card row. Kept.
- 2026-10-02: mascots animated (`src/ui/Mascot.tsx`, Motion). Whole-body only, because each mascot is one flat cutout: breathing idle, talk bob, hop (anticipation squash → stretch → land squash), lean toward the caption screen, a sagging "wait" in strip panel 2, a staggered wave and hover hop on the invite crew. States follow real story events (`src/story/StageCast.tsx`); loops stop offscreen; reduced motion shows still poses. Moving arms or blinking would need the mascots re-cut into separate parts.
- 2026-10-02: full-screen hero added. One pinned canvas (`.showcase-track` → `.showcase-canvas`) spans hero + demo; the phone's start and end come from `.hero-slot` and `.stage-slot` (`src/story/slots.ts`), blended by hero scroll progress, so the hero → demo move is one continuous scroll. Layering: panel (z1) < phone (z2) < mascots (z3), so characters are always in front of the phone.
- 2026-10-02: OT.pdf deck adopted for content and look: blue English section labels (brief-mandated exception to the "no eyebrow" rule), lavender/green requirement cards, grey rounded cards, the rewrite example ("지금 → Right now / 지금 갈게 → I'm on my way"), <SEG> rule-based vs model-based comparison, commit priority chips.
- 2026-10-02: page must stay valid across semesters and backbones. Removed semester- and model-specific material: 26-2 label, Qwen3/GPT names, Whisper journey, LibriSpeech/DailyTalk/FLEURS results, 93.3%, 26-2 plans. Hero facts are now lasting goals (0.5초 미만, 재수정 없음, 자동 감지). The speed bar compares reference points, not our measurements. Events history stays and can grow.
- 2026-10-02: mascots redrawn as code (`src/ui/LetterArt.tsx`), replacing the raster cutouts in every section. Same five letters, colours and personalities (S waves, light T thumbs-up, i points up, green T fist + determined brows, y peace), made chubbier with bigger low-set eyes, blush, open smile, a darker underside and one soft shine stroke. Parts are separate, so they blink (seeded per character), wave, and move their mouths while their line is streaming (`talk` state). `public/assets/m-*.webp` are no longer used by the page.
- 2026-10-02: user rejected the comic direction after two rounds of feedback (panel/ground boxing didn't flow, then "the comic approach is really bad"). Rolled 4 fresh directions (`creative_roll.py deal --mode persuade --platform web --n 4`), presented 3 fused cards, user picked "B. Direction system." Before building, found `STiTy/DESIGN.md` already defines a full Toss-style system the mobile app uses — rebuilt against those exact tokens instead of inventing a new landing palette (see Direction: TDS above). Removed `--caption`/`--comic-line`/`--r-balloon` and every ink-bordered/halftone/speech-balloon class across `global.css`, `sections.css`, `story.css`; Strip panel bubbles now reuse the app's real `bubble-mine`/`bubble-peer` spec. `slop_lint` passes clean (0 FAIL, 0 WARN) across `src/`. Verified live in-browser (not just headless capture): 3D phone, mascots and scroll story all render correctly on the new flat/shadow system.
