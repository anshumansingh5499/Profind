import React from "react";

const tips = [
  "Add keywords like “ReactJS” + “TypeScript” to improve relevance.",
  "Use filters like experience & salary to narrow down results.",
  "Try Remote + Full-time to see more flexible roles.",
  "Save jobs you like so you can compare later.",
];

export const TipsSidebar: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-[11px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-2">Job search tips</h2>
      <ul className="space-y-1.5 text-slate-600">
        {tips.map((t) => (
          <li key={t} className="flex gap-1">
            <span className="mt-[2px]">💡</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
