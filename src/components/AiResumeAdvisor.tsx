/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { Job, ParsedResume } from "../types";
import {
  Sparkles,
  AlertCircle,
  Brain,
  Wand2,
} from "lucide-react";

/* ======================================================
   TYPES
====================================================== */
type MatchLevel = "Low" | "Medium" | "High";

interface MatchResult {
  score: number;
  level: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  suggestions: string[];
  tailoredSummary: string;
}

/* ======================================================
   HELPERS (UNCHANGED)
====================================================== */
const KNOWN_SKILL_KEYWORDS = [
  "react",
  "reactjs",
  "typescript",
  "javascript",
  "node",
  "node.js",
  "next.js",
  "nextjs",
  "tailwind",
  "redux",
  "html",
  "css",
  "rest",
  "api",
  "graphql",
  "aws",
  "docker",
  "jest",
  "testing",
  "python",
  "java",
];

const normalizeSkill = (s: string) => s.toLowerCase().trim();

const extractSkillsFromText = (text: string) => {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  KNOWN_SKILL_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) found.add(kw);
  });
  return Array.from(found);
};

const titleCaseSkill = (skill: string) => {
  if (skill === "react" || skill === "reactjs") return "React.js";
  if (skill === "next" || skill === "nextjs" || skill === "next.js")
    return "Next.js";
  if (skill === "node" || skill === "node.js") return "Node.js";

  return skill
    .split(/[\s_/]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/* ======================================================
   MATCHING LOGIC (UNCHANGED)
====================================================== */
function computeMatch(
  job: Job,
  resume: ParsedResume | null
): MatchResult | null {
  if (!resume) return null;

  const jobSkills = new Set<string>();
  job.skills?.forEach((s) => jobSkills.add(normalizeSkill(s)));
  job.requiredSkills?.forEach((s) => jobSkills.add(normalizeSkill(s)));
  job.niceToHaveSkills?.forEach((s) => jobSkills.add(normalizeSkill(s)));

  if (job.description) {
    extractSkillsFromText(job.description).forEach((s) =>
      jobSkills.add(normalizeSkill(s))
    );
  }

  const resumeSkills = new Set<string>();
  resume.skills?.forEach((s) => resumeSkills.add(normalizeSkill(s)));

  extractSkillsFromText((resume as any).rawText ?? "").forEach((s) =>
    resumeSkills.add(normalizeSkill(s))
  );

  const jobSkillList = Array.from(jobSkills);
  if (!jobSkillList.length) return null;

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const extraSkills: string[] = [];

  jobSkillList.forEach((s) =>
    resumeSkills.has(s) ? matchedSkills.push(s) : missingSkills.push(s)
  );
  resumeSkills.forEach((s) => {
    if (!jobSkills.has(s)) extraSkills.push(s);
  });

  const coverage = matchedSkills.length / jobSkillList.length;
  let score = Math.round(60 + coverage * 35 - missingSkills.length * 3);
  score = Math.max(5, Math.min(98, score));

  const level: MatchLevel =
    score >= 75 ? "High" : score >= 55 ? "Medium" : "Low";

  return {
    score,
    level,
    matchedSkills,
    missingSkills,
    extraSkills,
    suggestions: [
      missingSkills.length
        ? `Add or highlight: ${missingSkills
            .map(titleCaseSkill)
            .join(", ")}`
        : "Your skills align well with this role.",
      "Mirror the job title in your resume headline.",
      "Surface key technologies in your top experience bullets.",
    ],
    tailoredSummary: `Frontend engineer applying for the ${job.title} role at ${
      job.company?.name ?? "this company"
    }, with hands-on experience building modern, accessible, high-performance interfaces using React, TypeScript, and APIs.`,
  };
}

/* ======================================================
   UI
====================================================== */
export const AiResumeAdvisor: React.FC<{
  job: Job;
  resume: ParsedResume | null;
}> = ({ job, resume }) => {
  const match = useMemo(() => computeMatch(job, resume), [job, resume]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        relative mt-6
        rounded-2xl
        border border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3">
            <Brain size={14} className="text-indigo-600" />
            <span className="text-[11px] font-semibold text-indigo-700">
              AI Resume Advisor
            </span>
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            Resume ↔ Job alignment
          </h3>
          <p className="mt-1 text-sm text-slate-600 max-w-md">
            See how well your resume matches this role and what to improve.
          </p>
        </div>

        {match && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="
              flex flex-col items-center justify-center
              w-16 h-16 rounded-full
              bg-indigo-50 border border-indigo-100
            "
          >
            <span className="text-xl font-semibold text-indigo-700">
              {match.score}
            </span>
            <span className="text-[10px] text-slate-500">Match</span>
          </motion.div>
        )}
      </div>

      {/* Empty state */}
      {!resume && (
        <div className="mt-6 flex gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <AlertCircle size={16} className="text-indigo-600 mt-0.5" />
          <p className="text-sm text-slate-600">
            Upload your resume to unlock AI-powered matching and insights.
          </p>
        </div>
      )}

      {/* Content */}
      {resume && match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 space-y-6"
        >
          {/* Skill blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkillBlock title="Matched" items={match.matchedSkills} tone="good" />
            <SkillBlock
              title="To highlight"
              items={match.missingSkills}
              tone="warn"
            />
            <SkillBlock
              title="Extra strengths"
              items={match.extraSkills}
              tone="neutral"
            />
          </div>

          {/* Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wand2 size={14} className="text-indigo-600" />
              <p className="text-sm font-medium text-slate-800">
                AI suggestions
              </p>
            </div>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {match.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-600" />
              <p className="text-sm font-medium text-slate-800">
                Tailored summary
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
              {match.tailoredSummary}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Edit wording to reflect real experience.
            </p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

/* ======================================================
   SUB COMPONENT
====================================================== */
function SkillBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "neutral";
}) {
  const styles = {
    good: "bg-emerald-50 border-emerald-100 text-emerald-700",
    warn: "bg-amber-50 border-amber-100 text-amber-700",
    neutral: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-600">{title}</p>
      {items.length ? (
        <div className="flex flex-wrap gap-1">
          {items.map((s) => (
            <span
              key={s}
              className={`px-2 py-0.5 text-[11px] rounded-full border ${styles[tone]}`}
            >
              {titleCaseSkill(s)}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] italic text-slate-400">
          Nothing notable here
        </p>
      )}
    </div>
  );
}
