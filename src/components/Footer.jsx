import { BRAND, CONTACT, SOCIALS } from '../config/site'
import {
  PhoneIcon,
  MailIcon,
  PinIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
} from './icons'

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
}

const SHOP_LINKS = [
  { label: 'All products', href: '#products' },
  { label: 'Why us', href: '#about' },
  { label: 'Place an order', href: '#order' },
]

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-sand/70 bg-sage-900 text-sage-100">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* The footer column has room for the full stacked lockup, so show
              the real logo complete with its tagline. It sits on an ivory card
              because the artwork is dark green on a light ground. */}
          <img
            src="/logo.png"
            alt={`${BRAND.name} — Care, Nurture, Empower`}
            width="346"
            height="240"
            className="h-24 w-auto rounded-2xl bg-ivory px-4 py-3"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sage-200">{BRAND.description}</p>
        </div>

        {/* Shop */}
        <nav aria-label="Footer">
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-sage-300 uppercase">
            Shop
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-sm text-sage-100 transition-colors hover:text-ivory"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-sage-300 uppercase">
            Contact
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
              <a
                href={CONTACT.phoneHref}
                className="rounded-sm transition-colors hover:text-ivory"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MailIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
              <a
                href={CONTACT.emailHref}
                className="rounded-sm transition-colors hover:text-ivory"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
              <span className="text-sage-200">{CONTACT.address}</span>
            </li>
            <li className="pt-1 text-sage-300">{CONTACT.hours}</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-sage-300 uppercase">
            Follow
          </h2>
          <ul className="mt-5 flex gap-3">
            {SOCIALS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon]
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-11 place-items-center rounded-full bg-sage-800 text-sage-100 transition-colors duration-300 hover:bg-sage-700 hover:text-ivory"
                  >
                    {Icon ? <Icon className="size-5" /> : social.label}
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-sage-300">
            Wellness information only — not a substitute for medical advice.
          </p>
        </div>
      </div>

      <div className="border-t border-sage-800">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-sage-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
