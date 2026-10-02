export interface NavLink {
  id: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export type SkillTag = "Advanced" | "Proficient" | "Familiar";

export interface SkillItem {
  name: string;
  level: number;
  tag: SkillTag;
}

export interface SkillCategory {
  id: string;
  title: string;
  blurb: string;
  items: SkillItem[];
}

export interface MetricItem {
  value: string;
  label: string;
}

export interface CaseStudyTab {
  id: string;
  label: string;
  heading: string;
  body: string;
  points: string[];
}

export interface CaseStudyRole {
  role: string;
  scope: string;
  detail: string;
}

export interface PaymentStep {
  id: string;
  title: string;
  detail: string;
}

export interface CodeTab {
  id: string;
  file: string;
  lang: string;
  code: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  period: string;
  role: string;
  overview: string;
  stack: string[];
  metrics: MetricItem[];
  tabs: CaseStudyTab[];
  roles: CaseStudyRole[];
  payment: PaymentStep[];
  code: CodeTab[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  problem: string;
  solution: string;
  tech: string[];
  metric: string;
  repo: string;
}

export interface TimelineItem {
  id: string;
  role: string;
  org: string;
  place: string;
  period: string;
  kind: "work" | "education";
  summary: string;
  highlights: string[];
}

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  detail: string;
  outcome: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  hint: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface CvSnapshot {
  summary: string;
  highlights: string[];
  facts: MetricItem[];
}