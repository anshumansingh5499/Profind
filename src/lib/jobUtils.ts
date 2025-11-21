import type { FilterState, Job, ParsedResume } from "../types";

export const defaultFilters: FilterState = {
  keyword: "",
  location: "",
  quickLocation: "",
  experienceLevels: [],
  jobTypes: [],
  workModes: [],
  salaryMin: undefined,
  salaryMax: undefined,
  companySizes: [],
  postedDate: "Any time",
  jobSources: [],
  industries: [],
  mustHaveSkills: [],
};

export function filterJobs(jobs: Job[], filters: FilterState): Job[] {
  return jobs.filter((job) => {
    const {
      keyword,
      location,
      quickLocation,
      experienceLevels,
      jobTypes,
      workModes,
      salaryMin,
      salaryMax,
      companySizes,
      postedDate,
      jobSources,
      industries,
      mustHaveSkills,
    } = filters;

    const text = `${job.title} ${job.company.name} ${job.description}`.toLowerCase();
    if (keyword && !text.includes(keyword.toLowerCase())) return false;

    if (location && !job.location.toLowerCase().includes(location.toLowerCase()))
      return false;

    if (quickLocation && job.workMode !== quickLocation) return false;

    if (experienceLevels.length && !experienceLevels.includes(job.experienceLevel))
      return false;

    if (jobTypes.length && !jobTypes.includes(job.jobType)) return false;

    if (workModes.length && !workModes.includes(job.workMode)) return false;

    if (salaryMin !== undefined && (job.salaryMax ?? 0) < salaryMin) return false;
    if (salaryMax !== undefined && (job.salaryMin ?? 0) > salaryMax) return false;

    if (companySizes.length && !companySizes.includes(job.company.size)) return false;

    if (postedDate !== "Any time") {
      const days = postedDate === "Last 24 hours"
        ? 1
        : postedDate === "Last 3 days"
        ? 3
        : postedDate === "Last 7 days"
        ? 7
        : 30;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      if (new Date(job.postedAt).getTime() < cutoff) return false;
    }

    if (jobSources.length && !jobSources.includes(job.source)) return false;

    if (industries.length && !industries.includes(job.company.industry)) return false;

    if (
      mustHaveSkills.length &&
      !mustHaveSkills.every((skill) =>
        job.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
      )
    )
      return false;

    return true;
  });
}

export function computeMatchScore(job: Job, resume: ParsedResume | null): number {
  if (!resume) return 0;
  const jobSkills = job.skills.map((s) => s.toLowerCase());
  const resumeSkills = resume.skills.map((s) => s.toLowerCase());
  const overlap = resumeSkills.filter((s) => jobSkills.includes(s));
  if (!overlap.length) return 0;
  const base = (overlap.length / Math.max(jobSkills.length, 1)) * 100;

  // crude bonus for experience alignment
  let bonus = 0;
  if (resume.totalExperienceYears !== undefined) {
    const y = resume.totalExperienceYears;
    if (job.experienceLevel === "Intern / Fresher" && y <= 1) bonus = 10;
    else if (job.experienceLevel === "1–3 years" && y >= 1 && y <= 3) bonus = 10;
    else if (job.experienceLevel === "3–5 years" && y >= 3 && y <= 5) bonus = 10;
    else if (job.experienceLevel === "5–10 years" && y >= 5 && y <= 10) bonus = 10;
    else if (job.experienceLevel === "10+ years" && y >= 10) bonus = 10;
  }

  return Math.min(100, Math.round(base + bonus));
}

export function getMatchLabel(score: number): "Low" | "Medium" | "High" {
  if (score >= 75) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}
