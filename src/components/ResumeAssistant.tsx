import React from "react";
import { motion } from "framer-motion";
import type { ParsedResume } from "../types";
import {
  UploadCloud,
  Sparkles,
  Brain,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ---------------- AI STREAMING STEPS ---------------- */
const AI_STEPS = [
  "Reading document structure",
  "Extracting skills",
  "Identifying experience level",
  "Analyzing role preferences",
  "Detecting location preferences",
  "Finalizing AI insights",
];

interface Props {
  resume: ParsedResume | null;
  onResumeChange: (resume: ParsedResume | null) => void;
}

export const ResumeAssistant: React.FC<Props> = ({
  resume,
  onResumeChange,
}) => {
  const [isParsing, setIsParsing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(0);

  /* ---------------- STREAM STEP PROGRESSION ---------------- */
  React.useEffect(() => {
    if (!isParsing) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < AI_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 900);

    return () => clearInterval(interval);
  }, [isParsing]);

  /* ---------------- FILE UPLOAD ---------------- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsParsing(true);
    setCurrentStep(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to parse resume");
      }

      onResumeChange(payload);
      setCurrentStep(AI_STEPS.length - 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not analyze resume. Try again."
      );
      onResumeChange(null);
      setCurrentStep(0);
    } finally {
      setIsParsing(false);
      e.target.value = "";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        relative overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        p-6 sm:p-8
        shadow-[0_20px_45px_rgba(15,23,42,0.08)]
      "
    >
      {/* Minimal ambient gradients */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-sky-300/20 blur-[120px]" />

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center rounded-lg bg-indigo-50 p-2">
            <Brain size={16} className="text-indigo-600" />
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-indigo-600">
            AI RESUME INTELLIGENCE
          </span>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          Let AI understand your resume
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-600">
          Automatically extract skills, experience level, and preferences to
          power smarter job matching.
        </p>
      </div>

      {/* Upload CTA */}
      <motion.label
        whileHover={{ scale: isParsing ? 1 : 1.015 }}
        whileTap={{ scale: isParsing ? 1 : 0.98 }}
        animate={
          isParsing
            ? {
                boxShadow: [
                  "0 0 0 rgba(99,102,241,0.0)",
                  "0 0 24px rgba(99,102,241,0.35)",
                  "0 0 0 rgba(99,102,241,0.0)",
                ],
              }
            : {}
        }
        transition={
          isParsing
            ? { repeat: Infinity, duration: 1.6 }
            : { duration: 0.2 }
        }
        className={`
          relative z-10
          flex items-center justify-center gap-2
          w-full rounded-2xl
          border border-slate-300
          bg-slate-50
          py-4
          cursor-pointer
          hover:border-indigo-400 hover:bg-white
          transition
          ${isParsing ? "pointer-events-none opacity-80" : ""}
        `}
      >
        {isParsing ? (
          <>
            <Loader2 size={16} className="animate-spin text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              AI is analyzing your resume…
            </span>
          </>
        ) : (
          <>
            <UploadCloud size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-800">
              Upload resume (PDF or DOCX)
            </span>
          </>
        )}

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />
      </motion.label>

      {/* ---------------- STREAMING AI STEPS ---------------- */}
      {isParsing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative z-10 mt-6
            rounded-2xl
            border border-indigo-200
            bg-indigo-50/50
            p-5
          "
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={14} className="text-indigo-600 animate-pulse" />
            <p className="text-xs font-semibold text-indigo-700">
              AI processing pipeline
            </p>
          </div>

          <div className="space-y-2">
            {AI_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div key={step} className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : isActive ? (
                    <Loader2
                      size={14}
                      className="text-indigo-600 animate-spin"
                    />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                  )}

                  <span
                    className={`text-[11px] ${
                      isActive
                        ? "font-medium text-indigo-700"
                        : isDone
                        ? "text-slate-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <p className="relative z-10 mt-3 text-xs text-red-600">
          {error}
        </p>
      )}

      {/* ---------------- AI OUTPUT ---------------- */}
      {resume && !error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            relative z-10 mt-8
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
          "
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-indigo-600" />
            <p className="text-sm font-semibold text-slate-900">
              AI Insights
            </p>
          </div>

          <p className="mb-4 text-xs text-slate-600">
            Experience detected:{" "}
            <span className="font-semibold text-slate-900">
              {resume.totalExperienceYears ?? 0} yrs ·{" "}
              {resume.inferredExperienceLevel ?? "—"}
            </span>
          </p>

          <div className="mb-4">
            <p className="mb-1 text-xs text-slate-600">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills?.map((s) => (
                <span
                  key={s}
                  className="
                    rounded-full
                    border border-indigo-200
                    bg-indigo-50
                    px-2 py-0.5
                    text-[10px]
                    text-indigo-700
                  "
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-slate-600">
              Preferred locations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {resume.preferredLocations?.map((l) => (
                <span
                  key={l}
                  className="
                    rounded-full
                    border border-slate-200
                    bg-slate-50
                    px-2 py-0.5
                    text-[10px]
                    text-slate-700
                  "
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
