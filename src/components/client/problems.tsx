"use client";

import { Children, createContext, isValidElement, useContext, useEffect, useState, type ReactNode } from "react";
import { ChevronRight, CircleCheck } from "lucide-react";

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
