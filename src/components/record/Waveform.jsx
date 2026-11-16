// Fixed bar heights (in px) give a natural voice shape without randomness.
const BAR_HEIGHTS = [18, 30, 44, 26, 52, 36, 60, 40, 28, 48, 64, 42, 56, 34, 46, 62, 38, 50, 30, 44, 24, 36, 20, 14];

/**
 * Audio waveform bars. They breathe slowly ONLY while recording; otherwise they
 * sit still and faded. Decorative, so hidden from assistive tech.
 */
export default function Waveform({ active }) {
  return (
    <div aria-hidden="true" className="flex h-16 items-center justify-center gap-[6px]">
      {BAR_HEIGHTS.map((height, i) => (
        <span
          key={i}
          className={`w-[7px] origin-center rounded-full bg-litale-forest transition-opacity duration-500 ${
            active ? 'opacity-100 motion-safe:animate-breathe' : 'opacity-30'
          }`}
          style={{
            height: active ? height : Math.max(10, height * 0.35),
            // Stagger each bar so they move like a soft ripple, not in unison.
            animationDelay: active ? `${(i % 8) * 0.15}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
