"use client";

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  Check,
  ChevronRight,
  Copy,
  List,
  Monitor,
  Moon,
  Search,
  Sun,
  X,
  CircleCheck,
  Sparkles,
  Activity,
  Terminal,
  Play,
  CircleDot,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  FileText,
  ArrowRightCircle,
  ExternalLink,
  Layers,
  Heart
} from "lucide-react";
import { CHAPTERS, RUNS, SITE } from "@/lib/site";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

/* ---------- Theme toggle (single compact button) ---------- */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="iconbtn"
        style={{ width: 34, height: 34, padding: 0 }}
        aria-label="Toggle theme"
      >
        <span style={{ width: 15, height: 15, display: "inline-block" }} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="iconbtn"
      style={{ width: 34, height: 34, padding: 0 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

/* ---------- Map chapter icon names to Lucide icons ---------- */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Sparkles,
  Activity,
  Terminal,
  Play,
  CircleDot,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  FileText,
  ArrowRightCircle,
};

/* ---------- Top Bar with Search & Brand ---------- */
export function TopBar({ onOpenMobileMenu, onOpenSearch }: { onOpenMobileMenu?: () => void; onOpenSearch?: () => void }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) {
          bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-container">
        {/* Left: Mobile menu toggle + Brand Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <button
            className="iconbtn lg:hidden"
            style={{ display: "inline-flex", width: 34, height: 34, padding: 0 }}
            aria-label="Open navigation menu"
            onClick={onOpenMobileMenu}
          >
            <List size={18} />
          </button>

          <a href="#" className="brand-badge">
            <div className="brand-logo">K</div>
            <div className="brand-titles">
              <span className="brand-title">
                Keploy <span className="brand-title-accent">Docs</span>
              </span>
              <span className="brand-sub">Echo + PostgreSQL Run Log</span>
            </div>
          </a>

          <span className="version-chip hidden sm:inline-flex">
            v2.x eBPF
          </span>
        </div>

        {/* Center / Right: Search trigger + GitHub + Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            type="button"
            className="search-trigger hidden md:flex"
            onClick={onOpenSearch}
            aria-label="Search tutorial documentation"
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Search size={14} />
              <span>Search run log...</span>
            </span>
            <kbd className="search-kbd">Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="iconbtn md:hidden"
            style={{ width: 32, height: 32, padding: 0 }}
            onClick={onOpenSearch}
            aria-label="Search"
          >
            <Search size={15} />
          </button>

          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="iconbtn hidden sm:inline-flex"
            aria-label="GitHub Repository"
          >
            <GithubIcon size={15} />
            <span>GitHub</span>
            <ExternalLink size={11} style={{ opacity: 0.6 }} />
          </a>

          <ThemeToggle />
        </div>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div ref={bar} className="progress-bar" />
      </div>
    </header>
  );
}

/* ---------- Sticky Left Documentation Sidebar ---------- */
export function DocsSidebar() {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <aside className="docs-sidebar" aria-label="Documentation navigation">
      {/* Quickstarts switcher */}
      <div className="sidebar-quickstart-card">
        <div className="sidebar-section-title" style={{ padding: 0, marginBottom: "0.5rem" }}>
          <Sparkles size={13} style={{ color: "var(--accent)" }} />
          <span>Quickstart Guides</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <a
            href="#"
            className="sidebar-nav-item"
            aria-current="true"
            style={{ fontSize: "0.78rem" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
              Echo + Postgres (This Log)
            </span>
            <ChevronRight size={13} />
          </a>
          <a
            href="https://keploy.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-nav-item"
            style={{ fontSize: "0.78rem", color: "var(--muted)" }}
          >
            <span>Gin + MongoDB</span>
            <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>Docs</span>
          </a>
          <a
            href="https://keploy.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-nav-item"
            style={{ fontSize: "0.78rem", color: "var(--muted)" }}
          >
            <span>Fiber + gRPC</span>
            <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>Docs</span>
          </a>
        </div>
      </div>

      {/* Chapters list */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="sidebar-section-title">
          <span>Tutorial Chapters</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {CHAPTERS.map((c) => {
            const Icon = ICON_MAP[c.iconName] || CircleDot;
            const isCur = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="sidebar-nav-item"
                aria-current={isCur}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <Icon
                    size={15}
                    style={{
                      color: isCur ? "var(--accent)" : "var(--muted)",
                      flexShrink: 0,
                    }}
                  />
                  <span>{c.fullLabel}</span>
                </span>
                {c.badge && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontFamily: "var(--font-mono)",
                      background: "var(--fail-soft)",
                      color: "var(--fail)",
                      padding: "0.1rem 0.4rem",
                      borderRadius: 99,
                      border: "1px solid var(--fail-border)",
                    }}
                  >
                    {c.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Author Bio Card */}
      <div className="sidebar-bio-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.45rem" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.75rem",
              flexShrink: 0,
            }}
          >
            VG
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{SITE.author}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Echo + PostgreSQL Log</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.4 }}>
          Documenting first-hand tests, real errors, and zero-code testing with Keploy.
        </p>
      </div>
    </aside>
  );
}

/* ---------- Command Palette / Quick Jump Search Modal ---------- */
export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search modal from keyboard
          const event = new CustomEvent("open-search");
          window.dispatchEvent(event);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredChapters = CHAPTERS.filter(
    (c) =>
      c.fullLabel.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="search-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-modal">
        <div className="search-modal-input-row">
          <Search size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search chapters, errors, setup..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              padding: 2,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="search-modal-results">
          {filteredChapters.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
              No matching sections found for "{query}".
            </div>
          ) : (
            filteredChapters.map((c) => {
              const Icon = ICON_MAP[c.iconName] || CircleDot;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="search-modal-item"
                  onClick={onClose}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Icon size={16} style={{ color: "var(--accent)" }} />
                    <span style={{ fontWeight: 500 }}>{c.fullLabel}</span>
                  </span>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                    #{c.id}
                  </span>
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile Drawer ---------- */
export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div
      className="mobile-drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mobile-drawer">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="brand-logo" style={{ width: 28, height: 28, fontSize: "0.95rem" }}>
              K
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Keploy Docs</span>
          </div>
          <button onClick={onClose} className="iconbtn" style={{ width: 30, height: 30, padding: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-section-title">Navigation</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {CHAPTERS.map((c) => {
            const Icon = ICON_MAP[c.iconName] || CircleDot;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="sidebar-nav-item"
                onClick={onClose}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Icon size={15} style={{ color: "var(--accent)" }} />
                  <span>{c.fullLabel}</span>
                </span>
                {c.badge && (
                  <span style={{ fontSize: "0.65rem", color: "var(--fail)" }}>{c.badge}</span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ---------- Code Block with Terminal Controls + Copy ---------- */
export function Pre({ children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [done, setDone] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {}
  }, []);

  return (
    <>
      <button type="button" className="copy" onClick={copy} aria-label="Copy code snippet">
        {done ? <Check size={12} style={{ color: "var(--pass)" }} /> : <Copy size={12} />}
        <span>{done ? "Copied!" : "Copy"}</span>
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </>
  );
}

/* ---------- Replay Receipt Card ---------- */
export function RunReceipt() {
  const [k, setK] = useState<"final" | "earlier">("final");
  const r = RUNS[k];
  const tabs = [
    ["final", "Final Run (Pass)"],
    ["earlier", "Earlier Run"],
  ] as const;

  return (
    <div className="receipt" role="region" aria-label="Replay Receipt">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RotateCcw size={15} style={{ color: "var(--accent)" }} />
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)" }}>Replay Receipt</span>
        </div>
        <div className="tabs" role="tablist" aria-label="Choose a run">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              id={`rt-${key}`}
              aria-selected={k === key}
              aria-controls="receipt-panel"
              onClick={() => setK(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <hr />
      <div role="tabpanel" id="receipt-panel" aria-labelledby={`rt-${k}`}>
        <div className="row">
          <span>Run ID</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{r.run}</span>
        </div>
        <div className="row">
          <span>Test Set</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>{r.sets}</span>
        </div>
        <div className="row">
          <span>Total Tests</span>
          <span>{r.tests}</span>
        </div>
        <div className="row">
          <span>Tests Passed</span>
          <span style={{ color: "var(--pass)", fontWeight: 700 }}>{r.passed}</span>
        </div>
        <div className="row">
          <span>Tests Failed</span>
          <span>{r.failed}</span>
        </div>
        <div className="row">
          <span>Execution Time</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>{r.time}</span>
        </div>
        <hr />
        <div className="row" style={{ alignItems: "center" }}>
          <span>Verification Status</span>
          <span className="status">✓ All Tests Passed</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Interactive Architecture Visualizer (FlowSwitch) ---------- */
export function FlowSwitch() {
  const [mode, setMode] = useState<"record" | "replay">("record");
  const rec = mode === "record";

  return (
    <figure
      className="box"
      style={{
        margin: "1.8rem 0",
        padding: "1.25rem 1.4rem",
        background: "var(--surface2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.74rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>
            <Activity size={14} className="animate-pulse" />
            Keploy Architecture Visualizer
          </div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ink)" }}>
            {rec ? "How Keploy Records Tests & Mocks" : "How Keploy Replays Without PostgreSQL"}
          </div>
        </div>

        <div className="tabs" role="group" aria-label="Diagram mode">
          <button
            type="button"
            aria-pressed={mode === "record"}
            onClick={() => setMode("record")}
          >
            1. Record Mode
          </button>
          <button
            type="button"
            aria-pressed={mode === "replay"}
            onClick={() => setMode("replay")}
          >
            2. Test Mode (Replay)
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "0.65rem 0.85rem",
          borderRadius: 8,
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          fontSize: "0.78rem",
          color: "var(--ink-secondary)",
          marginBottom: "1rem",
        }}
      >
        {rec ? (
          <span>
            <strong>Record Mode (<code style={{ color: "var(--accent)" }}>keploy record</code>):</strong> Keploy attaches eBPF/proxy hooks to intercept HTTP requests and Postgres queries, saving both as YAML test cases and mocks.
          </span>
        ) : (
          <span>
            <strong>Test Mode (<code style={{ color: "var(--pass)" }}>keploy test</code>):</strong> Keploy replays saved requests against your app and serves database responses directly from saved mocks—no real database needed!
          </span>
        )}
      </div>

      <div className="flow">
        <svg
          viewBox="0 0 640 262"
          role="img"
          aria-label={
            rec
              ? "Recording: a request reaches your app through Keploy, the app calls PostgreSQL through Keploy, and Keploy writes tests and mocks to disk."
              : "Replay: Keploy sends the recorded requests to your app and answers its PostgreSQL calls from the saved mocks, so PostgreSQL is not needed."
          }
        >
          <defs>
            <marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L8 4L0 8z" fill="var(--muted)" />
            </marker>
            <marker id="ahk" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L8 4L0 8z" fill="var(--accent)" />
            </marker>
          </defs>

          <g opacity={rec ? 1 : 0.4}>
            <rect className="node" x="16" y="38" width="104" height="54" rx="10" />
            <text x="68" y="70" textAnchor="middle" style={{ fontWeight: 600 }}>Request</text>
          </g>

          <rect className="node" x="220" y="38" width="120" height="54" rx="10" />
          <text x="280" y="70" textAnchor="middle" style={{ fontWeight: 600 }}>Your Echo App</text>

          <rect
            className="node"
            x="440"
            y="38"
            width="130"
            height="54"
            rx="10"
            strokeDasharray={rec ? undefined : "5 4"}
          />
          <text x="505" y={rec ? 70 : 60} textAnchor="middle" style={{ fontWeight: 600 }}>
            PostgreSQL
          </text>
          {!rec && (
            <text className="sub" x="505" y="78" textAnchor="middle" style={{ fill: "var(--pass)", fontWeight: 600 }}>
              served from mocks
            </text>
          )}

          <rect className="kep" x="130" y="160" width="340" height="46" rx="10" />
          <text className="acc" x="300" y="188" textAnchor="middle" style={{ fontWeight: 700 }}>
            ⚡ Keploy eBPF Engine
          </text>

          {/* disk */}
          <g transform="translate(540 158)">
            <ellipse cx="26" cy="8" rx="24" ry="8" className="node" />
            <path d="M2 8v32c0 5 11 8 24 8s24-3 24-8V8" className="node" />
            <ellipse cx="26" cy="40" rx="24" ry="8" fill="none" stroke="var(--rule)" strokeWidth="0" />
          </g>
          <text x="566" y="228" textAnchor="middle" className="sub" style={{ fontWeight: 600 }}>
            tests + mocks
          </text>

          {rec ? (
            <>
              <path className="ln" d="M120 65H218" markerEnd="url(#ah)" />
              <path className="ln" d="M340 65H438" markerEnd="url(#ah)" />
              <path className="tap" d="M170 65V158" markerEnd="url(#ahk)" />
              <path className="tap" d="M390 65V158" markerEnd="url(#ahk)" />
              <path className="tap" d="M470 183H538" markerEnd="url(#ahk)" />
              <text className="sub" x="178" y="128">copies HTTP req</text>
              <text className="sub" x="398" y="128">copies Postgres reply</text>
              <text className="sub" x="476" y="176">writes YAML</text>
            </>
          ) : (
            <>
              <path className="tap" d="M280 158V94" markerEnd="url(#ahk)" />
              <text className="sub" x="272" y="128" textAnchor="end">replays HTTP calls</text>
              <path className="ln" d="M340 65H438" strokeDasharray="5 5" markerEnd="url(#ah)" />
              <path className="tap" d="M390 158V68" markerEnd="url(#ahk)" />
              <text className="sub" x="398" y="128" style={{ fill: "var(--pass)" }}>stubs DB responses</text>
              <path className="tap" d="M538 183H472" markerEnd="url(#ahk)" />
              <text className="sub" x="476" y="176">reads YAML</text>
            </>
          )}
        </svg>
      </div>
    </figure>
  );
}

/* ---------- Replay Code Switch ---------- */
export function ReplaySwitch({ labels, children }: { labels: [string, string]; children: ReactNode }) {
  const panels = Children.toArray(children).filter(
    (c) => (typeof c === "string" ? c.trim() !== "" : isValidElement(c))
  );
  const [i, setI] = useState(0);

  return (
    <div className={`replay p${i}`}>
      <div className="tabs" role="tablist" aria-label="Compare replays">
        {labels.map((l, n) => (
          <button
            key={l}
            role="tab"
            id={`rs-${n}`}
            aria-selected={i === n}
            aria-controls="rs-panel"
            onClick={() => setI(n)}
          >
            {l}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="rs-panel" aria-labelledby={`rs-${i}`}>
        {panels[i]}
      </div>
    </div>
  );
}

/* ---------- Problems Ledger (Troubleshooting) ---------- */
type Ctx = { filter: string; signal: { open: boolean; n: number } };
const ProbCtx = createContext<Ctx>({ filter: "all", signal: { open: false, n: 0 } });
const STAGES = ["setup", "build", "keploy", "replay"];

export function ProblemList({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState("all");
  const [signal, setSignal] = useState({ open: false, n: 0 });
  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<{ stage: string }>[];
  const count = (s: string) => (s === "all" ? items.length : items.filter((c) => c.props.stage === s).length);

  return (
    <ProbCtx.Provider value={{ filter, signal }}>
      <div className="filters" role="group" aria-label="Filter problems by stage">
        {["all", ...STAGES].map((s) => (
          <button
            key={s}
            className="chip"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >
            {s} ({count(s)})
          </button>
        ))}
        <button
          className="chip"
          style={{ marginLeft: "auto" }}
          onClick={() => setSignal((p) => ({ open: !p.open, n: p.n + 1 }))}
        >
          {signal.open ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="ledger">{children}</div>
    </ProbCtx.Provider>
  );
}

export function Problem({
  id,
  stage,
  title,
  children,
}: {
  id: string;
  stage: string;
  title: string;
  children: ReactNode;
}) {
  const { filter, signal } = useContext(ProbCtx);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (signal.n) setOpen(signal.open);
  }, [signal]);

  useEffect(() => {
    const check = () => {
      if (location.hash === `#${id}`) {
        setOpen(true);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "center" }), 50);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [id]);

  if (filter !== "all" && filter !== stage) return null;

  return (
    <details
      className="prob"
      id={id}
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary>
        <span className="stage">{stage}</span>
        <span>{title}</span>
        <span className="fixed">
          <CircleCheck size={13} />
          <span>Fixed</span>
        </span>
        <ChevronRight className="chev" size={16} aria-hidden />
      </summary>
      <div className="pbody">
        {children}
        <p style={{ margin: "0.6rem 0 0" }}>
          <a className="mono" style={{ fontSize: "0.75rem", color: "var(--muted)" }} href={`#${id}`}>
            #{id}
          </a>
        </p>
      </div>
    </details>
  );
}

/* ---------- App Shell Component (combines TopBar, Sidebar, Modals) ---------- */
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onCustomOpen = () => setSearchOpen(true);
    window.addEventListener("open-search", onCustomOpen);
    return () => window.removeEventListener("open-search", onCustomOpen);
  }, []);

  return (
    <>
      <TopBar
        onOpenMobileMenu={() => setMobileOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="doc-shell">
        <DocsSidebar />
        <main id="main" className="doc-main">
          <article className="doc">{children}</article>
        </main>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
