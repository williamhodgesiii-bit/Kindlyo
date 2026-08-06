# MODULE_WORLDS.md — the Neighborhood

> Repository target: `docs/design/MODULE_WORLDS.md`
> Source of truth: `assets/prototypes/Module Worlds.dc.html` (map, kit, and all 12 storyboards).

Twelve module worlds, each a place in one living neighborhood, introduced by one repeatable
six-beat formula and built from one shared scenery kit. **Reuse target: by scene instance, ≥ 80% of
drawn elements are kit parts; each world adds at most four unique assets.** Cultural difference is
represented as variation between homes, tables, and gardens — never as one standard with exceptions.

---

## 1. Module-introduction formula (same six beats, every world)

1. **On the map** — the neighborhood map, this world's node breathing once. `motion.scene · calm-scene`
2. **Travel** — Glim's light leads along the path; the landmark grows nearer. `motion.intro · calm-scene`
3. **Landmark wakes** — the world's signature ambient motion starts; the place is alive. `motion.intro · gentle-enter`
4. **One small moment** — a short social interaction previews what this world teaches. `motion.reaction · gentle-enter`
5. **Title reveal** — motion quiets; the module title arrives with narration. `motion.card · gentle-enter`
6. **Into the path** — crossfade to the learning path, first lesson glowing. `motion.scene · calm-scene`

Whole intro ≤ 8s, skippable after first viewing, fully narrated. **Reduced motion:** five still
frames with the same narration; "travel" becomes a map-position change.

---

## 2. Environment construction contract (6 layers, always)

Every scene panel (`radius-xl`) is assembled bottom-up:

1. **Wash** — `module.tint` fills the panel.
2. **Far shapes** — `module.tint-deep`, big soft silhouettes, **no outline**.
3. **Landmark & props** — `module.accent` + `accent-soft`, 2px ink outline, built from the kit:
   circle, block, capsule, diamond, arch.
4. **Ground band** — `paper` tone with a 2px ink top rule.
5. **Characters** — standing on the ground band (2px ink line; see `CHARACTER_BIBLE.md`).
6. **UI** — narration bar, prompts, cards. **Never inside the scene.**

Max **3 accent-hue elements** per scene. The motif shape may repeat as decoration (≤ 5 instances).
Complex final art is an illustrator deliverable — layout ships with kit scenes marked as
placeholders (see `ASSET_MANIFEST.md`).

### Shared scenery kit — the ~80% (26 parts, drawn once, themed by module variables)

ground band · hill silhouette (2 sizes) · path dots · canopy circle · trunk capsule · bush circle ·
block (3 sizes) · arch · diamond · plank capsule · door · window · table · chair · bench · jar ·
dish set · cloud · motif particle system · title chip · lesson-path nodes · narration bar ·
choice cards · character rig (×5 kids) · Glim · celebration ring.

**Accounting rule:** a scene averaging 20 drawn elements may use at most 4 module-unique ones.
Any unique asset a second module wants is **promoted into the kit**.

---

## 3. Accent assignments

Adjacent worlds on the map never share a hue family. `accent-strong` (text-safe, ≥ 4.5:1 on
surface) is a darker step of the same hue; three are proven in the design system
(Hello Garden `#3F6A5D`, Pixel Plaza `#47558C`, Brave Basecamp `#8A5A1C`) and the rest are derived
the same way at implementation.

| # | World | accent | accent-soft | tint | tint-deep | motif |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hello Garden | `#587F70` | `#9DB8AC` | `#E7EEE7` | `#D5E2D6` | petal |
| 2 | Echo Treehouse | `#47808A` | `#8FB4BB` | `#E4EDEE` | `#CFDFE1` | echo ring |
| 3 | Friendship Forest | `#7A8040` | `#AEB37E` | `#EDEEDF` | `#DDDFC5` | leaf |
| 4 | Build-It Workshop | `#B26B3A` | `#D6A379` | `#F4EAE0` | `#E8D6C4` | brick |
| 5 | Bridge Builders Bay | `#4E7A9B` | `#8FAEC5` | `#E5ECF2` | `#D0DEE8` | wave |
| 6 | Thankful Kitchen | `#C29237` | `#DDBA79` | `#F6EEDC` | `#EBDDBC` | steam curl |
| 7 | Welcome Home | `#8A5E74` | `#B693A6` | `#F1E8ED` | `#E2D2DB` | mat stripe |
| 8 | Community Town | `#A85D62` | `#C99295` | `#F4E9EA` | `#E7D3D4` | crosswalk stripe |
| 9 | Sunny Table Café | `#D9A44A` | `#EBC98D` | `#FAF1DE` | `#F0E0BC` | sun ray |
| 10 | Pixel Plaza | `#5D6FAE` | `#A5B0D6` | `#E6EAF5` | `#D2D9EC` | pixel |
| 11 | Brave Basecamp | `#B0782A` | `#D8B075` | `#F2E8D3` | `#E6D8B8` | compass diamond |
| 12 | World Garden | `#7D6CA6` | `#AC9FC9` | `#EDE9F4` | `#DDD5EA` | mixed petals |

