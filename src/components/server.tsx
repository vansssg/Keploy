import type { ReactNode } from "react";
import {
  Activity,
  Database,
  FileCode2,
  Info,
  Lightbulb,
  Link2,
  Sparkles,
  TriangleAlert,
  Wand2,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Terminal,
  Layers,
  Heart
} from "lucide-react";
import { REPORTS, SITE, STATS } from "@/lib/site";
import { REFLECTIONS } from "@/lib/reflections";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  );
}

export function Intro({ kicker, title, dek }: { kicker: string; title: string; dek: string }) {
  const [a, b] = title.split(", and ");
  return (
    <header className="hero">
      <div className="hero-meta-row">
        <span className="meta-pill highlight">
          <span className="w-2 h-2 rounded-full bg-keploy-500 animate-pulse" style={{ background: "var(--accent)" }} />
          Echo + PostgreSQL Quickstart
        </span>
        <span className="meta-pill">
          <Clock size={12} style={{ display: "inline", verticalAlign: "-1px" }} />
          {SITE.readingMinutes} Min Read
        </span>
        <span className="meta-pill">🎯 Hands-On Run Log</span>
        <span className="meta-pill">⚡ Keploy v3.8+ (eBPF Engine)</span>
        <span className="meta-pill">🪟 Windows WSL2</span>
      </div>

      <h1>
        {b ? (
          <>
            {a}, and <em>{b}</em>
          </>
        ) : (
          title
        )}
      </h1>

      <p className="dek">{dek}</p>

      <div className="author-bar">
        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{SITE.author}</span>
        <span>•</span>
        <span>{SITE.dateLabel}</span>
        <span>•</span>
        <span>Developer Experience & Testing Log</span>
      </div>

      <ul className="chips" aria-label="Environment Stack">
        {SITE.stack.map((s) => (
          <li key={s} className="chip">
            {s}
          </li>
        ))}
      </ul>

      <div className="stats" role="region" aria-label="Key Run Metrics">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

export function Chapter({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-h`}>
      <p className="kicker">{kicker}</p>
      <h2 id={`${id}-h`}>
        <a href={`#${id}`}>
          {title}
          <Link2 size={18} aria-hidden />
        </a>
      </h2>
      {children}
    </section>
  );
}

const CALL = {
  note: [Info, "Note"],
  tip: [Lightbulb, "Pro Tip"],
  aha: [Sparkles, "Key Takeaway"],
  watch: [TriangleAlert, "Watch Out"],
} as const;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof CALL;
  title?: string;
  children: ReactNode;
}) {
  const [Icon, defaultLabel] = CALL[type];
  return (
    <aside className={`callout ${type}`} role="note">
      <div className="lab">
        <Icon size={15} aria-hidden />
        <span>{title ?? defaultLabel}</span>
      </div>
      <div>{children}</div>
    </aside>
  );
}

