import ColoringStage from '../illustrate/ColoringStage';
import StrokeCanvas from '../illustrate/StrokeCanvas';
import { defaultFillsFor, getSceneArt } from '../illustrate/sceneArt';

/**
 * The finished picture for one page of the book:
 *  - the child's coloring (plus any drawing on top), or
 *  - just their drawing, or
 *  - if they skipped this scene, a softly pre-colored version of the line art.
 */
export default function SceneIllustration({ scene, index, artwork }) {
  const art = getSceneArt(scene.id, index);
  const fills = artwork?.fills ?? {};
  const colorStrokes = artwork?.colorStrokes ?? [];
  const drawStrokes = artwork?.drawStrokes ?? [];
  const hasColoring = Object.keys(fills).length > 0 || colorStrokes.length > 0;
  const hasDrawing = drawStrokes.length > 0;
  const label = `Illustration: ${scene.title}`;

  if (hasDrawing && !hasColoring) {
    return <StrokeCanvas strokes={drawStrokes} enabled={false} label={label} className="h-full w-full bg-white" />;
  }

  return (
    <div className="relative h-full w-full">
      <ColoringStage
        art={art}
        fills={hasColoring ? fills : defaultFillsFor(art)}
        strokes={colorStrokes}
        label={label}
        readOnly
      />
      {hasDrawing && (
        <StrokeCanvas strokes={drawStrokes} enabled={false} label="" className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
