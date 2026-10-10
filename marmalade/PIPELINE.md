# MARMALADE: Sitcom Shorts Pipeline (Google Flow, browser only)

> **Handoff brief for a new Claude chat.** Paste or attach this file at the start.
> Claude drives **Google Flow (labs.google/flow) in the browser**, signed in to the user's own account.
> **No external APIs, no ElevenLabs, no other generation services.** Every image, voice and video is made inside Flow.

---

## 0. Rules for Claude

1. **Flow in the browser only.** Use the built-in browser or Claude in Chrome. The user signs in to Google themselves; never type their password.
2. **Credits are real money.** Before each batch of generations, say what you're about to run and roughly how many credits, then go. Draft first in the fastest/cheapest quality, and render final quality only for approved shots.
3. **Check every output before moving on.** Look at the result (a screenshot or the preview). Reject duplicated people, extra cats, a cat changing color, characters vanishing, and garbled or invented words in the dialogue.
4. **Fix one shot at a time.** If a shot fails, regenerate only that shot with the same ingredients. Change one thing in the prompt, not the whole scene.
5. **Vertical 9:16 always.** Check the aspect setting before every generation; defaults are often 16:9.
6. **Keep the user posted** in short lines: what's generating, and what passed or failed.

---

## 1. Core story

**Series:** *Marmalade.* A multi-camera sitcom where the cat runs the house and the human is "the help."
**Format:** a viral vertical short, 30–50s, with a live studio audience laugh track. Comedy comes from a supremely confident cat and a mortified, loving owner.

### Pilot: "Date Night" (cold open, ~44s)

Dani comes home with pizza for the movie night she promised Marmalade, and finds him on a candlelit dinner date with an elegant white Persian. He bribes her to leave, introduces her as "the help," and keeps the pizza.

| Beat | Line | Audience |
|---|---|---|
| Dani opens the door with a pizza box and sees the cat date | DANI: "Wait, what—" | |
| Dani, frozen | DANI: "...you said we were doing movie night!" | "Ooooh!" |
| Marmalade turns his head and slides a $10 bill over with his paw | MARMALADE: "Psst. Here's ten bucks. Go see a movie." *(beat)* "Alone." "Don't disturb my date. Go." | big laugh |
| Dani, outraged | DANI: "But... this is MY house!" | |
| Duchess turns to him, suspicious | DUCHESS: "You said you owned the place." | |
| Marmalade doesn't blink | MARMALADE: "She's the help." | **biggest laugh, "OHHH!"** |
| Dani's jaw drops | — | laugh peaks |
| Dani turns to leave | MARMALADE *(not looking)*: "Leave the pizza." She sets it down and leaves. | laugh, applause |
| Tag: Marmalade slow-blinks at camera and nudges the pizza to Duchess | — | "Awww," applause → loop |

