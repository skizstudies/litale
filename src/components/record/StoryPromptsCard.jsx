import { Check } from 'lucide-react';
import Card from '../ui/Card';
import Eyebrow from '../ui/Eyebrow';
import { STORY_PROMPTS } from '../../constants/mascotMessages';

export default function StoryPromptsCard({ selectedPromptId, onSelectPrompt }) {
  return (
    <Card aria-labelledby="story-prompts-heading">
      <Eyebrow>
        <span id="story-prompts-heading">Need an idea?</span>
      </Eyebrow>
      <ul className="mt-5 flex flex-col gap-4">
        {STORY_PROMPTS.map(({ id, label, icon: Icon }) => {
          const isSelected = id === selectedPromptId;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelectPrompt(id)}
                aria-pressed={isSelected}
                className={`flex min-h-[60px] w-full items-center gap-3 rounded-full border-2 bg-litale-butter px-6 text-left text-lg font-semibold text-litale-ink transition-colors duration-200 hover:bg-litale-butter-hover ${
                  isSelected ? 'border-litale-ink' : 'border-litale-forest'
                }`}
              >
                <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-litale-forest" strokeWidth={2.25} />
                <span className="flex-1">{label}</span>
                {isSelected && (
                  <Check aria-hidden="true" className="h-6 w-6 shrink-0 text-litale-forest" strokeWidth={2.75} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
