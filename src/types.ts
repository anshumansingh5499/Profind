export type JobSource = "Google Jobs" | "LinkedIn" | "Glassdoor" | "Indeed" | "Other";

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  size: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
  industry: string;
  location: string;
}

export type ExperienceLevel =
  | "Intern / Fresher"
  | "0–1 years"
  | "1–3 years"
  | "3–5 years"
  | "5–10 years"
  | "10+ years";

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type PostedDateFilter =
  | "Any time"
  | "Last 24 hours"
  | "Last 3 days"
  | "Last 7 days"
  | "Last 30 days";

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: "INR" | "USD" | "EUR";
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  workMode: WorkMode;
  source: JobSource;
  skills: string[];
  postedAt: string; // ISO date
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  applyUrl: string;
}

export interface FilterState {
  keyword: string;
  location: string;
  quickLocation: WorkMode | ""; // for Remote/Hybrid/On-site chips
  experienceLevels: ExperienceLevel[];
  jobTypes: JobType[];
  workModes: WorkMode[];
  salaryMin?: number;
  salaryMax?: number;
  companySizes: Company["size"][];
  postedDate: PostedDateFilter;
  jobSources: JobSource[];
  industries: string[];
  mustHaveSkills: string[];
}

// ✅ Single, final ParsedResume definition
export interface ParsedResume {
  name?: string;
  totalExperienceYears?: number;
  skills: string[];
  preferredLocations: string[];
  inferredExperienceLevel?: ExperienceLevel;
}

export interface SearchQuerySummary {
  keyword: string;
  location: string;
  timestamp: string;
  filtersSnapshot: Partial<FilterState>;
}
