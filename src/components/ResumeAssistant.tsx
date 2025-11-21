import React from "react";
import type { ParsedResume } from "../types";

interface Props {
  resume: ParsedResume | null;
  onResumeChange: (resume: ParsedResume | null) => void;
}

export const ResumeAssistant: React.FC<Props> = ({ resume, onResumeChange }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // mock parsing
    const simulated: ParsedResume = {
      name: "Your Name",
      totalExperienceYears: 2,
      skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind"],
      preferredLocations: ["Remote", "Bengaluru", "Noida"],
      inferredExperienceLevel: "1–3 years",
    };
    onResumeChange(simulated);
    alert(`✅ Mock parsed resume from "${file.name}"`);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h2 className="text-sm font-semibold text-slate-900 mb-2">Resume assistant</h2>
      <p className="text-[11px] text-slate-500 mb-2">
        Upload your resume (simulated) and we&apos;ll highlight top matching jobs based on
        skills & experience.
      </p>
      <label className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-md border border-dashed border-slate-300 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40">
        <span>📄 Upload resume (PDF/DOCX)</span>
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      {resume && (
        <div className="mt-3 border-t border-slate-100 pt-2">
          <p className="text-xs font-semibold text-slate-800 mb-1">
            Parsed summary (mock)
          </p>
          <p className="text-[11px] text-slate-600 mb-1">
            Experience:{" "}
            {resume.totalExperienceYears !== undefined
              ? `${resume.totalExperienceYears} years`
              : "N/A"}{" "}
            {resume.inferredExperienceLevel && `· ${resume.inferredExperienceLevel}`}
          </p>
          <p className="text-[11px] text-slate-600 mb-1">Skills:</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mb-1">Preferred locations:</p>
          <div className="flex flex-wrap gap-1">
            {resume.preferredLocations.map((loc) => (
              <span
                key={loc}
                className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] text-slate-700"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
