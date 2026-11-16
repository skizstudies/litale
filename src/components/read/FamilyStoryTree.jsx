import { BookOpen, Plus } from 'lucide-react';
import Eyebrow from '../ui/Eyebrow';

/** Minimal geometric tree: forest-green branches carrying three round "stories". */
function TreeGraphic() {
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" className="mx-auto h-32 w-auto">
      <g stroke="#2B6E38" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M100 145 V62" />
        <path d="M100 102 L58 72" />
        <path d="M100 86 L144 58" />
      </g>
      <circle cx="52" cy="62" r="22" fill="#4FBF3A" />
      <circle cx="100" cy="38" r="26" fill="#2B6E38" />
      <circle cx="150" cy="50" r="20" fill="#FCE89B" stroke="#1B2E20" strokeWidth="3" />
      <path d="M70 145 H130" stroke="#2B6E38" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Sidebar archive. Clicking a story opens it in the reader (or sends an
 * unfinished one back to Review); "Add a new tale" starts over at Record.
 */
export default function FamilyStoryTree({ stories, readingId, onSelectStory, onAddTale }) {
  return (
    <section
      id="story-tree"
      aria-labelledby="story-tree-heading"
      className="scroll-mt-8 rounded-3xl border border-litale-border bg-white p-6 sm:p-7"
    >
      <Eyebrow>
        <span id="story-tree-heading">Family Story Tree</span>
      </Eyebrow>
      <div className="mt-5">
        <TreeGraphic />
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {stories.map((story) => {
          const isReading = story.id === readingId;
          const needsReview = !story.scenes?.length;
          return (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => onSelectStory(story)}
                aria-current={isReading ? 'true' : undefined}
                className={`flex min-h-[60px] w-full items-center gap-3 rounded-full border-2 px-5 py-2 text-left text-lg font-semibold leading-snug transition-colors duration-200 ${
                  isReading
                    ? 'border-litale-ink bg-litale-butter text-litale-ink'
                    : 'border-transparent bg-litale-mint text-litale-forest hover:border-litale-sage'
                }`}
              >
                <BookOpen aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={2.25} />
                <span className="min-w-0 flex-1">
                  {story.title}
                  {isReading && <span className="font-medium"> · now reading</span>}
                  {needsReview && <span className="font-medium"> · needs review</span>}
                </span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onAddTale}
            className="flex min-h-[60px] w-full items-center gap-3 rounded-full border-2 border-dashed border-litale-sage bg-litale-mint px-5 text-left text-lg font-semibold text-litale-forest transition-colors duration-200 hover:border-litale-forest"
          >
            <Plus aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={2.5} />
            Add a new tale
          </button>
        </li>
      </ul>
    </section>
  );
}
