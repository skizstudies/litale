const WIDTHS = ['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/4', 'w-10/12', 'w-full', 'w-2/3'];

/** Soft placeholder bars while the AI works — calm pulse, no spinners. */
export default function SkeletonLines({ count = 6 }) {
  return (
    <div aria-hidden="true" className="mt-5 flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-5 animate-pulse rounded-full bg-litale-mint ${WIDTHS[i % WIDTHS.length]}`} />
      ))}
    </div>
  );
}
