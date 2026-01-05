import React from "react";
import type { Job } from "../types";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { FiMapPin, FiBriefcase, FiCompass, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

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
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : matchLabel === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onSelect(job)}
      className="
        group cursor-pointer
        rounded-2xl border border-slate-200
        bg-white
        p-5
        shadow-[0_6px_20px_rgba(15,23,42,0.05)]
        hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]
        hover:border-sky-300
        transition
      "
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <CompanyLogo
            name={job.company.name}
            logoUrl={job.company.logoUrl}
            size="sm"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {job.title}
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {job.source}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
              {job.company.name}
            </p>
          </div>

          {matchLabel && matchScore !== undefined && (
            <span
              className={`ml-auto rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${badgeColor}`}
            >
              {matchLabel} match · {matchScore}%
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <FiMapPin size={12} /> {job.location}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <FiBriefcase size={12} /> {job.jobType}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <FiCompass size={12} /> {job.workMode}
          </span>

          {job.salaryMin && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
              <FiDollarSign size={12} />
              {job.currency} {job.salaryMin.toLocaleString()}
              {job.salaryMax && ` – ${job.salaryMax.toLocaleString()}`}
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-[11px] text-slate-500">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
          <span>
            Posted{" "}
            {new Date(job.postedAt).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            })}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job);
              }}
              className="
                inline-flex items-center gap-1
                rounded-lg border border-slate-300
                px-3 py-1.5
                text-[11px] text-slate-700
                hover:border-sky-400 hover:bg-sky-50
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
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                inline-flex items-center justify-center
                rounded-lg bg-slate-900
                px-4 py-1.5
                text-[11px] font-semibold text-white
                hover:bg-slate-800
                transition
              "
            >
              Apply →
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
