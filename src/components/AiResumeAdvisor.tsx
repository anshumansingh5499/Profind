import React, { useMemo } from "react";
import type { Job, ParsedResume } from "../types";

interface Props {
  job: Job;
  resume: ParsedResume | null;
}

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

function normalizeSkill(raw: string): string {
  return raw.toLowerCase().trim();
}

function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  KNOWN_SKILL_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) {
      found.add(kw);
    }
  });

  return Array.from(found);
}

// Helper type to allow optional raw text from backend in future
type ResumeWithRaw = ParsedResume & {
  rawText?: string;
  text?: string;
};

function titleCaseSkill(skill: string): string {
  // simple title-case helper for display
  if (!skill) return skill;
  if (skill.toLowerCase() === "reactjs") return "React.js";
  if (skill.toLowerCase() === "nextjs") return "Next.js";
  if (skill.toLowerCase() === "node.js" || skill.toLowerCase() === "node")
    return "Node.js";

  return skill
    .split(/[\s_/]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function computeMatch(job: Job, resume: ParsedResume | null): MatchResult | null {
  if (!resume) return null;

  const extended = resume as ResumeWithRaw;

  // ---- Collect skills from the job ----
  const jobSkills = new Set<string>();

  // 1) From job.skills (if present)
  (job.skills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));

  // 2) From requiredSkills / niceToHaveSkills
  (job.requiredSkills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));
  (job.niceToHaveSkills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));

  // 3) From job description text using known keywords
  if (job.description) {
    extractSkillsFromText(job.description).forEach((s) =>
      jobSkills.add(normalizeSkill(s))
    );
  }

  // ---- Collect skills from the resume (AI-parsed summary/skills) ----
  const resumeSkillSet = new Set<string>();

  const resumeSkillsArray = Array.isArray(extended.skills)
    ? extended.skills
    : [];

  resumeSkillsArray.forEach((s) => resumeSkillSet.add(normalizeSkill(s)));

  // If in future you add raw resume text from parser, we’ll also mine skills from it
  const rawText = extended.rawText ?? extended.text ?? "";
  if (rawText) {
    extractSkillsFromText(rawText).forEach((s) =>
      resumeSkillSet.add(normalizeSkill(s))
    );
  }

  const jobSkillList = Array.from(jobSkills);
  if (jobSkillList.length === 0) {
    return {
      score: 60,
      level: "Medium",
      matchedSkills: [],
      missingSkills: [],
      extraSkills: [],
      suggestions: [
        "This job description does not list many specific skills. Focus on tailoring your summary and experience to the role title.",
      ],
      tailoredSummary: "",
    };
  }

  // ---- Compare skills ----
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const extraSkills: string[] = [];

  jobSkillList.forEach((skill) => {
    if (resumeSkillSet.has(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  resumeSkillSet.forEach((skill) => {
    if (!jobSkills.has(skill)) {
      extraSkills.push(skill);
    }
  });

  // ---- Score & match level ----
  const coverage = matchedSkills.length / jobSkillList.length;
  const missingPenalty = missingSkills.length * 3; // -3 per missing skill
  let score = Math.round(60 + coverage * 35 - missingPenalty);
  score = Math.max(5, Math.min(98, score)); // clamp

  let level: MatchLevel = "Low";
  if (score >= 75) level = "High";
  else if (score >= 55) level = "Medium";

  // ---- Suggestions focused on missing skills to add in resume ----
  const suggestions: string[] = [];

  if (missingSkills.length) {
    const humanMissing = missingSkills.map(titleCaseSkill);
    suggestions.push(
      `These skills appear in the job description but not clearly in your resume: ${humanMissing.join(
        ", "
      )}. Add them to your skills section or summary if you actually have experience with them.`
    );

    const topForHeadline = humanMissing.slice(0, 3).join(", ");
    if (topForHeadline) {
      suggestions.push(
        `You can update your resume summary line to something like: "Frontend engineer with hands-on experience in ${topForHeadline}."`
      );
    }
  }

  if (matchedSkills.length) {
    const humanMatched = matchedSkills.map(titleCaseSkill);
    suggestions.push(
      `Your resume already matches these key skills from the job: ${humanMatched.join(
        ", "
      )}. Make sure they are visible in the top 1/3 of your resume (summary + key skills).`
    );
  }

  suggestions.push(
    "Customize your resume headline to match the job title and mention 2–3 core skills (for example: 'React + TypeScript Frontend Engineer')."
  );

  suggestions.push(
    "Use bullet points that include action verbs plus metrics (e.g. 'Improved page load speed by 35% by optimizing React components and API calls')."
  );

  const jobTitle = job.title || "this role";
  const companyName = job.company?.name || "the company";

  const tailoredSummary = `Frontend engineer with hands-on experience in modern JavaScript and UI development, applying for a ${jobTitle} role at ${companyName}. Strong focus on building responsive, accessible, and high-performance interfaces using tools like React, TypeScript and REST APIs. Comfortable collaborating with product and backend teams, writing clean reusable components, and improving UX with data-driven iterations.`;

  return {
    score,
    level,
    matchedSkills,
    missingSkills,
    extraSkills,
    suggestions,
    tailoredSummary,
  };
}

export const AiResumeAdvisor: React.FC<Props> = ({ job, resume }) => {
  const match = useMemo(() => computeMatch(job, resume), [job, resume]);

  if (!job) return null;

  return (
    <div className="mt-4 bg-slate-900 text-slate-50 rounded-xl p-4 shadow-md space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            AI Resume Match (Beta)
          </p>
          <h3 className="text-sm font-semibold">
            Boost your chances before you apply
          </h3>
        </div>

        {match && (
          <div className="flex flex-col items-end">
            <div className="text-xs text-slate-400">ATS Fit Score</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{match.score}</span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
            <span
              className={
                "mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium " +
                (match.level === "High"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : match.level === "Medium"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/40"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/40")
              }
            >
              {match.level} match
            </span>
          </div>
        )}
      </div>

      {!resume && (
        <div className="text-xs text-slate-300 bg-slate-800/60 border border-slate-700 rounded-lg p-3">
          Upload your resume in the{" "}
          <span className="font-semibold">Resume Assistant</span> panel to get:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>ATS-style match score for this job</li>
            <li>Missing vs matched skills</li>
            <li>Tailored summary text you can paste into your resume</li>
          </ul>
        </div>
      )}

      {resume && match && (
        <>
          {/* Skills overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div>
              <p className="text-slate-400 mb-1">Matched skills</p>
              {match.matchedSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No clear matches yet.</p>
              )}
            </div>

            <div>
              <p className="text-slate-400 mb-1">Missing skills</p>
              {match.missingSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-200 border border-rose-500/40"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  You cover most listed skills.
                </p>
              )}
            </div>

            <div>
              <p className="text-slate-400 mb-1">Extra skills you have</p>
              {match.extraSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.extraSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-200 border border-sky-500/40"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Add more tools / libraries you know.
                </p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="text-[11px] space-y-1.5">
            <p className="text-slate-400">Improvement tips</p>
            <ul className="list-disc list-inside space-y-1">
              {match.suggestions.map((tip, idx) => (
                <li key={idx} className="text-slate-200">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Tailored summary block */}
          <div className="text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-slate-400">Tailored summary for this role</p>
            </div>
            <p className="text-slate-100 bg-slate-800/70 border border-slate-700 rounded-lg p-3 leading-relaxed">
              {match.tailoredSummary}
            </p>
            <p className="text-[10px] text-slate-500">
              Paste this into your resume summary/about section and adjust the
              details to match your actual experience.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
