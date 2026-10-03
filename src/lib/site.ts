export const SITE = {
  title: "Recording Go API tests with Keploy, and everything that broke on the way",
  shortTitle: "Keploy run log",
  description:
    "A first-hand log of running Keploy's Echo + PostgreSQL quickstart on Windows with WSL, including every error and its fix.",
  author: "Vanshika Gupta", // confirm the name to show
  dateLabel: "October 2026",
  readingMinutes: 9,
  repoUrl: "https://github.com/vansssg/Keploy",
  showReportLinks: false, // set true only after the report links open in a private window without a login
  stack: ["Keploy 3.8.58", "Go 1.26", "Echo v4.9.0", "PostgreSQL 10.5", "Windows + WSL (Ubuntu)"],
} as const;

export const STATS = [
  { value: "8", label: "things that broke" },
  { value: "1", label: "line of Go changed" },
  { value: "2/2", label: "tests passing at the end" },
  { value: "15.23 s", label: "final replay" },
] as const;

export type ChapterItem = {
  readonly id: string;
  readonly label: string;
  readonly fullLabel: string;
  readonly iconName: string;
  readonly num: string;
  readonly badge?: string;
};

export const CHAPTERS: readonly ChapterItem[] = [
  { id: "what-is-keploy", label: "what & why", fullLabel: "What & Why Keploy", iconName: "Sparkles", num: "01" },
  { id: "how-it-works", label: "the idea", fullLabel: "The Idea & Architecture", iconName: "Activity", num: "02" },
  { id: "setup", label: "setup", fullLabel: "Setup & Host Fix", iconName: "Terminal", num: "03" },
  { id: "run-keploy", label: "run it", fullLabel: "Starting Keploy", iconName: "Play", num: "04" },
  { id: "record", label: "record", fullLabel: "Recording Traffic", iconName: "CircleDot", num: "05" },
  { id: "replay", label: "replay", fullLabel: "Replaying & Results", iconName: "RotateCcw", num: "06" },
  { id: "breakage", label: "what broke", fullLabel: "Everything That Broke", iconName: "AlertTriangle", num: "07", badge: "8 fixes" },
  { id: "lessons", label: "lessons", fullLabel: "Lessons Learned", iconName: "Lightbulb", num: "08" },
  { id: "docs-notes", label: "docs notes", fullLabel: "Notes for Keploy Docs", iconName: "FileText", num: "09" },
  { id: "next", label: "next", fullLabel: "What's Next", iconName: "ArrowRightCircle", num: "10" },
];

export const RUNS = {
  final: { run: "test-run-4", sets: "test-set-3", tests: 2, passed: 2, failed: 0, time: "15.23 s" },
  earlier: { run: "test-run-3", sets: "test-set-1 + test-set-2", tests: 3, passed: 3, failed: 0, time: "10.41 s" },
} as const;

export const REPORTS = [
  { label: "test-run-4 report", url: "https://app.keploy.io/tr/84071e1a-1977-4d4d-8d14-700fcc1589b0" },
  { label: "test-run-3 report", url: "https://app.keploy.io/tr/c2833201-e88d-4a9b-90aa-a5cc920a21d0" },
] as const;
