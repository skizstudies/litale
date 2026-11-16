import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import PillButton from '../components/ui/PillButton';
import ModeCards from '../components/illustrate/ModeCards';
import ToolStrip from '../components/illustrate/ToolStrip';
import ColoringStage from '../components/illustrate/ColoringStage';
import StrokeCanvas from '../components/illustrate/StrokeCanvas';
import ListenPanel from '../components/illustrate/ListenPanel';
import TypePanel from '../components/illustrate/TypePanel';
import SceneSwitcher from '../components/illustrate/SceneSwitcher';
import { getSceneArt } from '../components/illustrate/sceneArt';
import { DEFAULT_ILLUSTRATE_MODE, DRAW_PEN_SIZE, ILLUSTRATE_MODES, SWATCHES } from '../constants/illustrate';
import { MANGO_TREE_STORY } from '../constants/sampleStories';

// One child's work on one scene.
const EMPTY_ART = { fills: {}, colorStrokes: [], drawStrokes: [], caption: '' };

const hasWork = (art) =>
  Boolean(
    art &&
      (Object.keys(art.fills ?? {}).length ||
        art.colorStrokes?.length ||
        art.drawStrokes?.length ||
        art.caption?.trim()),
  );

/**
 * STEP 3 · ILLUSTRATE — a child (ages 6–9) listens, colors, draws, or types
 * for each scene. Artwork is kept per scene while they switch around.
 *
 * Props
 *  - story: the active story (falls back to the sample draft if none yet)
 *  - onDone({ scenes, illustrations }) => Promise
 *      Saves the artwork and moves on to Read.
 */
export default function IllustrateScreen({ story, onDone }) {
  const scenes = story?.scenes ?? MANGO_TREE_STORY.scenes;

  const [mode, setMode] = useState(DEFAULT_ILLUSTRATE_MODE);
  const [tool, setTool] = useState('fill');
  const [color, setColor] = useState(SWATCHES[0].hex);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [artwork, setArtwork] = useState(() => story?.illustrations ?? {});
  const [isSaving, setIsSaving] = useState(false);

  const scene = scenes[sceneIndex];
  const sceneNumber = sceneIndex + 1;
  const art = { ...EMPTY_ART, ...artwork[scene.id] };
  const stageLabel = ILLUSTRATE_MODES.find((m) => m.id === mode).stageLabel;

  const startedIds = useMemo(
    () => new Set(Object.keys(artwork).filter((id) => hasWork(artwork[id]))),
    [artwork],
  );

  const updateArt = (sceneId, change) =>
    setArtwork((prev) => {
      const current = { ...EMPTY_ART, ...prev[sceneId] };
      return { ...prev, [sceneId]: { ...current, ...change(current) } };
    });

  const handleClear = () => {
    if (mode === 'color') updateArt(scene.id, () => ({ fills: {}, colorStrokes: [] }));
    if (mode === 'draw') updateArt(scene.id, () => ({ drawStrokes: [] }));
  };

  const canClear =
    mode === 'color'
      ? Object.keys(art.fills).length > 0 || art.colorStrokes.length > 0
      : art.drawStrokes.length > 0;

  const handleDone = async () => {
    setIsSaving(true);
    try {
      await onDone({ scenes, illustrations: artwork });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStage = () => {
    switch (mode) {
      case 'listen':
        return <ListenPanel key={scene.id} sceneNumber={sceneNumber} text={scene.text} />;
      case 'type':
        return (
          <TypePanel
            key={scene.id}
            sceneId={scene.id}
            sceneNumber={sceneNumber}
            text={scene.text}
            caption={art.caption}
            onChangeCaption={(caption) => updateArt(scene.id, () => ({ caption }))}
          />
        );
      case 'draw':
        return (
          <StrokeCanvas
            key={scene.id}
            strokes={art.drawStrokes}
            onAddStroke={(stroke) => updateArt(scene.id, (cur) => ({ drawStrokes: [...cur.drawStrokes, stroke] }))}
            color={color}
            size={DRAW_PEN_SIZE}
            label={`Scene ${sceneNumber} drawing`}
            className="h-full w-full"
          />
        );
      case 'color':
      default:
        return (
          <ColoringStage
            key={scene.id}
            art={getSceneArt(scene.id, sceneIndex)}
            fills={art.fills}
            strokes={art.colorStrokes}
            tool={tool}
            color={color}
            label={`Scene ${sceneNumber} coloring picture`}
            onFillRegion={(regionId) => updateArt(scene.id, (cur) => ({ fills: { ...cur.fills, [regionId]: color } }))}
            onAddStroke={(stroke) => updateArt(scene.id, (cur) => ({ colorStrokes: [...cur.colorStrokes, stroke] }))}
          />
        );
    }
  };

  // Canvas modes keep a strict 4:3 shape; text modes may grow on narrow phones.
  const isCanvasMode = mode === 'color' || mode === 'draw';

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div>
        <Eyebrow>Step 3 · Illustrate</Eyebrow>
        <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">How would you like to join the story?</h1>
      </div>

      <ModeCards selectedMode={mode} onSelectMode={setMode} />

      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_260px] lg:gap-6">
        <div className="lg:self-start">
          <ToolStrip
            mode={mode}
            color={color}
            onSelectColor={setColor}
            tool={tool}
            onSelectTool={setTool}
            onClear={handleClear}
            canClear={canClear}
          />
        </div>

        <section
          aria-label={`Scene ${sceneNumber} · ${stageLabel}`}
          className="rounded-3xl border border-litale-border bg-white p-3 sm:p-5"
        >
          <div className="rounded-2xl border-2 border-dashed border-litale-sage p-2 sm:p-3">
            <div
              className={`relative w-full overflow-hidden rounded-xl bg-white ${
                isCanvasMode ? 'aspect-[4/3]' : 'min-h-[300px] sm:aspect-[4/3] sm:min-h-0'
              }`}
            >
              <div className={isCanvasMode ? 'absolute inset-0' : 'h-full sm:absolute sm:inset-0 sm:overflow-y-auto'}>
                {renderStage()}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-base text-litale-ink/60">
            Scene {sceneNumber} · {stageLabel}
          </p>
        </section>

        <div className="flex flex-col gap-4">
          <SceneSwitcher scenes={scenes} selectedIndex={sceneIndex} onSelect={setSceneIndex} startedIds={startedIds} />
          <PillButton
            variant="primary"
            icon={Check}
            onClick={handleDone}
            disabled={isSaving}
            className="w-full lg:mt-auto"
          >
            {isSaving ? 'Saving…' : 'Done'}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
