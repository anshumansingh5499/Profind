/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // REQUIRED for file upload
  },
};

const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!AFFINDA_API_KEY) {
    return res.status(500).json({ error: "Affinda API key missing" });
  }

  upload.single("file")(req as any, res as any, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const form = new FormData();
      form.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
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

      const data = affindaRes.data?.data ?? {};

      return res.status(200).json({
        name:
          data.name?.raw ||
          [data.name?.first, data.name?.last].filter(Boolean).join(" ") ||
          "Unknown",
        totalExperienceYears:
          data.totalYearsExperience ??
          data.summary?.yearsExperience ??
          0,
        skills: data.skills?.map((s: any) => s.name) ?? [],
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to parse resume",
        details: error.response?.data ?? error.message,
      });
    }
  });
}
