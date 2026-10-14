import Link from "next/link";
import { ArrowUpRight, Sprout } from "lucide-react";
import { editorial } from "@/lib/editorial";

export function CurrentWork() {
  return <>
    <section className="current-work section page-width" id="now">
      <div className="section-heading"><div><h2>Building, learning, explaining.</h2><p>The work continues beyond the release.</p></div></div>
      <div className="current-grid">
        <article><h3>Computer science in Paderborn</h3><p>Studying M.Sc. Computer Science at Paderborn University, alongside independent software projects.</p><Link href="/about#education" className="text-link">Education <ArrowUpRight size={16} /></Link></article>
        <article><h3>theainativeengineer</h3><p>Short explainers about backend systems and software engineering. Turning what I learn into demonstrations other engineers can follow.</p>
          <ul className="explainer-list">{editorial.explainers.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.title}<small>{item.topic}</small></span><ArrowUpRight size={16} /></a></li>)}</ul>
          <a href="https://www.youtube.com/@theainativeengineer" target="_blank" rel="noopener noreferrer" className="text-link">All explainers <ArrowUpRight size={16} /></a><div className="channel-links"><a href="https://www.instagram.com/theainativeengineer/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.facebook.com/theainativeengineer" target="_blank" rel="noopener noreferrer">Facebook</a></div></article>
      </div>
    </section>
    <section className="trail-invitation page-width"><div><Sprout size={26} /><h2>There’s a longer story.</h2><p>Contests, community, milestones and the lessons behind the work. A living record of how I got here.</p></div><Link href="/trail" className="text-link">Explore the growth trail <ArrowUpRight size={16} /></Link></section>
  </>;
}
