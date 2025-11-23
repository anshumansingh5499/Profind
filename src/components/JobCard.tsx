import React from "react";
import type { Job } from "../types";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { FiMapPin, FiBriefcase, FiCompass, FiDollarSign } from "react-icons/fi";


interface Props {
  job: Job & { _matchScore?: number; _matchLabel?: "Low" | "Medium" | "High" | null };
  isSaved: boolean;
  matchScore?: number;
  matchLabel?: "Low" | "Medium" | "High" | null;
  onSelect: (job: Job) => void;
  onToggleSave: (job: Job) => void;
}

export const JobCard: React.FC<Props> = ({
  job,
  isSaved,
  matchScore,
  matchLabel,
  onSelect,
  onToggleSave,
}) => {
  const badgeColor =
    matchLabel === "High"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : matchLabel === "Medium"
      ? "bg-amber-100 text-amber-700 border-amber-300"
      : "bg-slate-100 text-slate-600 border-slate-300";

  return (
    <article
      className="border border-slate-200 p-4 bg-white/80 backdrop-blur shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
      onClick={() => onSelect(job)}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <CompanyLogo name={job.company.name} logoUrl={job.company.logoUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{job.title}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 font-medium">
                  {job.source}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2 font-medium truncate">{job.company.name}</p>
            </div>
          </div>

         <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 mb-3">
  <span className="px-2 py-1 flex items-center gap-1 bg-slate-100 rounded">
    <FiMapPin size={12} /> {job.location}
  </span>

  <span className="px-2 py-1 flex items-center gap-1 bg-slate-100 rounded">
    <FiBriefcase size={12} /> {job.jobType}
  </span>

  <span className="px-2 py-1 flex items-center gap-1 bg-slate-100 rounded">
    <FiCompass size={12} /> {job.workMode}
  </span>

  {job.salaryMin && (
    <span className="px-2 py-1 flex items-center gap-1 bg-slate-100 rounded">
      <FiDollarSign size={12} /> {job.currency} {job.salaryMin.toLocaleString()} – {job.salaryMax?.toLocaleString()}
    </span>
  )}
</div>


          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.skills.slice(0, 5).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{job.description}</p>

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>
              Posted{" "}
              {new Date(job.postedAt).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
              })}
            </span>
            {matchLabel && matchScore !== undefined && (
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${badgeColor}`}>
                Match: {matchLabel} ({matchScore}%)
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex md:flex-col flex-row md:items-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job);
            }}
            className="text-[11px] flex items-center justify-center gap-1 px-3 py-2 w-full md:w-auto border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition"
          >
            {isSaved ? <><BookmarkCheck size={12} /> Saved</> : <><Bookmark size={12} /> Save</>}
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] px-3 py-2 w-full md:w-auto text-center bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition"
          >
            Apply 
          </a>
        </div>
      </div>
    </article>
  );
};
