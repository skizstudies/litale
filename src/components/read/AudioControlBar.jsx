import { Pause, Play, RotateCcw } from 'lucide-react';
import PillButton from '../ui/PillButton';
import PagongMascot from '../mascot/PagongMascot';

/** Read-aloud button, narrator label, and a calm progress bar with Pagong at the end. */
export default function AudioControlBar({ isPlaying, isFinished, progress, narratorName, onToggle }) {
  const percent = Math.round(progress * 100);
  const icon = isPlaying ? Pause : isFinished ? RotateCcw : Play;
  const label = isPlaying ? 'Pause' : isFinished ? 'Read again' : 'Read aloud';

  return (
    <section
      aria-label="Read aloud"
      className="flex flex-col gap-5 rounded-3xl border border-litale-border bg-white p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6"
    >
      <PillButton variant="primary" icon={icon} onClick={onToggle} aria-pressed={isPlaying} className="sm:min-w-[220px]">
        {label}
      </PillButton>

      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-litale-ink">
            {isPlaying ? `Reading in ${narratorName}'s voice` : isFinished ? 'The end!' : `Ready to read in ${narratorName}'s voice`}
          </p>
          <div
            role="progressbar"
            aria-label="Story progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-3 h-4 w-full overflow-hidden rounded-full bg-litale-mint"
          >
            <div
              className="h-full rounded-full bg-litale-forest transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <PagongMascot className="h-14 w-14 shrink-0" />
      </div>
    </section>
  );
}
