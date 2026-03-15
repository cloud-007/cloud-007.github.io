import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Achievements } from "@/components/achievements";
import { Gallery } from "@/components/gallery";
import { Education } from "@/components/education";
import { Volunteering } from "@/components/volunteering";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main>
        <Hero />

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Experience />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Skills />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Projects />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Achievements />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Gallery />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Education />

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <Volunteering />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-12 px-4 mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-zinc-400 text-sm font-medium" suppressHydrationWarning>
                © {new Date().getFullYear()} Md Mazharul Islam Emon
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                Built with Next.js · TypeScript · Tailwind CSS
              </p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "https://github.com/cloud-007", label: "GitHub" },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/-mazharulislam-/",
                  label: "LinkedIn",
                },
                {
                  icon: Mail,
                  href: "mailto:mie.mazharul@gmail.com",
                  label: "Email",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
