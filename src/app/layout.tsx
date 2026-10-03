import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SITE } from "@/lib/site";
import { Providers, AppShell } from "@/components/client";
import { Footer } from "@/components/server";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.title} | Developer Guide`,
  description: SITE.description,
  authors: [{ name: SITE.author, url: "https://keploy.io" }],
  keywords: ["Keploy", "Go", "Echo", "PostgreSQL", "eBPF", "Integration Testing", "Zero Code Testing", "Windows WSL"],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: "article",
    siteName: "Keploy Developer Documentation",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090c13" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <AppShell>
            {children}
          </AppShell>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
