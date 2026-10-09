/**
 * GlassCard — reusable frosted-glass card.
 * Uses the .glass CSS class (backdrop-filter) with solid fallback.
 *
 * Props:
 *   className  – additional classes
 *   style      – inline style overrides
 *   as         – HTML element (default "div")
 *   onClick    – click handler
 *   id         – element id
 *   children   – content
 */
export default function GlassCard({
  className = '',
  style = {},
  as: Tag = 'div',
  onClick,
  id,
  children,
  ...rest
}) {
  return (
    <Tag
      id={id}
      className={`glass ${className}`}
      style={{ ...style }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Tag>
  )
}
