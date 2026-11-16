import { useState } from 'react';
import { RotateCcw, Save, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Eyebrow from '../components/ui/Eyebrow';
import PillButton from '../components/ui/PillButton';
import MicButton from '../components/record/MicButton';
import Waveform from '../components/record/Waveform';
import RecordingStatus from '../components/record/RecordingStatus';
import StoryPromptsCard from '../components/record/StoryPromptsCard';
import MascotCard from '../components/mascot/MascotCard';
import { useRecorder } from '../hooks/useRecorder';
import { MASCOT_MESSAGES, allRecordMessages, getPrompt } from '../constants/mascotMessages';

/**
 * STEP 1 · RECORD
 *
 * Props
 *  - userName: storyteller's name shown in greetings ("Lola")
 *  - onSaveRecording({ durationSeconds, audioBlob, promptId }) => Promise
 *      Called by "Stop & Save". The parent persists it and moves to Review.
 */
export default function RecordScreen({ userName, onSaveRecording }) {
  const recorder = useRecorder();
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [mascotMessage, setMascotMessage] = useState(MASCOT_MESSAGES.idle(userName));
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMicToggle = () => {
    setConfirmingRestart(false);
    setMascotMessage(
      recorder.isRecording ? MASCOT_MESSAGES.paused(userName) : MASCOT_MESSAGES.recording(userName),
    );
    recorder.toggle();
  };

  // Starting over throws away the current recording, so ask once — gently,
  // through Pagong rather than a pop-up — before discarding anything.
  const handleStartNewTale = () => {
    if (recorder.hasRecording && !confirmingRestart) {
      setConfirmingRestart(true);
      setMascotMessage(MASCOT_MESSAGES.confirmRestart(userName));
      return;
    }
    setConfirmingRestart(false);
    recorder.start();
    setMascotMessage(MASCOT_MESSAGES.recording(userName));
  };

  const handleSelectPrompt = (promptId) => {
    setSelectedPromptId(promptId);
    setMascotMessage(getPrompt(promptId)?.message ?? MASCOT_MESSAGES.idle(userName));
  };

  const handleStopAndSave = async () => {
    setConfirmingRestart(false);
    if (!recorder.hasRecording) {
      setMascotMessage(MASCOT_MESSAGES.nothingToSave(userName));
      return;
    }
    const { durationSeconds, audioBlob } = recorder.finish();
    setIsSaving(true);
    setMascotMessage(MASCOT_MESSAGES.saving(userName));
    try {
      await onSaveRecording({ durationSeconds, audioBlob, promptId: selectedPromptId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-8">
      {/* ── Main recording card ─────────────────────────────── */}
      <Card aria-labelledby="record-heading" className="flex flex-col">
        <Eyebrow>Step 1 · Record</Eyebrow>
        <h1 id="record-heading" className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">
          Hi, {userName}! Ready to tell a tale?
        </h1>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 sm:py-14">
          <MicButton
            isRecording={recorder.isRecording}
            hasRecording={recorder.hasRecording}
            onToggle={handleMicToggle}
            disabled={isSaving}
          />
          <div className="flex w-full flex-col items-center gap-4">
            <Waveform active={recorder.isRecording} />
            <RecordingStatus status={recorder.status} elapsedSeconds={recorder.elapsedSeconds} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PillButton
            variant="primary"
            icon={confirmingRestart ? RotateCcw : Sparkles}
            onClick={handleStartNewTale}
            disabled={isSaving}
          >
            {confirmingRestart ? 'Yes, start over' : 'Start New Tale'}
          </PillButton>
          <PillButton variant="secondary" icon={Save} onClick={handleStopAndSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Stop & Save'}
          </PillButton>
        </div>
      </Card>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="flex flex-col gap-6 lg:gap-8" aria-label="Helper">
        <MascotCard message={mascotMessage} possibleMessages={allRecordMessages(userName)} />
        <StoryPromptsCard selectedPromptId={selectedPromptId} onSelectPrompt={handleSelectPrompt} />
      </aside>
    </div>
  );
}
