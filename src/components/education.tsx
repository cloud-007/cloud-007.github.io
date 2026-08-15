"use client";

import { GraduationCap, Calendar } from "lucide-react";

const education = [
  {
    institution: "Leading University",
    location: "Sylhet, Bangladesh",
    degree: "B.Sc. in Computer Science and Engineering",
    period: "Sep 2018 – Dec 2022",
    detail: "GPA: 3.6 / 4.0",
  },
  {
    institution: "Beanibazar Govt. College",
    location: "Sylhet, Bangladesh",
    degree: "Higher Secondary Certificate (Science)",
    period: "2016 – 2018",
    detail: "",
  },
  {
    institution: "Purba Muria High School",
    location: "Sylhet, Bangladesh",
    degree: "Secondary School Certificate",
    period: "2011 – 2016",
    detail: "",
  },
];

export function Education() {
  return (
    <section id="education" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Academic Background</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Education
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">Degrees and qualifications</p>
        </div>

        <div className="space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bento-card p-6 hover:border-zinc-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Icon + content */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-zinc-50 font-bold text-base">
                      {edu.institution}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-0.5">{edu.degree}</p>
                    {edu.detail && (
                      <p className="text-emerald-400 text-xs font-semibold mt-1.5">
                        {edu.detail}
                      </p>
                    )}
                    <p className="text-zinc-600 text-xs mt-1">{edu.location}</p>
                  </div>
                </div>

                {/* Period */}
                <div className="flex items-center gap-2 text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-700/50 shrink-0 self-start sm:self-center">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                    {edu.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
