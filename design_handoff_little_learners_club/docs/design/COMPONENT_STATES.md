# COMPONENT_STATES.md — screens, components & every state

> Repository target: `docs/design/COMPONENT_STATES.md`
> Sources of truth: `assets/prototypes/Lesson Spec.dc.html` (engineering companion, 16 child
> screens), `assets/prototypes/Lesson Prototype.dc.html` (tappable child flow), and
> `assets/prototypes/Parent Experience.dc.html` (14 parent screens, all data states).

Everything here references the Storybook Geometry tokens (`DESIGN.md`) and Little Motions
(`MOTION.md`) — **no screen introduces a one-off value.** New components follow the same content
contracts as the existing ones: no `correct` prop on choices, no `src` on avatars, no score fields.

---

## 1. Component inventory

### Reuse as-is (existing Kindlyo primitives in `src/components`)

`ChildAppShell` · `LessonShell` · `StoryPanel` · `ChoiceList` · `ChoiceCard` · `InlineFeedback` ·
`ProgressBar` · `MissionCard` · `CompletionStepView` · `PrincipleStepView` · `PracticeStepView` ·
`CoachingStepView` · `MissionStepView` · `SceneStepView` · `ParentInsightCard` ·
`ContentStatusBadge` · `Skeleton` · `ErrorState` · `EmptyState` · `LearningPath` ·
`Button / ButtonLink` · `Card`.

### Build new (specified in this doc)

`SplashScreen` · `NeighborhoodMap` · `MapNode` · `ModuleIntro` (sequenced scene player) ·
`SceneStage` (kit + rig) · `CharacterRig` · `AudioNarration + captions` · `GlimBubble` ·
`BottomNav` · `ResumeCard` · `CelebrationBurst` (≤ 8 motif particles) · `NonverbalNote` ·
`MissionSaveToggle`.

---

## 2. Global rules (every screen)

Touch targets ≥ 44×44 with ≥ `space-2` between. One `<h1>` per screen, no skipped levels. Focus
moves to the **step region** on step change (not on first render). Nothing is conveyed by color
alone. No `correct/wrong/rude` anywhere. Data per child profile: `run {stepIndex, choiceBySceneId,
practiceOptionId}` (version-strict), `completion {at}` (survives content revisions),
`missionStatus` (parent-set). **No free-form child text is ever stored.**

---

## 3. Child lesson flow — 16 screens (Hello Garden · "Saying Hello")

### 01 · App launch
- **Composes:** `SplashScreen` (wordmark + Glim `dim_rest → glow`). No shell.
- **Layout:** full-bleed canvas, centered stack; identical phone/tablet, art scales.
- **Interactions:** any tap or 1.5s auto-advance → Clubhouse; skippable always.
- **States:** cold-start only — not shown on resume from background.
- **Motion:** `motion.intro` 900 · `calm-scene`, one fade+rise, no loop. **Reduced:** 240ms opacity fade; Glim static.

### 02 · Clubhouse home
- **Composes:** `ChildAppShell` · `Card` (continue) · `ProgressBar` · `MissionCard` · new `BottomNav`, `GlimBubble`.
- **Layout:** scroll column; continue-card on a **level-2 paper-offset**; bottom nav pinned. Tablet: same column, wider gutters, larger art.
- **Interactions:** continue-card → Learning path; nav = Clubhouse / Map / Me; mission read-only here.
- **States:** returning (resume card) · **new profile → empty continue-card** ("Start your first lesson"), no mission yet.
- **Motion:** continue-card enters `motion.card` 240 gentle-enter, +120ms after header. **Reduced:** no rise; Glim bubble static.

### 03 · Neighborhood map
- **Composes:** new `NeighborhoodMap`, `MapNode`; `ChildAppShell`.
- **Layout:** vertical node trail on phone; free 2D layout on tablet; current node scrolls to center on mount.
- **Interactions:** tap current/next node → that module's path; later nodes are information, not buttons.
- **`MapNode` states:** `hub` · `current` (breathes once, `idle_variant`) · `next` ("up next") · `later` ("a little later"). New-profile: Hello Garden available, rest "a little later" — never a demerit.
- **A11y:** state in **text + shape** ("Exploring · 1 of 8", "up next", "a little later"), never hue alone.
- **Motion:** screen `motion.scene` calm-scene; current node breathes once. **Reduced:** no breathe.

### 04 · Module introduction
- **Composes:** new `ModuleIntro` (sequenced scene player) reusing the scenery kit + `CharacterRig`.
- **Layout:** full-bleed scene; title chip lower third; same composition both devices.
- **Interactions:** auto-plays ≤ 8s; tap advances a beat; "Skip intro" after first view (stored per module).
- **States:** first-visit (full six beats) vs return (auto-skips to path).
- **Motion:** the six beats per `MODULE_WORLDS.md §1`. **Reduced:** five still frames, same narration; "travel" = map-position change.
- **Data:** writes `hasSeenIntro[moduleId]`; never blocks progress.