**Known flag:** Thankful Kitchen (saffron) and Sunny Table Café (gold) sit in nearby hue families —
acceptable because they are non-adjacent on the map, but final art should push Kitchen warmer and
Café lighter.

---

## 4. The twelve worlds

Each world lists what it **teaches**, its **landmark** and **environment**, **ambient motion**,
**completion** payoff, **props**, the primary character **interactions** (animation states, see
`CHARACTER_BIBLE.md`), **reduced-motion** substitution, **a11y** watch-item, **culture & safety**
note, and its **shared / unique** asset split.

### 1 · Hello Garden — sage · petal
- **Teaches:** greetings & introductions — noticing people and letting them know you're ready to connect.
- **Landmark:** greeting arch with bloom bushes at the garden gate. **Environment:** arch, bush circles, flower dots, path, hills, ground band.
- **Ambient:** blooms slowly turn toward whoever arrives (3s, calm-scene). **Completion:** one arch bloom opens per practised lesson; full arch at module end.
- **Props:** hello cards, watering can, gate bell. **Interactions:** `wave`, `greet`, `join_group` — Nora's no-thank-you wave is canon here.
- **Reduced motion:** blooms swap to open state; no turning. **A11y:** petal motion near the narration bar pauses during speech.
- **Culture & safety:** bow, wave, nod, hello card shown as equal greetings; no forced handshakes, hugs, or eye contact.
- **Shared:** arch, bushes, hills, path dots, ground band. **Unique (≤4):** bloom set (3 states), gate bell.

### 2 · Echo Treehouse — teal · echo ring
- **Teaches:** conversation & listening — taking turns, waiting for pauses, showing you heard.
- **Landmark:** broad tree with plank treehouse and listening-leaf canopy. **Environment:** trunk, canopy circles, house block, ladder rungs, hills.
- **Ambient:** leaves shimmer while someone speaks; go perfectly still to listen. **Completion:** a paper lantern lights in the canopy per lesson.
- **Props:** speech-dot bubbles, rope ladder, cushion. **Interactions:** `listen`, `speak`, `wait_for_pause`.
- **Reduced motion:** leaves swap between two static states; speech dots appear without drift. **A11y:** turn-taking must be captioned, never carried by motion alone.
- **Culture & safety:** pause length and friendly overlap differ by family — both named as styles, not errors.
- **Shared:** trunk, canopy, block, hills, ground band. **Unique:** listening-leaf cluster, lantern string.

### 3 · Friendship Forest — olive · leaf
- **Teaches:** friendship & inclusion — joining, inviting, and making room.
- **Landmark:** a clearing where three paths meet at a stump table. **Environment:** forest kit (canopies, trunks), merging paths, stump.
- **Ambient:** paths brighten gently when walked together. **Completion:** a ring of stones grows around the clearing — room for more.
- **Props:** stump table, backpack, shared blanket. **Interactions:** `invite`, `join_group`, `give_space`.
- **Reduced motion:** brightening becomes a static highlighted path. **A11y:** "the clearing widens" must be narrated, not implied.
- **Culture & safety:** parallel play, chatting, and quiet company all count as friendship.
- **Shared:** entire forest kit from Echo Treehouse, hills, path dots. **Unique:** stump table, path-merge tiles.

