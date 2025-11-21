import React, { useState, useRef, useEffect } from "react";
import type { Job } from "../types";

interface Props {
  savedJobs: Job[];
  onToggleSave: (job: Job) => void;
}

export const SavedJobsPanel: React.FC<Props> = ({ savedJobs, onToggleSave }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative text-xs" ref={panelRef}>
      {/* Button */}
      <button
        type="button"
        className={`px-3 py-1.5 rounded-full border transition-all 
          ${open ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"}
          hover:border-indigo-300 flex items-center gap-1`}
        onClick={() => setOpen((o) => !o)}
      >
        ⭐ Saved
        {savedJobs.length > 0 && (
          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full shadow-sm">
            {savedJobs.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute right-0 mt-2 w-72 bg-white border border-slate-200 
          rounded-xl shadow-xl z-20 max-h-80 overflow-auto transition-all duration-200
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="p-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-slate-900">Saved jobs</p>
            <button
              className="text-[11px] text-slate-400 hover:text-slate-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Empty state */}
          {!savedJobs.length && (
            <p className="text-[11px] text-slate-500">No saved jobs yet.</p>
          )}

          {/* Job Items */}
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="border border-slate-100 rounded-lg p-2 mb-2 hover:bg-slate-50 transition-all"
            >
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 text-[11px] line-clamp-1">
                    {job.title}
                  </p>
                  <p className="text-slate-500 text-[10px] line-clamp-1">
                    {job.company.name}
                  </p>
                </div>

                <button
                  onClick={() => onToggleSave(job)}
                  className="text-[10px] text-rose-500 hover:text-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
