import { Check } from 'lucide-react';
import { ILLUSTRATE_MODES } from '../../constants/illustrate';

/** Four big, calm choice cards. Only the border and badge change when picked. */
export default function ModeCards({ selectedMode, onSelectMode }) {
  return (
    <ul aria-label="Ways to join the story" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {ILLUSTRATE_MODES.map(({ id, label, icon: Icon }) => {
        const isSelected = id === selectedMode;
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelectMode(id)}
              aria-pressed={isSelected}
              className={`flex h-full min-h-[168px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white px-4 py-5 text-center transition-colors duration-200 ${
                isSelected ? 'border-litale-forest' : 'border-litale-border hover:border-litale-sage'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                  isSelected
                    ? 'border-solid border-litale-forest bg-litale-forest text-white'
                    : 'border-dashed border-litale-sage bg-litale-mint text-litale-forest'
                }`}
              >
                {isSelected ? (
                  <Check className="h-8 w-8" strokeWidth={3} />
                ) : (
                  <Icon className="h-8 w-8" strokeWidth={2} />
                )}
              </span>
              <span className="text-xl font-bold leading-tight text-litale-ink">{label}</span>
              <span className={`text-base ${isSelected ? 'font-semibold text-litale-forest' : 'text-litale-ink/70'}`}>
                {isSelected ? 'Selected' : 'Tap to choose'}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
