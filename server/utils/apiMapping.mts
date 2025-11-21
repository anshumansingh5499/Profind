// server/utils/apiMapping.mts

/* Basic mapping from Remotive API job to your frontend Job shape */

export function mapRemotiveJobToJob(raw: any) {
  // Remotive fields:
  // id, url, title, company_name, company_logo,
  // category, job_type, publication_date,
  // candidate_required_location, salary, description

  const id = raw.id ?? raw.url ?? String(Date.now());

  const title = raw.title || "Untitled role";
  const companyName = raw.company_name || "Unknown company";
  const companyLogo = raw.company_logo || "";
  const category = raw.category || "General";
  const publicationDate = raw.publication_date || new Date().toISOString();
  const candidateLocation = raw.candidate_required_location || "Remote";
  const salaryStr = raw.salary || "";

  // Very simple salary parser: "$40,000 - $50,000"
  let salaryMin: number | undefined = undefined;
  let salaryMax: number | undefined = undefined;
  let currency = "USD";

  if (typeof salaryStr === "string" && salaryStr.trim()) {
    // Extract numbers
    const nums = salaryStr
      .replace(/[^0-9\-\.]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((n: string) => Number(n))
      .filter((n: number) => !Number.isNaN(n));

    if (nums.length === 1) {
      salaryMin = nums[0];
      salaryMax = nums[0];
    } else if (nums.length >= 2) {
      salaryMin = nums[0];
      salaryMax = nums[1];
    }

    // Try to guess currency from original string
    if (salaryStr.includes("€")) currency = "EUR";
    else if (salaryStr.includes("£")) currency = "GBP";
    else if (salaryStr.includes("₹")) currency = "INR";
    else if (salaryStr.includes("USD") || salaryStr.includes("$")) currency = "USD";
  }

  // Map job_type to your JobType
  let jobType: any = "Full-time";
  const jt = (raw.job_type || "").toLowerCase();
  if (jt.includes("part")) jobType = "Part-time";
  else if (jt.includes("contract")) jobType = "Contract";
  else if (jt.includes("intern")) jobType = "Internship";
  else if (jt.includes("freelance") || jt.includes("consult")) jobType = "Freelance";

  // All Remotive jobs are remote
  const workMode: any = "Remote";

  return {
    id: String(id),
    title,
    company: {
      id: companyName.toLowerCase().replace(/\s+/g, "-"),
      name: companyName,
      logoUrl: companyLogo,
      size: "51-200",           // Remotive doesn’t give size, so we keep a default
      industry: category || "Remote / Misc",
      location: candidateLocation,
    },
    location: candidateLocation,
    salaryMin,
    salaryMax,
    currency,
    experienceLevel: "Not specified", // Remotive doesn’t have seniority field
    jobType,
    workMode,
    source: "Remotive",
    skills: [] as string[],           // you can later extract skills from description if you want
    postedAt: publicationDate,
    description: raw.description || "",
    responsibilities: [] as string[],
    requiredSkills: [] as string[],
    niceToHaveSkills: [] as string[],
    applyUrl: raw.url || "#",
  };
}
