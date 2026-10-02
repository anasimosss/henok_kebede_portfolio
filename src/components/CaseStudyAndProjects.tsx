import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CircleCheck,
  ExternalLink,
  GraduationCap,
  Lock,
  Users,
} from "lucide-react";
import { caseStudy, processSteps, projects, timeline } from "../data/portfolioData";
import { Chip, CodeLines, Reveal, SectionHeading } from "./Hero";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLE_ICONS = [Lock, Building2, Users];

function CaseStudySection() {
  const [tabId, setTabId] = useState(caseStudy.tabs[0].id);
  const reduce = useReducedMotion();
  const tab = caseStudy.tabs.find((t) => t.id === tabId) ?? caseStudy.tabs[0];
  const webhook = caseStudy.code.find((c) => c.id === "service") ?? caseStudy.code[0];

  return (
    <section id="property-hub" className="relative border-t border-white/[0.07] px-5 py-20 sm:px-8 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_70%_at_50%_0%,rgba(56,189,248,0.08),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionHeading
              title="Property Hub: rental software with money on the line."
              lead={caseStudy.overview}
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <dl className="grid gap-4 sm:grid-cols-2 lg:justify-items-end">
              <div className="border-l border-white/10 pl-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Timeline</dt>
                <dd className="mt-1 text-[14.5px] font-medium text-white">{caseStudy.period}</dd>
              </div>
              <div className="border-l border-white/10 pl-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Scope</dt>
                <dd className="mt-1 max-w-[26ch] text-[13.5px] leading-snug text-slate-300">
                  Solo full-stack build: data model, API, interface, payments, deployment
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudy.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors duration-200 hover:border-sky-400/25"
              >
                <dt className="font-display text-xl font-semibold text-sky-300">{metric.value}</dt>
                <dd className="mt-1 text-[12.5px] leading-snug text-slate-400">{metric.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-5 flex flex-wrap gap-2">
            {caseStudy.stack.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex overflow-x-auto border-b border-white/10" role="tablist" aria-label="Case study details">
              {caseStudy.tabs.map((item) => {
                const isActive = item.id === tab.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTabId(item.id)}
                    className={`relative shrink-0 px-4 py-3.5 text-[13.5px] font-medium transition-colors duration-200 sm:px-5 ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                    {isActive ? (
                      <motion.span
                        layoutId="case-tab-underline"
                        className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-sky-400"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab.id}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="grid gap-8 p-5 sm:p-7 lg:grid-cols-12"
              >
                <div className="lg:col-span-6">
                  <h3 className="font-display text-[1.25rem] font-semibold leading-snug text-white sm:text-[1.4rem]">
                    {tab.heading}
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-slate-400">
                    {tab.body}
                  </p>
                </div>
                <ul className="space-y-3 lg:col-span-6">
                  {tab.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[13.5px] leading-relaxed text-slate-300">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-white">
                Who can see what
              </h3>
              <ul className="mt-5 space-y-3">
                {caseStudy.roles.map((role, i) => {
                  const Icon = ROLE_ICONS[i] ?? Users;
                  return (
                    <li
                      key={role.role}
                      className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors duration-200 hover:border-sky-400/25"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-sky-400/10 text-sky-300">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="flex flex-wrap items-baseline gap-2">
                          <span className="text-[14.5px] font-semibold text-white">{role.role}</span>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-sky-300/80">
                            {role.scope}
                          </span>
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{role.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.06}>
              <h3 className="font-display text-lg font-semibold text-white">
                How a rent payment settles
              </h3>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {caseStudy.payment.map((step, i) => (
                  <li
                    key={step.id}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors duration-200 hover:border-sky-400/25"
                  >
                    <p className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-sky-400/15 font-mono text-[11px] font-semibold text-sky-200">
                        {i + 1}
                      </span>
                      <span className="text-[13.5px] font-semibold text-white">{step.title}</span>
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0b1120]/80">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                  <span className="font-mono text-[11.5px] text-slate-400">{webhook.file}</span>
                  <span className="font-mono text-[11.5px] text-slate-500">
                    simplified for reading
                  </span>
                </div>
                <div className="max-h-[19rem] overflow-y-auto">
                  <CodeLines code={webhook.code} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative border-t border-white/[0.07] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            title="Other things I have shipped."
            lead="Each one started as a complaint about a manual process. The interesting part is always the same: what has to stay correct when something fails halfway."
          />
        </Reveal>

        <div className="mt-12 border-t border-white/[0.07]">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <article className="group grid gap-6 border-b border-white/[0.07] py-8 transition-colors duration-300 hover:bg-white/[0.015] lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    {project.category} - {project.year}
                  </p>
                  <h3 className="mt-2 font-display text-[1.3rem] font-semibold leading-snug text-white">
                    {project.title}
                  </h3>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-[13px] leading-relaxed text-slate-400">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      Problem -{" "}
                    </span>
                    {project.problem}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      What I built -{" "}
                    </span>
                    {project.solution}
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <p className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[12.5px] leading-snug text-slate-300">
                    <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />
                    {project.metric}
                  </p>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300 transition-colors duration-200 hover:text-sky-300"
                  >
                    Source and notes
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative border-t border-white/[0.07] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            title="Work history and how I operate."
            lead="Bank-side engineering, contract product work, and a degree finished while both were running. The process below is not a poster: it is the order I actually work in."
          />
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-7">
            <div aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-white/10" />
            {timeline.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <article className="relative flex gap-5 pb-10 last:pb-0">
                  <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#0b1120] text-sky-300">
                    {item.kind === "work" ? (
                      <Briefcase className="h-4 w-4" aria-hidden />
                    ) : (
                      <GraduationCap className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[1.0625rem] font-semibold text-white">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-[13px] font-medium text-slate-300">
                      {item.org}
                      <span className="text-slate-500"> - {item.place}</span>
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      {item.period}
                    </p>
                    <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-slate-400">
                      {item.summary}
                    </p>
                    <ul className="mt-3.5 space-y-2">
                      {item.highlights.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300"
                        >
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-white">How I work</h3>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {processSteps.map((step) => (
                  <li
                    key={step.id}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors duration-200 hover:border-sky-400/25"
                  >
                    <p className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] font-semibold text-sky-300">
                        {step.index}
                      </span>
                      <span className="text-[14px] font-semibold text-white">{step.title}</span>
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{step.detail}</p>
                    <p className="mt-2.5 border-t border-white/[0.07] pt-2.5 font-mono text-[11px] text-slate-500">
                      Output: {step.outcome}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudyAndProjects() {
  return (
    <>
      <CaseStudySection />
      <ProjectsSection />
      <ExperienceSection />
    </>
  );
}