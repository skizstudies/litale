/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LITALE · API SERVICE  (mock)  — the ONLY file the UI uses to reach a backend
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Every function below is async and returns plain JSON-shaped objects. To go
 *  live, replace each function BODY with the real call (keep the name,
 *  arguments and return shape) — no React component needs to change.
 *
 *  Intended stack:
 *    • Supabase   — Postgres `stories` table + Storage bucket for audio
 *    • Whisper    — speech-to-text (Tagalog / Taglish)       → transcribeAudio()
 *    • GPT-4o     — Grade 1–3 simplification into 4 scenes   → generateGradeLevelStory()
 *    • ElevenLabs — narration in Lola's cloned voice          → synthesizeLolaVoice()
 *
 *  Keep API keys on the server (Supabase Edge Functions or your own API) —
 *  never ship OpenAI / ElevenLabs keys in this frontend bundle.
 *
 * ─── Shared types ───────────────────────────────────────────────────────────
 *
 * @typedef {Object} Scene
 * @property {string} id      Stable id, e.g. "sun" (also picks the line-art)
 * @property {string} title   Short caption, e.g. "Waving at the sun"
 * @property {string} text    One Grade 1–3 sentence
 *
 * @typedef {Object} Stroke   Freehand crayon line, in 1000×750 canvas units
 * @property {string} color   Hex, e.g. "#8EE060"
 * @property {number} size    Brush width
 * @property {number[][]} points  [[x, y], …]
 *
 * @typedef {Object} SceneArtwork  A child's Step 3 work on one scene
 * @property {Object<string,string>} fills   regionId → hex, e.g. { "sun": "#FFD93D" }
 * @property {Stroke[]} colorStrokes          Crayon strokes over the coloring page
 * @property {Stroke[]} drawStrokes           Free drawing board strokes
 * @property {string} caption                 The child's own sentence
 *
 * @typedef {Object} Story    One row of the Family Story Tree
 * @property {string} id
 * @property {string} title
 * @property {string} narratorName           e.g. "Lola"
 * @property {string|null} promptId           "childhood-game" | "family-legend" | "favorite-food" | null
 * @property {number} durationSeconds
 * @property {string|null} audioUrl           Supabase Storage URL of the raw recording
 * @property {'recorded'|'reviewed'|'illustrated'} status
 * @property {string} createdAt               ISO date
 * @property {string[]} [transcript]          Paragraphs, as spoken
 * @property {Scene[]} [scenes]               The approved Grade 1–3 story
 * @property {Object<string,SceneArtwork>} [illustrations]  sceneId → artwork
 *
 *  Suggested Supabase table:  stories (id uuid pk, title text, narrator_name text,
 *  prompt_id text, duration_seconds int, audio_url text, status text,
 *  transcript jsonb, scenes jsonb, illustrations jsonb, created_at timestamptz)
 */

