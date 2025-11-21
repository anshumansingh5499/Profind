// server/jobs-server.mts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getJobsFromRemotive } from "./jobs-service.mts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Remotive Job API proxy is running 🚀");
});

app.get("/api/jobs", async (req, res) => {
  const keyword = (req.query.keyword || "").toString().trim();
  const location = (req.query.location || "").toString().trim();

  // ✅ even if keyword+location are empty, we call Remotive
  try {
    const jobs = await getJobsFromRemotive(keyword, location, 50);
    console.log(`📦 /api/jobs responding with ${jobs.length} jobs`);
    return res.json(jobs);
  } catch (err) {
    console.error("❌ /api/jobs error:", err);

    let message = "Failed to fetch jobs from Remotive API";

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    }

    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Job API running at http://localhost:${PORT}`);
});