### 4 · Build-It Workshop — rust · brick
- **Teaches:** cooperation — plans, turns, and lifting things together.
- **Landmark:** workshop shed with an outdoor build-table. **Environment:** shed block, roof diamond, crates, planks.
- **Ambient:** aligned blocks settle with a soft-settle click when a plan works. **Completion:** each lesson adds a piece to a group build displayed outside.
- **Props:** crates, planks, pulley wheel, blueprint card. **Interactions:** `offer_object`, `receive_object`, `ask_permission`.
- **Reduced motion:** structure swaps assembled/unassembled states. **A11y:** cooperation shown by position + narration, never simultaneous motion alone.
- **Culture & safety:** ask before taking tools; the planner role rotates — no boss.
- **Shared:** block set, plank, table, ground band. **Unique:** pulley, blueprint card, group-build display.

### 5 · Bridge Builders Bay — blue · wave
- **Teaches:** conflict, apologies & repair — rebuilding after a wobble.
- **Landmark:** two shore platforms with a build-it-yourself bridge. **Environment:** water band (tint-deep), platforms, planks, small boat.
- **Ambient:** water arcs lap slowly; a plank glows faintly when a repair step lands. **Completion:** the bridge completes; a paper boat passes under — repairs carry weight.
- **Props:** planks, rope, paper boat, repair kit. **Interactions:** `apologize`, `accept_apology`, `say_no_confidently`.
- **Reduced motion:** planks appear laid; water still. **A11y:** conflict scenes stay low-volume — no raised-voice audio.
- **Culture & safety:** apologies take many forms (words, notes, actions); accepting has no deadline; leaving stays available.
- **Shared:** platform blocks, plank, water band, hills. **Unique:** bridge assembly set, paper boat.

### 6 · Thankful Kitchen — saffron · steam curl
- **Teaches:** gratitude & kindness — small helpful actions that add up.
- **Landmark:** a warm kitchen with one big shared pot and a recipe board. **Environment:** interior wall, counter, pot, shelf, jars.
- **Ambient:** steam curls rise slowly; a jar glows when filled. **Completion:** the finished dish is shared out — every plate gets some.
- **Props:** pot, jars, ladle, recipe cards, plates. **Interactions:** `offer_object`, `receive_object`, `encouraged`.
- **Reduced motion:** steam removed; ingredients appear in the pot. **A11y:** kindness is never counted publicly — the pot fills, no one keeps score.
- **Culture & safety:** recipes rotate cuisines with cultural review; thanks customs vary and all are shown warmly.
- **Shared:** interior wall, table, shelf, jar, dish set. **Unique:** pot + steam set, recipe board.

### 7 · Welcome Home — plum · mat stripe
- **Teaches:** being a guest and a host — doorways, coats, and making space.
- **Landmark:** a friendly front door with porch light, pegs, and a guest corner. **Environment:** door, porch, peg rail, rug, sofa block.
- **Ambient:** the porch light warms as someone approaches; the door opens gently. **Completion:** the welcome mat gains a stripe per lesson; the light stays lit.
- **Props:** coat pegs, slippers, tray, board game. **Interactions:** `invite`, `greet`, `ask_permission`, `give_space`.
- **Reduced motion:** light and door are state swaps. **A11y:** no doorbell startle sounds; "home" drawn neutral — apartment or house.
- **Culture & safety:** shoes on or off, greeting elders first, host and guest customs shown as each family's way, never ranked.
- **Shared:** door, rug, interior wall, table, block set. **Unique:** peg rail, welcome mat, porch light.

### 8 · Community Town — rose · crosswalk stripe
- **Teaches:** sharing public spaces — queues, quiet zones, buses, and benches.
- **Landmark:** a small town square: crosswalk, bench, bus stop, library corner. **Environment:** building row, crosswalk stripes, bench, bus.
- **Ambient:** the square responds to considerate acts — the bus kneels, queue gaps even out. **Completion:** the square fills with a small friendly crowd, everyone with space.
- **Props:** bus, bench, queue markers, library cart. **Interactions:** `wait_for_pause`, `give_space`, `ask_for_help`.
- **Reduced motion:** queue and bus become state swaps; no crowd motion. **A11y:** crowd scenes stay low-density; queue logic narrated, not implied.
- **Culture & safety:** volume and queue norms differ by place; safety — find a uniformed or trusted helper, stay findable.
- **Shared:** block set, bench, ground band, path dots. **Unique:** bus, crosswalk set, queue markers.

