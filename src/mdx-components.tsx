import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Callout, Chapter, Diff, Exchange, Facts, FileTree, Intro, Reflections, ReportLinks, WhyGrid } from "@/components/server";
import { FlowSwitch, Pre, Problem, ProblemList, ReplaySwitch, RunReceipt } from "@/components/client";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Intro, Chapter, Callout, WhyGrid, Facts, Exchange, Diff, FileTree, Reflections, ReportLinks,
    RunReceipt, FlowSwitch, ReplaySwitch, ProblemList, Problem,
    pre: Pre,
    table: (p: ComponentProps<"table">) => <div className="tablewrap"><table {...p} /></div>,
    a: ({ href = "", ...p }: ComponentProps<"a">) =>
      href.startsWith("http") ? <a href={href} target="_blank" rel="noopener noreferrer" {...p} /> : <a href={href} {...p} />,
    h3: ({ id, children, ...p }: ComponentProps<"h3">) => <h3 id={id} {...p}>{id ? <a className="plain" href={`#${id}`}>{children}</a> : children}</h3>,
    ...components,
  };
}
