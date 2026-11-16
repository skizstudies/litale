import { Brush, Check, Eraser, PaintBucket } from 'lucide-react';
import { SWATCHES } from '../../constants/illustrate';

const FILL_TOOLS = [
  { id: 'fill', label: 'Fill a shape', icon: PaintBucket },
  { id: 'brush', label: 'Crayon brush', icon: Brush },
];

const Divider = () => (
  <span aria-hidden="true" className="h-10 w-px shrink-0 bg-litale-border lg:h-px lg:w-10" />
);

/**
 * White pill holding the crayons. Vertical beside the canvas on large screens,
 * a horizontal row above it on small ones. In Listen / Type modes the crayons
 * stay in place but rest (disabled) so nothing moves around.
 */
export default function ToolStrip({ mode, color, onSelectColor, tool, onSelectTool, onClear, canClear }) {
  const isActive = mode === 'color' || mode === 'draw';

  return (
    <div
      role="toolbar"
      aria-label="Crayons"
      className="flex flex-wrap items-center justify-center gap-3 rounded-[2.5rem] border border-litale-border bg-white p-3 lg:flex-col lg:flex-nowrap lg:justify-start lg:rounded-full lg:px-3 lg:py-5"
    >
      {mode === 'color' && (
        <>
          {FILL_TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTool(id)}
              aria-pressed={tool === id}
              aria-label={label}
              title={label}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                tool === id
                  ? 'border-litale-forest bg-litale-forest text-white'
                  : 'border-litale-border bg-litale-mint text-litale-forest hover:border-litale-sage'
              }`}
            >
              <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2.25} />
            </button>
          ))}
          <Divider />
        </>
      )}

      {SWATCHES.map((swatch) => {
        const isSelected = isActive && swatch.hex === color;
        return (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => onSelectColor(swatch.hex)}
            disabled={!isActive}
            aria-pressed={isSelected}
            aria-label={swatch.name}
            title={swatch.name}
            style={{ backgroundColor: swatch.hex }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-litale-ink transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-35 ${
              isSelected ? 'ring-4 ring-litale-forest ring-offset-2' : ''
            }`}
          >
            {isSelected && <Check aria-hidden="true" className="h-6 w-6" style={{ color: swatch.check }} strokeWidth={3} />}
          </button>
        );
      })}

      <Divider />

      <button
        type="button"
        onClick={onClear}
        disabled={!isActive || !canClear}
        className="flex min-h-[64px] w-16 flex-col items-center justify-center gap-1 rounded-2xl text-base font-semibold text-litale-forest transition-colors duration-200 hover:bg-litale-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Eraser aria-hidden="true" className="h-6 w-6" strokeWidth={2.25} />
        Clear
      </button>
    </div>
  );
}
