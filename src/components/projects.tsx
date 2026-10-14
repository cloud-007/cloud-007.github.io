"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";
import { safeHref } from "@/lib/content";
import { caseStudies } from "@/data/case-studies";
import { ProjectVisual } from "./project-visual";
import { editorial } from "@/lib/editorial";

export function Projects({ selected = false }: { selected?: boolean }) {
  const { content } = useSiteContent();
  const featured = caseStudies.flatMap((study) => {
    const project = content.projects.find((item) => item.name === study.projectName && !item.teaser);
    return project ? [{ study, project }] : [];
  });
  const titleOnly = content.projects.filter((project) => !project.teaser && editorial.titleOnlyProjects.includes(project.name));
  const more = content.projects.filter((project) => !project.teaser && !editorial.titleOnlyProjects.includes(project.name) && !caseStudies.some((study) => study.projectName === project.name));
  return (
    <section id="projects" className="section page-width">
      <div className="section-heading">
        <div><h2>{selected ? "Selected work" : "Projects and contributions"}</h2><p>Client delivery, production engineering and independent tools.</p></div>
        {selected && <Link href="/about#projects" className="text-link">All projects <ArrowUpRight size={16} /></Link>}
      </div>
      <div className="work-list">{featured.map(({study, project}) => <article className="work-item" key={study.slug}>
        <Link href={`/work/${study.slug}`} className="work-visual" aria-label={`Read the ${project.name} case study`}><ProjectVisual study={study} /></Link>
        <div className="work-copy">
          <p className="work-category">{study.category}</p><h3><Link href={`/work/${study.slug}`}>{project.name}</Link></h3>
          <p className="work-summary">{study.summary}</p><p className="work-role">{study.role}</p>
          <ul className="work-highlights">{project.highlights.slice(0,2).map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="work-stack">{project.technologies.slice(0,5).join(" / ")}</p>
          <Link href={`/work/${study.slug}`} className="text-link">Read case study <ArrowUpRight size={16} /></Link>
        </div>
      </article>)}</div>
      {titleOnly.map((project) => <div key={project.id} className="project-reference"><h3>{safeHref(project.live_url) ? <a href={safeHref(project.live_url)} target="_blank" rel="noopener noreferrer">{project.name}<ArrowUpRight size={17} aria-hidden="true" /></a> : project.name}</h3></div>)}
      {!selected && <div className="project-archive"><h3>More work</h3>{more.map((project) => <article key={project.id} className="archive-item">
        <div><p className="work-category">{project.category === "professional" ? "LII Lab contribution" : project.category === "client" ? "Client work" : "Independent project"} · {project.period}</p><h4>{project.name}</h4><p>{project.description}</p></div>
        {safeHref(project.live_url ?? project.repo_url) && <a className="text-link" href={safeHref(project.live_url ?? project.repo_url)} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name}`}>{project.repo_url ? "Repository" : "Website"}<ArrowUpRight size={16} /></a>}
      </article>)}</div>}
    </section>
  );
}
