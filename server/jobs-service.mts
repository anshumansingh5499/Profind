// server/jobs-service.mts
import { mapRemotiveJobToJob } from "./utils/apiMapping.mts";

// If you don't have this yet, create it as in my previous message.
// mapRemotiveJobToJob(raw) should convert a Remotive job → your Job type.

export async function getJobsFromRemotive(
  keyword: string,
  location: string,
  limit: number = 50
) {
  const params = new URLSearchParams();

  // Remotive: "search" matches title + description
  if (keyword && keyword.trim()) {
    params.set("search", keyword.trim());
  }

  // Always set limit
  params.set("limit", String(limit));

  const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;

  console.log("🌐 Calling Remotive:", url);

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Remotive API error:", res.status, text);
    throw new Error(`Remotive API failed: ${res.status} ${text}`);
  }

  const data: any = await res.json();

  // Remotive returns: { "job-count": number, "jobs": [...] }
  const rawJobs: any[] = Array.isArray(data.jobs) ? data.jobs : [];
  console.log(`✅ Remotive returned ${rawJobs.length} jobs before filtering`);

  let filtered = rawJobs;

  // Optional backend location filter: match candidate_required_location
  if (location && location.trim()) {
    const loc = location.trim().toLowerCase();
    filtered = filtered.filter((job: any) => {
      const candLoc = (job.candidate_required_location || "").toLowerCase();
      return candLoc.includes(loc);
    });
    console.log(`📍 After location filter (${location}): ${filtered.length} jobs`);
  }

  // DO NOT apply extra keyword filtering here (Remotive already used "search")
  // to avoid over-filtering to 0.

  const mapped = filtered.map(mapRemotiveJobToJob);
  console.log(`🔁 Mapped jobs to frontend type: ${mapped.length} jobs`);

  return mapped;
}