### 05 · Learning path
- **Composes:** `LearningPath` · `ProgressBar` · `ContentStatusBadge` · new `PathNode`.
- **Layout:** vertical nodes + connectors; sticky module header with back-to-map. Tablet: two columns of nodes.
- **`PathNode` states:** `locked` · `available` · `in-progress` (`current`) · `complete` · `unwritten` ("being written"). Locked renders a plain-language reason ("Finish lesson 2 first"), no press.
- **Interactions:** available/current → LessonRunner. **Data:** `buildModulePath(module, getLesson, progress)` is pure; completing unlocks the next only.
- **A11y:** draft badge visible; locked in words + lock icon. **Motion:** nodes stagger `motion.card` gentle-enter; complete→unlock uses `soft-settle` once. **Reduced:** no stagger.

### 06 · Lesson · scene (situation + interaction)
- **Composes:** `LessonShell` · `StoryPanel` · new `SceneStage` (kit + rig), `AudioNarration`.
- **Layout:** phone — scene upper, narration bar below, one "Carry on". **Tablet — two-pane** (scene ‖ narration/controls).
- **Interactions:** "Carry on" advances; narration play/pause/replay; CC toggles a transcript; illustration is decorative (`aria-hidden`).
- **States:** scene beats derived from `lesson.scenes` (a lesson with more beats gets more scene steps).
- **Motion:** scene enters `motion.scene` calm-scene; characters `idle`; narration pauses ambient motion. **Reduced:** 240ms fade; `idle` static, no loops.

### 07 · Lesson · choice
- **Composes:** `ChoiceList` + `ChoiceCard` (**no `correct` prop, ever**) · new `NonverbalNote`.
- **Layout:** serif prompt + stacked choice cards; a persistent note offers wave/card. Tablet: cards beside the scene.
- **`ChoiceCard` states:** `unselected` · `selected` (`aria-pressed`, check, `motion.ui` soft-settle). A choice can be changed freely; other cards never dim or reflow (exploring is allowed).
- **Interactions:** tap selects; "Carry on" enabled only after a pick. Buttons in a labelled list, Tab+Enter — **not radios** (arrow keys would commit on explore).
- **Nonverbal mode:** choices reworded (e.g. "…wave or show your hello card"); note becomes an affirming line.
- **Motion:** cards enter one at a time `motion.card` +60ms stagger, after narration. **Reduced:** appear together; selection = border/check swap.
- **Data:** `run.choiceBySceneId[sceneId] = optionId`.

### 08 · Lesson · consequence
- **Composes:** `InlineFeedback` (`helpful | mixed | needs-context`) · `SceneStage` (consequence variant) · `GlimBubble`.
- **Layout:** inline **below** the choices — stays on screen (not a toast); scene updates to reflect the choice.
- **`InlineFeedback` states:** `helpful` · `mixed` · `needs_context` — **no failure state exists.** Tone = icon + text label + color, never color alone; **identical motion weight across all three.**
- **Interactions:** read-only; Glim poses a question (never a verdict); child may go back and try another choice.
- **Motion:** `motion.reaction` gentle-enter; needs-context adds a 200ms thoughtful hold; character settles. **Reduced:** 240ms fade after the same hold; scene = state swap.
- **A11y:** `role=status` / `aria-live=polite`.

### 09 · Lesson · principle
- **Composes:** `PrincipleStepView` · Glim (`curious`).
- **Layout:** quiet centered layout; all other motion paused; serif principle + one supporting line (many greeting forms).
- **Interactions:** "Let's practise" advances; no choices. **States:** single state.
- **Motion:** `motion.scene` calm-scene; otherwise still (Explain). **Reduced:** 240ms fade.

### 10 · Lesson · guided practice
- **Composes:** `PracticeStepView` · `ChoiceList` · `InlineFeedback`.
- **Layout:** prompt + option cards, same anatomy as the choice step (consistency by design).
- **States:** `unselected` · `fitting` · `not-yet-fitting` (gentle "try another"). "Carry on" enabled when the fitting option is chosen; retry encouraged, never blocked (`canAdvance=false` until picked, reason shown in words beside the disabled button).
- **Motion:** feedback `motion.reaction` gentle-enter; selection soft-settle. **Data:** `run.practiceOptionId`.

### 11 · Lesson · offline mission
- **Composes:** `MissionStepView` · `MissionCard` · new `MissionSaveToggle`.
- **Layout:** mission card on a paper-offset; a muted "For grown-ups" line; add-to-missions toggle.
- **`MissionSaveToggle` states:** `not-added` · `added` ("Saved to your missions").
- **Interactions:** "Reveal" (`motion.card` 16px rise); toggle marks intent; "Finish lesson" advances; skippable without blocking.
- **Data:** `missionStatus` is parent-owned; the child "add" sets a suggestion flag only.

### 12 · Lesson · completion
- **Composes:** `CompletionStepView` · Glim (`celebrate_small`) · new `CelebrationBurst` (≤ 8 motif particles).
- **Layout:** centered — Glim, headline, one-line garden change, position chip, primary return + "Play again".
- **States:** `first-completion` vs `replay` (no new achievement, still celebrated softly).
- **Interactions:** "Back to Hello Garden" → path (**live immediately, never gated**); "Play again" replays the burst only.
- **Motion:** `motion.celebrate` 600 playful, single emission, then still. **Reduced:** static badge + progress text change; no particles.
- **Data:** writes `completion{at}`; updates module path; run may be replayed without re-locking.

