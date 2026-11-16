import Eyebrow from '../components/ui/Eyebrow';
import StorybookCard from '../components/read/StorybookCard';
import AudioControlBar from '../components/read/AudioControlBar';
import FamilyStoryTree from '../components/read/FamilyStoryTree';
import { useReadAloud } from '../hooks/useReadAloud';

/** The open book + read-aloud bar. Keyed by story id so playback resets per book. */
function StoryReader({ story }) {
  const reader = useReadAloud(story.scenes, { storyId: story.id });
  const { sceneIndex } = reader;
  const scene = story.scenes[sceneIndex];

  return (
    <div className="flex flex-col gap-6">
      <StorybookCard
        scene={scene}
        sceneIndex={sceneIndex}
        sceneCount={story.scenes.length}
        words={reader.sceneWords[sceneIndex]}
        activeWord={reader.wordIndex}
        artwork={story.illustrations?.[scene.id]}
        onPrev={() => reader.goToScene(sceneIndex - 1)}
        onNext={() => reader.goToScene(sceneIndex + 1)}
      />
      <AudioControlBar
        isPlaying={reader.isPlaying}
        isFinished={reader.isFinished}
        progress={reader.progress}
        narratorName={story.narratorName ?? 'Lola'}
        onToggle={reader.toggle}
      />
    </div>
  );
}

/**
 * STEP 4 · READ TOGETHER
 *
 * Props
 *  - stories: everything in the Family Story Tree
 *  - isLoading: true while the tree is still being fetched
 *  - activeStoryId: the book to open (falls back to the newest finished one)
 *  - onSelectStory(story): open a different book from the tree
 *  - onAddTale(): start a brand-new tale at Record
 */
export default function ReadScreen({ stories, isLoading = false, activeStoryId, onSelectStory, onAddTale }) {
  const readable = stories.filter((story) => story.scenes?.length);
  const story = readable.find((s) => s.id === activeStoryId) ?? readable[0] ?? null;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div>
        <Eyebrow>Step 4 · Read Together</Eyebrow>
        <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">{story?.title ?? 'Your family library'}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)] lg:gap-8">
        {story ? (
          <StoryReader key={story.id} story={story} />
        ) : (
          <p className="rounded-3xl border border-litale-border bg-white p-8 text-lg">
            {isLoading ? 'Opening your family library…' : 'No finished books yet. Record a tale to make the first one!'}
          </p>
        )}
        <div>
          <FamilyStoryTree
            stories={stories}
            readingId={story?.id}
            onSelectStory={onSelectStory}
            onAddTale={onAddTale}
          />
        </div>
      </div>
    </div>
  );
}
