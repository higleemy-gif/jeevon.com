import Reveal from './Reveal'
import HeroVisual from './HeroVisual'
import { ArrowRightIcon, ShieldCheckIcon, DropletIcon } from './icons'

const TRUST_POINTS = [
  { icon: ShieldCheckIcon, label: '100% genuine' },
  { icon: DropletIcon, label: 'Dermatologist-safe' },
]

/** Above-the-fold introduction: headline, promise, primary CTA, product visual. */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Ambient colour wash — purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-sage-100/70 blur-3xl" />
        <div className="absolute top-40 -right-20 size-[24rem] rounded-full bg-blush-100/70 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        {/* Copy */}
        <div>
          <Reveal className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-sage-700 uppercase">
            <span className="size-1.5 rounded-full bg-sage-500" />
            New — barrier care range
          </Reveal>

          <Reveal as="h1" delay={80} className="mt-6 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Skincare that is <em className="italic text-sage-600">clean</em>, healthcare that is
            honest.
          </Reveal>

          <Reveal
            as="p"
            delay={160}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty"
          >
            Short ingredient lists, dermatologist-tested formulas and everyday health essentials
            you can actually trust. Sourced genuine, shipped fresh, delivered to your doorstep.
          </Reveal>

          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#order"
              className="group inline-flex items-center gap-2 rounded-full bg-sage-600 px-7 py-3.5 text-base font-semibold text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-700 hover:shadow-lift"
            >
              Join Now
              <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full border border-sand bg-ivory px-7 py-3.5 text-base font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-300 hover:bg-cream"
            >
              Browse products
            </a>
          </Reveal>

          {/* Trust strip */}
          <Reveal delay={320} as="ul" className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <Icon className="size-5 text-sage-500" />
                {label}
              </li>
            ))}
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={200} className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-sand/70">
            <HeroVisual className="aspect-4/5 size-full" />
          </div>

          {/* Floating credibility card */}
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-sand/80 bg-ivory/95 px-4 py-3 shadow-lift backdrop-blur-sm sm:left-8">
            <span className="grid size-10 place-items-center rounded-full bg-blush-100 text-blush-500">
              <ShieldCheckIcon className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">Lab tested batches</span>
              <span className="block text-ink-soft">Reports with every order</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
