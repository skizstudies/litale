import Card from '../ui/Card';
import Eyebrow from '../ui/Eyebrow';
import SkeletonLines from './SkeletonLines';

/** Left column: the storyteller's own words, exactly as they were spoken. */
export default function TranscriptCard({ userName, paragraphs }) {
  return (
    <Card aria-labelledby="transcript-heading" className="flex flex-col">
      <Eyebrow>
        <span id="transcript-heading">{userName}&apos;s words (transcript)</span>
      </Eyebrow>
      {paragraphs ? (
        <div lang="fil" className="mt-5 flex animate-fade-in flex-col gap-4 text-lg leading-relaxed text-litale-ink/85">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <SkeletonLines count={8} />
      )}
    </Card>
  );
}
