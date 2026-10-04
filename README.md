# Keploy run log

A single-page, static tutorial built with **Next.js** and **MDX**. It documents my first-hand run of Keploy's Echo + PostgreSQL Go quickstart on Windows with WSL, including every error I hit and how I fixed it.

**Live site:** _add your Vercel link here_

## Stack

- Next.js (App Router, static export) and MDX via `@next/mdx`
- Tailwind CSS 4 plus small hand-built components (no component kit)
- `rehype-pretty-code` + Shiki for syntax highlighting (light and dark themes), `remark-gfm`, `rehype-slug`
- `next-themes` for the light / dark / system toggle, `lucide-react` for icons, `geist` for fonts

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # writes a fully static site to out/
```

## Project structure

```
src/
  app/
    page.mdx          the tutorial (all content lives here)
    layout.tsx        fonts, theme provider, top bar, footer
    globals.css       design tokens (light + dark) and styles
  components/
    server.tsx        Intro, Chapter, Callout, WhyGrid, Facts, Exchange, Diff, FileTree, ...
    client.tsx        TopBar, ThemeToggle, navigation, and app shell
    client/
      tutorial.tsx    code Pre + copy, RunReceipt, FlowSwitch, ReplaySwitch
      problems.tsx    ProblemList and Problem
  lib/
    site.ts           title, author, stack chips, chapters, run numbers, repo URL
    reflections.ts    optional personal reflections (empty entries are hidden)
  mdx-components.tsx  maps MDX elements and custom components
```

## Customising

- Set `repoUrl` in `src/lib/site.ts` after pushing. The repo icon and footer link appear automatically.
- Write your own paragraphs in `src/lib/reflections.ts`. Entries left empty are not rendered.
- Set `showReportLinks: true` in `src/lib/site.ts` only after the Keploy report links open in a private window without a login.

## Deploy

Push to GitHub, then import the repo at vercel.com/new. No configuration is needed. Vercel detects Next.js and serves the static export.
