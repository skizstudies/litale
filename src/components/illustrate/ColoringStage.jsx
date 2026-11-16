import { createElement, useState } from 'react';
import StrokeCanvas from './StrokeCanvas';
import { ART_VIEWBOX } from './sceneArt';
import { COLOR_BRUSH_SIZE } from '../../constants/illustrate';

const INK = '#1B2E20';
const FOCUS = '#2B6E38';

/**
 * Coloring page in three stacked layers so the black lines always stay crisp:
 *   1. fills   — tap a region to pour the chosen colour into it
 *   2. brush   — freehand crayon strokes (only catches touches in brush mode)
 *   3. outlines — the line art, drawn on top, never catches touches
 *
 * With `readOnly` it just displays the finished picture (used by the reader).
 */
export default function ColoringStage({
  art,
  fills,
  strokes,
  tool = 'fill',
  color,
  onFillRegion,
  onAddStroke,
  label,
  readOnly = false,
}) {
  const [focusedRegion, setFocusedRegion] = useState(null);
  const isFill = tool === 'fill';

  const regionHandlers = (id, regionLabel) =>
    readOnly
      ? {}
      : {
          role: 'button',
          tabIndex: isFill ? 0 : -1,
          'aria-label': `Color the ${regionLabel}`,
          className: 'cursor-pointer transition-[fill] duration-200 focus:outline-none',
          onClick: () => onFillRegion(id),
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onFillRegion(id);
            }
          },
          onFocus: () => setFocusedRegion(id),
          onBlur: () => setFocusedRegion(null),
        };

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={ART_VIEWBOX}
        className="absolute inset-0 h-full w-full"
        aria-label={label}
        role={readOnly ? 'img' : 'group'}
      >
        {art.regions.map(({ id, label: regionLabel, shape, props }) =>
          createElement(shape, {
            ...props,
            key: id,
            fill: fills[id] ?? '#FFFFFF',
            ...regionHandlers(id, regionLabel),
          }),
        )}
      </svg>

      <StrokeCanvas
        strokes={strokes}
        onAddStroke={onAddStroke}
        color={color}
        size={COLOR_BRUSH_SIZE}
        enabled={!readOnly && !isFill}
        label="Crayon layer"
        className="absolute inset-0 h-full w-full"
      />

      <svg
        viewBox={ART_VIEWBOX}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {art.regions.map(({ id, shape, props }) =>
          id === 'sky' ? null : createElement(shape, { ...props, key: id }),
        )}
        {art.decor.map(({ shape, props }, i) => createElement(shape, { ...props, key: `decor-${i}` }))}
        {/* keyboard focus highlight for the region about to be colored */}
        {focusedRegion &&
          art.regions
            .filter((region) => region.id === focusedRegion)
            .map(({ id, shape, props }) =>
              createElement(shape, { ...props, key: `focus-${id}`, stroke: FOCUS, strokeWidth: 6, strokeDasharray: '10 6' }),
            )}
      </svg>
    </div>
  );
}
