import React, { useMemo, useState } from "react";
import type { FilterState, Job, ParsedResume } from "./types";
import {
  defaultFilters,
  filterJobs,
  computeMatchScore,
  getMatchLabel,
} from "./lib/jobUtils";
import { Hero } from "./components/Hero";
import { FiltersSidebar } from "./components/FiltersSidebar";
import { JobList } from "./components/JobList";
import { JobDetailPanel } from "./components/JobDetailPanel";
import { ResumeAssistant } from "./components/ResumeAssistant";
import { useJobs } from "./hooks/useJobs";
import { Footer } from "./components/Footer";

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 🔹 Get jobs from backend (Remotive)
  const { jobs: apiJobs, loading, error } = useJobs(filters);

  // 🔹 Base = API jobs
  const baseJobs = apiJobs;

  // 🔹 Client-side filters
  const filteredJobs = useMemo(
    () => filterJobs(baseJobs, filters),
    [baseJobs, filters]
  );

  const jobsWithMatch = useMemo(() => {
    return filteredJobs.map((job) => {
      const score = computeMatchScore(job, resume);
      return {
        ...job,
        _matchScore: score,
        _matchLabel: score ? getMatchLabel(score) : null,
      } as Job & {
        _matchScore: number;
        _matchLabel: "Low" | "Medium" | "High" | null;
      };
    });
  }, [filteredJobs, resume]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return jobsWithMatch.slice(start, start + pageSize);
  }, [jobsWithMatch, currentPage]);

  const totalPages = Math.max(1, Math.ceil(jobsWithMatch.length / pageSize));

  const handleSearch = (keyword: string, location: string) => {
    setFilters((prev) => ({ ...prev, keyword, location }));
    setCurrentPage(1);
    setSelectedJob(null);
  };

  const toggleSaveJob = (job: Job) => {
    setSavedJobs((prev) => {
      const exists = prev.find((j) => j.id === job.id);
      if (exists) return prev.filter((j) => j.id !== job.id);
      return [...prev, job];
    });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Hero onSearch={handleSearch} />

      <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 flex flex-col gap-4">
        <FiltersSidebar
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr),minmax(0,1.1fr)] gap-4">
          <section className="bg-white  shadow-sm border border-slate-100 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 gap-2">
              <div>
                <h2 className="text-lg font-semibold">
                  {loading
                    ? "Loading jobs…"
                    : `${jobsWithMatch.length} jobs found`}
                  {!loading && filters.keyword && (
                    <span className="font-normal text-slate-500">
                      {" "}
                      for “{filters.keyword}”
                    </span>
                  )}
                  {!loading && filters.location && (
                    <span className="font-normal text-slate-500">
                      {" "}
                      in {filters.location}
                    </span>
                  )}
                  {!loading &&
                    !filters.keyword &&
                    !filters.location && (
                      <span className="block text-xs text-slate-400">
                        Recommended remote jobs
                      </span>
                    )}
                </h2>
                {!loading && (
                  <p className="text-xs text-slate-500">
                    Showing page {currentPage} of {totalPages}
                  </p>
                )}
                {error && (
                  <p className="text-xs text-rose-500">
                    Error loading jobs: {error}
                  </p>
                )}
              </div>
            </div>

            {loading && (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                Fetching jobs…
              </div>
            )}

            {!loading && !error && (
              <JobList
                jobs={paginatedJobs}
                resume={resume}
                savedJobs={savedJobs}
                onSelectJob={setSelectedJob}
                onToggleSave={toggleSaveJob}
              />
            )}

            {!loading && totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  className="px-3 py-1 text-sm rounded border bg-white disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-slate-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 text-sm rounded border bg-white disabled:opacity-40"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </button>
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <ResumeAssistant resume={resume} onResumeChange={setResume} />
            <JobDetailPanel
  job={selectedJob}
  savedJobs={savedJobs}
  onToggleSave={toggleSaveJob}
  resume={resume} 
/>

          </aside>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default App;
