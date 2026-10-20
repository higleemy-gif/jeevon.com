import { useReveal } from '../hooks/useReveal'

/**
 * Thin wrapper that fades + slides its children in on first scroll into view.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div'] Element/component to render.
 * @param {number} [props.delay=0]  Stagger in ms (useful inside grids/lists).
 * @param {string} [props.className]
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, revealed } = useReveal()

  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
