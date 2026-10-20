import Reveal from './Reveal'
import { ShieldCheckIcon, DropletIcon, TruckIcon, SupportIcon } from './icons'

const BENEFITS = [
  {
    icon: ShieldCheckIcon,
    title: 'Genuine products only',
    body: 'Sourced direct from brands and authorised distributors. Every batch is traceable, sealed and in date.',
  },
  {
    icon: DropletIcon,
    title: 'Dermatologist-safe',
    body: 'Fragrance-free where it matters, patch-test friendly, and free from the irritants sensitive skin reacts to.',
  },
  {
    icon: TruckIcon,
    title: 'Doorstep delivery',
    body: 'Packed the day you order and shipped in protective, recyclable packaging with tracking on every parcel.',
  },
  {
    icon: SupportIcon,
    title: 'Easy human support',
    body: 'Real people on call and on WhatsApp to help you pick a routine, track an order or arrange a return.',
  },
]

/** "Why us" — four short, scannable reasons to trust the brand. */
export default function Benefits() {
  return (
    <section id="about" className="scroll-mt-32 py-20 sm:py-24">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Intro */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <Reveal
              as="p"
              className="text-xs font-semibold tracking-[0.18em] text-sage-600 uppercase"
            >
              Why us
            </Reveal>
            <Reveal as="h2" delay={60} className="mt-4 text-4xl sm:text-5xl">
              Built on proof, not promises
            </Reveal>
            <Reveal as="p" delay={120} className="mt-4 text-lg leading-relaxed text-ink-soft">
              We only stock what we would use ourselves, and we are happy to show the paperwork
              behind it.
            </Reveal>
          </div>

          {/* Feature blocks */}
          <ul className="grid gap-5 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, body }, index) => (
              <Reveal
                as="li"
                key={title}
                delay={(index % 2) * 90}
                className="group rounded-3xl border border-sand/80 bg-ivory p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sage-200 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 transition-colors duration-300 group-hover:bg-sage-100">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
