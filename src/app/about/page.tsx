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

export const metadata: Metadata = {
  title: "About | Md Mazharul Islam Emon",
  description:
    "Experience, skills, projects, achievements, education, and volunteering of Md Mazharul Islam Emon, Full-Stack AI Engineer.",
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
