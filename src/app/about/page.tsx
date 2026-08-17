import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Achievements } from "@/components/achievements";
import { Education } from "@/components/education";
import { Volunteering } from "@/components/volunteering";
import { Footer } from "@/components/footer";
import { siteIdentity } from "@/lib/content";

/* Same reason as the root layout: the name and role live in one place, and
   this page derives from it rather than keeping its own copy. */
const { name, role } = siteIdentity;

export const metadata: Metadata = {
  title: `About | ${name}`,
  description: `Experience, skills, projects, achievements, education, and volunteering of ${name}, ${role}.`,
};

const Divider = () => (
  <div className="max-w-5xl mx-auto px-4">
    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main>
        <Hero />
        <Divider />
        <Experience />
        <Divider />
        <Skills />
        <Divider />
        <Projects />
        <Divider />
        <Achievements />
        <Divider />
        <Education />
        <Divider />
        <Volunteering />
      </main>
      <Footer />
    </div>
  );
}
