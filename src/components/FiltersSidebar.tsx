/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type {
  FilterState,
  ExperienceLevel,
  JobType,
  WorkMode,
} from "../types";

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
}

const experienceOptions: ExperienceLevel[] = [
  "Intern / Fresher",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

const jobTypeOptions: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const workModes: WorkMode[] = ["Remote", "Hybrid", "On-site"];

const companySizes: FilterState["companySizes"] = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
];

export const FiltersSidebar: React.FC<Props> = ({
  filters,
  onChange,
  onClear,
}) => {
  return (
    <>
      
      <div className="md:hidden w-full ">
        <details className="bg-white/90 backdrop-blur-xl border border-slate-200  shadow-sm rounded-xl">
          <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex justify-between items-center">
            Filters
            <span className="text-xs text-slate-500">Tap to open ▽ </span>
          </summary>

          <div className="px-3 py-3">
            <FilterUI filters={filters} onChange={onChange} onClear={onClear} />
          </div>
        </details>
      </div>

     
      <div className="hidden md:block w-full">
        <FilterUI filters={filters} onChange={onChange} onClear={onClear} />
      </div>
    </>
  );
};

const FilterUI: React.FC<Props> = ({ filters, onChange, onClear }) => {
  return (
    <div className="rounded-xl w-full bg-white/80 backdrop-blur-xl shadow-sm border border-slate-200/60 px-3 md:px-4 py-3 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between">
      {/* Middle: dropdown filters */}
      <div className="flex flex-wrap gap-2 text-xs md:justify-center">
        {/* Experience */}
        <div className="min-w-[130px]">
          <label className="block text-slate-500 text-[11px] mb-1 ">
            Experience
          </label>
          <select
            className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            value={filters.experienceLevels[0] ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                experienceLevels: e.target.value
                  ? [e.target.value as ExperienceLevel]
                  : [],
              })
            }
          >
            <option value="">Any</option>
            {experienceOptions.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Job type */}
        <div className="min-w-[120px]">
          <label className="block text-slate-500 text-[11px] mb-1">
            Job type
          </label>
          <select
            className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            value={filters.jobTypes[0] ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                jobTypes: e.target.value ? [e.target.value as JobType] : [],
              })
            }
          >
            <option value="">All</option>
            {jobTypeOptions.map((jt) => (
              <option key={jt} value={jt}>
                {jt}
              </option>
            ))}
          </select>
        </div>

        {/* Work mode */}
        <div className="min-w-[120px]">
          <label className=" rounded-xl block text-slate-500 text-[11px] mb-1">
            Work mode
          </label>
          <select
            className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            value={filters.workModes[0] ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                workModes: e.target.value
                  ? [e.target.value as WorkMode]
                  : [],
              })
            }
          >
            <option value="">All</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Company size */}
        <div className="min-w-[120px]">
          <label className="block text-slate-500 text-[11px] mb-1">
            Company size
          </label>
          <select
            className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            value={filters.companySizes[0] ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                companySizes: e.target.value
                  ? [e.target.value as (typeof companySizes)[number]]
                  : [],
              })
            }
          >
            <option value="">Any</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Posted date */}
        <div className="min-w-[130px]">
          <label className="block text-slate-500 text-[11px] mb-1">
            Posted date
          </label>
          <select
            className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            value={filters.postedDate}
            onChange={(e) =>
              onChange({
                ...filters,
                postedDate: e.target.value as any,
              })
            }
          >
            {[
              "Any time",
              "Last 24 hours",
              "Last 3 days",
              "Last 7 days",
              "Last 30 days",
            ].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary + Clear button */}
      <div className="flex flex-wrap gap-2 items-end justify-end">
        <div className="flex gap-2 text-xs">
          <div className="min-w-[90px]">
            <label className="block text-slate-500 text-[11px] mb-1">
              Min salary
            </label>
            <input
              type="number"
              className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Min"
              value={filters.salaryMin ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  salaryMin: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>

          <div className="min-w-[90px]">
            <label className="block text-slate-500 text-[11px] mb-1">
              Max salary
            </label>
            <input
              type="number"
              className="rounded-xl w-full border border-slate-300 px-2 py-2 text-xs shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Max"
              value={filters.salaryMax ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  salaryMax: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        <button
          onClick={onClear}
          className="rounded-xl text-xs px-3 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 font-medium"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
