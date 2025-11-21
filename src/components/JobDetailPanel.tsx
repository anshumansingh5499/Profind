import React from "react";
import type { Job } from "../types";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";

interface Props {
  job: Job | null;
  savedJobs: Job[];
  onToggleSave: (job: Job) => void;
}

export const JobDetailPanel: React.FC<Props> = ({ job, savedJobs, onToggleSave }) => {
  if (!job) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-xs text-slate-500 h-fit">
        Select a job to view details.
      </div>
    );
  }

  const isSaved = !!savedJobs.find((j) => j.id === job.id);

  return (
    <section
      className="
        bg-white 
        rounded-xl 
        shadow-md 
        border border-slate-100 
        p-5 
        max-h-[650px] 
        overflow-y-auto 
        custom-scroll
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {job.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            {job.company.name} · {job.location}
          </p>
          <p className="text-[11px] text-slate-500">
            {job.jobType} · {job.workMode} · {job.experienceLevel}
          </p>
        </div>

        {/* SAVE & APPLY */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onToggleSave(job)}
            className="
              text-[11px] 
              flex items-center gap-1 
              px-2.5 py-1.5 
              rounded-md 
              border border-slate-300 
              hover:border-indigo-400 
              hover:bg-indigo-50 
              transition
            "
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
            className="
              text-[11px] 
              flex items-center gap-1 
              px-3 py-1.5 
              rounded-md 
              bg-indigo-600 
              text-white 
              hover:bg-indigo-500 
              shadow-sm 
              transition
            "
          >
            Apply <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* DATE */}
      <div className="text-[11px] text-slate-500 mb-3">
        Posted{" "}
        {new Date(job.postedAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* SALARY */}
      {job.salaryMin && (
        <div className="text-[11px] text-slate-700 mb-4 font-medium">
          💰 Salary: {job.currency} {job.salaryMin.toLocaleString()} –{" "}
          {job.salaryMax?.toLocaleString()}
        </div>
      )}

      {/* DESCRIPTION */}
      <section className="mb-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-1">
          Job Description
        </h3>
        <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
          {job.description}
        </p>
      </section>

      {/* RESPONSIBILITIES */}
      <section className="mb-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-1">
          Key Responsibilities
        </h3>
        <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
          {job.responsibilities.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </section>

      {/* REQUIRED SKILLS */}
      <section className="mb-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-1">
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills.map((s) => (
            <span
              key={s}
              className="
                px-2 py-0.5 
                rounded-full 
                bg-slate-50 
                border border-slate-200 
                text-[10px] 
                text-slate-700
              "
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* NICE TO HAVE */}
      {job.niceToHaveSkills.length > 0 && (
        <section className="mb-4">
          <h3 className="text-xs font-semibold text-slate-900 mb-1">
            Nice To Have
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.niceToHaveSkills.map((s) => (
              <span
                key={s}
                className="
                  px-2 py-0.5 
                  rounded-full 
                  bg-emerald-50 
                  border border-emerald-200 
                  text-[10px] 
                  text-emerald-700
                "
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SIMILAR JOBS */}
      <section className="mt-5 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-900 mb-2">
          Similar Jobs
        </h3>
        <p className="text-[11px] text-slate-500">
          In the final version, you can show 3–5 similar roles here based on matching
          skills / company.
        </p>
      </section>
    </section>
  );
};
