import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CodeXml } from "lucide-react";
import { caseStudy } from "../data/portfolioData";
import type { CodeTab } from "../types";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Shared primitives (kept in this module to respect the file budget)  */
/* ------------------------------------------------------------------ */

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  title,
  lead,
  className = "",
}: {
  title: ReactNode;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.6rem] text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-400 sm:text-[1.0625rem]">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function Chip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide ${
        accent
          ? "border-sky-400/25 bg-sky-400/10 text-sky-200"
          : "border-white/10 bg-white/[0.04] text-slate-300"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Code rendering                                                      */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  "public",
  "private",
  "static",
  "async",
  "await",
  "var",
  "return",
  "new",
  "if",
  "else",
  "class",
  "using",
  "string",
  "bool",
  "void",
  "readonly",
  "true",
  "false",
  "null",
]);

const isWordChar = (c: string) => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
const isIdentChar = (c: string) =>
  isWordChar(c) || (c >= "0" && c <= "9") || c === ".";
const isDigit = (c: string) => c >= "0" && c <= "9";

function splitTokens(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    const ch = line.charAt(i);
    if (ch === "/" && line.charAt(i + 1) === "/") {
      out.push(line.slice(i));
      break;
    }
    if (ch === '"') {
      let j = i + 1;
      while (j < line.length && line.charAt(j) !== '"') j += 1;
      const end = Math.min(j + 1, line.length);
      out.push(line.slice(i, end));
      i = end;
      continue;
    }
    if (isWordChar(ch)) {
      let j = i + 1;
      while (j < line.length && isIdentChar(line.charAt(j))) j += 1;
      out.push(line.slice(i, j));
      i = j;
      continue;
    }
    if (ch === " ") {
      let j = i + 1;
      while (j < line.length && line.charAt(j) === " ") j += 1;
      out.push(line.slice(i, j));
      i = j;
      continue;
    }
    let j = i + 1;
    while (j < line.length && !isIdentChar(line.charAt(j)) && line.charAt(j) !== " ") j += 1;
    out.push(line.slice(i, j));
    i = j;
  }
  return out;
}

function tokenClass(token: string): string {
  if (token.startsWith("/")) return "italic text-slate-500";
  if (token.startsWith('"')) return "text-emerald-300/90";
  if (KEYWORDS.has(token)) return "text-sky-300";
  if (token.charAt(0) >= "A" && token.charAt(0) <= "Z") return "text-indigo-200/90";
  if (isDigit(token.charAt(0))) return "text-amber-200/80";
  return "text-slate-300";
}

export function CodeLines({ code }: { code: string[] }) {
  return (
    <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] sm:text-[13px]">
      <code>
        {code.map((line, i) => (
          <span key={i} className="grid grid-cols-[2.25rem_1fr] whitespace-pre">
            <span className="select-none pr-3 text-right text-slate-600">{i + 1}</span>
            <span>
              {splitTokens(line).map((token, j) => (
                <span key={j} className={tokenClass(token)}>
                  {token}
                </span>
              ))}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

function CodeVisualizer({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const reduce = useReducedMotion();
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-8 bottom-0 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_70%_10%,rgba(56,189,248,0.14),transparent_70%)] blur-xl"
      />
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1120]/90 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.95)] backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500/70" />
          </div>
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Source files">
            {tabs.map((tab) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.id)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11.5px] transition-colors duration-200 ${
                    isActive
                      ? "bg-sky-500/15 text-sky-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  {tab.file}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="max-h-[22rem] overflow-y-auto"
          >
            <CodeLines code={current.code} />
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[11.5px] text-slate-400">
          <span className="inline-flex items-center gap-2">
            <CodeXml className="h-3.5 w-3.5 text-sky-300" aria-hidden />
            {current.lang} - {current.code.length} lines
          </span>
          <span className="hidden text-slate-500 sm:inline">Property Hub codebase</span>
          <span className="text-slate-500">Verified webhook flow</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:flex lg:min-h-[100dvh] lg:items-center lg:pb-28 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(56,189,248,0.11),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <motion.span
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-slate-300"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            Henok Kebede - Full-Stack Software Engineer
          </motion.span>

          <motion.h1
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
            className="mt-7 font-display text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.1rem] text-balance"
          >
            I build software that businesses run on, then keep running.
          </motion.h1>

          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-slate-400"
          >
            Full-stack engineer in Addis Ababa: layered ASP.NET Core APIs, typed React
            interfaces, and payment flows that reconcile cleanly.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollToId("property-hub")}
              className="group inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-sky-400 hover:shadow-[0_16px_40px_-18px_rgba(14,165,233,0.85)] active:translate-y-px"
            >
              View My Work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>

        <div className="lg:col-span-6">
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <CodeVisualizer tabs={caseStudy.code} />
            <p className="mt-4 pl-1 text-[12.5px] leading-relaxed text-slate-500">
              Excerpts from the Property Hub codebase. Switch files to read the real logic.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}