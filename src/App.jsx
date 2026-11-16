import { useCallback, useEffect, useRef, useState } from 'react';
import TopNav from './components/layout/TopNav';
import RecordScreen from './screens/RecordScreen';
import ReviewScreen from './screens/ReviewScreen';
import IllustrateScreen from './screens/IllustrateScreen';
import ReadScreen from './screens/ReadScreen';
import { DEFAULT_STEP } from './constants/steps';
import { getPrompt } from './constants/mascotMessages';
import { listStoryTree, saveStoryToTree, uploadRecording } from './services/mockApiService';

// TODO(backend): replace with the signed-in storyteller from Supabase Auth / profile.
const CURRENT_USER = { name: 'Lola' };

/**
 * App-level state lives here and only here:
 *  - currentStep:    which of the 4 steps is shown
 *  - stories:        the Family Story Tree (loaded from the API service)
 *  - activeStoryId:  the tale moving through Review → Illustrate → Read
 *
 * Every backend call goes through services/mockApiService.js.
 */
export default function App() {
  const [currentStep, setCurrentStep] = useState(DEFAULT_STEP);
  const [stories, setStories] = useState([]);
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [scrollToTree, setScrollToTree] = useState(false);
  const mainRef = useRef(null);

  const activeStory = stories.find((s) => s.id === activeStoryId) ?? null;

  useEffect(() => {
    listStoryTree().then((tree) => {
      setStories(tree);
      setStoriesLoaded(true);
    });
  }, []);

  const goToStep = useCallback((stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0 });
    // Move focus to the new screen so screen-reader users hear where they are.
    requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  }, []);

  const openStoryTree = useCallback(() => {
    setCurrentStep('read');
    setScrollToTree(true);
  }, []);

  // Scroll to the archive once the Read screen has rendered.
  useEffect(() => {
    if (!scrollToTree || currentStep !== 'read') return;
    document.getElementById('story-tree')?.scrollIntoView({ block: 'start' });
    setScrollToTree(false);
  }, [scrollToTree, currentStep]);

  const upsertStory = useCallback((saved) => {
    setStories((prev) =>
      prev.some((s) => s.id === saved.id) ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev],
    );
    setActiveStoryId(saved.id);
  }, []);

  // The story later steps write into. If the user jumped ahead from the nav
  // (nothing recorded yet), start an empty story to hold their work.
  const ensureActiveStory = useCallback(
    async () =>
      activeStory ??
      uploadRecording({
        durationSeconds: 0,
        title: `${CURRENT_USER.name}'s Tale #${stories.length + 1}`,
        narratorName: CURRENT_USER.name,
      }),
    [activeStory, stories.length],
  );

  // Step 1 → 2
  const handleSaveRecording = useCallback(
    async ({ durationSeconds, audioBlob, promptId }) => {
      const prompt = getPrompt(promptId);
      const story = await uploadRecording({
        audioBlob,
        durationSeconds,
        promptId,
        narratorName: CURRENT_USER.name,
        title: prompt ? `${CURRENT_USER.name}'s Tale: ${prompt.label}` : `${CURRENT_USER.name}'s Tale #${stories.length + 1}`,
      });
      upsertStory(story);
      goToStep('review');
    },
    [goToStep, upsertStory, stories.length],
  );

  // Step 2 → 3
  const handleApproveDraft = useCallback(
    async ({ transcript, scenes }) => {
      const base = await ensureActiveStory();
      upsertStory(await saveStoryToTree({ ...base, transcript, scenes, status: 'reviewed' }));
      goToStep('illustrate');
    },
    [ensureActiveStory, upsertStory, goToStep],
  );

  // Step 3 → 4
  const handleSaveIllustrations = useCallback(
    async ({ scenes, illustrations }) => {
      const base = await ensureActiveStory();
      upsertStory(
        await saveStoryToTree({ ...base, scenes: base.scenes ?? scenes, illustrations, status: 'illustrated' }),
      );
      goToStep('read');
    },
    [ensureActiveStory, upsertStory, goToStep],
  );

  // Family Story Tree: open a finished book, or finish an unreviewed one.
  const handleSelectStory = useCallback(
    (story) => {
      setActiveStoryId(story.id);
      if (!story.scenes?.length) goToStep('review');
    },
    [goToStep],
  );

  const handleAddTale = useCallback(() => {
    setActiveStoryId(null);
    goToStep('record');
  }, [goToStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'review':
        return (
          <ReviewScreen
            key={activeStoryId ?? 'new'}
            story={activeStory}
            userName={CURRENT_USER.name}
            onApprove={handleApproveDraft}
          />
        );
      case 'illustrate':
        return <IllustrateScreen key={activeStoryId ?? 'new'} story={activeStory} onDone={handleSaveIllustrations} />;
      case 'read':
        return (
          <ReadScreen
            stories={stories}
            isLoading={!storiesLoaded}
            activeStoryId={activeStoryId}
            onSelectStory={handleSelectStory}
            onAddTale={handleAddTale}
          />
        );
      case 'record':
      default:
        return <RecordScreen userName={CURRENT_USER.name} onSaveRecording={handleSaveRecording} />;
    }
  };

  return (
    <div className="min-h-screen bg-litale-bg">
      <TopNav currentStep={currentStep} onStepChange={goToStep} onOpenStoryTree={openStoryTree} />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto max-w-7xl px-5 py-8 focus:outline-none focus-visible:ring-0 sm:px-8 sm:py-10"
      >
        {/* Keyed by step so each screen fades in gently when it appears. */}
        <div key={currentStep} className="animate-fade-in">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