export function WhyGrid() {
  const items = [
    {
      icon: Activity,
      title: "Tests Come From Real Traffic",
      desc: "Use your API the normal way. Each HTTP request and its exact response is saved as a reproducible test.",
    },
    {
      icon: Database,
      title: "Dependencies Mocked Automatically",
      desc: "PostgreSQL queries and wire replies are captured as mocks, so you never have to hand-code fakes.",
    },
    {
      icon: Wand2,
      title: "Zero Test Code In App",
      desc: "Keploy monitors from outside via eBPF/proxy. In my run, the only Go code touched was a single host line.",
    },
    {
      icon: FileCode2,
      title: "Plain Files You Own",
      desc: "Tests and database mocks are stored as clean YAML files on disk that you can version control and review.",
    },
  ];

  return (
    <div className="why">
      {items.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="box">
          <div className="ic">
            <Icon size={18} aria-hidden />
          </div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ---- Evidence snippets (macOS terminal window style) ---- */
function Win({
  title,
  caption,
  children,
  pad = true,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
  pad?: boolean;
}) {
  return (
    <figure className="win">
      <div className="bar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span style={{ fontWeight: 600 }}>{title}</span>
        </div>
        <span style={{ opacity: 0.6, fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>terminal</span>
      </div>
      {pad ? <div className="body">{children}</div> : children}
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

export function Facts({
  title,
  caption,
  items,
}: {
  title: string;
  caption?: string;
  items: { k: string; v: string; ok?: boolean }[];
}) {
  return (
    <Win title={title} caption={caption} pad={false}>
      <div className="kv">
        {items.map((i) => (
          <div key={i.k}>
            <small>{i.k}</small>
            <b className={i.ok ? "pass" : ""}>
              {i.ok && <span className="dot" />}
              {i.v}
            </b>
          </div>
        ))}
      </div>
    </Win>
  );
}

export function Exchange({
  title,
  caption,
  req,
  res,
  note,
}: {
  title: string;
  caption?: string;
  req: string;
  res: string;
  note?: string;
}) {
  return (
    <Win title={title} caption={caption}>
      <div>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>&gt;</span> {req}
      </div>
      <div style={{ color: "var(--pass)", marginTop: "0.25rem" }}>
        <span style={{ fontWeight: 700 }}>&lt;</span> {res}
      </div>
      {note && (
        <div style={{ color: "var(--muted)", marginTop: "0.35rem", fontSize: "0.78rem" }}>
          # {note}
        </div>
      )}
    </Win>
  );
}

export function Diff({
  title,
  caption,
  del,
  add,
}: {
  title: string;
  caption?: string;
  del: string;
  add: string;
}) {
  return (
    <Win title={title} caption={caption}>
      <div className="diff">
        <div className="del">- {del}</div>
        <div className="add">+ {add}</div>
      </div>
    </Win>
  );
}

export function FileTree({
  title,
  caption,
  sets,
}: {
  title: string;
  caption?: string;
  sets: Record<string, string[]>;
}) {
  return (
    <Win title={title} caption={caption}>
      <div className="tree">
        {Object.entries(sets).map(([name, files]) => (
          <details key={name} open>
            <summary>
              <ChevronRight size={13} style={{ display: "inline", verticalAlign: "-1px" }} aria-hidden />{" "}
              <span className="set">{name}/</span> <span style={{ color: "var(--muted)" }}>tests/</span>
            </summary>
            {files.map((f) => (
              <div key={f} className="f">
                {f}
              </div>
            ))}
          </details>
        ))}
      </div>
    </Win>
  );
}

export function Reflections() {
  const list = REFLECTIONS.filter((r) => r.text.trim());
  if (!list.length) return null;
  return (
    <div style={{ marginTop: "2rem" }}>
      {list.map((r) => (
        <div key={r.key} style={{ marginBottom: "1.2rem" }}>
          <p className="mono" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.2rem" }}>
            {r.label}
          </p>
          <p style={{ marginTop: "0.2rem" }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

export function ReportLinks() {
  if (!SITE.showReportLinks) return null;
  return (
    <p className="mono" style={{ fontSize: "0.82rem" }}>
      {REPORTS.map((r, i) => (
        <span key={r.url}>
          {i > 0 && " / "}
          <a href={r.url} target="_blank" rel="noopener noreferrer">
            {r.label}
          </a>
        </span>
      ))}
    </p>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 600, color: "var(--ink)" }}>
            {SITE.author} — Keploy Run Log
          </span>
          <span style={{ fontSize: "0.8rem" }}>
            First-hand testing log with Echo + PostgreSQL on Windows WSL2 ({SITE.dateLabel}).
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
          <a
            href="https://keploy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="plain"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--muted)" }}
          >
            <span>Keploy Official</span>
            <ExternalLink size={13} />
          </a>
          <a
            href="https://github.com/keploy/keploy"
            target="_blank"
            rel="noopener noreferrer"
            className="plain"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--muted)" }}
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
          </a>
          {SITE.repoUrl && (
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Source Code
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
