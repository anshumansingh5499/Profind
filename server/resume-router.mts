// server/resume-router.mts
import express from "express";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import type { ExperienceLevel } from "../src/types";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;

if (!AFFINDA_API_KEY) {
  console.warn("[Resume Parser] AFFINDA_API_KEY is not set in .env");
}

router.post("/parse-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!AFFINDA_API_KEY) {
      return res.status(500).json({ error: "No Affinda API key configured" });
    }

    const { buffer, originalname, mimetype } = req.file;

    const form = new FormData();
    form.append("file", buffer, {
      filename: originalname,
      contentType: mimetype,
    });
    form.append("wait", "true");

    const response = await fetch("https://api.affinda.com/v2/resumes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AFFINDA_API_KEY}`,
        ...(form as any).getHeaders(),
      } as any,
      body: form as any,
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Affinda error:", response.status, text);
      return res
        .status(500)
        .json({ error: `Affinda error ${response.status}: ${text}` });
    }

    const affindaJson: any = JSON.parse(text);
    const data = affindaJson.data ?? affindaJson;

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

if (totalExperienceYears < 0.5) inferredExperienceLevel = "Intern / Fresher";
else if (totalExperienceYears < 1) inferredExperienceLevel = "0–1 years";
else if (totalExperienceYears < 3) inferredExperienceLevel = "1–3 years";
else if (totalExperienceYears < 5) inferredExperienceLevel = "3–5 years";
else if (totalExperienceYears < 10) inferredExperienceLevel = "5–10 years";
else inferredExperienceLevel = "10+ years";


    const parsedResume = {
      name,
      totalExperienceYears,
      skills,
      preferredLocations,
      inferredExperienceLevel,
    };

    return res.json(parsedResume);
  } catch (err) {
    console.error("Parse resume error:", err);
    return res
      .status(500)
      .json({ error: "Server error while parsing resume" });
  }
});

export default router;
