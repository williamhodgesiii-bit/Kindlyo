# CHARACTER_BIBLE.md — the cast, Glim & the animation-state contract

> Repository target: `docs/design/CHARACTER_BIBLE.md`
> Source of truth: `assets/prototypes/Character Bible.dc.html` (portraits, expression + pose sheets,
> Glim state sheet, and the full 31-state library, all drawn from one parametric rig).

Five kids and one clubhouse companion, all drawn by **one parametric rig** on the design-system grid
(2.6 heads tall, 2px ink line, six-step skin ramp). Every expression and pose is a **rig state, not
a new drawing**. The prototype figures are working sketches at final proportions; a human
illustrator refines surface detail **without touching the grid**.

## Shared construction

Circle head · rounded-block body · capsule limbs · dot eyes · one 2px mouth stroke · optional 2px
brows & blush. **Emotion = eyes + brows + mouth + pose only** (never face distortion). Kids are 2.6
heads tall; adults 3.4; Glim 1.6 — nobody towers. Eyes sit at ~45% of head height. Every character
is recognizable by silhouette alone.

## Clothing system

Signature top in the character's `llc.cast.*` color — constant everywhere. Bottoms in a shared
neutral `#6E6252`. One **accessory slot** may take the *module accent* in scenes, so kids visibly
belong to the place they're visiting: Maya's hair ties · Theo's glasses · Amara's beads · Jun's
cowlick clip · Nora's card lanyard.

## The five children

| Character | Age | Cast color | Silhouette / shape | Strengths | Growing in | Communicates | Wardrobe accent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Maya** | 8 | `#B85C48` | two round buns; circles-on-circles, bouncy, wide stance | welcoming newcomers, noticing left-out kids, hosting | pausing to listen, asking before hugs | talks fast, thinks aloud, warm touch — learning to ask first | hair ties |
| **Theo** | 6 | `#587F70` | curly mop + round glasses; soft rounded rectangles, tucked | deep listening, noticing feelings, calm one-on-one | joining groups, asking for help | few words with wait-time, drawings, small nods; eye contact optional | glasses frames |
| **Amara** | 9 | `#D8A24C` | crown of braids with beads; tall verticals, crisp, symmetrical | organizing, fairness, including younger kids, saying no | apologies & repair, leaving room for others' ideas | direct and clear; "what's the plan?"; lists on fingers | braid beads |
| **Jun** | 7 | `#5D6FAE` | straight fringe + one cowlick; springy capsules, asymmetric | generosity, cheering others, trying again | waiting for a pause, indoor volume, losing gracefully | loud and fizzy, whole-body talker | cowlick clip |
| **Nora** | 5 | `#5B7086` | round bob with a clip, smallest; compact rounds, self-contained | boundaries ("no thank you" wave), gentleness | asking for help, big-group noise, waiting her turn | picture cards on a lanyard, pointing, waving, short spoken bursts; **no eye contact required, ever** | card lanyard |

**Writing guardrails (never write):** Maya as the loud-bossy-girl trope; Theo "fixed" by becoming
loud (quiet ≠ sad); Amara as the sassy corrector or "mature for her age"; Jun as the running-gag
troublemaker (energetic ≠ trouble); Nora's cards as a limitation or inspiration material — they are
a language, and nobody speaks over or for her without asking. Home cultures are texture, never a
punchline or a lesson topic.

**Rotation rule — everyone does everything.** No character is the permanent mistake-maker or the
permanent example. Across each module's eight lessons every character must, at some point: make a
mistake · help someone · feel uncertain · learn from another · set a boundary · ask for help ·
repair a situation. (The prototype lists concrete per-lesson examples.)

## Glim — the clubhouse lantern (companion, not judge)

An old brass lantern that has hung by the clubhouse door long enough to get curious. Cast color
`#C98F2E`. Glim **can't talk** — it notices, wonders, glows, and lights the way; it asks questions
with a tilt and a wonder-bubble (icon + narrated text), and it **never declares anyone good or bad,
and never dims because of a child's choice.**

- **Guide rules:** asks, never grades · models curiosity first ("I wonder…") · reacts gently and
  briefly · carries transitions (its light leads to the next place) · works with zero spoken
  dialogue.
- **Form rules:** 1.6 heads tall · the **only sanctioned glow** in the system · dot eyes in the
  glass + one mouth stroke · no limbs — expression lives in tilt, hop, and glow intensity.
- **Never:** a bird, an owl, a scorekeeper, or a nag. Glim never blocks the screen, never repeats a
  prompt more than once, and never celebrates louder than the child's own moment.

**Glim states** (`glow` = radial-glow opacity): `dim_rest` (resting glow ~.45, **never** triggered
by a choice) · `glow_notice` (brightens + leans, ~.85) · `wonder_tilt` (10° tilt + bubble, ~.65) ·
`path_light` (leads transitions, ~.95) · `celebrate_small` (one bright hop then rest, ~1.0). Plus
the shared library below where the form allows.

---

## Animation-state contract (one rig, 31 states, every character)

