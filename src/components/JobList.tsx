import React from "react";
import type { Job, ParsedResume } from "../types";

import { JobCard } from "./JobCard";

interface Props {
  jobs: (Job & { _matchScore?: number; _matchLabel?: "Low" | "Medium" | "High" | null })[];
  resume: ParsedResume | null;
  savedJobs: Job[];
  onSelectJob: (job: Job) => void;
  onToggleSave: (job: Job) => void;
}

export const JobList: React.FC<Props> = ({
  jobs,
  
  savedJobs,
  onSelectJob,
  onToggleSave,
}) => {
  if (!jobs.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
        No jobs found for this combination of filters.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-auto pr-2">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSaved={!!savedJobs.find((j) => j.id === job.id)}
          matchScore={job._matchScore}
          matchLabel={job._matchLabel}
          onSelect={onSelectJob}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
};
