import { useEffect, useState } from 'react';
import { ArrowRight, Check, Pencil, WandSparkles } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import PillButton from '../components/ui/PillButton';
import DraftStatusPill from '../components/review/DraftStatusPill';
import TranscriptCard from '../components/review/TranscriptCard';
import DraftCard from '../components/review/DraftCard';
import Storyboard from '../components/review/Storyboard';
import { generateGradeLevelStory, transcribeAudio } from '../services/mockApiService';

/**
 * STEP 2 · REVIEW & GENERATE
 *
 * Props
 *  - story: the active story (null if the user jumped here from the nav)
 *  - userName: storyteller's name ("Lola")
 *  - onApprove({ transcript, scenes }) => Promise
 *      Called by "Approve & Generate". The parent saves it and moves to Illustrate.
 */
export default function ReviewScreen({ story, userName, onApprove }) {
  // A previously approved draft is shown straight away; otherwise ask the AI.
  const [draft, setDraft] = useState(() =>
    story?.scenes ? { transcript: story.transcript, scenes: story.scenes } : null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Runs once per mount — the parent remounts this screen for each story.
  useEffect(() => {
    if (draft) return undefined;
    let cancelled = false;
    (async () => {
      const { transcript } = await transcribeAudio({ storyId: story?.id ?? null, audioUrl: story?.audioUrl ?? null });
      const { scenes } = await generateGradeLevelStory({
        storyId: story?.id ?? null,
        transcript,
        narratorName: userName,
        sceneCount: 4,
      });
      if (!cancelled) setDraft({ transcript, scenes });
    })();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isReady = Boolean(draft);

  const handleChangeScene = (sceneId, text) => {
    setError('');
    setDraft((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) => (scene.id === sceneId ? { ...scene, text } : scene)),
    }));
  };

  const handleApprove = async () => {
    const scenes = draft.scenes.map((scene) => ({ ...scene, text: scene.text.trim() }));
    if (scenes.some((scene) => !scene.text)) {
      setIsEditing(true);
      setError('Every scene needs a few words before we draw the pictures.');
      return;
    }
    setIsEditing(false);
    setIsSaving(true);
    try {
      await onApprove({ transcript: draft.transcript, scenes });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Step 2 · Review &amp; Generate</Eyebrow>
          <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">Here&apos;s your story draft</h1>
        </div>
        <DraftStatusPill isReady={isReady} />
      </div>

      {/* ── Transcript → Draft ─────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-5">
        <TranscriptCard userName={userName} paragraphs={draft?.transcript} />
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center self-center justify-self-center rounded-full border-2 border-litale-forest bg-litale-butter text-litale-forest"
        >
          <ArrowRight className="h-7 w-7 rotate-90 lg:rotate-0" strokeWidth={2.5} />
        </span>
        <DraftCard scenes={draft?.scenes} isEditing={isEditing} onChangeScene={handleChangeScene} />
      </div>

      <Storyboard scenes={draft?.scenes} />

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end">
        <p role="alert" className="text-lg font-medium text-litale-ink empty:hidden sm:mr-auto">
          {error}
        </p>
        <PillButton
          variant="secondary"
          icon={isEditing ? Check : Pencil}
          onClick={() => setIsEditing((editing) => !editing)}
          disabled={!isReady || isSaving}
          aria-pressed={isEditing}
          className="sm:min-w-[220px]"
        >
          {isEditing ? 'Done editing' : 'Edit words'}
        </PillButton>
        <PillButton
          variant="primary"
          icon={WandSparkles}
          onClick={handleApprove}
          disabled={!isReady || isSaving}
          className="sm:min-w-[260px]"
        >
          {isSaving ? 'Saving…' : 'Approve & Generate'}
        </PillButton>
      </div>
    </div>
  );
}
