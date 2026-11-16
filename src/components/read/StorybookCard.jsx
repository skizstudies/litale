import { ChevronLeft, ChevronRight } from 'lucide-react';
import SceneIllustration from './SceneIllustration';

const arrowClass =
  'flex h-12 w-12 items-center justify-center rounded-full border-2 border-litale-border bg-white text-litale-forest transition-colors duration-200 hover:border-litale-sage hover:bg-litale-mint disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white';

/**
 * One open page of the book: picture on the left, big words on the right.
 * The word being read gets a butter-yellow pill; a box-shadow "pads" the pill
 * so highlighting never nudges the surrounding words.
 */
export default function StorybookCard({ scene, sceneIndex, sceneCount, words, activeWord, artwork, onPrev, onNext }) {
  return (
    <section
      aria-label={`Page ${sceneIndex + 1}`}
      className="grid gap-6 rounded-3xl border border-litale-border bg-white p-5 sm:p-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8"
    >
      <div>
        <div className="rounded-2xl border-2 border-dashed border-litale-sage p-2 sm:p-3">
          <div key={scene.id} className="relative aspect-[4/3] w-full animate-fade-in overflow-hidden rounded-xl bg-white">
            <SceneIllustration scene={scene} index={sceneIndex} artwork={artwork} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-5">
          <button type="button" onClick={onPrev} disabled={sceneIndex === 0} aria-label="Previous scene" className={arrowClass}>
            <ChevronLeft aria-hidden="true" className="h-7 w-7" strokeWidth={2.5} />
          </button>
          <span className="min-w-[120px] text-center text-lg font-semibold tabular-nums text-litale-forest-muted" aria-live="polite">
            Scene {sceneIndex + 1} of {sceneCount}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={sceneIndex === sceneCount - 1}
            aria-label="Next scene"
            className={arrowClass}
          >
            <ChevronRight aria-hidden="true" className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5 md:min-h-[300px]">
        <p key={scene.id} className="animate-fade-in text-[28px] font-semibold leading-[1.75] text-litale-ink sm:text-[32px]">
          {words.map((word, i) => (
            <span key={`${word}-${i}`}>
              <span
                className={`rounded-lg transition-[background-color,box-shadow] duration-150 ${
                  i === activeWord ? 'bg-litale-butter shadow-[0_0_0_5px_#FCE89B]' : ''
                }`}
              >
                {word}
              </span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </p>
        {artwork?.caption?.trim() && (
          <p className="rounded-2xl bg-litale-wash px-5 py-4 text-xl leading-relaxed text-litale-ink">
            <span className="block text-base font-semibold text-litale-forest-muted">In my own words</span>
            {artwork.caption.trim()}
          </p>
        )}
      </div>
    </section>
  );
}
