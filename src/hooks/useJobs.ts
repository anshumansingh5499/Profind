// src/hooks/useJobs.ts
import { useEffect, useState } from "react";
import type { Job, FilterState } from "../types";

const API_URL = "http://localhost:4000/api/jobs";

export function useJobs(filters: FilterState) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (filters.keyword && filters.keyword.trim()) {
      params.set("keyword", filters.keyword.trim());
    }
    if (filters.location && filters.location.trim()) {
      params.set("location", filters.location.trim());
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data: Job[] = await res.json();

        // 🔀 Randomize order so jobs look "random" on load
        const shuffled = [...data].sort(() => Math.random() - 0.5);

        console.log("✅ Frontend received jobs:", shuffled.length);
        setJobs(shuffled);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error("Error loading jobs:", e);
        setError(e.message ?? "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [filters.keyword, filters.location]);

  return { jobs, loading, error };
}
