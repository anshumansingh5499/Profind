import React from "react";
import type { SearchQuerySummary } from "../types";

interface Props {
  searches: SearchQuerySummary[];
  onApplySearch: (summary: SearchQuerySummary) => void;
}

export const RecentSearches: React.FC<Props> = ({ searches, onApplySearch }) => {
  if (!searches.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-[11px] text-slate-500">
        Your recent searches will appear here.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-[11px]">
      <p className="text-xs font-semibold text-slate-800 mb-2">Recent searches</p>
      <div className="flex flex-wrap gap-1.5">
        {searches.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onApplySearch(s)}
            className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
          >
            {s.keyword || "Any role"} · {s.location || "Any location"}
          </button>
        ))}
      </div>
    </div>
  );
};
