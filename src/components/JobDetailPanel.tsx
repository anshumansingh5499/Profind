import React from "react";
import type { Job, ParsedResume } from "../types";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { AiResumeAdvisor } from "./AiResumeAdvisor";
import { CompanyLogo } from "./CompanyLogo";

interface Props {
  job: Job | null;
  savedJobs: Job[];
  onToggleSave: (job: Job) => void;
  resume: ParsedResume | null;
}

export const JobDetailPanel: React.FC<Props> = ({
  job,
  savedJobs,
  onToggleSave,
  resume,
}) => {
  if (!job) {
    return (
      <div className="bg-white shadow-sm border border-slate-100 p-4 text-xs text-slate-500 h-fit flex items-center justify-center">
        Select a job to view details.
      </div>
    );
  }

  const isSaved = savedJobs.some((j) => j.id === job.id);

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!resume) {
      e.preventDefault();
      alert(
        "Upload your resume to check AI skill match and get improvement suggestions before applying!"
      );
    }
  };

  return (
    <section className="bg-white shadow-md border border-slate-100 px-6 py-5 max-h-[1650px] overflow-y-auto custom-scroll rounded-xl">
      {/* 🔥 AI Resume Advisor */}
      <div className="mb-6">
        <AiResumeAdvisor job={job} resume={resume} />
      </div>

      {/* 🏢 Header with company logo */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex items-start gap-3">
          <CompanyLogo name={job.company.name} logoUrl={job.company.logoUrl} size="md" />

          <div>
            <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
              {job.title}
            </h2>
            <p className="text-[12px] text-slate-600 font-medium mb-0.5">
              {job.company.name} • {job.location}
            </p>
            <p className="text-[11px] text-slate-500">
              {job.jobType} • {job.workMode} • {job.experienceLevel}
            </p>
          </div>
        </div>

        {/* 🎯 Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={() => onToggleSave(job)}
            className="text-[11px] flex items-center gap-1 px-3 py-1.5 
            border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg"
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={12} /> Saved
              </>
            ) : (
              <>
                <Bookmark size={12} /> Save
              </>
            )}
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="text-[11px] flex items-center gap-1 px-3 py-1.5 
            bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm rounded-lg"
          >
            Apply <ExternalLink size={12} />
          </a>

          {!resume && (
            <p className="text-[10px] text-slate-500 max-w-[160px] leading-tight text-right">
              Upload your resume to unlock AI skill match before applying.
            </p>
          )}
        </div>
      </div>

      {/* 📅 Posted Date */}
      <div className="text-[11px] text-slate-500 mb-4">
        Posted{" "}
        {new Date(job.postedAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* 💰 Salary */}
      {job.salaryMin && (
        <div className="text-[12px] text-slate-700 font-medium mb-5">
          💰 Salary: {job.currency}{" "}
          {job.salaryMin.toLocaleString()} – {job.salaryMax?.toLocaleString()}
        </div>
      )}

      {/* 📄 Job Description */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Job Description
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </section>

      {/* 🛠️ Required Skills */}
      {job.requiredSkills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ⭐ Nice To Have */}
      {job.niceToHaveSkills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
            Nice To Have
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.niceToHaveSkills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 🔍 Similar Jobs (Future Feature) */}
      <section className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Similar Jobs
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          This section will recommend similar jobs based on required skills in future versions.
        </p>
      </section>
    </section>
  );
};
