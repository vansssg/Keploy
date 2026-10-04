"use client";

import { Children, isValidElement, useCallback, useRef, useState, type ReactNode } from "react";
import { Activity, Check, Copy, RotateCcw } from "lucide-react";
import { RUNS } from "@/lib/site";

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
