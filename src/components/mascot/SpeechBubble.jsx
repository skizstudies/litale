/**
 * Pastel speech bubble with a tail pointing up at the mascot.
 * aria-live lets screen readers hear Pagong's new message without moving focus.
 *
 * `sizeTo` lists every message the bubble might show. They're stacked invisibly
 * in the same grid cell, so the bubble is always as tall as the longest one and
 * the page never jumps when the message changes.
 */
export default function SpeechBubble({ children, sizeTo = [] }) {
  return (
    <div className="relative mt-4 w-full">
      <div className="grid rounded-3xl border-2 border-litale-forest bg-litale-butter px-6 py-5 text-center text-lg font-medium leading-relaxed text-litale-ink">
        {sizeTo.map((text) => (
          <span key={text} aria-hidden="true" className="invisible col-start-1 row-start-1">
            {text}
          </span>
        ))}
        <p aria-live="polite" className="col-start-1 row-start-1 self-center">
          {children}
        </p>
      </div>
      {/* tail — drawn on top so it covers the bubble's border where they meet */}
      <span
        aria-hidden="true"
        className="absolute -top-[11px] left-1/2 z-10 h-5 w-5 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-litale-forest bg-litale-butter"
      />
    </div>
  );
}
