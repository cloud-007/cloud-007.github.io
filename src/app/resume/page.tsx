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
          border-top: 1.5px solid #0a0a0a;
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
          .rp-name { font-size: 17pt; }
          .rp-subtitle { font-size: 9.5pt; margin-bottom: 0.3rem; }
          .rp-contact { font-size: 8pt; }
          .rp-header { margin-bottom: 0.9rem; }

          .rp-section { margin-bottom: 0.8rem; }
          .rp-section-head { font-size: 7.2pt; letter-spacing: 0.1em; }
          .rp-rule { margin-bottom: 0.45rem; }

          .rp-summary { font-size: 8.5pt; line-height: 1.5; }

          .rp-skill-row { font-size: 8pt; line-height: 1.45; }
          .rp-skills { gap: 0.2rem; }

          .rp-block { margin-bottom: 0.65rem; }
          .rp-co { font-size: 9.5pt; }
          .rp-role { font-size: 8.5pt; }
          .rp-loc, .rp-dates { font-size: 8pt; }
          .rp-block-sub { margin-bottom: 0.2rem; }

          .rp-ul li { font-size: 8pt; line-height: 1.5; margin-bottom: 0.06rem; }
          .rp-stack { font-size: 7.5pt; margin-top: 0.22rem; }

          .rp-proj-name { font-size: 9pt; }
          .rp-proj-dates { font-size: 8pt; }
          .rp-proj-header { margin-bottom: 0.15rem; }

          .rp-link {
            font-size: 7pt;
            padding: 0.02rem 0.3rem;
            border-color: #aaa;
          }

          .rp-cp-grid { gap: 0.4rem 0.9rem; }
          .rp-cp-item { font-size: 8pt; line-height: 1.5; }

          /* Links visible in PDF */
          a { color: #111 !important; text-decoration: underline; }
          .rp-link { border: 1px solid #aaa; text-decoration: none; color: #111 !important; }

          /* Page break: Projects starts on page 2 */
          .rp-page2 { page-break-before: always; }

          .rp-section { page-break-inside: avoid; }
          .rp-block { page-break-inside: avoid; }
        }
      `}</style>

      <div className="rp-root">
        {/* ── Toolbar ── */}
        <div className="rp-toolbar">
          <div className="rp-toolbar-left">
            <a href="/" className="rp-back">&#8592; Portfolio</a>
            <span className="rp-toolbar-note">Print &rarr; Save as PDF &rarr; set margins to None</span>
          </div>
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
                Speech Recognition &middot; NLP Processing &middot; LLM Integration &middot; PyTorch &middot; WhisperX &middot; Azure Cognitive Services &middot; OpenAI API
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">Infrastructure &amp; DevOps: </span>
                Docker &middot; Nginx &middot; GCP &middot; DigitalOcean &middot; CI/CD &middot; GitHub Actions &middot; Prometheus &middot; Grafana &middot; Firebase
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">Payments: </span>
                Stripe &middot; Google Play Billing &middot; Apple App Store &middot; SSLCommerz &middot; Razorpay
              </p>
              <p className="rp-skill-row">
                <span className="rp-skill-key">Testing &amp; Quality: </span>
                pytest &middot; pytest-django &middot; factory_boy &middot; Flutter Unit Testing
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
              <ul className="rp-ul">
                <li>Architected a multi-tenant SaaS platform with complete data isolation per organization, domain-based tenant routing, per-tenant scoring configuration, and feature flags.</li>
                <li>Designed a QTI 3.0-compliant exam engine for IELTS Academic and General modules supporting 100+ question types with automated band-score normalization using a strategy-pattern scorer.</li>
                <li>Built a real-time speech evaluation pipeline processing spoken submissions end-to-end in under 15 seconds, integrating Speech Recognition, Pronunciation Assessment, and NLP Processing.</li>
                <li>Engineered multi-gateway payment infrastructure supporting 5 providers with subscription lifecycle management, webhook idempotency, and promotional pricing campaigns.</li>
                <li>Built the internal Studio API covering content authoring, expert evaluation queues, exam rejudge pipelines, and KPI analytics for subscription and engagement metrics.</li>
                <li>Set up production observability with per-API latency instrumentation and real-time alerting via Prometheus and Grafana.</li>
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
              <ul className="rp-ul">
                <li>Designed and built the Flutter application from scratch covering all four PTE modules (Speaking, Writing, Reading, Listening) with 20+ task types, interactive answer widgets, and audio recording.</li>
                <li>Built a task-group-based mock test engine with modular exam templates, configurable time allocations per task, automated question progression, and multi-dimensional score breakdowns.</li>
                <li>Engineered AI scoring backend for spoken and written PTE tasks using Speech Recognition, Pronunciation Assessment, and NLP for automated multi-trait evaluation across all modules.</li>
                <li>Integrated subscription billing across 4 platforms — Stripe, SSLCommerz, Google Play Billing, Apple App Store — with webhook handling, transaction deduplication, and purchase verification.</li>
                <li>Built Django admin and private API for question bank management, subscription analytics with regional reporting, exam rejudge system, and user dashboards via Google Analytics Data API.</li>
                <li>Wrote test suites covering auth, question bank, mock test, and billing; maintained CI/CD pipelines across Android, iOS, and Web.</li>
                <li>Led 93+ production mobile releases across Android, iOS, and Web.</li>
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
                  <div className="rp-proj-title">
                    <span className="rp-proj-name">OneIELTS &mdash; Multi-Tenant IELTS Preparation Platform</span>
                    <a href="https://oneielts.com" className="rp-link" target="_blank" rel="noopener noreferrer">Live &#8599;</a>
                  </div>
                  <span className="rp-proj-dates">2024 &ndash; Present</span>
                </div>
                <ul className="rp-ul">
                  <li>Built QTI 3.0-compliant exam engine with automated scoring across all four IELTS skill areas and per-section band normalization.</li>
                  <li>Integrated 5-gateway payment infrastructure with subscription lifecycle management and promotional pricing.</li>
                  <li>Designed internal Studio API for content moderation, expert evaluation queues, rejudge pipelines, and KPI analytics.</li>
                </ul>
              </div>

              <div className="rp-block">
                <div className="rp-proj-header">
                  <div className="rp-proj-title">
                    <span className="rp-proj-name">OnePTE &mdash; PTE Academic Exam Preparation Platform</span>
                    <a href="https://onepte.com" className="rp-link" target="_blank" rel="noopener noreferrer">Live &#8599;</a>
                  </div>
                  <span className="rp-proj-dates">2022 &ndash; Present</span>
                </div>
                <ul className="rp-ul">
                  <li>Built cross-platform Flutter app with 20+ task types across all PTE modules; led 93+ production releases on Android, iOS, and Web.</li>
                  <li>Designed GPU-backed speech microservice using WhisperX and Azure Cognitive Services for real-time pronunciation and fluency scoring.</li>
                  <li>Implemented multi-platform billing (Stripe, SSLCommerz, Google Play, Apple App Store) with regional analytics dashboards.</li>
                </ul>
              </div>

              <div className="rp-block">
                <div className="rp-proj-header">
                  <div className="rp-proj-title">
                    <span className="rp-proj-name">Projecto &mdash; University Course &amp; Proposal Management System</span>
                    <a href="https://github.com/cloud-007/projecto" className="rp-link" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>
                  </div>
                  <span className="rp-proj-dates">10/2022 &ndash; 12/2022</span>
                </div>
                <ul className="rp-ul">
                  <li>Django web app with multi-role access system, AJAX-driven interactions, automated email notifications, and PDF/CSV exports.</li>
                </ul>
              </div>

              <div className="rp-block">
                <div className="rp-proj-header">
                  <div className="rp-proj-title">
                    <span className="rp-proj-name">Reachout &mdash; Flutter Consultation MVP</span>
                    <a href="https://github.com/cloud-007" className="rp-link" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>
                  </div>
                  <span className="rp-proj-dates">10/2023</span>
                </div>
                <ul className="rp-ul">
                  <li>Flutter MVP connecting users with professional consultants featuring Google Sign-In, real-time chat, and Clean Architecture with Riverpod.</li>
                </ul>
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
                  <li>Helped establish the chapter and launch key community initiatives; increased membership by 20%.</li>
                  <li>Organized seminars, webinars, and technical events with industry speakers; organized a Flutter bootcamp.</li>
                  <li>Served as judge and problem setter for programming contests.</li>
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
                  <li>Conducted peer-to-peer sessions on Data Structures and Algorithms; mentored juniors in competitive programming.</li>
                </ul>
              </div>
            </section>

          </div>{/* /rp-page2 */}
        </div>{/* /rp-paper */}
      </div>{/* /rp-root */}
    </>
  );
}
