// src/hooks/useJobs.ts
import { useEffect, useState } from "react";
import type { Job, FilterState } from "../types";

const REMOTIVE_API = "https://remotive.com/api/remote-jobs";

// Helper types from Job so we stay in sync with your unions
type Currency = Job["currency"];           // "USD" | "EUR" | "INR"
type ExperienceLevel = Job["experienceLevel"]; // "Intern / Fresher" | "0–1 years" | ...
type JobSource = Job["source"];            // "Google Jobs" | "LinkedIn" | "Glassdoor" | "Indeed" | "Other"

interface RemotiveApiResponse {
  "job-count": number;
  jobs: RemotiveJob[];
}

interface RemotiveJob {
  id: number | string;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description: string;
}

/**
 * Map Remotive API job → your Job type
 */
function mapRemotiveJobToJob(raw: RemotiveJob): Job {
  const salaryStr = raw.salary ?? "";

  let salaryMin: number | undefined;
  let salaryMax: number | undefined;

  // 👇 Currency must be one of "USD" | "EUR" | "INR"
  let currency: Currency = "USD";

  if (salaryStr.trim()) {
    const numbers = salaryStr
      .replace(/[^0-9.\\-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map(Number)
      .filter((n) => !Number.isNaN(n));

    if (numbers.length === 1) {
      salaryMin = salaryMax = numbers[0];
    } else if (numbers.length >= 2) {
      salaryMin = numbers[0];
      salaryMax = numbers[1];
    }

    // Only assign values that exist in your union
    if (salaryStr.includes("€")) currency = "EUR";
    else if (salaryStr.includes("₹")) currency = "INR";
    else currency = "USD"; // default
  }

  // 👇 ExperienceLevel must be one of your union values
  // We'll treat "Not specified" as a Fresher-style level
  const experienceLevel: ExperienceLevel = "Intern / Fresher";

  // 👇 Map remotive job_type → your Job["jobType"]
  let jobType: Job["jobType"] = "Full-time";
  const jt = raw.job_type?.toLowerCase() ?? "";
  if (jt.includes("part")) jobType = "Part-time";
  else if (jt.includes("contract")) jobType = "Contract";
  else if (jt.includes("intern")) jobType = "Internship";
  else if (jt.includes("freelance") || jt.includes("consult")) jobType = "Freelance";

  // 👇 All Remotive jobs are remote
  const workMode: Job["workMode"] = "Remote";

  // 👇 JobSource must be one of your union; use "Other" for Remotive
  const source: JobSource = "Other";

  return {
    id: String(raw.id ?? raw.url),
    title: raw.title || "Untitled role",
    company: {
      id: raw.company_name.toLowerCase().replace(/\s+/g, "-"),
      name: raw.company_name,
      logoUrl: raw.company_logo ?? "",
      size: "51-200",
      industry: raw.category || "Remote / Misc",
      location: raw.candidate_required_location ?? "Remote",
    },
    location: raw.candidate_required_location ?? "Remote",
    salaryMin,
    salaryMax,
    currency,
    experienceLevel,
    jobType,
    workMode,
    source,
    skills: [],
    postedAt: raw.publication_date || new Date().toISOString(),
    description: raw.description || "",
    responsibilities: [],
    requiredSkills: [],
    niceToHaveSkills: [],
    applyUrl: raw.url,
  };
}

export function useJobs(filters: FilterState) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchJobs() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ limit: "50" });

        // Remotive "search" → matches title + description
        if (filters.keyword?.trim()) {
          params.set("search", filters.keyword.trim());
        }

        const response = await fetch(`${REMOTIVE_API}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = (await response.json()) as RemotiveApiResponse;

        let jobList = data.jobs;

        // Optional backend-like location filter
        if (filters.location?.trim()) {
          const locationFilter = filters.location.toLowerCase();
          jobList = jobList.filter((job) =>
            (job.candidate_required_location ?? "")
              .toLowerCase()
              .includes(locationFilter)
          );
        }

        const mapped = jobList.map(mapRemotiveJobToJob);

        // Shuffle so initial list looks "random"
        const shuffled = [...mapped].sort(() => Math.random() - 0.5);

        setJobs(shuffled);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching jobs:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();

    return () => controller.abort();
  }, [filters.keyword, filters.location]);

  return { jobs, loading, error };
}
