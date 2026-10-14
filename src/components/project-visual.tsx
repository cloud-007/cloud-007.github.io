import Image from "next/image";
import type { CaseStudy } from "@/data/case-studies";

export function ProjectVisual({ study, priority = false }: { study: CaseStudy; priority?: boolean }) {
  if (study.image) return <figure className="product-screenshot">
    <Image src={study.image} alt={study.imageAlt ?? study.projectName} width={1019} height={685} sizes="(max-width: 700px) 100vw, 600px" priority={priority} />
    <figcaption>Public website · captured October 2026</figcaption>
  </figure>;
  return <figure className={`system-visual system-${study.slug}`}>
    <figcaption>{study.projectName}<span>Workflow overview</span></figcaption>
    <ol>{study.steps.map((step, index) => <li key={step}><span className="flow-node" aria-hidden="true">{index + 1}</span><span>{step}</span></li>)}</ol>
    <p>{study.slug === "crosspost" ? "Completed posts stay completed on a retry." : "From generated claim to supporting source."}</p>
  </figure>;
}
