"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";
import { safeHref } from "@/lib/content";
import { editorial } from "@/lib/editorial";

export function Hero({ home = false }: { home?: boolean }) {
  const { content } = useSiteContent();
  const profile = content.profile;
  if (!profile) return null;
  return (
    <section id="about" className={`profile-hero page-width ${home ? "home-hero" : "about-hero"}`}>
      <div className="hero-copy">
        <p className="intro-name">{home ? profile.name : "About Mazharul"}<span className="intro-role">{profile.role}</span></p>
        <h1>{home ? editorial.headline : "An engineer who stays with the problem."}</h1>
        <p className="hero-description">{home ? "I build Python backends, web and mobile applications, and applied AI workflows. From the first product decision to the systems running in production." : profile.bio}</p>
        {home && <p className="hero-context">Previously Senior Software Engineer at LII Lab. Now studying M.Sc. Computer Science at Paderborn University.</p>}
        <div className="hero-actions">
          <Link href="/#projects" className="button-primary">View selected work <ArrowDown size={16} /></Link>
          <a href="/resume.pdf" download className="text-link">Download CV <ArrowUpRight size={16} /></a>
        </div>
        {profile.open_to_work && <p className="availability"><span aria-hidden="true" />{editorial.availability}</p>}
      </div>
      <aside className="hero-aside">
        <div className="portrait-frame">
          <Image src={profile.avatar_url ?? "/images/profile.jpg"} alt={profile.name} width={800} height={800} priority sizes="(max-width: 700px) 140px, 330px" />
        </div>
        <p className="portrait-location"><MapPin size={14} />{profile.location}</p>
        <p className="portrait-note">Backend depth.<br /> Product ownership.<br /> A habit of shipping.</p>
        <div className="hero-socials">{profile.socials.filter((social) => ["GitHub", "LinkedIn"].includes(social.label) && safeHref(social.href)).map((social) => <a key={social.label} href={safeHref(social.href)} target="_blank" rel="noopener noreferrer">{social.label}<ArrowUpRight size={13} /></a>)}</div>
      </aside>
      <dl className="proof-strip">
        <div><dt>3.5 years</dt><dd>Production experience at LII Lab</dd></div>
        <div><dt>93+ releases</dt><dd>Contributed across the LII Lab tenure</dd></div>
        <div><dt>End to end</dt><dd>Backend, mobile and product delivery</dd></div>
      </dl>
    </section>
  );
}
