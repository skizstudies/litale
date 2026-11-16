import { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import PagongMascot from '../mascot/PagongMascot';
import PillButton from '../ui/PillButton';

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Calm "listen" card: Pagong reads the scene aloud using the browser's voice.
 * TODO(backend): swap speechSynthesis for the recorded/generated narration audio.
 */
export default function ListenPanel({ sceneNumber, text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop talking when the child leaves this scene or mode.
  useEffect(() => () => canSpeak && window.speechSynthesis.cancel(), []);

  const toggle = () => {
    window.speechSynthesis.cancel();
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-litale-wash px-6 py-8 text-center">
      <PagongMascot className="h-32 w-32 sm:h-40 sm:w-40" />
      <p className="max-w-lg text-2xl font-semibold leading-relaxed text-litale-ink sm:text-3xl">{text}</p>
      {canSpeak ? (
        <PillButton
          variant="primary"
          icon={isPlaying ? Square : Play}
          onClick={toggle}
          aria-pressed={isPlaying}
          className="min-w-[260px]"
        >
          {isPlaying ? 'Stop listening' : `Listen to Scene ${sceneNumber}`}
        </PillButton>
      ) : (
        <p className="text-lg text-litale-ink/80">Ask a grown-up to read this one aloud with you.</p>
      )}
    </div>
  );
}
