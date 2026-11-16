const VARIANTS = {
  // Solid forest green — the main action on a screen.
  primary:
    'bg-litale-forest text-white border-2 border-litale-forest hover:bg-litale-forest-hover hover:border-litale-forest-hover',
  // White with green outline — the secondary action.
  secondary:
    'bg-white text-litale-forest border-2 border-litale-forest hover:bg-litale-mint',
  // Pastel yellow — gentle, optional suggestions.
  idea: 'bg-litale-butter text-litale-ink border-2 border-litale-forest hover:bg-litale-butter-hover',
};

const SIZES = {
  // Oversized touch targets: 64px and 56px tall.
  lg: 'min-h-[64px] px-8 text-lg',
  md: 'min-h-[56px] px-6 text-lg',
};

/**
 * Rounded pill button with large hit area.
 * Pass `icon` as a Lucide component to show it before the label.
 */
export default function PillButton({
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  iconPosition = 'start',
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const iconEl = Icon ? <Icon aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={2.25} /> : null;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-3 rounded-full font-semibold leading-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {iconPosition === 'start' && iconEl}
      <span>{children}</span>
      {iconPosition === 'end' && iconEl}
    </button>
  );
}
