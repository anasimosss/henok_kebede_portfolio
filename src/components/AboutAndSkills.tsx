import { motion, useReducedMotion } from "framer-motion";
import { CreditCard, Database, LayoutDashboard, MapPin, Server, Terminal, type LucideIcon } from "lucide-react";
import { aboutParagraphs, focusTags, profile, skillCategories, stats } from "../data/portfolioData";
import { Chip, Reveal, SectionHeading } from "./Hero";

const PORTRAIT =
  "https://cdn.phototourl.com/member/2026-09-29-3656b91a-5bec-4ccb-983a-46320ab2daef.jpg";

const ICONS: Record<string, LucideIcon> = {
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  integrations: CreditCard,
  tools: Terminal,
};

function SkillCard({ categoryId, featured = false }: { categoryId: string; featured?: boolean }) {
  const reduce = useReducedMotion();
  const category = skillCategories.find((c) => c.id === categoryId);
  if (!category) return null;
  const Icon = ICONS[category.id] ?? Server;

  return (
    <div
      className={`group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-sky-400/30 hover:bg-white/[0.04] ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
     <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-sky-400/10 text-sky-300">
          <Icon className="h-4.5 w-4.5" aria-hidden />
        </span>
        <h3 className="font-display text-[1.0625rem] font-semibold text-white">{category.title}</h3>
      </div>
      <p className="mt-3 max-w-[52ch] text-[13.5px] leading-relaxed text-slate-400">{category.blurb}</p>

      <ul className={`mt-5 grid gap-x-6 gap-y-3.5 ${featured ? "sm:grid-cols-2" : ""}`}>
        {category.items.map((item) => (
          <li key={item.name}>
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="min-w-0 break-words text-[13.5px] font-medium text-slate-200">{item.name}</span>
              <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-wider text-slate-500">
                {item.tag}
              </span>
            </div>
            <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                style={{ width: `${item.level}%` }}
                className="h-full origin-left rounded-full bg-sky-400/80"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutAndSkills() {
  return (
    <>
      <section id="about" className="relative px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:mx-0">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.25rem] bg-[radial-gradient(60%_60%_at_20%_20%,rgba(56,189,248,0.16),transparent_70%)] blur-lg"
              />
              <img
                src={PORTRAIT}
                alt="Henok Kebede, full-stack software engineer"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-xl border border-white/10 object-cover"
              />
              <div className="absolute -bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-[#0b1120]/95 px-4 py-3 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-[13px] font-medium text-slate-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {profile.availability}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[12.5px] text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-sky-300" aria-hidden />
                  {profile.location} - {profile.timezone}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <SectionHeading
                title="Business process first, framework second."
                lead={undefined}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6 max-w-[68ch] space-y-5">
                {aboutParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-[1.0625rem] leading-relaxed text-slate-200"
                        : "text-[15px] leading-relaxed text-slate-400"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-7 flex flex-wrap gap-2">
                {focusTags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-10 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-l border-white/10 pl-4">
                    <dt className="font-display text-2xl font-semibold text-sky-300">{stat.value}</dt>
                    <dd className="mt-1 text-[12.5px] leading-snug text-slate-400">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="skills" className="relative border-t border-white/[0.07] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              title="What I reach for, and how deep the water goes."
              lead="Levels are honest rather than flattering: advanced means I have shipped and debugged it under real load, familiar means I can read it and make small safe changes."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, i) => (
              <Reveal key={category.id} delay={i * 0.05} className="h-full">
                <SkillCard categoryId={category.id} featured={category.id === "backend"} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}