import React from "react";
import { motion } from "framer-motion";
import type { ParsedResume } from "../types";
import { UploadCloud, Sparkles } from "lucide-react";

interface Props {
  resume: ParsedResume | null;
  onResumeChange: (resume: ParsedResume | null) => void;
}

export const ResumeAssistant: React.FC<Props> = ({ resume, onResumeChange }) => {
  const [isParsing, setIsParsing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 🔗 Same style as your /api/jobs call
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // ignore JSON parse error
      }

      if (!res.ok) {
        const msg =
          payload?.error ||
          `Failed to parse resume (HTTP ${res.status})`;
        throw new Error(msg);
      }

      const parsed: ParsedResume = payload;
      onResumeChange(parsed);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't parse your resume. Please try again."
      );
      onResumeChange(null);
    } finally {
      setIsParsing(false);
      e.target.value = "";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative p-6  
        bg-white/20 backdrop-blur-2xl 
        border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        overflow-hidden
      "
    >
      {/* 🔵 AI Glow Ring */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />

      {/* ⚡ AI Chip Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="
          absolute top-4 right-4 
          px-3 py-1.5 
          bg-gradient-to-r from-indigo-600 to-purple-600 
          text-white text-[10px] font-semibold 
          shadow-lg flex items-center gap-1
        "
      >
        <Sparkles size={12} /> AI Enabled
      </motion.div>

      {/* HEADER */}
      <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-wide flex items-center gap-1">
        <Sparkles size={14} className="text-indigo-600" />
        Resume Assistant
      </h2>

      <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
        Let AI extract your skills, experience, and preferred roles for better job matches.
      </p>

      {/* Upload Box */}
      <motion.label
  initial={{ opacity: 1 }}
  animate={
    isParsing
      ? {
          scale: [1, 1.03, 1],
          y: [0, -2, 0],
          boxShadow: [
            "0 0 8px rgba(99,102,241,0.3)",
            "0 0 14px rgba(99,102,241,0.5)",
            "0 0 8px rgba(99,102,241,0.3)",
          ],
        }
      : { scale: 1, y: 0, boxShadow: "none" }
  }
  transition={
    isParsing
      ? { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
      : { duration: 0.2 }
  }
  whileHover={{ scale: isParsing ? 1 : 1.02 }}
  whileTap={{ scale: isParsing ? 1 : 0.98 }}
  className={`
    relative z-10 cursor-pointer
    flex items-center justify-center gap-2
    w-full py-3 
    border ${isParsing ? "border-indigo-400" : "border-slate-300"}
    bg-white/70 hover:bg-white
    hover:border-indigo-400
    hover:shadow-[0_0_18px_rgba(99,102,241,0.25)]
    transition
    ${isParsing ? "opacity-80 pointer-events-none" : ""}
  `}
>
  <UploadCloud size={18} className="text-indigo-600" />
  <span className="text-[12px] font-medium text-slate-700">
    {isParsing ? "Analyzing your resume..." : "Upload Resume (PDF / DOCX)"}
  </span>
  <input
    type="file"
    className="hidden"
    accept=".pdf,.doc,.docx"
    onChange={handleUpload}
  />
</motion.label>


      {/* Error message */}
      {error && (
        <p className="mt-2 text-[11px] text-red-600">
          {error}
        </p>
      )}

      {/* AI Parsed Output */}
      {resume && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="
            mt-6 p-5 
            bg-white/60 border border-slate-200 
            shadow-sm relative
          "
        >
          <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-600" />
            AI-Parsed Summary
          </p>

          <p className="text-[11px] text-slate-600 mb-2">
            Experience:{" "}
            <span className="font-semibold text-slate-900">
              {resume.totalExperienceYears ?? 0} yrs
            </span>{" "}
            · {resume.inferredExperienceLevel ?? "Not specified"}
          </p>

          <p className="text-[11px] text-slate-600 mb-1">Skills Identified:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resume.skills?.map((s) => (
              <span
                key={s}
                className="
                  px-2 py-0.5
                  bg-indigo-50 border border-indigo-100 
                  text-[10px] text-indigo-700
                "
              >
                {s}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-slate-600 mb-1">Preferred Locations:</p>
          <div className="flex flex-wrap gap-1">
            {resume.preferredLocations?.map((loc) => (
              <span
                key={loc}
                className="
                  px-2 py-0.5 rounded-full 
                  bg-slate-50 border border-slate-200 
                  text-[10px] text-slate-700
                "
              >
                {loc}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
