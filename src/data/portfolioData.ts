import type {
  CaseStudy,
  ContactChannel,
  CvSnapshot,
  NavLink,
  ProcessStep,
  Project,
  SkillCategory,
  StatItem,
  TimelineItem,
} from "../types";

export const profile = {
  name: "Henok Kebede",
  initials: "HK",
  role: "Full-Stack Software Engineer",
  focus: "ASP.NET Core, React and payment integrations",
  email: "henokkebe19@gmail.com",
  location: "Addis Ababa, Ethiopia",
  timezone: "EAT (UTC+3)",
  availability: "Open to full-time and contract software engineering roles",
  github: "https://github.com/@nasimosss",
  linkedin: "https://linkedin.com/in/",
} as const;

export const navLinks: NavLink[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "property-hub", label: "Case Study" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const aboutParagraphs: string[] = [
  "I build software the way businesses actually use it: reliable, measurable, and easy for the next engineer to extend. Most of my work starts with a blunt question about the business process, not with a framework decision.",
  "Day to day that means layered ASP.NET Core APIs, typed React and TypeScript interfaces, and SQL Server data models that stay predictable under load. I care most about money flows, because a single missed payment event costs a real customer real birr.",
  "Right now I work with bank-side tooling and rental marketplace software, and I am finishing a BSc in Software Engineering at Debre Markos University in 2026.",
];

export const focusTags: string[] = [
  "ASP.NET Core 8 Web APIs",
  "React 19 + TypeScript",
  "SQL Server tuning",
  "Chapa payment workflows",
  "Role-based access control",
  "Clean architecture",
];

export const stats: StatItem[] = [
  { value: "6+", label: "Systems shipped end to end" },
  { value: "3", label: "Payment and ledger integrations" },
  { value: "3", label: "Role scopes enforced server side" },
  { value: "2026", label: "BSc Software Engineering" },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend & APIs",
    blurb: "Contract-first services that stay predictable when traffic and rules get messy.",
    items: [
      { name: "C# / .NET", level: 88, tag: "Advanced" },
      { name: "ASP.NET Core Web API", level: 90, tag: "Advanced" },
      { name: "REST resource design", level: 86, tag: "Advanced" },
      { name: "JWT and role policies", level: 84, tag: "Advanced" },
      { name: "Entity Framework Core", level: 82, tag: "Proficient" },
      { name: "Webhooks and background jobs", level: 78, tag: "Proficient" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces that make complex state obvious instead of hiding it.",
    items: [
      { name: "React 19", level: 88, tag: "Advanced" },
      { name: "TypeScript", level: 86, tag: "Advanced" },
      { name: "Tailwind CSS", level: 84, tag: "Advanced" },
      { name: "Vite tooling", level: 78, tag: "Proficient" },
      { name: "Radix and MUI components", level: 76, tag: "Proficient" },
      { name: "Framer Motion", level: 72, tag: "Familiar" },
    ],
  },
  {
    id: "data",
    title: "Database",
    blurb: "Normalized schemas first, then measured tuning where it shows up.",
    items: [
      { name: "SQL Server", level: 88, tag: "Advanced" },
      { name: "Query and index tuning", level: 84, tag: "Advanced" },
      { name: "EF Core migrations", level: 82, tag: "Proficient" },
      { name: "Relational modeling (3NF)", level: 80, tag: "Proficient" },
      { name: "Reporting and ledgers", level: 78, tag: "Proficient" },
      { name: "Redis caching", level: 66, tag: "Familiar" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations & Payments",
    blurb: "The unglamorous part where correctness matters more than cleverness.",
    items: [
      { name: "Chapa payment gateway", level: 88, tag: "Advanced" },
      { name: "Signature-verified webhooks", level: 84, tag: "Advanced" },
      { name: "Idempotency and retries", level: 82, tag: "Proficient" },
      { name: "OpenAPI / Swagger contracts", level: 84, tag: "Advanced" },
      { name: "Postman test suites", level: 80, tag: "Proficient" },
      { name: "Reconciliation sweeps", level: 76, tag: "Proficient" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Practice",
    blurb: "Habits that keep a codebase readable after the first sprint.",
    items: [
      { name: "Git and code review", level: 88, tag: "Advanced" },
      { name: "Structured logging", level: 80, tag: "Proficient" },
      { name: "Docker basics", level: 74, tag: "Proficient" },
      { name: "CI pipelines", level: 72, tag: "Proficient" },
      { name: "Swagger documentation", level: 84, tag: "Advanced" },
      { name: "Incident triage", level: 84, tag: "Advanced" },
    ],
  },
];

export const caseStudy: CaseStudy = {
  id: "property-hub",
  title: "Property Hub",
  tagline: "A rental marketplace with real money moving through it.",
  period: "2025 - 2026",
  role: "Solo full-stack build: data model, API, interface, payments, deployment",
  overview:
    "Landlords publish units, tenants apply and pay deposit or rent, and admins verify owners and resolve disputes. Every financial action writes to an auditable ledger that reconciles against a Chapa payment webhook, so the rent statement and the gateway always agree.",
  stack: [
    "ASP.NET Core 8",
    "C# 12",
    "Entity Framework Core",
    "SQL Server",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "JWT + role policies",
    "Chapa API",
  ],
  metrics: [
    { value: "3", label: "Permission scopes resolved server side" },
    { value: "100%", label: "Payment events matched to a ledger entry" },
    { value: "0", label: "Duplicate postings after the replay guard" },
    { value: "40%", label: "Faster dashboard reads after index tuning" },
  ],
  tabs: [
    {
      id: "architecture",
      label: "Architecture",
      heading: "Layered by responsibility, not by folder habit",
      body: "Controllers only handle auth, mapping and HTTP status. Business rules and the ledger live in the application layer, and the domain never imports a database type.",
      points: [
        "Controllers stay thin: no query building, no business rules",
        "Application layer owns validation, ledger posting and payment orchestration",
        "Normalized schema: Properties, Units, Leases, Invoices, Payments, Users",
        "Report queries use AsNoTracking with covering indexes and server-side paging",
      ],
    },
    {
      id: "access",
      label: "Multi-role access",
      heading: "Three scopes, one codebase, zero leaks",
      body: "The role claim decides entry, but ownership is always resolved from the database on the server. The frontend never filters data for security, it only decides what to draw.",
      points: [
        "JWT carries role plus landlord or tenant identity claims",
        "Policy handlers confirm record ownership before the query runs",
        "Every list endpoint is scoped by owner id at the query level",
        "Admin-only actions (verify, refund, dispute) are audit logged",
      ],
    },
    {
      id: "payments",
      label: "Chapa payments",
      heading: "Money in through the gateway, money out through the ledger",
      body: "Checkout is initialised server side so amounts and references cannot be tampered with. Both the redirect callback and the webhook are treated as untrusted until the gateway confirms the transaction.",
      points: [
        "Server creates the payment row as Pending and returns a Chapa checkout link",
        "Webhook signature verified before any field is read",
        "Transaction status re-read from the gateway, never taken from the payload",
        "Idempotency key plus a unique TxRef index blocks double posting",
      ],
    },
    {
      id: "challenges",
      label: "Hard parts",
      heading: "What actually cost time, and how it ended",
      body: "Most of the difficulty sat in the edges: replays, slow reports, and access rules that looked fine until two roles collided.",
      points: [
        "Rent posted twice on webhook replay - solved with a unique TxRef index and a settled guard",
        "Landlord dashboards timed out - solved with a covering index and server-side pagination",
        "Role checks leaked through client state - solved by deleting them from the frontend entirely",
        "Ledger drifted from gateway totals - solved with a nightly reconciliation sweep and an alerting report",
      ],
    },
  ],
  roles: [
    {
      role: "Admin",
      scope: "Platform wide",
      detail: "Verifies landlords, resolves disputes, issues refunds, reads the full platform ledger.",
    },
    {
      role: "Landlord",
      scope: "Own properties",
      detail: "Publishes units, reviews applications, tracks rent status, exports monthly statements.",
    },
    {
      role: "Tenant",
      scope: "Own lease",
      detail: "Applies to units, pays deposit and rent, downloads receipts, raises maintenance issues.",
    },
  ],
  payment: [
    {
      id: "step-1",
      title: "Initialise",
      detail: "The tenant starts checkout. The API creates a Pending payment row and returns a signed Chapa checkout link.",
    },
    {
      id: "step-2",
      title: "Pay",
      detail: "The tenant pays on Chapa. Card and wallet data never touch the Property Hub server.",
    },
    {
      id: "step-3",
      title: "Verify",
      detail: "Callback and webhook both arrive. Signature is checked, then the transaction is re-read from the gateway.",
    },
    {
      id: "step-4",
      title: "Settle",
      detail: "Settlement posts to the ledger exactly once, the invoice closes, and the tenant receipt becomes available.",
    },
  ],
  code: [
    {
      id: "controller",
      file: "PropertyController.cs",
      lang: "csharp",
      code: [
        '[Authorize(Roles = "Landlord,Admin")]',
        '[HttpGet("api/properties/{id:guid}/ledger")]',
        "public async Task<ActionResult<LedgerDto>> GetLedger(Guid id, CancellationToken ct)",
        "{",
        "    var property = await _db.Properties",
        "        .AsNoTracking()",
        "        .Include(p => p.Units)",
        "        .FirstOrDefaultAsync(p => p.Id == id, ct);",
        "",
        "    // Ownership is re-resolved on the server, never trusted from the client",
        "    if (property is null) return NotFound();",
        "    if (!_access.CanRead(User, property)) return Forbid();",
        "",
        "    var ledger = await _ledger.BuildAsync(property, ct);",
        "    return Ok(ledger);",
        "}",
      ],
    },
    {
      id: "service",
      file: "ChapaPaymentService.cs",
      lang: "csharp",
      code: [
        "public async Task<PaymentResult> HandleWebhookAsync(ChapaEvent payload, string signature, CancellationToken ct)",
        "{",
        "    if (!_signer.IsValid(payload, signature))",
        '        return PaymentResult.Rejected("signature_mismatch");',
        "",
        "    var payment = await _db.Payments.FirstOrDefaultAsync(p => p.TxRef == payload.TxRef, ct);",
        '    if (payment is null) return PaymentResult.Rejected("unknown_tx_ref");',
        "",
        "    // Replay guard: a settled payment is returned without posting again",
        "    if (payment.Status == PaymentStatus.Settled)",
        "        return PaymentResult.Settled(payment.Id);",
        "",
        "    var confirmed = await _gateway.GetTransactionAsync(payload.TxRef, ct);",
        "    if (!confirmed.IsSuccess) return PaymentResult.Pending(payment.Id);",
        "",
        "    await _ledger.PostAsync(payment, confirmed, ct);",
        "    return PaymentResult.Settled(payment.Id);",
        "}",
      ],
    },
    {
      id: "architecture-file",
      file: "SystemArchitecture.json",
      lang: "json",
      code: [
        "{",
        '  "layers": [',
        '    "Api - ASP.NET Core Web API, JWT plus role policies",',
        '    "Application - CQRS handlers, validators, ledger service",',
        '    "Domain - Property, Unit, Lease, Invoice, Payment",',
        '    "Infrastructure - EF Core, SQL Server, Chapa client"',
        "  ],",
        '  "payments": {',
        '    "gateway": "Chapa",',
        '    "webhook": "signature verified then re-read from gateway",',
        '    "replay_protection": "unique TxRef index plus settled guard"',
        "  },",
        '  "observability": "structured logs, health checks, nightly reconciliation sweep"',
        "}",
      ],
    },
  ],
};

export const projects: Project[] = [
  {
    id: "audit-desk",
    title: "Branch Audit Desk",
    category: "Internal banking tool",
    year: "2025",
    problem:
      "Branch staff filed audit and incident tickets by email, so follow-ups died in inboxes and management had no view of repeat issues.",
    solution:
      "A ticketing desk with categories, SLA timers, role-based visibility and a one-click weekly report that replaced manual spreadsheet roll-ups.",
    tech: ["React", "TypeScript", "ASP.NET Core", "SQL Server"],
    metric: "Email threads replaced by tracked tickets with owners and due dates",
    repo: "https://github.com/henok-kebede",
  },
  {
    id: "sme-ledger",
    title: "SME Ledger Service",
    category: "Fintech backend",
    year: "2025",
    problem:
      "Small merchants tracked daily sales in notebooks, which made reconciliation and credit decisions guesswork.",
    solution:
      "A double-entry ledger API with idempotent posting, daily balance snapshots and a reconciliation endpoint that matches gateway payouts to entries.",
    tech: ["C#", "EF Core", "SQL Server", "REST"],
    metric: "Every posting balances by construction, with an audit trail per entry",
    repo: "https://github.com/henok-kebede",
  },
  {
    id: "checkout-module",
    title: "Storefront Checkout Module",
    category: "E-commerce integration",
    year: "2024",
    problem:
      "Ethiopian SME stores had no online payment path without building a custom integration for each shop.",
    solution:
      "A reusable checkout module over the Chapa API: hosted checkout, verified callbacks, an order state machine and a React order tracker.",
    tech: ["ASP.NET Core", "Chapa API", "Webhooks", "React"],
    metric: "Online payment added to a storefront in under a day",
    repo: "https://github.com/henok-kebede",
  },
  {
    id: "branch-query-dashboard",
    title: "Branch Query Dashboard",
    category: "Internal banking tool",
    year: "2025",
    problem:
      "Branch managers at Berhan Bank pulled daily transaction summaries by pasting raw SQL into SSMS and reformatting the output by hand — a process that took 30-40 minutes and produced inconsistent numbers.",
    solution:
      "A secured internal web dashboard backed by parameterised SQL Server stored procedures: managers pick a date range and branch, the API executes the right query with covering indexes, and the result renders as a filterable table with a one-click CSV export.",
    tech: ["ASP.NET Core", "SQL Server", "React", "TypeScript", "Role-based auth"],
    metric: "Daily summary time cut from ~35 minutes to under 2 minutes for branch managers",
    repo: "https://github.com/henok-kebede",
  },
  {
    id: "api-health-monitor",
    title: "Payment API Health Monitor",
    category: "Observability tool",
    year: "2026",
    problem:
      "Failed Chapa webhook deliveries surfaced only when a tenant complained about a missing receipt — by then the ledger was already out of sync and a manual fix was needed.",
    solution:
      "A lightweight polling service that reads the payment table on a schedule, cross-checks every Pending row older than five minutes against the Chapa transaction API, and writes a structured alert log plus triggers a reconciliation sweep if the mismatch count exceeds a threshold.",
    tech: ["C#", "ASP.NET Core Background Service", "Chapa API", "SQL Server", "Structured logging"],
    metric: "Ledger drift caught within 5 minutes instead of surfacing through user complaints",
    repo: "https://github.com/henok-kebede",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "berhan-bank",
    role: "Junior IT Officer / Programmer",
    org: "Berhan Bank",
    place: "Addis Ababa, Ethiopia",
    period: "2024 - Present",
    kind: "work",
    summary:
      "Engineering support for core banking users plus internal tooling: query tuning, incident triage and small applications that remove manual work.",
    highlights: [
      "Wrote and tuned SQL Server reports used daily by branch and back-office teams",
      "Built internal tools that replaced spreadsheet-based workflows",
      "Triaged production incidents alongside the core banking team",
      "Worked with sensitive transaction data under strict access rules",
    ],
  },
  {
    id: "efuye-gela",
    role: "Software Engineer (Contract)",
    org: "Efuye Gela",
    place: "Remote, Ethiopia",
    period: "2023 - 2024",
    kind: "work",
    summary:
      "Contributed to digital product features across API and interface layers for local businesses, with a focus on payment and messaging integrations.",
    highlights: [
      "Implemented REST endpoints and React screens for client projects",
      "Integrated third-party payments and messaging APIs",
      "Wrote setup documentation so handover never depended on one person",
      "Reviewed code for junior contributors and tightened API contracts",
    ],
  },
  {
    id: "debre-markos",
    role: "BSc Software Engineering",
    org: "Debre Markos University",
    place: "Debre Markos, Ethiopia",
    period: "2022 - 2026",
    kind: "education",
    summary:
      "Coursework built around distributed systems, algorithms and databases, with every major project shipped as working software rather than a slide deck.",
    highlights: [
      "Distributed systems and network programming",
      "Algorithms and data structures",
      "Database design and management",
      "Software requirements and project management",
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "understand",
    index: "01",
    title: "Understand",
    detail:
      "Sit with the people doing the work, map the current process, and write down what it costs when it breaks. No framework decisions yet.",
    outcome: "A short brief: actors, data, failure modes",
  },
  {
    id: "design",
    index: "02",
    title: "Design",
    detail:
      "Shape the data model first, then the API surface, then the interface. Access rules are decided here instead of patched in later.",
    outcome: "Entity model, endpoint list, role matrix",
  },
  {
    id: "build",
    index: "03",
    title: "Build",
    detail:
      "Small, reviewable commits with typed contracts end to end. Every endpoint gets a documented contract and a working error path.",
    outcome: "Shippable slices, not a big-bang release",
  },
  {
    id: "improve",
    index: "04",
    title: "Improve",
    detail:
      "Instrument what matters, watch the slow queries and failed payments, then attack the next biggest constraint with a number attached.",
    outcome: "Measured changes with before and after figures",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: "henokkebe19@gmail.com",
    href: "mailto:henokkebe19@gmail.com",
    hint: "Fastest route. I reply within a day.",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/henok-kebede",
    href: "https://github.com/henok-kebede",
    hint: "Source, experiments and API samples.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/henok-kebede",
    href: "https://linkedin.com/in/henok-kebede",
    hint: "Work history and recommendations.",
  },
  {
    id: "location",
    label: "Location",
    value: "Addis Ababa, Ethiopia",
    href: "https://maps.google.com/?q=Addis+Ababa",
    hint: "EAT (UTC+3). Open to remote and hybrid roles.",
  },
];

export const cvSnapshot: CvSnapshot = {
  summary:
    "Full-stack software engineer building business software with ASP.NET Core, React, TypeScript and SQL Server. Recent work centers on rental marketplace software and bank internal tooling, including a Chapa payment integration with verified webhooks and an auditable ledger.",
  highlights: [
    "Designed and shipped Property Hub end to end: schema, API, interface and payment flow",
    "Integrated Chapa payments with signature verification and replay protection",
    "Tuned SQL Server reports that back-office teams now depend on daily",
    "Built internal tools at Berhan Bank that replaced spreadsheet workflows",
  ],
  facts: [
    { value: "2026", label: "BSc Software Engineering, Debre Markos University" },
    { value: "Addis Ababa", label: "Based in Ethiopia, remote friendly" },
    { value: "Full-time", label: "Open to full-time or contract work" },
  ],
};