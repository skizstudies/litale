# Litale — Frontend (Phase 1)

*Turning Family Stories into a Child's First Books.*

React 18 + Vite + Tailwind CSS 3 + Lucide icons. Frontend-only prototype: recording, saving and
the story archive are mocked behind one service file, so the backend can be connected without
touching UI components.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Project structure

```
src/
├── App.jsx                     # App-level state: current step, saved stories, active story
├── constants/
│   ├── steps.js                # The 4 steps (Record, Review, Illustrate, Read)
│   └── mascotMessages.js       # All of Pagong's lines + the "Need an idea?" prompts
├── services/
│   └── storyService.js         # ⬅ BACKEND HOOK-UP POINT (mocked API calls)
├── hooks/
│   └── useRecorder.js          # Recording state + timer (⬅ add MediaRecorder here)
├── utils/formatTime.js
├── components/
│   ├── ui/                     # Card, PillButton, Eyebrow
│   ├── layout/                 # TopNav (stepper), StepPlaceholder
│   ├── mascot/                 # PagongMascot (SVG), SpeechBubble, MascotCard
│   └── record/                 # MicButton, Waveform, RecordingStatus, StoryPromptsCard
└── screens/
    ├── RecordScreen.jsx        # Step 1 — fully built
    ├── ReviewScreen.jsx        # Step 2 — placeholder
    ├── IllustrateScreen.jsx    # Step 3 — placeholder
    └── ReadScreen.jsx          # Step 4 — placeholder + Family Story Tree list
```

## Connecting the backend

1. **`src/services/storyService.js`**: replace the mocked bodies of `saveRecording()` and
   `listStories()` with real `fetch` calls. Keep the same return shape (documented at the top of
   the file) and the UI will keep working.
2. **`src/hooks/useRecorder.js`**: to capture real audio, start a `MediaRecorder` in `start`,
   pause/resume it in `toggle`, and return the recorded `Blob` from `finish()` as `audioBlob`.
   `RecordScreen` already passes `audioBlob` through to `saveRecording()`.
3. **`src/App.jsx`**: `CURRENT_USER` is hard-coded to `{ name: 'Lola' }`. Swap it for the
   signed-in storyteller. On load, call `listStories()` to fill the Family Story Tree.

## Design system

Tokens live in `tailwind.config.js` under `colors.litale`:

| Token | Hex | Used for |
|---|---|---|
| `litale-bg` | `#F3F8F0` | App background |
| `litale-card` / `litale-border` | `#FFFFFF` / `#E2ECE0` | Card surfaces, 1px borders |
| `litale-forest` / `litale-forest-hover` | `#2B6E38` / `#235A2D` | Primary buttons, active step |
| `litale-mint` | `#E5F1DF` | Inactive steps, story items, placeholders |
| `litale-butter` | `#FCE89B` | Mic, speech bubble, idea pills |
| `litale-ink` | `#1B2E20` | Body text |

## Low-stimulation & accessibility rules

- Poppins throughout; body and buttons are 18px or larger, headings 30–36px, line height is relaxed.
- Touch targets are 52–64px tall. The mic button is 160–192px across.
- The only motion is the slow waveform "breathing" (1.8s ease-in-out), and it runs only while
  recording. No flashing or blinking. `prefers-reduced-motion` turns all animation off.
- Every interactive element has a clear 4px green focus ring for keyboard and switch users.
- Pagong's speech bubble uses `aria-live="polite"`, so screen readers hear new messages.
  On step change, focus moves to the new screen.
- **"Start New Tale" asks before discarding.** If a recording exists, the first tap only asks
  through Pagong's bubble (no pop-up) and changes the button to "Yes, start over".
- "Stop & Save" with nothing recorded doesn't navigate. Pagong gently explains what to do instead.
