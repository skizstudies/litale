/** Small uppercase, tracked label above a heading (e.g. "STEP 1 · RECORD"). */
export default function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`text-base font-semibold uppercase tracking-[0.18em] text-litale-forest-muted ${className}`}
    >
      {children}
    </p>
  );
}
