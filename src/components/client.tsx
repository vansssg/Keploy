"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  ChevronRight,
  List,
  Moon,
  Search,
  Sun,
  X,
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
  ExternalLink
} from "lucide-react";
import { CHAPTERS, SITE } from "@/lib/site";
export { Problem, ProblemList } from "./client/problems";
export { FlowSwitch, Pre, ReplaySwitch, RunReceipt } from "./client/tutorial";

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
            className="iconbtn mobile-search"
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
