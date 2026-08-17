"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useSiteContent } from "@/lib/use-content";

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
];

/** "01/2025 - 04/2026", the compact form a resume wants. */
function period(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-").map(Number);
    return `${MONTHS[m - 1]}/${y}`;
  };
  return `${fmt(start)} - ${end ? fmt(end) : "Present"}`;
}

function ExtIcon() {
  return (
    <svg className="rp-ext-icon" viewBox="0 0 14 14" fill="none">
      <path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function ResumePage() {
  const { content } = useSiteContent();
  const paperRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scale = () => {
      const paper = paperRef.current;
      const wrap = wrapRef.current;
      if (!paper || !wrap) return;
      const available = wrap.clientWidth;
      const s = Math.min(1, available / 850);
      if (s < 1) {
        paper.style.transform = `scale(${s})`;
        paper.style.transformOrigin = "top left";
        wrap.style.height = `${paper.offsetHeight * s}px`;
      } else {
        paper.style.transform = "";
        wrap.style.height = "";
      }
    };
    scale();
    window.addEventListener("resize", scale);
    return () => window.removeEventListener("resize", scale);
  }, []);

  const profile = content.profile;
  const skills = content.skills.filter((s) => s.context === "resume");
  const resumeProjects = content.projects.filter((p) => p.on_resume && !p.teaser);
  const cpStats = content.stats.filter((s) => s.context === "competitive");
  const degrees = content.education.filter((e) => e.on_resume);
  const wins = content.entries
    .filter((e) => !e.teaser && e.traits.includes("won"))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  /* Rendered as-is if the database is unreachable AND the snapshot is empty,
     which should never happen, but an empty page is worse than a message. */
  if (!profile) return null;

  const contacts = [
    ...(profile.email ? [{ href: `mailto:${profile.email}`, text: profile.email }] : []),
    ...profile.socials
      .filter((s) => s.label !== "Email")
      .map((s) => ({ href: s.href, text: s.href.replace(/^https?:\/\//, "") })),
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-root {
          background: #e8e8e8;
          min-height: 100vh;
          padding: 1.25rem 1rem 3rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #2D3748;
        }

        /* ── Toolbar ── */
        .rp-toolbar {
          max-width: 850px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .rp-back {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #444;
          text-decoration: none;
          padding: 0.38rem 0.8rem;
          border: 1px solid #bbb;
          border-radius: 5px;
          background: #fff;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .rp-back:hover { color: #111; border-color: #888; }
        .rp-dl {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #fff;
          background: #1B2A4A;
          border: none;
          border-radius: 5px;
          padding: 0.42rem 1rem;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
          text-decoration: none;
        }
        .rp-dl:hover { background: #2C3E50; }

        /* ── Paper wrap ── */
        .rp-paper-wrap {
          max-width: 850px;
          margin: 0 auto;
        }

        /* ── A4 paper card ── */
        .rp-paper {
          width: 850px;
          background: #fff;
          padding: 2.1rem 2.6rem 2.4rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.13);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ── Header ── */
        .rp-header { text-align: left; margin-bottom: 1.4rem; padding-bottom: 0.9rem; border-bottom: 2px solid #1B2A4A; }
        .rp-name {
          font-size: 1.85rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: #1B2A4A;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }
        .rp-subtitle {
          font-size: 1.05rem;
          font-weight: 400;
          color: #6B7280;
          letter-spacing: 0.01em;
          margin-bottom: 0.45rem;
        }
        .rp-contact {
          font-size: 0.875rem;
          color: #6B7280;
          line-height: 1.65;
        }
        .rp-contact a { color: #2563EB; text-decoration: none; transition: color 0.15s; }
        .rp-contact a:hover { color: #1D4ED8; }
        .rp-sep { margin: 0 0.38rem; color: #D1D5DB; }

        /* ── Section ── */
        .rp-section { margin-bottom: 1.2rem; }
        .rp-section:last-child { margin-bottom: 0; }
        .rp-section-head {
          text-align: left;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1B2A4A;
          margin-bottom: 0.25rem;
        }
        .rp-rule { border: none; border-top: 1.5px solid #1B2A4A; margin-bottom: 0.65rem; }

        /* ── Summary ── */
        .rp-summary { font-size: 0.925rem; line-height: 1.6; color: #2D3748; text-align: justify; hyphens: auto; }

        /* ── Skills ── */
        .rp-skills { display: flex; flex-direction: column; gap: 0.3rem; }
        .rp-skill-row { font-size: 0.9rem; line-height: 1.55; color: #2D3748; }
        .rp-skill-key { font-weight: 600; color: #1B2A4A; }

        /* ── Block ── */
        .rp-block { margin-bottom: 1rem; }
        .rp-block:last-child { margin-bottom: 0; }
        .rp-block-row { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
        .rp-co { font-size: 1.05rem; font-weight: 700; color: #1B2A4A; }
        .rp-loc { font-size: 0.85rem; color: #6B7280; flex-shrink: 0; }
        .rp-block-sub { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; margin-top: 0.08rem; margin-bottom: 0.32rem; }
        .rp-role { font-size: 0.925rem; font-weight: 600; color: #2D3748; }
        .rp-dates { font-size: 0.85rem; color: #6B7280; flex-shrink: 0; }

        .rp-ul { padding-left: 1.1rem; list-style: disc; }
        .rp-ul li { font-size: 0.9rem; line-height: 1.6; color: #2D3748; margin-bottom: 0.15rem; text-align: justify; hyphens: auto; }
        .rp-ul li::marker { color: #1B2A4A; }

        .rp-stack { font-size: 0.82rem; color: #6B7280; margin-top: 0.35rem; line-height: 1.5; }
        .rp-stack b { color: #1B2A4A; font-weight: 600; }

        /* ── Projects ── */
        .rp-proj-header { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem; }
        .rp-proj-dates { font-size: 0.85rem; color: #6B7280; flex-shrink: 0; }
        .rp-proj-link {
          font-size: 1rem; font-weight: 600; color: #1B2A4A; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.3rem; transition: color 0.15s;
        }
        .rp-proj-link:hover { color: #2C3E50; }
        .rp-ext-icon { width: 0.85rem; height: 0.85rem; color: #9CA3AF; flex-shrink: 0; transition: color 0.15s; position: relative; top: 1px; }
        .rp-proj-link:hover .rp-ext-icon { color: #2C3E50; }

        /* ── CP grid ── */
        .rp-cp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1.2rem; }
        .rp-cp-item { font-size: 0.9rem; line-height: 1.6; color: #2D3748; }
        .rp-cp-item b { color: #1B2A4A; }
        .rp-cp-item a { color: #2563EB; text-decoration: none; border-bottom: 1px solid #DBEAFE; }
        .rp-cp-item a:hover { color: #1D4ED8; border-bottom-color: #2563EB; }

        .rp-kw { font-weight: 600; color: #1B2A4A; }

        .rp-desc { font-size: 0.9rem; line-height: 1.6; color: #6B7280; font-style: italic; margin: 0.18rem 0 0.35rem; }
        .rp-prod-link { color: #2563EB; font-style: normal; font-weight: 600; text-decoration: none; border-bottom: 1px solid #DBEAFE; transition: border-color 0.15s; }
        .rp-prod-link:hover { border-bottom-color: #2563EB; }

        .rp-gpa { font-weight: 700; color: #1B2A4A; }

        /* ── Print ── */
        @media print {
          @page { size: A4; margin: 0.55in; }

          html, body { background: #fff !important; }
          .rp-toolbar { display: none !important; }
          .rp-root { background: #fff; padding: 0; min-height: auto; }

          .rp-paper-wrap, .rp-paper {
            transform: none !important;
            width: 100% !important;
            min-width: unset !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          .rp-name { font-size: 18pt; }
          .rp-subtitle { font-size: 11pt; margin-bottom: 0.2rem; }
          .rp-contact { font-size: 9pt; white-space: nowrap; }
          .rp-header { margin-bottom: 0.6rem; padding-bottom: 0.45rem; }

          .rp-section { margin-bottom: 0.5rem; }
          .rp-section-head { font-size: 9pt; letter-spacing: 0.1em; break-after: avoid; }
          .rp-rule { margin-bottom: 0.35rem; break-after: avoid; }

          .rp-summary { font-size: 10pt; line-height: 1.45; }
          .rp-skill-row { font-size: 9.5pt; line-height: 1.42; }
          .rp-skills { gap: 0.15rem; }

          .rp-block { margin-bottom: 0.5rem; page-break-inside: avoid; }
          .rp-co { font-size: 11pt; }
          .rp-role { font-size: 10pt; }
          .rp-loc, .rp-dates { font-size: 9pt; }
          .rp-block-sub { margin-bottom: 0.12rem; }
          .rp-desc { font-size: 9.5pt; line-height: 1.42; margin: 0.08rem 0 0.22rem; }
          .rp-ul li { font-size: 9.5pt; line-height: 1.45; margin-bottom: 0.04rem; }
          .rp-stack { font-size: 8.5pt; margin-top: 0.18rem; }
          .rp-proj-link { font-size: 10.5pt; }
          .rp-proj-dates { font-size: 9pt; }
          .rp-proj-header { margin-bottom: 0.12rem; }
          .rp-cp-grid { gap: 0.35rem 0.9rem; }
          .rp-cp-item { font-size: 9.5pt; line-height: 1.45; }

          a { color: #1B2A4A !important; text-decoration: none; }
          .rp-prod-link { border-bottom: 1px solid #aaa; color: #1B2A4A !important; }
          .rp-proj-link { color: #1B2A4A !important; }
          .rp-ext-icon { display: none; }
          .rp-cp-item a { border-bottom: 1px solid #aaa; color: #1B2A4A !important; }
          .rp-section-head { color: #1B2A4A !important; }
          .rp-name { color: #1B2A4A !important; }
          .rp-rule { border-top-color: #1B2A4A !important; }
          .rp-header { border-bottom-color: #1B2A4A !important; }
          .rp-skill-key { color: #1B2A4A !important; }
          .rp-ul li::marker { color: #1B2A4A !important; }
        }
      `}</style>

      <div className="rp-root">
        {/* Toolbar */}
        <div className="rp-toolbar">
          <Link href="/" className="rp-back">&#8592; Portfolio</Link>
          <a href="/resume.pdf" download="MazharulIslam_Resume.pdf" className="rp-dl">
            &#8595;&nbsp;Download PDF
          </a>
        </div>

        {/* Paper wrap */}
        <div className="rp-paper-wrap" ref={wrapRef}>
          <div className="rp-paper" ref={paperRef}>

            <header className="rp-header">
              <h1 className="rp-name">{profile.name}</h1>
              <p className="rp-subtitle">{profile.role}</p>
              <p className="rp-contact">
                {profile.phone && (
                  <>
                    {profile.phone}
                    <span className="rp-sep">&bull;</span>
                  </>
                )}
                {contacts.map((c, i) => (
                  <span key={c.href}>
                    <a href={c.href} target="_blank" rel="noopener noreferrer">
                      {c.text}
                    </a>
                    {i < contacts.length - 1 && <span className="rp-sep">&bull;</span>}
                  </span>
                ))}
                {profile.location && (
                  <>
                    <span className="rp-sep">&bull;</span>
                    {profile.location}
                  </>
                )}
              </p>
            </header>

            <section className="rp-section">
              <h2 className="rp-section-head">Summary</h2>
              <hr className="rp-rule" />
              <p className="rp-summary">{profile.bio}</p>
            </section>

            {skills.length > 0 && (
              <section className="rp-section">
                <h2 className="rp-section-head">Technical Skills</h2>
                <hr className="rp-rule" />
                <div className="rp-skills">
                  {skills.map((g) => (
                    <p className="rp-skill-row" key={g.id}>
                      <span className="rp-skill-key">{g.group}: </span>
                      {g.items.join(" \u00b7 ")}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {content.experience.length > 0 && (
              <section className="rp-section">
                <h2 className="rp-section-head">Professional Experience</h2>
                <hr className="rp-rule" />
                {content.experience.map((exp) => (
                  <div className="rp-block" key={exp.id}>
                    <div className="rp-block-row">
                      <span className="rp-co">{exp.company}</span>
                      <span className="rp-loc">{exp.location}</span>
                    </div>
                    <div className="rp-block-sub">
                      <span className="rp-role">{exp.role}</span>
                      <span className="rp-dates">
                        {period(exp.start_date, exp.end_date)}
                      </span>
                    </div>
                    {exp.summary && <p className="rp-desc">{exp.summary}</p>}
                    <ul className="rp-ul">
                      {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                    {exp.stack.length > 0 && (
                      <p className="rp-stack">
                        <b>Stack:</b> {exp.stack.join(" \u00b7 ")}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {resumeProjects.length > 0 && (
              <section className="rp-section">
                <h2 className="rp-section-head">Projects</h2>
                <hr className="rp-rule" />
                {resumeProjects.map((p) => {
                  const href = p.live_url ?? p.repo_url;
                  return (
                    <div className="rp-block" key={p.id}>
                      <div className="rp-proj-header">
                        {href ? (
                          <a href={href} className="rp-proj-link" target="_blank" rel="noopener noreferrer">
                            {p.name}{p.tagline ? `, ${p.tagline}` : ""}
                            <ExtIcon />
                          </a>
                        ) : (
                          <span className="rp-proj-link">{p.name}</span>
                        )}
                        {p.period && <span className="rp-proj-dates">{p.period}</span>}
                      </div>
                      <ul className="rp-ul">
                        {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                      {p.technologies.length > 0 && (
                        <p className="rp-stack">
                          <b>Stack:</b> {p.technologies.join(" \u00b7 ")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {(wins.length > 0 || cpStats.length > 0) && (
              <section className="rp-section">
                <h2 className="rp-section-head">Competitive Programming and Achievements</h2>
                <hr className="rp-rule" />
                <div className="rp-cp-grid">
                  {cpStats.length > 0 && (
                    <div className="rp-cp-item">
                      {cpStats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(" \u00b7 ")}
                    </div>
                  )}
                  {wins.map((w) => (
                    <div className="rp-cp-item" key={w.id || w.slug}>
                      {w.outcome && <b>{w.outcome}</b>}
                      {w.outcome ? ", " : ""}
                      {w.title}
                    </div>
                  ))}
                  {content.judges.length > 0 && (
                    <div className="rp-cp-item">
                      {content.judges.map((j, i) => (
                        <span key={j.id}>
                          <a href={j.url} target="_blank" rel="noopener noreferrer">{j.name}</a>
                          {j.rating ? ` (${j.rating})` : ""}
                          {i < content.judges.length - 1 ? " \u00b7 " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {degrees.length > 0 && (
              <section className="rp-section">
                <h2 className="rp-section-head">Education</h2>
                <hr className="rp-rule" />
                {degrees.map((e) => (
                  <div className="rp-block" key={e.id}>
                    <div className="rp-block-row">
                      <span className="rp-co">{e.institution}</span>
                      <span className="rp-loc">{e.location}</span>
                    </div>
                    <div className="rp-block-sub">
                      <span className="rp-role">
                        {e.degree}
                        {e.detail && (
                          <>
                            {" \u00b7 "}
                            <span className="rp-gpa">{e.detail}</span>
                          </>
                        )}
                      </span>
                      <span className="rp-dates">{e.period}</span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {content.volunteering.length > 0 && (
              <section className="rp-section">
                <h2 className="rp-section-head">Volunteering</h2>
                <hr className="rp-rule" />
                {content.volunteering.map((v) => (
                  <div className="rp-block" key={v.id}>
                    <div className="rp-block-row">
                      <span className="rp-co">{v.org}</span>
                    </div>
                    <div className="rp-block-sub">
                      <span className="rp-role">{v.title}</span>
                      <span className="rp-dates">{v.period}</span>
                    </div>
                    <ul className="rp-ul">
                      {v.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}

          </div>{/* /rp-paper */}
        </div>{/* /rp-paper-wrap */}
      </div>{/* /rp-root */}
    </>
  );
}
