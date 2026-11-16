import { Check } from 'lucide-react';
import { getSceneIcon } from '../../constants/sceneIcons';

/** Stacked scene picker. A small tick shows which scenes the child has worked on. */
export default function SceneSwitcher({ scenes, selectedIndex, onSelect, startedIds }) {
  return (
    <ol aria-label="Scenes" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
      {scenes.map((scene, index) => {
        const Icon = getSceneIcon(scene.id);
        const isSelected = index === selectedIndex;
        const isStarted = startedIds.has(scene.id);
        return (
          <li key={scene.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={`Scene ${index + 1}: ${scene.title}${isStarted ? ' (started)' : ''}`}
              className={`flex min-h-[84px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-200 ${
                isSelected
                  ? 'border-solid border-litale-forest bg-white'
                  : 'border-dashed border-litale-sage bg-litale-wash hover:bg-litale-mint'
              }`}
            >
              <span
                aria-hidden="true"
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-litale-forest"
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
                {isStarted && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-litale-forest text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold uppercase tracking-[0.12em] text-litale-forest-muted">
                  Scene {index + 1}
                </span>
                <span className="block text-base font-semibold leading-snug text-litale-ink">{scene.title}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
