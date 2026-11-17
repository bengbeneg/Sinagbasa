# SINAGBASA — Reading Adventure Edition
A bilingual, dependency-free HTML/CSS/JavaScript reading platform with original pixel characters, interactive games, categorized lessons, and browser-saved progress.

## Run locally
Extract the ZIP and open `dist/index.html` in a modern browser. For consistent saved progress, serve the folder:

python3 -m http.server 8000 --directory dist

Visit http://localhost:8000. No package installation or build step is needed.

## Deploy to Vercel

The repository includes `vercel.json`, which publishes the static `dist` directory without a build step.

1. Run `vercel` from this directory for a preview deployment, then `vercel --prod` when the preview is approved.
2. In the Vercel project dashboard, open **Analytics** and enable Web Analytics, then redeploy.
3. In **Supabase → Authentication → URL Configuration**, set the production Vercel address as the Site URL and add `https://your-project.vercel.app/**` as a Redirect URL. Keep `http://localhost:8000/**` for local testing.

The browser-safe Supabase publishable key remains in `dist/supabase-config.js`; never place a secret or `service_role` key in this directory.

## Accounts and Supabase

The app now requires a verified email account. Student progress synchronizes to Supabase, while teacher accounts can create and publish bilingual lessons, materials, and stories through Teacher Studio. Run `supabase/schema.sql` in the project SQL Editor and complete the steps in `supabase/README.md` before testing authentication.

Teacher Studio supports private file attachments for learning content. Existing databases must run `supabase/file-upload-migration.sql` once before uploads are used.

Teacher Studio creates two current content types: lessons appear in the Lessons tab, while configurable bilingual story games appear in Games. Existing databases must also run `supabase/game-authoring-migration.sql` once to store scene, choice, timer, outcome, and point settings.

Authentication opens on a single login form, with signup available through an inline link. Registration and password recovery enforce eight characters, uppercase and lowercase letters, a number, a special character, and inline bilingual validation.

Signed-out visitors first see a responsive public landing page featuring `dist/assets/222.jpg`. Authentication uses a clean non-pixel interface; pixel characters and the pixel-town artwork are reserved for the story campaign.

The interface uses fluid grids, dynamic typography and spacing, touch-friendly controls, scroll-safe mobile navigation, and dedicated compact-landscape layouts for phones, tablets, laptops, and desktops down to 320px wide.

Authenticated pages use a fixed desktop sidebar. On smaller screens it becomes an accessible off-canvas navigation drawer with a backdrop, keyboard dismissal, and automatic closing after navigation.

The SINAGBASA logo inside the desktop sidebar toggles a persistent compact icon rail. Accessible labels and native tooltips remain available, while tapping the logo on mobile closes the full-label drawer.

The sidebar also includes a bilingual light/dark theme control. The first visit follows the device color preference, and a manual selection is saved in the browser for future visits.

## Content
- 12 lessons across 6 skills: literal comprehension, inference, vocabulary, sequencing and cause/effect, main idea and supporting details, critical reading.
- 7 game modes: Sinag Dispatch, Story Repair, Evidence Detective, Word Compass, Headline Studio, Fact or View, and the lesson-linked Rabbit Recall target game.
- Rabbit Recall turns all 12 lesson checks into rabbit targets. Each target shows its bilingual story passage before the question. First-time correct answers award puzzle-card pieces; every four pieces unlocks a rabbit skin.
- Senior-high challenge scoring adds mastery stars for accurate first attempts, penalties for hints and retries, Rabbit Recall focus hearts, four-choice questions, richer passage context, and answer streaks.
- Signal After Dark: an additional 6-chapter branching story campaign.
- Dispatch includes 2 extra practice questions per mission.
- All reading content and game choices are available in English and Filipino.

## Signal After Dark
Join Alex, Mika, Theo, and Ms. Reyes in a stormy town. Read every dialogue line, inspect the clue, then choose a course of action. Choices lead to successful progress, a detour with guidance, or a failed scene. Failures return to the most recent scene checkpoint. Completing each chapter unlocks the next.

