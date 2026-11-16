import Card from '../ui/Card';
import Eyebrow from '../ui/Eyebrow';
import { getSceneIcon } from '../../constants/sceneIcons';

const PLACEHOLDER_SCENES = [1, 2, 3, 4].map((n) => ({ id: `placeholder-${n}`, title: '' }));

export default function Storyboard({ scenes }) {
  const items = scenes ?? PLACEHOLDER_SCENES;

  return (
    <Card aria-labelledby="storyboard-heading">
      <Eyebrow>
        <span id="storyboard-heading">Interactive storyboard</span>
      </Eyebrow>
      <ol className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((scene, index) => {
          const Icon = getSceneIcon(scene.id);
          return (
            <li
              key={scene.id}
              className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-litale-sage bg-litale-wash p-5 text-center"
            >
              <span className="text-base font-semibold uppercase tracking-[0.14em] text-litale-forest-muted">
                Scene {index + 1}
              </span>
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-litale-forest"
              >
                <Icon className="h-8 w-8" strokeWidth={2} />
              </span>
              {scenes ? (
                <span className="animate-fade-in text-lg font-semibold leading-snug">{scene.title}</span>
              ) : (
                <span aria-hidden="true" className="h-5 w-3/4 animate-pulse rounded-full bg-litale-mint" />
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