import { MANGO_TREE_STORY, SAMPLE_STORIES } from '../constants/sampleStories';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => (typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)));
const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `story-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

// In-memory stand-in for the Supabase `stories` table (resets on reload).
const mockTable = new Map(SAMPLE_STORIES.map((story) => [story.id, clone(story)]));

/* ═══ 1 · Recording upload ══════════════════════════════════════════════════
 *
 * uploadRecording({ audioBlob, durationSeconds, promptId, title, narratorName })
 *
 *  Real: upload `audioBlob` to Supabase Storage (bucket "recordings"), then
 *        insert a `stories` row with status "recorded".
 *
 *  Request  (multipart/form-data → POST /api/stories)
 *    audio:           <Blob audio/webm>          (may be null in the demo)
 *    durationSeconds: 94
 *    promptId:        "childhood-game" | null
 *    title:           "Lola's Tale: A childhood game"
 *    narratorName:    "Lola"
 *
 *  Response 201 → Story
 *    { "id": "8f1c…", "title": "Lola's Tale: A childhood game", "narratorName": "Lola",
 *      "promptId": "childhood-game", "durationSeconds": 94,
 *      "audioUrl": "https://<project>.supabase.co/storage/v1/object/public/recordings/8f1c.webm",
 *      "status": "recorded", "createdAt": "2026-11-16T08:00:00.000Z" }
 */
export async function uploadRecording({ audioBlob = null, durationSeconds, promptId = null, title, narratorName = 'Lola' }) {
  await wait(600);
  const story = {
    id: makeId(),
    title: title || 'Untitled Tale',
    narratorName,
    promptId,
    durationSeconds,
    audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
    status: 'recorded',
    createdAt: new Date().toISOString(),
  };
  mockTable.set(story.id, story);
  return clone(story);
}

/* ═══ 2 · Whisper — speech to text ══════════════════════════════════════════
 *
 * transcribeAudio({ storyId, audioUrl })
 *
 *  Real: OpenAI `audio/transcriptions` (model "whisper-1", language "tl"),
 *        then split the text into paragraphs on long pauses / sentence ends.
 *
 *  Request  POST /api/transcribe
 *    { "storyId": "8f1c…", "audioUrl": "https://…/recordings/8f1c.webm" }
 *
 *  Response 200
 *    { "language": "tl",
 *      "transcript": [
 *        "Noong bata pa ako sa Batangas, tuwing umaga ay umaakyat ako…",
 *        "Sisilipin ko talaga yung mga dahon…"
 *      ] }
 */
export async function transcribeAudio({ storyId, audioUrl = null }) {
  await wait(800);
  return { language: 'tl', transcript: [...MANGO_TREE_STORY.transcript] };
}

/* ═══ 3 · GPT-4o — Grade 1–3 story ══════════════════════════════════════════
 *
 * generateGradeLevelStory({ storyId, transcript, narratorName, sceneCount })
 *
 *  Real: GPT-4o with a JSON-mode / structured-output prompt, e.g.
 *        "Retell this family story for a Grade 1–3 reader in exactly
 *         {sceneCount} short English sentences (≤ 12 words each). Use the
 *         storyteller's name ({narratorName}). Return { scenes: [{ id, title, text }] }
 *         where id is a short lowercase slug and title is ≤ 4 words."
 *
 *  Request  POST /api/generate-story
 *    { "storyId": "8f1c…", "transcript": ["Noong bata pa ako…"],
 *      "narratorName": "Lola", "sceneCount": 4 }
 *
 *  Response 200
 *    { "readingLevel": "Grade 1–3",
 *      "scenes": [
 *        { "id": "sun", "title": "Waving at the sun",
 *          "text": "Every morning, Lola climbed the mango tree and waved at the sun." },
 *        …3 more
 *      ] }
 */
export async function generateGradeLevelStory({ storyId, transcript, narratorName = 'Lola', sceneCount = 4 }) {
  await wait(700);
  return { readingLevel: 'Grade 1–3', scenes: clone(MANGO_TREE_STORY.scenes).slice(0, sceneCount) };
}

/* ═══ 4 · ElevenLabs — narration in Lola's voice ════════════════════════════
 *
 * synthesizeLolaVoice({ storyId, sceneId, text, voiceId })
 *
 *  Real: ElevenLabs `text-to-speech/{voiceId}/with-timestamps` using the
 *        family's cloned voice. Convert the character-level `alignment` it
 *        returns into word timings, upload the MP3 to Supabase Storage and
 *        return its URL (cache by storyId + sceneId so each scene is paid once).
 *
 *  Request  POST /api/narrate
 *    { "storyId": "8f1c…", "sceneId": "sun",
 *      "text": "Every morning, Lola climbed the mango tree and waved at the sun.",
 *      "voiceId": "lola-voice-clone-id" }
 *
 *  Response 200
 *    { "audioUrl": "https://…/narration/8f1c-sun.mp3",
 *      "wordTimings": [
 *        { "word": "Every",    "startMs": 0,   "endMs": 310 },
 *        { "word": "morning,", "startMs": 310, "endMs": 820 },
 *        …one entry per whitespace-separated word of `text`
 *      ] }
 *
 *  The reader (hooks/useReadAloud.js) plays `audioUrl` and highlights words
 *  from `wordTimings`. While this mock returns nulls, it falls back to the
 *  browser's built-in voice (speechSynthesis) with an estimated word timer.
 */
export async function synthesizeLolaVoice({ storyId, sceneId, text, voiceId = null }) {
  return { audioUrl: null, wordTimings: null };
}

/* ═══ 5 · Supabase — save / list the Family Story Tree ══════════════════════
 *
 * saveStoryToTree(story)
 *
 *  Real: Supabase `upsert` into `stories` (match on id). Called after the
 *        draft is approved (status "reviewed") and after Step 3 (status
 *        "illustrated"). Send the whole Story — scenes and illustrations are jsonb.
 *
 *  Request  PUT /api/stories/:id   body: Story (see typedef above)
 *  Response 200 → the saved Story (server may add/normalise fields)
 */
export async function saveStoryToTree(story) {
  await wait(500);
  const saved = { ...clone(story), updatedAt: new Date().toISOString() };
  mockTable.set(saved.id, saved);
  return clone(saved);
}

/**
 * listStoryTree()
 *
 *  Real: Supabase `select * from stories order by created_at desc`
 *        (filtered to the signed-in family).
 *
 *  Request  GET /api/stories
 *  Response 200 → Story[]  (newest first)
 */
export async function listStoryTree() {
  await wait(300);
  return clone([...mockTable.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}