Timed adventure gives 75 seconds per decision AFTER the dialogue and clue inspection. Story mode has no timer. Pause freezes the countdown. Hidden tabs pause it automatically. Returning to a story restores its saved checkpoint; countdown snapshots save every five seconds and on visibility changes. Optional square-wave radio and outcome sounds are enabled only through the Sound button. The browser may suppress audio until a user gesture. Reduced-motion preferences disable animated characters, rain, and bursts.

## Progress
State is device-local under `sinagbasa-platform-v2`. It tracks lessons, dispatch attempts and first-attempt scores, arcade completion and scores, story checkpoints, evidence journal, decisions, and story chapter completion. These are practice metrics, not standardized reading assessment results. The original MVP's completed first mission migrates without inventing an initial score. Reset clears all progress.

## Edit
- `dist/data.js`: base lessons, dispatch missions, and interface copy.
- `dist/arcade-data.js`: original arcade questions and dispatch follow-ups.
- `dist/expansion-data.js`: categorized lessons and additional arcade chapters.
- `dist/story-data.js`: cast, story chapters, dialogue, clues, and branching edges.
- `dist/app.js`: base routing, lesson and dispatch rules, progress.
- `dist/arcade.js`: arcade mechanics, drag/move controls, hints, scores.
- `dist/expansion.js`: skill categories, chapter selector, animated rewards.
- `dist/story.js`: dialogue gates, choices, timer, checkpoints, journal, audio.
- `dist/rabbit-bash.js`: Rabbit Recall targets, lesson questions, puzzle pieces, and skin rewards.
- `dist/style.css`: responsive styles and animations.
- `dist/assets/characters.png`, `dist/assets/town.png`: original AI-generated pixel-style character atlas and backdrop.

## Asset generation
Built-in image generation produced a transparent four-character pixel atlas (student investigator, radio operator, courier, librarian) and a navy/teal town plaza at rainy dusk with amber lights. The assets are bundled locally. They do not represent actual students or an exact school map.

## Validation

Activity Logs shows one row per recorded session: user, login time in Asia/Manila, interaction status, and a View details button. The details dialog contains session metadata and a searchable, sortable timeline. Active requires visible-page interaction within 90 seconds and a recent status update; logged-in but idle/background pages are not counted as active. The teacher view refreshes every 15 seconds. Users must load the updated app to begin sending presence updates; old records without presence are not treated as proof of current activity.

Presence uses the existing `record_activity` RPC with reserved `presence/`, `session/`, and `visit/` page prefixes, so no new database migration is needed when activity logging is already installed. Heartbeats are excluded from session timelines and ordinary page-visit queries. Idle tabs send one transition update rather than writing repeated idle heartbeats. Recent presence is bounded to two minutes; ordinary history is bounded to the latest 1,000 events. No IP address is collected for this view.

Leaving/closing the website sends a durable `logout` record tagged `exit/<session>/<document>`, alongside the presence-close update. The report labels this Logged out and includes its time and reason in details. A new document or Back/Forward Cache restore records `resume/<session>/<document>`; reloads therefore retain the session without a false permanent logout. Exit/resume bookkeeping is hidden from the timeline unless it represents the final logout. Explicit Log out remains final. Browser termination or loss of connectivity can prevent delivery of exit requests; presence freshness still prevents such sessions from being shown as active indefinitely.

Checks: `node scripts/test-activity-sessions.cjs`, `node scripts/test-activity-presence.cjs`, and `node scripts/check-activity-browser.cjs` (requires local Chrome). Browser checks use synthetic fixture data, not live student accounts, and cover the session dialog, filtering, keyboard dismissal/focus, and mobile fit.
JavaScript syntax and modeled interaction checks cover all 12 lesson answers, all 36 arcade chapters, answer-key consistency, all story success routes, detours, failures, dialogue/clue gates, checkpoint retries, countdown expiry, pause, hidden tabs, story mode, bilingual content, saving, and reset. A browser visual pass could not run because this workspace has no browser executable.

## Classroom use
Original demonstration passages and thresholds should be reviewed by teachers before research use. No student accounts, central database, or research pre/post-test collection is included.