### 13 · Loading
- **Composes:** `Skeleton` · Glim (`dim_rest` breathing).
- **Layout:** centered Glim + "Getting Hello Garden ready…" over skeleton bars of the incoming layout.
- **States:** ≤ 3 breathe cycles, then a still frame + text; if still pending → error path.
- **A11y:** `role=status` `aria-live=polite` announces "Loading" once; skeleton hidden from AT. **Reduced:** static lantern + text.

### 14 · Interruption / resume
- **Composes:** new `ResumeCard` · `GlimBubble`.
- **Layout:** "Welcome back" bubble + a card naming the saved step; "Keep going" primary, "Start over" secondary.
- **States:** `valid-run` (resume offered) · `stale/older-version` (fresh start, no scary message). Plain-language position ("Step 3 of 7").
- **Interactions:** Keep going → saved `stepIndex`; Start over → step 0 (answers cleared). Nothing auto-decides.

### 15 · Recoverable error
- **Composes:** `ErrorState` (live) · Glim.
- **Layout:** calm centered card — Glim, "That part didn't load", reassurance, "Try again" + "Back to the clubhouse".
- **States:** single recoverable state (fatal errors route to a separate boundary, out of scope here).
- **Interactions:** Try again → Loading; secondary returns home; place preserved.
- **A11y:** `role=alert` only because it follows an action; **no big ✕, no blame wording, no red flood**; contrast holds. **Motion:** `motion.card` gentle-enter, like any card. **Reduced:** 240ms fade.

### 16 · Parent coaching prompt
- **Composes:** `ParentInsightCard` · `CoachingStepView` · `MissionCard`.
- **Layout:** sand "For grown-ups" card in the **parent area** (never mid-lesson): the coaching question + this week's mission with mark-practised.
- **States:** `post-lesson` (prompt shown) · `no-activity` (empty state, no nagging).
- **Interactions:** parent reads, marks the mission practised or "not yet"; read-only about the child's choices.
- **Motion:** parent motion is quieter — `motion.ui` gentle-enter crossfades only; no character motion. **Reduced:** instant crossfade.
- **Data:** reads `completion` + `needs_context` moments for "worth talking about"; writes `missionStatus`.

---

## 4. Parent experience — 14 screens

Same brand, quieter register: calm editorial layout, plain language, fast functional transitions, no
characters. Phone uses a bottom nav (Progress / Missions / Skills / Account); **tablet adds a left
rail + two-column dashboard.**

| # | Screen | Purpose & key states |
| --- | --- | --- |
| 1 | **Parent onboarding** | 3 calm steps (what it is · how it works · safety first). `noNav`. |
| 2 | **Account welcome** | first run after sign-up; private-by-default reassurance → add first child. |
| 3 | **Create child profile** | nickname + age band only (`5` / `6–7` / `8–9`); up to 3 children, a 4th blocked kindly, no upsell. |
| 4 | **Child selector** | one child at a time — never a sibling comparison. |
| 5 | **Progress** | dashboard: progress bar, next up, current mission, worth-talking-about, recent skills, last used. **Data states: `normal` · `empty` · `loading` · `error`.** No score anywhere. |
| 6 | **Current mission** | this week's mission + a prompt for afterwards; "Mark practised together" / "Not yet" → quiet success toast. |
| 7 | **Skills** | skill areas with status chips — describing lessons, not the child. |
| 8 | **Ready to review** | lessons been through once; revisiting encouraged and never re-locks. |
| 9 | **Conversation prompt** | one "worth talking about" moment, framed try-together, never a correction. |
| 10 | **Privacy & account** | product-emails / analytics (first-party only) toggles, export, danger zone, plan link. |
| 11 | **Delete child profile** | clear consequences, offer to delete just progress, calm confirm. Uses `danger` `#A34141`. |
| 12 | **Delete account** | removes everything; undoable warning; sign-out offered as a gentler option. |
| 13 | **Subscription** | family plan, placeholder pricing (billing not live in beta); "Continue to payment" opens the parental gate. |
| 14 | **Safe return** | no link to account/billing inside the child area; leaving opens the gate. |

### Shared parent-surface states & rules

- **Status chips (fixed vocabulary):** `Practised` (sage) · `Exploring` (honey) · `Ready to review`
  (blue) · `Not started yet` (paper). No goodness/politeness/behavior/obedience score exists.
- **Toast:** quiet success confirmation after actions (auto-dismiss ~2.4s), sage fill.
- **Parental gate & safe return:** any exit to the open web or a purchase sits behind the **"Ask a
  grown-up"** gate — a **written multi-step answer** (e.g. "seven plus five") a young child can't tap
  through. The child area has **no link** to account, billing, or settings. Two gate purposes:
  `purchase` (before payment) and `return` (to leave the child area).
- **Empty / loading / error:** every data surface has all three, framed calmly ("Nothing here yet…",
  `role=status` loading, blame-free `role=alert` error with "Try again").