**Notes:**
- No smoking references. The $10 "go see a movie, alone" bribe is the joke, a callback to her movie night.
- The cat always wins; that's the brand.
- **Episode ideas:** "Duchess Moved In," "The Diet" (Marmalade orders sushi on Dani's phone), "Dani's Date" (Marmalade interviews him like a dad).

---

## 2. Characters (lock these, reuse word for word)

### MARMALADE: the cat, lead
- **Look:** chunky **solid smoky-grey British Shorthair** (grey only, **no orange**), round amber eyes, tiny black satin bow tie. A real cat with real proportions.
- **Voice:** deep, slow, velvety American baritone; smug lounge-singer cool; never raises his voice; dry, unbothered timing.

### DUCHESS: the date
- **Look:** elegant fluffy pure-white Persian, blue eyes, thin pearl necklace.
- **Voice:** posh, refined female voice with a light British accent; cool, slow, suspicious; every word sounds like a raised eyebrow.

### DANI: the owner
- **Look:** woman about 30, messy brown top bun, oversized heather-grey hoodie, black leggings, grey socks, brown slippers. Usually holding a pizza box.
- **Voice:** American woman about 30; warm but frazzled; fast, expressive, comedic; her voice cracks up high when outraged.

### SET: the apartment
Cozy city apartment, warm multi-camera sitcom lighting. Small round dining table with a white tablecloth, two lit candles, a red rose, two small plates of salmon and two glasses of milk, two wooden chairs. The front door opens from a hallway, with a small side table just inside the door. Bookshelf, lamps, a couch with a knitted throw, and a record player on a cabinet playing soft jazz.

---

## 3. Pipeline (all inside Flow)

### Step 1: Project setup
- Open `https://labs.google/flow`. The user is already signed in, or signs in now.
- Create a new project: **"Marmalade – Pilot"**. Set the aspect ratio to **9:16 (portrait)**.

### Step 2: Character and set design (Flow image generation)
Generate each as a reference image ("ingredient") in Flow. Make 2–4 options, pick the best, and save it to the project.

- **Marmalade sheet:**
  > Character turnaround sheet, photorealistic real cat: a chunky solid smoky-grey British Shorthair with round amber eyes wearing a tiny black satin bow tie, no orange fur. Plain warm light-grey backdrop. Five views in a row: front, three-quarter, profile, back, and an extreme close-up with a smug half-lidded look. Same fur and bow tie in every view. No text.
- **Duchess sheet:**
  > Character turnaround sheet, photorealistic real cat: an elegant fluffy pure-white Persian with blue eyes and a thin pearl necklace. Plain warm light-grey backdrop. Front, three-quarter, profile, back, and an extreme close-up with a haughty side-eye. No text.
- **Dani sheet:**
  > Character turnaround sheet, photorealistic: a woman about 30 with a messy brown top bun, oversized heather-grey hoodie, black leggings, grey socks and brown slippers, holding a closed pizza box. Plain warm light-grey backdrop. Front full body, three-quarter, profile, back, and a close-up with a shocked, exasperated face. No text.
- **Set plate:** the SET description above, wide, with no people, no animals and no text.

**Gate:** show the user the four picks before spending on video.

### Step 3: Character voices (Flow's character voice feature)
If Flow lets you attach a voice to a character or ingredient, create **Marmalade, Duchess and Dani** as characters, attach their sheet, and paste their **Voice** line from section 2.
If Flow has no voice field, put the voice description inside every shot prompt instead (the same words each time). That is what keeps voices consistent across clips.

### Step 4: Draft shots (Omni 1.1 Flash, 9:16, fastest quality)
- Model: **Omni 1.1 Flash**. Attach only the ingredients that are in frame, plus the set.
- Write in intent, not frame-by-frame lists: camera + action + quoted dialogue + audio. Keep each prompt short.
- Add this to every prompt: *"Live studio audience at a sitcom taping. Soft jazz from a record player in the room."*
- Draft all 9 shots, review each one (rule 3), and redo failures.

| # | Len | Camera | Prompt |
|---|---|---|---|
| S1 | 6s | Over-the-shoulder glide | One continuous shot from the hallway, behind Dani's shoulder. She pushes the door open with her hip, carrying a pizza box, and the camera glides past her shoulder to reveal Marmalade and Duchess at a candlelit dinner, both sitting upright on chairs. She stops dead and says, "Wait, what—" |
| S2 | 4s | Static MCU | Medium close-up of Dani in the doorway clutching the pizza box, blinking in disbelief. She says, confused and wounded, "...you said we were doing movie night!" The audience goes "Ooooooh!" |
| S3 | 8s | Slow push-in | Slow push-in on Marmalade at the table. He turns his head over his shoulder toward Dani with a smug side-eye and slides a folded ten-dollar bill across the tablecloth with one paw. In a low whisper: "Psst. Here's ten bucks. Go see a movie." Beat. "Alone." The audience laughs. "Don't disturb my date. Go." He turns back to Duchess. |
| S4 | 4s | Low angle | Low-angle shot up at Dani in the doorway, pizza box in one arm, other hand thrown up. Outraged, voice cracking: "But... this is MY house!" |
| S5 | 4s | Rack focus | Close-up on Duchess across the candlelit table, rack focus from the rose to her face. She slowly turns to Marmalade: "You said you owned the place." |
| S6 | 4s | Locked ECU | Extreme close-up of Marmalade, candlelight in his amber eyes. He doesn't blink or look at Dani: "She's the help." |
| S7 | 3s | Punch-in | Fast punch-in on Dani's face as her jaw drops in silent outrage. The audience explodes with laughter and a long "OHHHHH!" |
| S8 | 7s | Wide, locked, oner | Wide locked-off shot, one continuous take. Dani sighs and turns to leave with the pizza. Without looking up, Marmalade says, "Leave the pizza." She freezes, sets the box on the side table by the door, steps out and shuts the door. Laughter, then applause. |
| S9 | 4s | CU to camera | Close-up of Marmalade. He looks straight into the camera, gives one long satisfied slow blink, and nudges the pizza box toward Duchess with his paw. Jazz swells; the audience says "Awww" and applauds. |

### Step 5: Final renders
Re-render the approved drafts at full quality (1080p) with the same prompt and ingredients. Review again; the final pass can drift from the draft.

### Step 6: Assemble in Flow
- Put S1→S9 in order on Flow's timeline / scene builder.
- **Cut points:** S1 on "Wait, what—" · S3 after "Go." (let the "Alone" laugh breathe) · S6 0.3s after the line · S7 at the peak of the laugh, don't cut it short · S8 on the door slam, applause carries over · S9 hard cut, so it loops to S1.
- If a clip has a stray glitch at its end (a cat jumping, a person duplicating), trim it in the timeline instead of regenerating.
- Export or download the final vertical video and give the user the file.

### Step 7: Captions and hook (if Flow's editor supports text; otherwise list them for the user)
- Hook text for the first 2s: **`POV: you came home early`**
- Captions: big, bold, centered, one line at a time. Most viewers watch muted.

---

## 4. Lessons from the first attempt (avoid repeating)

| Problem | Fix |
|---|---|
| The cat came out grey-orange | Say **"solid smoky-grey… no orange fur"** in every image and video prompt |
| The image editor defaulted to 16:9 | Check **9:16** before every generation |
| The content filter blocked the opening shot twice | Keep emotional words mild ("puzzled", "surprised"), avoid "hurt", "caught", "wounded" if blocked; simpler prompts pass |
| The exit shot duplicated Dani and the cat vanished | Say "only one woman in the scene; both cats stay seated the whole time"; keep the action simple |
| The cat jumped off his chair in a glitchy way at the end of a clip | Trim the clip end in the edit |
| The model invented a garbled word ("Keeneen") mid-line | Listen to every clip; regenerate, or trim/mute that moment |
| Continuity jump: Dani walked forward in one clip and was back at the door in the next | State her position in each prompt: "stays in the doorway" |
| The budget ran out from full-quality renders with no check | Draft cheap, show the user the price, render final only for approved shots |

---

## 5. Done means

- [ ] 4 reference images approved (Marmalade, Duchess, Dani, set)
- [ ] Character voices set (or voice lines repeated in prompts)
- [ ] 9 drafts reviewed, failures redone
- [ ] 9 finals rendered at 1080p, 9:16
- [ ] Assembled 40–46s cut with the laugh beats intact
- [ ] Final video downloaded and handed to the user
