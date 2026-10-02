import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  CircleCheck,
  Clock,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { contactChannels, navLinks, profile } from "../data/portfolioData";
import type { ContactFormData, FormErrors } from "../types";
import { Reveal, SectionHeading, scrollToId } from "./Hero";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY: ContactFormData = { name: "", email: "", subject: "", message: "" };

const CHANNEL_ICONS = { email: Mail, github: Github, linkedin: Linkedin, location: MapPin } as const;

function validate(values: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please add your name (2 characters or more).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "That email address looks incomplete.";
  if (values.subject.trim().length < 3) errors.subject = "A short subject helps me triage faster.";
  if (values.message.trim().length < 20)
    errors.message = "Add a little more detail (20 characters or more).";
  return errors;
}

export default function ContactAndFooter() {
  const [values, setValues] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const timer = useRef<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const update = (field: keyof ContactFormData) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email address copied", { description: profile.email });
    } catch {
      toast.error("Copy blocked by the browser", { description: "Select the address manually instead." });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "Fix the notes under each field and send again.",
      });
      return;
    }

    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    values.name,
          from_email:   values.email,
          subject:      values.subject,
          message:      values.message,
          to_email:     "henokkebe19@gmail.com",
          reply_to:     values.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );

      setStatus("sent");
      setValues(EMPTY);
      toast.success("Message sent!", {
        description: "Your message was delivered to Henok's inbox.",
      });

      // Reset back to idle after a few seconds so the form can be used again
      timer.current = window.setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("idle");
      toast.error("Send failed", {
        description: "Something went wrong. Try emailing directly: henokkebe19@gmail.com",
      });
    }
  };

  const inputClass = (field: keyof ContactFormData) =>
    `w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white transition-colors duration-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 ${
      errors[field] ? "border-rose-400/60" : "border-white/12 focus:border-sky-400/60"
    }`;

  return (
    <>
      <section id="contact" className="relative border-t border-white/[0.07] px-5 py-20 sm:px-8 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_75%_10%,rgba(56,189,248,0.09),transparent_70%)]"
        />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              title="Tell me what is breaking, or what you want to build."
              lead="Recruiters, hiring managers and business owners all get the same reply time. Include the role or the problem in one line and I will come back to you with a straight answer."
            />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <ul className="space-y-3">
                  {contactChannels.map((channel) => {
                    const Icon = CHANNEL_ICONS[channel.id as keyof typeof CHANNEL_ICONS] ?? Mail;
                    return (
                      <li key={channel.id}>
                        <a
                          href={channel.href}
                          target={channel.id === "email" ? undefined : "_blank"}
                          rel="noreferrer"
                          className="group flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors duration-200 hover:border-sky-400/30 hover:bg-white/[0.05]"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-sky-400/10 text-sky-300">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                                {channel.label}
                              </span>
                              <ArrowUpRight
                                className="h-3.5 w-3.5 text-slate-500 transition-colors duration-200 group-hover:text-sky-300"
                                aria-hidden
                              />
                            </span>
                            <span className="mt-1 block truncate text-[14.5px] font-medium text-white">
                              {channel.value}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] leading-snug text-slate-400">
                              {channel.hint}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-5 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] p-4">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-sky-100">
                    <Clock className="h-4 w-4" aria-hidden />
                    Typical reply time: under 24 hours
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-slate-100 transition-colors hover:bg-white/[0.08]"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                      Copy email
                    </button>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-slate-100 transition-colors hover:bg-white/[0.08]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      LinkedIn profile
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.05}>
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-slate-300">
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => update("name")(e.target.value)}
                        placeholder="Aster Tesfaye"
                        className={inputClass("name")}
                      />
                      {errors.name ? (
                        <p className="mt-1.5 text-[12px] text-rose-300">{errors.name}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-slate-300">
                        Work email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => update("email")(e.target.value)}
                        placeholder="you@company.com"
                        className={inputClass("email")}
                      />
                      {errors.email ? (
                        <p className="mt-1.5 text-[12px] text-rose-300">{errors.email}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="subject" className="mb-1.5 block text-[13px] font-medium text-slate-300">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={values.subject}
                      onChange={(e) => update("subject")(e.target.value)}
                      placeholder="Backend engineer role, or a payments project"
                      className={inputClass("subject")}
                    />
                    {errors.subject ? (
                      <p className="mt-1.5 text-[12px] text-rose-300">{errors.subject}</p>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-slate-300">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={(e) => update("message")(e.target.value)}
                      placeholder="What are you building, what is the timeline, and where does the current setup hurt?"
                      className={`${inputClass("message")} resize-y`}
                    />
                    {errors.message ? (
                      <p className="mt-1.5 text-[12px] text-rose-300">{errors.message}</p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/60 active:translate-y-px"
                    >
                      {status === "sending" ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-900" />
                          Preparing
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </>
                      )}
                    </button>
                    <p className="text-[12.5px] text-slate-500">
                      Sends directly to Henok's inbox. No newsletters, no CRM.
                    </p>
                  </div>

                  <AnimatePresence>
                    {status === "sent" ? (
                      <motion.p
                        initial={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] px-3.5 py-2.5 text-[13px] text-emerald-100"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                        Message sent — Henok will reply within 24 hours.
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-sky-400/30 bg-sky-400/10 font-display text-[13px] font-semibold text-sky-200">
                  {profile.initials}
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-white">{profile.name}</p>
                  <p className="text-[12px] text-slate-400">{profile.focus}</p>
                </div>
              </div>
              <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-slate-400">
                {profile.availability}. Based in {profile.location}, working with teams on site,
                hybrid or fully remote.
              </p>
            </div>

            <nav className="lg:col-span-4" aria-label="Section links">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Sections</p>
              <ul className="mt-3 grid grid-cols-2 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(link.id)}
                      className="text-[13.5px] text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Elsewhere</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 text-slate-300 transition-colors hover:border-sky-400/40 hover:text-sky-200"
                >
                  <Github className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 text-slate-300 transition-colors hover:border-sky-400/40 hover:text-sky-200"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send an email"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 text-slate-300 transition-colors hover:border-sky-400/40 hover:text-sky-200"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <button
                type="button"
                onClick={() => scrollToId("hero")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/12 px-3.5 py-2 text-[12.5px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.06]"
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                Back to top
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] pt-6 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright {new Date().getFullYear()} {profile.name}. Built with React, TypeScript and Tailwind CSS.</p>
            <p className="font-mono">Designed and coded in Addis Ababa</p>
          </div>
        </div>
      </footer>
    </>
  );
}