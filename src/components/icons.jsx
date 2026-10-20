/**
 * Small, dependency-free icon set.
 *
 * All icons are 24x24 stroke SVGs that inherit `currentColor` and are marked
 * `aria-hidden` — they are decorative, so the adjacent text carries the meaning.
 */

/** Shared wrapper so every icon has identical stroke treatment. */
function Icon({ children, className = 'size-6', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Benefits                                                                   */
/* -------------------------------------------------------------------------- */

/** Genuine / verified products */
export function ShieldCheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 8.5 4.1-.9 7-4.3 7-8.5V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </Icon>
  )
}

/** Dermatologist-safe / gentle formulas */
export function DropletIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5c3 3.4 5.5 6.2 5.5 9.2a5.5 5.5 0 0 1-11 0c0-3 2.5-5.8 5.5-9.2Z" />
      <path d="M9.5 14.2a2.8 2.8 0 0 0 2.8 2.8" />
    </Icon>
  )
}

/** Doorstep delivery */
export function TruckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 7h10v9H3z" />
      <path d="M13 10h3.5l2.5 3v3H13z" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="16.5" cy="18.5" r="1.6" />
    </Icon>
  )
}

/** Easy human support */
export function SupportIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
      <path d="M5 13h1.6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z" />
      <path d="M19 13h-1.6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z" />
    </Icon>
  )
}

/* -------------------------------------------------------------------------- */
/* UI                                                                         */
/* -------------------------------------------------------------------------- */

export function MenuIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  )
}

export function CloseIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  )
}

export function CheckCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.3 2.3 4.7-5" />
    </Icon>
  )
}

export function AlertIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </Icon>
  )
}

export function ArrowRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Icon>
  )
}

/** Inline spinner for the submit button's loading state. */
export function SpinnerIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} animate-spin`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Footer / contact                                                           */
/* -------------------------------------------------------------------------- */

export function PhoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h2.2l1.3 3.4-1.8 1.3a9.5 9.5 0 0 0 4.6 4.6l1.3-1.8 3.4 1.3v2.2a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </Icon>
  )
}

export function MailIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m4 7 8 5.5L20 7" />
    </Icon>
  )
}

export function PinIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 21s6.5-5.6 6.5-10.3A6.5 6.5 0 0 0 5.5 10.7C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </Icon>
  )
}

export function InstagramIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M16.8 7.2h.01" />
    </Icon>
  )
}

export function FacebookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14.5 8.5h2V5.8h-2.2A3.3 3.3 0 0 0 11 9.1v1.6H9v2.7h2V21h3v-7.6h2.2l.4-2.7H14V9.4c0-.5.2-.9.5-.9Z" />
    </Icon>
  )
}

export function WhatsAppIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20l1.2-3.4A8 8 0 1 1 8.4 19.3L4 20Z" />
      <path d="M9.2 9.1c.4 1.9 1.8 3.3 3.7 3.7l.9-1.1 1.8.8v1a1 1 0 0 1-1.1 1 7 7 0 0 1-6-6 1 1 0 0 1 1-1.1h1l.8 1.8-1.1.9Z" />
    </Icon>
  )
}
