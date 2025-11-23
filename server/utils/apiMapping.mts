// server/utils/apiMapping.mts

/**
 * Maps a Remotive job to your internal Job type.
 * Includes fallback logic, basic skill detection, and inferred fields.
 */

export function mapRemotiveJobToJob(raw: any) {
  const id = raw.id ?? raw.url ?? String(Date.now());
  const title = raw.title || "Untitled role";
  const companyName = raw.company_name || "Unknown Company";

  // 🔥 Correct logo source with fallback
  const companyLogo =
    raw.company_logo_url || raw.company_logo || "";

  const publicationDate = raw.publication_date || new Date().toISOString();
  const location = raw.candidate_required_location || "Remote";

  // 🧠 Experience level inference
  const titleLower = title.toLowerCase();
  let experienceLevel: any = "1–3 years";

  if (titleLower.includes("intern")) experienceLevel = "Intern / Fresher";
  else if (titleLower.includes("junior") || titleLower.includes("entry")) experienceLevel = "0–1 years";
  else if (titleLower.includes("senior") || titleLower.includes("lead") || titleLower.includes("sr")) experienceLevel = "5–10 years";
  else if (titleLower.includes("principal") || titleLower.includes("director") || titleLower.includes("head"))
    experienceLevel = "10+ years";

  // 💼 Job type
  let jobType: any = "Full-time";
  const jt = (raw.job_type || "").toLowerCase();
  if (jt.includes("part")) jobType = "Part-time";
  else if (jt.includes("contract")) jobType = "Contract";
  else if (jt.includes("intern")) jobType = "Internship";
  else if (jt.includes("freelance") || jt.includes("consult")) jobType = "Freelance";

  // 👉 All Remotive jobs are remote
  const workMode: any = "Remote";

  // 🧠 Extract basic skills from Remotive tags
  const baseTags: string[] = Array.isArray(raw.tags) ? raw.tags : [];

  // 🔎 Also extract common tech skills from job description
  const description = raw.description?.toLowerCase() || "";
  const COMMON_SKILL_KEYWORDS = [
    "react", "typescript", "javascript", "node", "next",
    "tailwind", "redux", "html", "css", "graphql", "api",
    "docker", "aws", "jest", "sql", "python"
  ];

  const extractedFromDescription = COMMON_SKILL_KEYWORDS.filter((kw) =>
    description.includes(kw)
  );

  const skills = Array.from(new Set([...baseTags, ...extractedFromDescription]));

  // 🪙 Salary parsing
  let salaryMin: number | undefined;
  let salaryMax: number | undefined;
  let currency = "USD";
  const salaryStr = raw.salary || "";

  if (typeof salaryStr === "string" && salaryStr) {
    const nums = salaryStr
      .replace(/[^0-9\-\.]/g, " ")
      .split(/\s+/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));

    if (nums.length === 1) salaryMin = salaryMax = nums[0];
    if (nums.length >= 2) [salaryMin, salaryMax] = nums;

    if (salaryStr.includes("€")) currency = "EUR";
    if (salaryStr.includes("£")) currency = "GBP";
    if (salaryStr.includes("₹")) currency = "INR";
    if (salaryStr.includes("USD") || salaryStr.includes("$")) currency = "USD";
  }

  return {
    id: String(id),
    title,
    company: {
      id: companyName.toLowerCase().replace(/\s+/g, "-"),
      name: companyName,
      logoUrl: companyLogo, // 👈 Used by Job UI
      size: "51–200", // default
      industry: raw.category || "General",
      location,
    },
    location,
    salaryMin,
    salaryMax,
    currency,
    experienceLevel,
    jobType,
    workMode,
    source: "Remotive",
    skills,
    postedAt: publicationDate,
    description: raw.description || "",
    responsibilities: [],
    requiredSkills: skills,
    niceToHaveSkills: [],
    applyUrl: raw.url || "#",
  };
}
