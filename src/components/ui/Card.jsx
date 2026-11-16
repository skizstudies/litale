/** White surface with soft 1px border and large radius — no drop shadows. */
export default function Card({ as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-3xl border border-litale-border bg-litale-card p-6 sm:p-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
