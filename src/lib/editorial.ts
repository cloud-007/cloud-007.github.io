import editorial from "@/data/editorial.json";
import type { ExperienceRole, Project, SiteContent, TrailEntry } from "./content";

export { editorial };

/** Reviewed public copy is versioned with the site. Apply it after either
 * source, so a stale live response cannot undo a reviewed correction.
 * Existing records are patched only if still public; teasers stay redacted. */
export function applyEditorial(content: SiteContent): SiteContent {
  const projects = content.projects.map((project) => {
    if (project.teaser) return project;
    return { ...project,
      ...editorial.newProjects.find((p) => p.id === project.id || p.name === project.name),
      ...editorial.projectPatches.find((p) => p.id === project.id),
      id: project.id,
    } as Project;
  });
  const experience = content.experience.map((role) => ({
    ...role,
    ...editorial.experiencePatches.find((patch) => patch.id === role.id),
  }));
  return {
    ...content,
    profile: content.profile ? { ...content.profile, ...editorial.profile } : null,
    projects: [
      ...(editorial.newProjects as Project[]).filter((p) => !projects.some((existing) => existing.id === p.id || existing.name === p.name)),
      ...projects,
    ],
    experience: [
      ...(editorial.newExperience as ExperienceRole[]).filter((r) => !experience.some((existing) => existing.id === r.id)),
      ...experience,
    ],
    skills: content.skills.map((group) => ({ ...group, ...editorial.skillPatches.find((patch) => patch.id === group.id) })),
    stats: content.stats.map((stat) => ({ ...stat, ...editorial.statPatches.find((patch) => patch.id === stat.id) })),
    entries: [
      ...(editorial.newEntries as TrailEntry[]).filter((entry) => !content.entries.some((existing) => existing.slug === entry.slug)),
      ...content.entries.map((entry) => entry.teaser ? entry : ({
      ...entry,
      ...editorial.entryPatches.find((patch) => patch.slug === entry.slug),
    } as TrailEntry)),
    ].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)),
  };
}
