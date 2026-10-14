import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectVisual } from "@/components/project-visual";
import { caseStudies } from "@/data/case-studies";
import { snapshotContent, safeHref } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return caseStudies.map(({slug}) => ({slug})); }
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  return {title: `${study?.projectName ?? "Work"} | Mazharul Islam`, description: study?.summary};
}
export default async function WorkPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  const project = snapshotContent.projects.find((item) => item.name === study?.projectName && !item.teaser);
  if (!study || !project) notFound();
  return <><Header /><main id="main-content" className="case-page page-width">
    <Link href="/#projects" className="text-link"><ArrowLeft size={16} />Selected work</Link>
    <div className="case-intro"><p className="work-category">{study.category}</p><h1>{study.projectName}</h1><p className="case-summary">{study.summary}</p><p className="work-role">{study.role} · {project.period}</p>
      <div className="hero-actions">{safeHref(project.live_url) && <a className="button-primary" href={safeHref(project.live_url)} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={16} /></a>}{safeHref(project.repo_url) && <a className="button-primary" href={safeHref(project.repo_url)} target="_blank" rel="noopener noreferrer">View repository <ArrowUpRight size={16} /></a>}</div>
    </div>
    <div className="case-visual"><ProjectVisual study={study} priority /></div>
    <div className="case-narrative">
      <section><h2>{study.requirements ? "What the restaurant needed" : "The problem"}</h2><p>{study.problem}</p></section>
      {study.requirements && <section><h2>From requirements to product decisions</h2><dl className="requirements-list">{study.requirements.map((requirement) => <div key={requirement.need}><dt>{requirement.need}</dt><dd>{requirement.response}</dd></div>)}</dl></section>}
      <section><h2>{study.requirements ? "How I scoped the product" : "The approach"}</h2><p>{study.decision}</p></section>
      <section><h2>What I delivered</h2><p>{study.outcome}</p>{!study.requirements && <ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>}</section>
      {study.lesson && <section><h2>What this project taught me</h2><p>{study.lesson}</p></section>}
      <section><h2>Built with</h2><p>{project.technologies.join(" / ")}</p></section>
      {study.source && <p className="case-source"><a className="text-link" href={study.source.url} target="_blank" rel="noopener noreferrer">{study.source.label}<ArrowUpRight size={16} /></a></p>}
    </div>
    <div className="case-next"><p>Have a similar problem to solve?</p><a className="text-link" href="mailto:mie.mazharul@gmail.com">Let’s talk <ArrowUpRight size={16} /></a></div>
  </main><Footer /></>;
}
