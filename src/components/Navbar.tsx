import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleDot, Copy, Download, Mail, MapPin, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { cvSnapshot, navLinks, profile } from "../data/portfolioData";
import { scrollToId } from "./Hero";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const ids = ["hero", ...navLinks.map((l) => l.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = menuOpen || cvOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cvOpen]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email address copied", { description: profile.email });
    } catch {
      toast.error("Copy blocked by the browser", { description: "Use the contact form instead." });
    }
  };

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-white/10 bg-[#070c1a]/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => go("hero")}
            className="flex items-center gap-3 text-left"
            aria-label="Go to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-sky-400/30 bg-sky-400/10 font-display text-[13px] font-semibold tracking-wide text-sky-200">
              {profile.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-[13.5px] font-semibold text-white">{profile.name}</span>
              <span className="block text-[11px] tracking-wide text-slate-400">
                Software Engineer
              </span>
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={`rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-[13px] font-semibold text-slate-200 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.06]"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download CV
            </button>
            <button
              type="button"
              onClick={() => go("property-hub")}
              className="group inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-[13px] font-semibold text-slate-950 transition-all duration-200 hover:bg-sky-400 active:translate-y-px"
            >
              View My Work
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-slate-200 transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed inset-0 z-40 bg-[#070c1a]/95 pt-[68px] backdrop-blur-xl lg:hidden"
          >
            <motion.ul
              initial={reduce ? { opacity: 1 } : { y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { y: -8, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pt-6 sm:px-8"
            >
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.03 * i, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className="flex w-full items-center justify-between border-b border-white/[0.07] py-3.5 text-left text-[17px] font-medium text-slate-200"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-slate-500" aria-hidden />
                  </button>
                </motion.li>
              ))}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    go("property-hub");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  View My Work
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setCvOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download CV
                </button>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-medium text-slate-400"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  {profile.email}
                </button>
              </div>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {cvOpen ? (
          <motion.div
            key="cv-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={() => setCvOpen(false)}
          >
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.28, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Curriculum vitae snapshot"
              className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/12 bg-[#0b1120] shadow-[0_40px_120px_-40px_rgba(2,6,23,1)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    CV snapshot
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-400">
                    The full PDF is on the way. Here is the one-page version recruiters ask for.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCvOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/12 text-slate-300 transition-colors hover:bg-white/[0.07]"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto px-5 py-5 sm:px-6">
                <p className="max-w-[68ch] text-sm leading-relaxed text-slate-300">
                  {cvSnapshot.summary}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {cvSnapshot.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                      <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                  {cvSnapshot.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        {fact.label.slice(0, 22)}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-white">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-300" aria-hidden />
                    {profile.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sky-300" aria-hidden />
                    {profile.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-[13px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.06]"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCvOpen(false);
                    toast.success("CV request noted", {
                      description: "Send a one-line email and the PDF lands in your inbox today.",
                    });
                    go("contact");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-[13px] font-semibold text-slate-950 transition-colors hover:bg-sky-400"
                >
                  Request the PDF
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}