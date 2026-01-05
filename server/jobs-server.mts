// server/jobs-server.mts

import express from "express";
import cors from "cors";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { getJobsFromRemotive } from "./jobs-service.mts";
import type { ExperienceLevel } from "../src/types";

/* =======================
   🔑 DOTENV (ESM SAFE)
   ======================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Force-load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Debug once (can remove later)
console.log("🔐 AFFINDA_API_KEY loaded:", !!process.env.AFFINDA_API_KEY);

/* =======================
   🚀 APP SETUP
   ======================= */

const app = express();
const PORT = process.env.PORT || 3000;
const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Multer in-memory upload
const upload = multer({ storage: multer.memoryStorage() });

/* =======================
   🧪 HEALTH CHECK
   ======================= */

app.get("/", (_req, res) => {
  res.send("Remotive Job API + Resume Parser is running 🚀");
});

/* =======================
   📦 JOBS API
   ======================= */

app.get("/api/jobs", async (req, res) => {
  const keyword = (req.query.keyword || "").toString().trim();
  const location = (req.query.location || "").toString().trim();

  try {
    const jobs = await getJobsFromRemotive(keyword, location, 50);
    console.log(`📦 /api/jobs → ${jobs.length} jobs`);
    return res.json(jobs);
  } catch (err) {
    console.error("❌ /api/jobs error:", err);

    let message = "Failed to fetch jobs from Remotive API";
    if (err instanceof Error) message = err.message;

    return res.status(500).json({ error: message });
  }
});

/* =======================
   📄 RESUME PARSER (AFFINDA)
   ======================= */

if (!AFFINDA_API_KEY) {
  console.warn("⚠️ AFFINDA_API_KEY is NOT set");
}

app.post("/api/parse-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!AFFINDA_API_KEY) {
      return res
        .status(500)
        .json({ error: "No Affinda API key configured" });
    }

    const { buffer, originalname, mimetype } = req.file;

    const form = new FormData();
    form.append("file", buffer, {
      filename: originalname,
      contentType: mimetype,
    });
    form.append("wait", "true");

    const affindaRes = await axios.post(
      "https://api.affinda.com/v2/resumes",
      form,
      {
        headers: {
          Authorization: `Bearer ${AFFINDA_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    const data: any = affindaRes.data?.data ?? affindaRes.data ?? {};

    const name =
      data.name?.raw ||
      [data.name?.first, data.name?.last].filter(Boolean).join(" ") ||
      "Unknown";

    const totalExperienceYears: number =
      data.totalYearsExperience ??
      data.summary?.yearsExperience ??
      0;

    const skills: string[] =
      data.skills?.map((s: any) => s.name).filter(Boolean) ?? [];

    const preferredLocations: string[] =
      data.locations?.map((l: any) => l.rawLocation).filter(Boolean) ?? [];

    let inferredExperienceLevel: ExperienceLevel = "Intern / Fresher";

    if (totalExperienceYears < 0.5)
      inferredExperienceLevel = "Intern / Fresher";
    else if (totalExperienceYears < 1)
      inferredExperienceLevel = "0–1 years";
    else if (totalExperienceYears < 3)
      inferredExperienceLevel = "1–3 years";
    else if (totalExperienceYears < 5)
      inferredExperienceLevel = "3–5 years";
    else if (totalExperienceYears < 10)
      inferredExperienceLevel = "5–10 years";
    else inferredExperienceLevel = "10+ years";

    return res.json({
      name,
      totalExperienceYears,
      skills,
      preferredLocations,
      inferredExperienceLevel,
    });
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error(
        "❌ Affinda error:",
        err.response?.status,
        err.response?.data
      );
      return res.status(500).json({
        error:
          typeof err.response?.data === "string"
            ? err.response.data
            : "Affinda request failed",
      });
    }

    console.error("❌ Resume parsing error:", err);
    return res
      .status(500)
      .json({ error: "Server error while parsing resume" });
  }
});

/* =======================
   ▶️ START SERVER
   ======================= */

app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`📄 Resume parser → POST /api/parse-resume`);
});

export default app;
