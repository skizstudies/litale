import { Dices, Scroll, Soup } from 'lucide-react';

// Everything Pagong says lives here so copy can be edited (or translated) in one place.
export const MASCOT_MESSAGES = {
  idle: (name) => `Take your time, ${name}. I'm all ears.`,
  recording: (name) => `Great story, ${name}! Ready to save whenever you are.`,
  paused: (name) => `Take a little rest, ${name}. Tap the microphone when you're ready.`,
  nothingToSave: (name) => `Let's record a little first, ${name}. Tap the yellow microphone to begin.`,
  saving: () => 'Tucking your story somewhere safe…',
  confirmRestart: (name) =>
    `Start a brand-new tale, ${name}? Tap “Yes, start over” and I'll listen from the beginning.`,
};

// "Need an idea?" prompts. `message` is what Pagong says when the prompt is chosen.
export const STORY_PROMPTS = [
  {
    id: 'childhood-game',
    label: 'A childhood game',
    icon: Dices,
    message: 'Tell me about your favorite childhood game! Who did you play it with?',
  },
  {
    id: 'family-legend',
    label: 'A family legend',
    icon: Scroll,
    message: 'Tell me a family legend! Who first told it to you?',
  },
  {
    id: 'favorite-food',
    label: 'Your favorite food',
    icon: Soup,
    message: 'Tell me about your favorite food! Who used to cook it for you?',
  },
];

// Every message Pagong can say on the Record screen — used to keep the speech
// bubble a fixed size so the layout doesn't shift between messages.
export const allRecordMessages = (name) => [
  ...Object.values(MASCOT_MESSAGES).map((message) => message(name)),
  ...STORY_PROMPTS.map((prompt) => prompt.message),
];

export const getPrompt = (id) => STORY_PROMPTS.find((prompt) => prompt.id === id) ?? null;
