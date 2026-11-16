import { Check, LoaderCircle } from 'lucide-react';

/** Butter-yellow badge telling the storyteller whether the AI draft is ready. */
export default function DraftStatusPill({ isReady }) {
  return (
    <p
      role="status"
      className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-litale-forest bg-litale-butter px-5 text-lg font-semibold text-litale-ink"
    >
      {isReady ? (
        <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-litale-forest" strokeWidth={3} />
      ) : (
        <LoaderCircle
          aria-hidden="true"
          className="h-5 w-5 shrink-0 animate-[spin_2s_linear_infinite] text-litale-forest"
          strokeWidth={2.5}
        />
      )}
      <span key={isReady ? 'ready' : 'loading'} className="animate-fade-in">
        {isReady ? 'Story draft ready!' : 'AI is shaping the story...'}
      </span>
    </p>
  );
}
