"use client";

export default function ResumePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Page shell ── */
        .rp-root {
          background: #e8e8e8;
          min-height: 100vh;
          padding: 1.25rem 1rem 3rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #111;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
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
        .rp-toolbar-left { display: flex; align-items: center; gap: 0.5rem; }
        .rp-toolbar-note {
          font-size: 0.7rem;
          color: #777;
          font-style: italic;
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
          background: #111;
          border: none;
          border-radius: 5px;
          padding: 0.42rem 1rem;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .rp-dl:hover { background: #333; }

        /* ── A4 paper card ── */
        .rp-paper {
          max-width: 850px;
          margin: 0 auto;
          background: #fff;
          padding: 2.1rem 2.6rem 2.4rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.13);
        }

        /* ── Header ── */
        .rp-header { text-align: center; margin-bottom: 1.2rem; }
        .rp-name {
          font-size: 1.55rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1.15;
          margin-bottom: 0.18rem;
        }
        .rp-subtitle {
          font-size: 0.88rem;
          font-weight: 400;
          color: #3a3a3a;
          letter-spacing: 0.01em;
          margin-bottom: 0.42rem;
        }
        .rp-contact {
          font-size: 0.775rem;
          color: #444;
          line-height: 1.65;
        }
        .rp-contact a {
          color: #444;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s;
        }
        .rp-contact a:hover { border-bottom-color: #444; }
        .rp-sep { margin: 0 0.38rem; color: #bbb; }

        /* ── Section ── */
        .rp-section { margin-bottom: 1.05rem; }
        .rp-section:last-child { margin-bottom: 0; }

        .rp-section-head {
          text-align: center;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin-bottom: 0.22rem;
        }
        .rp-rule {
          border: none;
          border-top: 0.75px solid #0a0a0a;
          margin-bottom: 0.6rem;
        }

        /* ── Summary ── */
        .rp-summary {
          font-size: 0.795rem;
          line-height: 1.68;
          color: #2a2a2a;
          text-align: justify;
          hyphens: auto;
        }

        /* ── Skills ── */
        .rp-skills { display: flex; flex-direction: column; gap: 0.24rem; }
        .rp-skill-row {
          font-size: 0.782rem;
          line-height: 1.52;
          color: #2a2a2a;
        }
        .rp-skill-key { font-weight: 600; color: #0a0a0a; }

        /* ── Block ── */
        .rp-block { margin-bottom: 0.85rem; }
        .rp-block:last-child { margin-bottom: 0; }

        .rp-block-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
        }
        .rp-co {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0a0a0a;
        }
        .rp-loc { font-size: 0.75rem; color: #555; flex-shrink: 0; }

        .rp-block-sub {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
          margin-top: 0.05rem;
          margin-bottom: 0.28rem;
        }
        .rp-role { font-size: 0.81rem; font-weight: 600; color: #222; }
        .rp-dates { font-size: 0.74rem; color: #666; flex-shrink: 0; }

        .rp-ul {
          padding-left: 1.1rem;
          list-style: disc;
        }
        .rp-ul li {
          font-size: 0.775rem;
          line-height: 1.62;
          color: #2a2a2a;
          margin-bottom: 0.1rem;
          text-align: justify;
          hyphens: auto;
        }

        .rp-stack {
          font-size: 0.72rem;
          color: #666;
          margin-top: 0.3rem;
          line-height: 1.5;
        }
        .rp-stack b { color: #444; font-weight: 600; }

        /* ── Projects ── */
        .rp-proj-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.22rem;
          flex-wrap: wrap;
        }
        .rp-proj-title { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
        .rp-proj-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0a0a0a;
        }
        .rp-proj-dates { font-size: 0.74rem; color: #666; flex-shrink: 0; }

        /* ── Link badge ── */
        .rp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.18rem;
          font-size: 0.68rem;
          font-weight: 500;
          color: #444;
          text-decoration: none;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 0.05rem 0.38rem;
          margin-left: 0.25rem;
          line-height: 1.6;
          transition: border-color 0.15s, color 0.15s;
          vertical-align: middle;
          position: relative;
          top: -0.5px;
        }
        .rp-link:hover { border-color: #888; color: #111; }

        /* ── CP grid ── */
        .rp-cp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem 1.1rem;
        }
        .rp-cp-item {
          font-size: 0.775rem;
          line-height: 1.58;
          color: #2a2a2a;
          text-align: left;
        }
        .rp-cp-item b { color: #0a0a0a; }
        .rp-cp-item a {
          color: #2a2a2a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
        }
        .rp-cp-item a:hover { color: #111; border-bottom-color: #555; }

        /* ── Keyword highlight ── */
        .rp-kw { font-weight: 600; color: #0a0a0a; }

        /* ── Experience description ── */
        .rp-desc {
          font-size: 0.775rem;
          line-height: 1.58;
          color: #555;
          font-style: italic;
          margin: 0.15rem 0 0.32rem;
        }
        .rp-prod-link {
          color: #333;
          font-style: normal;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid #bbb;
          transition: border-color 0.15s;
        }
        .rp-prod-link:hover { border-bottom-color: #444; }

        /* ── Project title as link ── */
        .rp-proj-link {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0a0a0a;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.15s;
        }
        .rp-proj-link:hover { color: #444; }
        .rp-ext-icon {
          width: 0.78rem;
          height: 0.78rem;
          color: #777;
          flex-shrink: 0;
          transition: color 0.15s;
          position: relative;
          top: 1px;
        }
        .rp-proj-link:hover .rp-ext-icon { color: #333; }

        /* ── GPA ── */
        .rp-gpa { font-weight: 700; color: #0a0a0a; }

        /* ── Print ── */
        @media print {
          .rp-toolbar { display: none !important; }

          .rp-root {
            background: #fff;
            padding: 0;
          }
          .rp-paper {
            box-shadow: none;
            padding: 0;
            max-width: 100%;
          }

          @page {
            size: A4;
            margin: 0.5in 0.58in;
          }

          /* Tighten for 2 pages */
          .rp-name { font-size: 16pt; }
          .rp-subtitle { font-size: 9pt; margin-bottom: 0.25rem; }
          .rp-contact { font-size: 7.8pt; }
          .rp-header { margin-bottom: 0.75rem; }

          .rp-section { margin-bottom: 0.65rem; }
          .rp-section-head { font-size: 7pt; letter-spacing: 0.1em; }
          .rp-rule { margin-bottom: 0.38rem; }

          .rp-summary { font-size: 8pt; line-height: 1.45; }

          .rp-skill-row { font-size: 7.8pt; line-height: 1.42; }
          .rp-skills { gap: 0.17rem; }

          .rp-block { margin-bottom: 0.55rem; }
          .rp-co { font-size: 9pt; }
          .rp-role { font-size: 8.2pt; }
          .rp-loc, .rp-dates { font-size: 7.8pt; }
          .rp-block-sub { margin-bottom: 0.15rem; }
          .rp-desc { font-size: 7.8pt; line-height: 1.42; margin: 0.1rem 0 0.22rem; }

          .rp-ul li { font-size: 7.8pt; line-height: 1.45; margin-bottom: 0.04rem; }
          .rp-stack { font-size: 7.2pt; margin-top: 0.18rem; }

          .rp-proj-link { font-size: 8.5pt; }
          .rp-proj-dates { font-size: 7.8pt; }
          .rp-proj-header { margin-bottom: 0.12rem; }

          .rp-cp-grid { gap: 0.35rem 0.8rem; }
          .rp-cp-item { font-size: 7.8pt; line-height: 1.45; }

          /* Links visible in PDF */
          a { color: #111 !important; text-decoration: none; }
          .rp-prod-link { border-bottom: 1px solid #aaa; color: #111 !important; }
          .rp-proj-link { color: #111 !important; }
          .rp-ext-icon { display: none; }
          .rp-cp-item a { border-bottom: 1px solid #aaa; }

          /* Page break: Projects starts on page 2 */
          .rp-page2 { page-break-before: always; }

          .rp-section { page-break-inside: avoid; }
          .rp-block { page-break-inside: avoid; }
        }
      `}</style>

      <div className="rp-root">
        {/* ── Toolbar ── */}
        <div className="rp-toolbar">
          <a href="/" className="rp-back">&#8592; Portfolio</a>
          <button className="rp-dl" onClick={() => window.print()}>
            &#8595;&nbsp; Download PDF
          </button>
        </div>

        {/* ── A4 Paper ── */}
        <div className="rp-paper">

          {/* Header */}
          <header className="rp-header">
            <h1 className="rp-name">MD MAZHARUL ISLAM EMON</h1>
            <p className="rp-subtitle">Senior Software Engineer</p>
            <p className="rp-contact">
              +8801794405314
              <span className="rp-sep">&bull;</span>
              <a href="mailto:mie.mazharul@gmail.com">mie.mazharul@gmail.com</a>
              <span className="rp-sep">&bull;</span>
              <a href="https://github.com/cloud-007" target="_blank" rel="noopener noreferrer">github.com/cloud-007</a>
              <span className="rp-sep">&bull;</span>
              <a href="https://linkedin.com/in/-mazharulislam-/" target="_blank" rel="noopener noreferrer">linkedin.com/in/-mazharulislam-/</a>
              <span className="rp-sep">&bull;</span>
              Sylhet, Bangladesh
            </p>
          </header>

          {/* ── PAGE 1 ── */}

          {/* Summary */}
          <section className="rp-section">
            <h2 className="rp-section-head">Summary</h2>
            <hr className="rp-rule" />
            <p className="rp-summary">
              Senior Software Engineer with 3+ years of experience building AI-powered SaaS platforms, cross-platform mobile applications, and scalable backend systems. Proven track record in architecting multi-tenant platforms, designing real-time speech evaluation pipelines, and leading end-to-end product delivery from system design to production. Strong background in competitive programming with 2,000+ problems solved and ICPC Asia Dhaka Regional participation.
            </p>
          </section>

          {/* Skills — trimmed to key industry-standard skills */}
          <section className="rp-section">
            <h2 className="rp-section-head">Technical Skills</h2>
            <hr className="rp-rule" />
            <div className="rp-skills">
              <p className="rp-skill-row">
                <span className="rp-skill-key">Languages &amp; Frameworks: </span>
                Python &middot; Django &middot; Django REST Framework &middot; FastAPI &middot; Dart &middot; Flutter &middot; TypeScript &middot; Next.js &middot; React
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">Databases &amp; Messaging: </span>
                PostgreSQL &middot; Redis &middot; Celery &middot; Celery Beat
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">AI &amp; NLP: </span>
                Speech Recognition &middot; NLP Processing &middot; LLM Integration &middot; PyTorch &middot; WhisperX &middot; OpenAI API
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">Infrastructure &amp; DevOps: </span>
                Docker &middot; Nginx &middot; GCP &middot; DigitalOcean &middot; CI/CD &middot; Prometheus &middot; Grafana &middot; Firebase &middot; FCM &middot; Firebase Analytics &middot; Crashlytics
              </p>
            </div>
          </section>

          {/* Experience */}
          <section className="rp-section">
            <h2 className="rp-section-head">Professional Experience</h2>
            <hr className="rp-rule" />

            {/* Senior SWE */}
            <div className="rp-block">
              <div className="rp-block-row">
                <span className="rp-co">LII Lab</span>
                <span className="rp-loc">Sylhet, Bangladesh</span>
              </div>
              <div className="rp-block-sub">
                <span className="rp-role">Senior Software Engineer</span>
                <span className="rp-dates">01/2025 &ndash; Present</span>
              </div>
              <p className="rp-desc">
                Leading backend engineering and product development across two AI-powered English test preparation platforms &mdash;{" "}
                <a href="https://oneielts.com" className="rp-prod-link" target="_blank" rel="noopener noreferrer">OneIELTS</a> and{" "}
                <a href="https://onepte.com" className="rp-prod-link" target="_blank" rel="noopener noreferrer">OnePTE</a>{" "}
                &mdash; from system design and architecture reviews to mentoring engineers and shipping production features.
              </p>
              <ul className="rp-ul">
                <li>Architected a <span className="rp-kw">multi-tenant SaaS platform</span> with complete data isolation per organization, domain-based tenant routing, per-tenant scoring configuration, and feature flags.</li>
                <li>Designed a <span className="rp-kw">QTI 3.0-compliant exam engine</span> supporting <span className="rp-kw">100+ question types</span> with automated band-score normalization using a strategy-pattern scorer.</li>
                <li>Built a <span className="rp-kw">real-time speech evaluation pipeline</span> processing spoken submissions end-to-end in <span className="rp-kw">under 15 seconds</span>, integrating Speech Recognition, Pronunciation Assessment, and NLP Processing.</li>
                <li>Engineered multi-gateway payment infrastructure supporting <span className="rp-kw">5 providers</span> with subscription lifecycle management, webhook idempotency, and promotional pricing campaigns.</li>
                <li>Built the internal <span className="rp-kw">Studio API</span> covering content authoring, expert evaluation queues, exam rejudge pipelines, and KPI analytics for subscription and engagement metrics.</li>
                <li>Set up <span className="rp-kw">production observability</span> with per-API latency instrumentation and real-time alerting via Prometheus and Grafana.</li>
                <li>Mentored junior engineers through code reviews and technical walkthroughs; collaborated with stakeholders on requirement definition and architectural trade-offs.</li>
              </ul>
            </div>

            {/* SWE */}
            <div className="rp-block">
              <div className="rp-block-row">
                <span className="rp-co">LII Lab</span>
                <span className="rp-loc">Sylhet, Bangladesh</span>
              </div>
              <div className="rp-block-sub">
                <span className="rp-role">Software Engineer</span>
                <span className="rp-dates">11/2022 &ndash; 12/2024</span>
              </div>
              <p className="rp-desc">
                Full-stack ownership of{" "}
                <a href="https://onepte.com" className="rp-prod-link" target="_blank" rel="noopener noreferrer">OnePTE</a>
                {" "}&mdash; designing and shipping the Flutter app from day one to a multi-brand cross-platform product, and building the Django backend powering AI scoring, exam management, and billing.
              </p>
              <ul className="rp-ul">
                <li>Designed and built the <span className="rp-kw">Flutter application from scratch</span> covering all four test modules (Speaking, Writing, Reading, Listening) with <span className="rp-kw">20+ task types</span>, interactive answer widgets, and audio recording.</li>
                <li>Built a task-group-based <span className="rp-kw">mock test engine</span> with modular exam templates, configurable time allocations per task, automated question progression, and multi-dimensional score breakdowns.</li>
                <li>Engineered <span className="rp-kw">AI scoring backend</span> for spoken and written exam submissions using Speech Recognition, Pronunciation Assessment, and NLP for automated multi-trait evaluation.</li>
                <li>Integrated subscription billing across <span className="rp-kw">4 platforms</span> — Stripe, SSLCommerz, Google Play Billing, Apple App Store — with webhook handling, transaction deduplication, and purchase verification.</li>
                <li>Built Django admin and private API for question bank management, subscription analytics with regional reporting, exam rejudge system, and user dashboards via Google Analytics Data API.</li>
                <li>Wrote test suites covering auth, question bank, mock test, and billing; maintained <span className="rp-kw">CI/CD pipelines</span> across Android, iOS, and Web.</li>
                <li>Managed <span className="rp-kw">93+ production releases</span> on <span className="rp-kw">Google Play Store</span> and <span className="rp-kw">Apple App Store</span>, maintaining a regular release cadence with versioned builds, staged rollouts, release notes, and post-release production monitoring.</li>
              </ul>
            </div>
          </section>

          {/* ── PAGE 2 ── */}
          <div className="rp-page2">

            {/* Projects */}
            <section className="rp-section">
              <h2 className="rp-section-head">Projects</h2>
              <hr className="rp-rule" />

              <div className="rp-block">
                <div className="rp-proj-header">
                  <a href="https://www.patty-bros.co.uk" className="rp-proj-link" target="_blank" rel="noopener noreferrer">
                    Patty Bros &mdash; Restaurant Website
                    <svg className="rp-ext-icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <span className="rp-proj-dates">2025</span>
                </div>
                <ul className="rp-ul">
                  <li>Built a <span className="rp-kw">marketing and booking website</span> for a South East London restaurant with responsive animated pages and a serverless booking system.</li>
                  <li>Integrated <span className="rp-kw">Google Sheets-driven live menu</span> with Google Apps Script for serverless booking processing and Telegram Bot API for real-time owner notifications.</li>
                </ul>
                <p className="rp-stack"><b>Stack:</b> Next.js &middot; TypeScript &middot; Tailwind CSS &middot; Framer Motion &middot; Google Sheets API &middot; Google Apps Script &middot; Telegram Bot API</p>
              </div>

              <div className="rp-block">
                <div className="rp-proj-header">
                  <a href="https://github.com/cloud-007/projecto" className="rp-proj-link" target="_blank" rel="noopener noreferrer">
                    Projecto &mdash; University Course &amp; Proposal Management System
                    <svg className="rp-ext-icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <span className="rp-proj-dates">10/2022 &ndash; 12/2022</span>
                </div>
                <ul className="rp-ul">
                  <li>Built a <span className="rp-kw">multi-role web application</span> (student, supervisor, admin) for managing university project proposals, submissions, and evaluations end-to-end.</li>
                  <li>Implemented <span className="rp-kw">AJAX-driven interactions</span> for dynamic form handling, real-time feedback, and automated Gmail notifications for proposal status updates and deadlines.</li>
                  <li>Added <span className="rp-kw">PDF and CSV export</span> for project reports and integrated a background job service for scheduled task operations.</li>
                </ul>
                <p className="rp-stack"><b>Stack:</b> Django &middot; Python &middot; PostgreSQL &middot; AJAX &middot; jQuery &middot; Bootstrap</p>
              </div>
            </section>

            {/* Competitive Programming */}
            <section className="rp-section">
              <h2 className="rp-section-head">Competitive Programming &amp; Achievements</h2>
              <hr className="rp-rule" />
              <div className="rp-cp-grid">
                <div className="rp-cp-item">
                  Solved <b>2,000+ problems</b> across online judges; participated in <b>300+ contests</b>.
                </div>
                <div className="rp-cp-item">
                  <b>Champion</b>, LU CSE Carnival National Hackathon 2023 &mdash; Team: LU Ovream
                </div>
                <div className="rp-cp-item">
                  <b>Runner-up (Bangladesh)</b>, IEEEXtreme 16.0 (2022) &mdash; Global Rank 149, Team: LazySquad
                </div>
                <div className="rp-cp-item">
                  <b>ICPC:</b> 87th / 1,700+ teams, Preliminary 2021; 51st, Dhaka Regional 2020
                </div>
                <div className="rp-cp-item">
                  <b>Champion</b>, LU TechStorm 4 Programming Contest 2021
                </div>
                <div className="rp-cp-item">
                  <a href="https://codeforces.com/profile/cloud_007" target="_blank" rel="noopener noreferrer">Codeforces</a> (Max: <b>1603</b>)
                  &nbsp;&middot;&nbsp;
                  <a href="https://www.codechef.com/users/cloud_007" target="_blank" rel="noopener noreferrer">CodeChef</a> (Max: <b>1965</b>)
                  &nbsp;&middot;&nbsp;
                  <a href="https://lightoj.com/user/cloud_007" target="_blank" rel="noopener noreferrer">LightOJ</a>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="rp-section">
              <h2 className="rp-section-head">Education</h2>
              <hr className="rp-rule" />
              <div className="rp-block">
                <div className="rp-block-row">
                  <span className="rp-co">Leading University</span>
                  <span className="rp-loc">Sylhet, Bangladesh</span>
                </div>
                <div className="rp-block-sub">
                  <span className="rp-role">B.Sc. in Computer Science and Engineering &nbsp;&mdash;&nbsp; GPA:&nbsp;<span className="rp-gpa">3.6</span>&nbsp;/&nbsp;4.0</span>
                  <span className="rp-dates">09/2018 &ndash; 12/2022</span>
                </div>
              </div>
            </section>

            {/* Volunteering */}
            <section className="rp-section">
              <h2 className="rp-section-head">Volunteering</h2>
              <hr className="rp-rule" />

              <div className="rp-block">
                <div className="rp-block-row">
                  <span className="rp-co">IEEE Computer Society &mdash; LU Student Branch Chapter</span>
                </div>
                <div className="rp-block-sub">
                  <span className="rp-role">Chair</span>
                  <span className="rp-dates">04/2022 &ndash; 05/2023</span>
                </div>
                <ul className="rp-ul">
                  <li>Helped establish the IEEE Computer Society Student Branch Chapter at LU from the ground up and launched key initiatives that shaped the chapter&apos;s technical identity and community presence.</li>
                  <li>Organized and hosted seminars, webinars, and technical workshops featuring guest speakers from the local software industry and academic community.</li>
                  <li>Guided chapter-wide community-building efforts through outreach programs and engagement campaigns that <span className="rp-kw">grew membership by over 20%</span> within the first year.</li>
                  <li>Planned and delivered hands-on technical learning programs for students, including a multi-session <span className="rp-kw">Flutter bootcamp</span> focused on cross-platform mobile development.</li>
                  <li>Served as a problem setter and judge for inter-university and intra-university competitive programming contests, contributing to the local CP ecosystem.</li>
                </ul>
              </div>

              <div className="rp-block">
                <div className="rp-block-row">
                  <span className="rp-co">Leading University Computer Club</span>
                </div>
                <div className="rp-block-sub">
                  <span className="rp-role">ACM Coordinator</span>
                  <span className="rp-dates">01/2022 &ndash; 12/2023</span>
                </div>
                <ul className="rp-ul">
                  <li>Conducted regular peer-to-peer learning sessions on Data Structures and Algorithms, helping students build strong foundations for technical interviews and competitive programming.</li>
                  <li>Mentored junior students in competitive programming strategies, problem-solving techniques, and online judge workflows across Codeforces, CodeChef, and LightOJ.</li>
                  <li>Helped establish a collaborative team learning culture and organized regular contest practice sessions to prepare members for ICPC and national competitions.</li>
                </ul>
              </div>
            </section>

          </div>{/* /rp-page2 */}
        </div>{/* /rp-paper */}
      </div>{/* /rp-root */}
    </>
  );
}
