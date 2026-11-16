import Card from '../ui/Card';
import Eyebrow from '../ui/Eyebrow';
import SkeletonLines from './SkeletonLines';

/**
 * Right column: the simplified Grade 1–3 story, one sentence per scene.
 * In edit mode each sentence becomes a textarea in the exact same box, and the
 * textarea grows with its text (mirrored by an invisible copy) so nothing jumps.
 */
export default function DraftCard({ scenes, isEditing, onChangeScene }) {
  return (
    <Card aria-labelledby="draft-heading" className="flex flex-col">
      <Eyebrow>
        <span id="draft-heading">Story draft · Grade 1–3 level</span>
      </Eyebrow>
      {scenes ? (
        <ol className="mt-5 flex animate-fade-in flex-col gap-3">
          {scenes.map((scene, index) => {
            const fieldId = `scene-text-${scene.id}`;
            return (
              <li key={scene.id}>
                <label
                  htmlFor={isEditing ? fieldId : undefined}
                  className="text-base font-semibold text-litale-forest-muted"
                >
                  Scene {index + 1}
                </label>
                <div
                  className={`mt-1 grid rounded-2xl border-2 px-4 py-3 text-xl font-medium leading-relaxed transition-colors duration-200 ${
                    isEditing ? 'border-litale-forest bg-white' : 'border-transparent bg-litale-wash'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="invisible col-start-1 row-start-1 whitespace-pre-wrap break-words"
                      >
                        {scene.text}{' '}
                      </span>
                      <textarea
                        id={fieldId}
                        value={scene.text}
                        onChange={(e) => onChangeScene(scene.id, e.target.value)}
                        rows={1}
                        className="col-start-1 row-start-1 resize-none overflow-hidden bg-transparent text-litale-ink focus:outline-none"
                      />
                    </>
                  ) : (
                    <p className="col-start-1 row-start-1 whitespace-pre-wrap break-words">{scene.text}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <SkeletonLines count={8} />
      )}
    </Card>
  );
}