### 9 · Sunny Table Café — gold · sun ray
- **Teaches:** dining together — tables, turns, and passing things kindly.
- **Landmark:** a round café table under one big umbrella. **Environment:** umbrella, round table, chairs, menu board.
- **Ambient:** the table sets itself piece by piece as characters take part. **Completion:** a full table and one shared-meal moment, played once.
- **Props:** plates, cups, napkins, menu, pitcher. **Interactions:** `ask_permission`, `offer_object`, `wait_for_pause`.
- **Reduced motion:** settings appear placed. **A11y:** sensory food aversions respected — "no thank you" is table manners too.
- **Culture & safety:** chopsticks, hands, and forks all appear; no utensil is the correct one; family table customs vary.
- **Shared:** table, chairs, dish set, ground band. **Unique:** umbrella, menu board, pitcher.

### 10 · Pixel Plaza — periwinkle · pixel
- **Teaches:** digital citizenship — kind messages, permission, and screen sense.
- **Landmark:** a plaza kiosk built of pixel blocks with a mosaic screen. **Environment:** pixel blocks, kiosk, message shapes.
- **Ambient:** message shapes float up the kiosk, softening or sharpening with their wording. **Completion:** the screen shows a mosaic of the module's kind messages.
- **Props:** message tiles, camera-permission tile, device frame. **Interactions:** `ask_permission`, `wait_for_pause`, `say_no_confidently`.
- **Reduced motion:** message states swap; no float. **A11y:** tone is never color-alone — every message shape pairs with a label; core rule of this world.
- **Culture & safety:** photo consent, private info, and telling a trusted adult about odd messages; screen rules belong to each family.
- **Shared:** block set (workshop), title chip, ground band. **Unique:** message-shape set, mosaic screen.

### 11 · Brave Basecamp — amber · compass diamond
- **Teaches:** safety, consent & boundaries — **the module every other one defers to.**
- **Landmark:** a tent with a flag, a compass rock, and a trusted-adults board. **Environment:** tent diamond, flag, compass, trail dots.
- **Ambient:** the compass needle settles when a safe choice is made; the trail lights toward trusted adults. **Completion:** the child plants their own flag: "I can say no. I can get help."
- **Props:** compass, flags, trail markers, trusted-adult cards. **Interactions:** `say_no_confidently`, `ask_for_help`, boundary pose throughout.
- **Reduced motion:** needle appears settled; trail is a static highlight. **A11y:** safety choices are never timed and never pressured; the calmest module in the app.
- **Culture & safety:** politeness never overrides safety, consent, or body autonomy; practicing "no" is celebrated; **all content requires qualified human review pre-ship.**
- **Shared:** ground band, hills, trail/path dots, title chip. **Unique:** tent + flag set, compass, trusted-adult board.

### 12 · World Garden — violet · mixed petals
- **Teaches:** culture & different customs — many right ways, one shared garden.
- **Landmark:** a ring of planter beds, each growing differently, around one fountain. **Environment:** planter blocks, varied plant shapes, fountain.
- **Ambient:** each bed sways in its own rhythm; the fountain reflects them all. **Completion:** the fountain blooms with a pattern woven from every bed's motif.
- **Props:** planters, watering can (shared with Hello Garden), pattern tiles. **Interactions:** `notice`, `curious`, `greet` — in many forms.
- **Reduced motion:** sway removed; beds hold varied static states. **A11y:** variety carried by shape + label, never color alone.
- **Culture & safety:** the variation module — customs are parallel gardens, never exotic-vs-normal; authored with cultural consultants; no flag or costume clichés.
- **Shared:** garden kit from Hello Garden, circle/block kit, hills. **Unique:** plant-variety set, fountain, pattern tiles.

---

## 5. Curriculum note

The fully specified module for build-out is **Hello Garden → "Saying Hello"** (see
`COMPONENT_STATES.md` and the `Lesson Prototype` / `Lesson Spec` prototypes). Its eight lessons are:
Saying hello · Introducing yourself · Remembering names · Meeting someone new · Joining a group ·
Listening · Leaving a conversation · Review & challenge. The other eleven worlds are specified to
storyboard + asset-list depth here; each needs the same lesson-level content pass before build.
