"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

export default function ResumeProfessionalPage() {
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
        .rp-personal {
          font-size: 0.85rem;
          color: #6B7280;
          line-height: 1.6;
          margin-top: 0.4rem;
        }
        .rp-personal b { color: #1B2A4A; font-weight: 600; }

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

        /* ── Skills / Languages ── */
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
        .rp-desc { font-size: 0.9rem; line-height: 1.6; color: #6B7280; font-style: italic; margin: 0.18rem 0 0.35rem; }
        .rp-prod-link { color: #2563EB; font-style: normal; font-weight: 600; text-decoration: none; border-bottom: 1px solid #DBEAFE; transition: border-color 0.15s; }
        .rp-prod-link:hover { border-bottom-color: #2563EB; }

        /* ── CP grid ── */
        .rp-cp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem 1.2rem; }
        .rp-cp-item { font-size: 0.9rem; line-height: 1.6; color: #2D3748; }
        .rp-cp-item b { color: #1B2A4A; }
        .rp-cp-item a { color: #2563EB; text-decoration: none; border-bottom: 1px solid #DBEAFE; }
        .rp-cp-item a:hover { color: #1D4ED8; border-bottom-color: #2563EB; }

        .rp-kw { font-weight: 600; color: #1B2A4A; }
        .rp-gpa { font-weight: 700; color: #1B2A4A; }

        /* ── Signature ── */
        .rp-sign { margin-top: 1.6rem; padding-top: 0.9rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: flex-end; }
        .rp-sign-place { font-size: 0.85rem; color: #6B7280; }
        .rp-sign-name { font-size: 0.9rem; font-weight: 600; color: #1B2A4A; }

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
          .rp-personal { font-size: 9pt; margin-top: 0.25rem; }
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
          .rp-sign { margin-top: 1rem; padding-top: 0.6rem; }
          .rp-sign-place, .rp-sign-name { font-size: 9.5pt; }

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
          <a href="/resume-professional.pdf" download="MazharulIslamEmon_CV.pdf" className="rp-dl">
            &#8595;&nbsp;Download PDF
          </a>
        </div>

        {/* Paper wrap */}
        <div className="rp-paper-wrap" ref={wrapRef}>
          <div className="rp-paper" ref={paperRef}>

            <header className="rp-header">
              <h1 className="rp-name">MD MAZHARUL ISLAM EMON</h1>
              <p className="rp-subtitle">AI-Native Software Engineer</p>
              <p className="rp-contact">
                <a href="mailto:mie.mazharul@gmail.com">mie.mazharul@gmail.com</a>
                <span className="rp-sep">&bull;</span>
                <a href="https://github.com/cloud-007" target="_blank" rel="noopener noreferrer">github.com/cloud-007</a>
                <span className="rp-sep">&bull;</span>
                <a href="https://linkedin.com/in/-mazharulislam-/" target="_blank" rel="noopener noreferrer">linkedin.com/in/-mazharulislam-/</a>
                <span className="rp-sep">&bull;</span>
                Sylhet, Bangladesh
              </p>
              <p className="rp-personal">
                <b>Date of birth:</b> 26.07.1999
                <span className="rp-sep">&bull;</span>
                <b>Nationality:</b> Bangladeshi
              </p>
            </header>

            <section className="rp-section">
              <h2 className="rp-section-head">Profile</h2>
              <hr className="rp-rule" />
              <p className="rp-summary">
                Software engineer with 3+ years building AI-powered, production-scale SaaS platforms used by tens of thousands of test-prep candidates across IELTS and PTE. Architected multi-tenant Django/DRF backends, real-time speech-evaluation pipelines, and Flutter/Next.js clients; shipped 90+ production releases across iOS, Android, and Web. AI-native engineer who ships faster using Claude Code and agentic workflows for code generation, refactoring, and test scaffolding. Competitive programming background: 2,000+ problems solved, ICPC Dhaka Regional main round competitor.
              </p>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Education</h2>
              <hr className="rp-rule" />
              <div className="rp-block">
                <div className="rp-block-row"><span className="rp-co">Leading University</span><span className="rp-loc">Sylhet, Bangladesh</span></div>
                <div className="rp-block-sub">
                  <span className="rp-role">B.Sc. in Computer Science &amp; Engineering &nbsp;-&nbsp; GPA:&nbsp;<span className="rp-gpa">3.6</span>&nbsp;/&nbsp;4.0</span>
                  <span className="rp-dates">09/2018 &ndash; 12/2022</span>
                </div>
                <ul className="rp-ul">
                  <li><span className="rp-kw">Relevant coursework:</span> Data Structures, Algorithms, Operating Systems, Computer Networks, Databases, Distributed Systems, Machine Learning.</li>
                  <li><span className="rp-kw">Final-year project: Projecto:</span> multi-role university course &amp; proposal management system built with Django, with role-based workflows, automated notifications, and PDF/CSV reporting.</li>
                  <li><span className="rp-kw">Leadership:</span> Founding Chair, IEEE Computer Society LU Student Branch (2022&ndash;23); ACM Coordinator, LU Computer Club (2022&ndash;23).</li>
                </ul>
              </div>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Languages</h2>
              <hr className="rp-rule" />
              <div className="rp-skills">
                <p className="rp-skill-row"><span className="rp-skill-key">Bengali: </span>Native</p>
                <p className="rp-skill-row"><span className="rp-skill-key">English: </span>Full professional: IELTS Academic 6.5 (Listening 7.0 &middot; Reading 6.5 &middot; Writing 6.5 &middot; Speaking 6.0), Aug 2025 &middot; CEFR&nbsp;B2</p>
              </div>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Technical Skills</h2>
              <hr className="rp-rule" />
              <div className="rp-skills">
                <p className="rp-skill-row"><span className="rp-skill-key">Languages: </span>Python &middot; TypeScript &middot; Dart &middot; SQL &middot; JavaScript &middot; C++</p>
                <p className="rp-skill-row"><span className="rp-skill-key">Backend &amp; APIs: </span>Django &middot; Django REST Framework &middot; FastAPI &middot; REST &middot; WebSockets &middot; Celery &middot; async Python</p>
                <p className="rp-skill-row"><span className="rp-skill-key">Frontend &amp; Mobile: </span>Flutter &middot; Riverpod &middot; Next.js &middot; React &middot; Tailwind CSS &middot; Zod</p>
                <p className="rp-skill-row"><span className="rp-skill-key">Data &amp; Infra: </span>PostgreSQL &middot; Redis &middot; Docker &middot; Nginx &middot; GCP &middot; DigitalOcean &middot; CI/CD &middot; Prometheus &middot; Grafana</p>
                <p className="rp-skill-row"><span className="rp-skill-key">AI / ML: </span>OpenAI API &middot; WhisperX &middot; PyTorch &middot; RAG &middot; Speech Recognition &middot; Pronunciation Assessment &middot; NLP</p>
              </div>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Professional Experience</h2>
              <hr className="rp-rule" />

              <div className="rp-block">
                <div className="rp-block-row"><span className="rp-co">LII Lab</span><span className="rp-loc">Sylhet, Bangladesh</span></div>
                <div className="rp-block-sub"><span className="rp-role">Senior Software Engineer</span><span className="rp-dates">01/2025 &ndash; 04/2026</span></div>
                <p className="rp-desc">
                  OnePTE &amp; OneIELTS: AI-powered English test-prep SaaS (Web + iOS + Android).
                </p>
                <ul className="rp-ul">
                  <li>Architected <span className="rp-kw">multi-tenant SaaS backend</span> with django-multitenant: full data isolation, custom-domain routing, per-tenant scoring config and feature flags; scaled to two production products on a shared codebase with zero cross-tenant data leakage.</li>
                  <li>Designed a <span className="rp-kw">QTI 3.0&ndash;compliant exam engine</span> supporting 100+ question types across IELTS Academic &amp; General with XML parsing, interaction routing, and strategy-pattern band-score normalization.</li>
                  <li>Built a <span className="rp-kw">real-time AI speech-evaluation pipeline</span> (Speech Recognition + Pronunciation Assessment + NLP) delivering end-to-end scoring in under 15 seconds: combining WhisperX, OpenAI APIs, and custom NLP graders for fluency, lexical resource, and grammar.</li>
                  <li>Engineered a <span className="rp-kw">multi-gateway payment platform</span> across 5 providers (Stripe, Razorpay, SSLCommerz, Google Play, Apple) with subscription lifecycle management, webhook idempotency, and transaction-level reconciliation.</li>
                  <li>Stood up a production <span className="rp-kw">observability stack</span> with Prometheus + Grafana: health checks, per-API latency histograms, and error-rate alerting.</li>
                  <li>Drove <span className="rp-kw">AI-native engineering practice</span> across the team: Claude Code workflows, CLAUDE.md skill/subagent design, and AI-assisted PR review; mentored junior engineers through code reviews and architecture walkthroughs.</li>
                </ul>
                <p className="rp-stack"><b>Stack:</b> Django &middot; DRF &middot; FastAPI &middot; Python &middot; PostgreSQL &middot; Redis &middot; Celery &middot; Docker &middot; GCP &middot; Prometheus &middot; Grafana &middot; Next.js &middot; TypeScript</p>
              </div>

              <div className="rp-block">
                <div className="rp-block-row"><span className="rp-co">LII Lab</span><span className="rp-loc">Sylhet, Bangladesh</span></div>
                <div className="rp-block-sub"><span className="rp-role">Software Engineer</span><span className="rp-dates">11/2022 &ndash; 12/2024</span></div>
                <p className="rp-desc">
                  OnePTE: AI-scored PTE test-prep platform (Flutter + Django).
                </p>
                <ul className="rp-ul">
                  <li><span className="rp-kw">Full-stack ownership from day one</span>: designed and shipped the Flutter cross-platform app (iOS + Android) covering all four PTE modules and 20+ task types with audio capture, timer management, and offline-tolerant state via Riverpod.</li>
                  <li>Built a <span className="rp-kw">task-group mock-test engine</span> with modular exam templates, configurable time allocations, automated question progression, and multi-dimensional score breakdowns.</li>
                  <li>Engineered the <span className="rp-kw">AI scoring backend</span> for spoken and written PTE tasks using Speech Recognition, Pronunciation Assessment, and NLP for multi-trait evaluation.</li>
                  <li>Integrated <span className="rp-kw">subscription billing across 4 platforms</span> (Stripe, SSLCommerz, Google Play, Apple) with webhook handling, transaction deduplication, and in-app purchase receipt verification.</li>
                  <li>Led <span className="rp-kw">90+ production releases</span> across Android, iOS, and Web: owned release pipelines, Firebase Remote Config, and CI/CD across all channels.</li>
                </ul>
                <p className="rp-stack"><b>Stack:</b> Flutter &middot; Dart &middot; Riverpod &middot; Django &middot; DRF &middot; Python &middot; PostgreSQL &middot; Redis &middot; Celery &middot; Firebase &middot; Next.js &middot; TypeScript</p>
              </div>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Selected Projects</h2>
              <hr className="rp-rule" />

              <div className="rp-block">
                <div className="rp-proj-header">
                  <a href="https://sushilabrestaurant.com" className="rp-proj-link" target="_blank" rel="noopener noreferrer">
                    Sushi Lab: Bilingual Restaurant Ordering &amp; Marketing Platform
                    <svg className="rp-ext-icon" viewBox="0 0 14 14" fill="none"><path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  </a>
                  <span className="rp-proj-dates">2026</span>
                </div>
                <p className="rp-desc">Japanese restaurant in Chartres, France: solo end-to-end build.</p>
                <ul className="rp-ul">
                  <li>Designed and shipped a production <span className="rp-kw">bilingual (FR/EN)</span> ordering + marketing site on Next.js 16 App Router with React 19 and server actions: translated URL segments and locale-aware checkout.</li>
                  <li>Built an <span className="rp-kw">ordering engine</span> with a hydration-safe Zustand cart, scheduled-ahead time slots, per-item option pickers, and server-enforced time-of-day availability windows.</li>
                  <li>Engineered <span className="rp-kw">triple-channel notifications</span> (Telegram bot, transactional customer email, restaurant inbox) dispatched in parallel, plus AI-discoverable SEO (JSON-LD, per-locale canonical + hreflang) and a GA4 ecommerce funnel.</li>
                </ul>
                <p className="rp-stack"><b>Stack:</b> Next.js 16 &middot; React 19 &middot; TypeScript &middot; Tailwind &middot; Zustand &middot; Zod &middot; React Email &middot; next-intl &middot; ZeptoMail &middot; Telegram Bot API &middot; GA4</p>
              </div>
            </section>

            <section className="rp-section">
              <h2 className="rp-section-head">Competitive Programming &amp; Achievements</h2>
              <hr className="rp-rule" />
              <div className="rp-cp-grid">
                <div className="rp-cp-item">Solved <b>2,000+ problems</b> across online judges; participated in <b>300+ contests</b> over 4 years.</div>
                <div className="rp-cp-item"><b>ICPC Dhaka Regional 2020 Main Round</b>: 51st. <b>Regional Online Preliminary 2021</b>: 85th of 1,747 teams.</div>
                <div className="rp-cp-item"><b>Runner-up (Bangladesh)</b>, IEEEXtreme 16.0 (2022): global rank 149 / 6,500+ teams.</div>
                <div className="rp-cp-item"><b>Champion</b>, LU CSE Carnival National Hackathon 2023; <b>Champion</b>, LU TechStorm 4 (2021).</div>
                <div className="rp-cp-item">
                  <a href="https://codeforces.com/profile/cloud_007" target="_blank" rel="noopener noreferrer">Codeforces</a> (Max: <b>1603</b>)
                  &nbsp;&middot;&nbsp;
                  <a href="https://www.codechef.com/users/cloud_007" target="_blank" rel="noopener noreferrer">CodeChef</a> (Max: <b>1965</b>)
                </div>
              </div>
            </section>

            <div className="rp-sign">
              <span className="rp-sign-place">Sylhet, Bangladesh: June 2026</span>
              <span className="rp-sign-name">Md Mazharul Islam Emon</span>
            </div>

          </div>{/* /rp-paper */}
        </div>{/* /rp-paper-wrap */}
      </div>{/* /rp-root */}
    </>
  );
}