State names are **engineering-stable identifiers** — implement the rig against exactly these names.
Scene feedback uses `helpful_choice · mixed_choice · needs_context`; these are **scene states, never
character states.** No rig state expresses a verdict about the child, and **no state is ever named
`correct`, `wrong`, `failure`, `bad`, or `rude`.**

Each state maps to a Little Motions token (`MOTION.md`) and has a defined reduced-motion fallback.

| State | Group | What the rig does | Token | Reduced motion |
| --- | --- | --- | --- | --- |
| `idle` | core | slow breath (≤ 2% scale), long stillness between | 3s cycle · calm-scene | static |
| `idle_variant` | core | blink + small weight shift, ~every 8s | motion.ui · gentle-enter | static |
| `enter` | core | walks in, settles to idle | motion.scene · calm-scene | fade in |
| `exit` | core | turns, walks out | motion.card · gentle-exit | fade out |
| `walk` | locomotion | capsule-limb swing, no bounce above 2px | per-step 400ms · calm-scene | position slide |
| `sit` | locomotion | folds to seated block | motion.ui · soft-settle | state swap |
| `stand` | locomotion | rises, settles | motion.ui · soft-settle | state swap |
| `wave` | social | one arm to 150°, two swings | motion.reaction · playful | static raised arm |
| `greet` | social | wave + lean + open mouth | motion.reaction · gentle-enter | expression swap |
| `listen` | social | 5° tilt toward speaker, arms rest, eyes to speaker | motion.ui · gentle-enter | static listening pose |
| `speak` | social | hand gesture + mouth cycle | per-line · gentle-enter | static speaking pose |
| `think` | feeling | hand toward chin, eyes up | motion.ui · curious | static thinking pose |
| `notice` | feeling | head turn + brow raise | motion.ui · curious | expression swap |
| `curious` | feeling | lean forward, o-mouth | motion.ui · curious | expression swap |
| `uncertain` | feeling | arms tuck, wobble mouth, worry brows | motion.reaction · gentle-enter | expression swap |
| `encouraged` | feeling | straightens, small smile after support | motion.reaction · gentle-enter | expression swap |
| `disappointed_gentle` | feeling | 2px shoulder drop, flat mouth — brief, never held | motion.reaction · gentle-exit | expression swap |
| `relieved` | feeling | shoulders release, closed-eye soft smile | motion.reaction · soft-settle | expression swap |
| `proud` | feeling | chin up, grin — about own effort, never over others | motion.reaction · soft-settle | expression swap |
| `celebrate_small` | celebration | arms up once, ≤ 6px hop | motion.celebrate · playful | static celebration pose + text |
| `celebrate_module` | celebration | group version, one round, then still | motion.celebrate-module · playful | static group scene + map change |
| `offer_object` | care | arm extends with prop, waits | motion.reaction · gentle-enter | prop appears in hand |
| `receive_object` | care | both hands, small nod | motion.reaction · soft-settle | prop transfers |
| `invite` | care | arm sweeps toward open space | motion.reaction · gentle-enter | gesture pose |
| `join_group` | care | steps in at the edge + small wave | motion.scene · calm-scene | position + wave pose |
| `wait_for_pause` | care | hand half-raised, weight still, watching | hold · static | identical (already still) |
| `ask_permission` | care | palm-up arm + head tilt | motion.reaction · curious | gesture pose |
| `give_space` | care | one calm step back, arms neutral — framed as kindness | motion.ui · calm-scene | position shift |
| `apologize` | repair | bow pose, hold, then eyes up to the other person | motion.reaction · gentle-enter | static apology pose |
| `accept_apology` | repair | nod + soft smile, optional offered hand | motion.reaction · soft-settle | expression swap |
| `ask_for_help` | repair | arm toward a trusted person; Nora's card variant is canonical | motion.reaction · gentle-enter | gesture pose |
| `say_no_confidently` | repair | boundary pose: flat palm, steady eyes, calm mouth — **zero anger coding** | motion.ui · gentle-enter | static boundary pose |

### Expression set (head-only crossfades)

`neutral` · `happy` · `curious` · `uncertain` · `proud` · `gently disappointed`. Reduced motion:
these are the swap targets — a reaction becomes an expression change without body motion.

### Implementation notes

- The rig is **parametric**: skin (ramp step), hair style (buns / curly / braids / fringe / bob),
  cast color, and accessory are inputs; pose = limb rotations + body tilt; expression = eyes + brows
  + mouth. A single `CharacterRig` component with `(character, pose|state, expression, scale)` props
  reproduces every figure in the bible (the prototype's `fig()` / `headOnly()` functions are a
  literal reference implementation you can port).
- These are **CSS/vector-driven state swaps today** — Claude Code can implement all 31 as
  static/transition states directly. Richer continuous motion (breathing idles, walk cycles, the
  celebration hop) is where a **Rive / motion-designer** pass adds polish; until compiled files
  exist, ship the reduced-motion fallback column as the baseline. See `ASSET_MANIFEST.md`.
