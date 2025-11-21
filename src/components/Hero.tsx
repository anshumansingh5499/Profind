import React, { useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { Header } from "./Header";

interface HeroProps {
  onSearch: (keyword: string, location: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim(), location.trim());
  };

  return (
    <header className="relative overflow-hidden bg-[#09121e] text-white border-b border-slate-800 ">
      <Header />

      {/* Premium animated gradient lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-[140px] animate-pulse" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-[120px]" />
      </div>

      {/* Side Illustration – remote lifestyle */}
      <img
        src="/bg.png"
        alt="Job search illustration"
        className="hidden lg:block absolute right-8 top-36 w-[320px] max-w-sm select-none pointer-events-none opacity-80"
      />

      <div
        className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-6 lg:py-8
"
      >
        <div className="max-w-3xl space-y-10">
          {/* Overline */}
          <div className="px-4 py-1 inline-block rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs tracking-wider text-indigo-300">
            100% Remote Opportunities
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Land your next{" "}
           <span className="relative inline-block font-bold px-2 py-0.5 border-2 border-red-500 rotate-6">
  remote
</span>

            {/* Highlighted word (box underline like the screenshot) */}
            <span className="relative inline-block">
              effortlessly
              <span className="absolute inset-x-0 bottom-1 h-[10px] bg-indigo-400/40 rounded-sm -z-10"></span>
            </span>
            {/* Tilted pill badge like “qualified” */}
            <span
              className="
      inline-block ml-3 px-4 py-1
      bg-yellow-300 text-black font-bold
      rotate-[-5deg]
      shadow-[0_4px_10px_rgba(0,0,0,0.15)]
    "
            >
              faster
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed">
            Discover remote-friendly positions across tech, product, design, and
            more. Search globally, filter smarter, and apply seamlessly.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] space-y-5"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Keyword */}
              <div className="flex-1 group rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur focus-within:border-indigo-500 transition">
                <div className="flex items-center gap-3">
                  <FiSearch className="text-slate-300 text-lg" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                    placeholder="Job title, skill, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:w-64 group rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur focus-within:border-indigo-500 transition">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-slate-300 text-lg" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                    placeholder="Remote, Worldwide, Europe, etc."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="md:w-auto w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all"
              >
                Find Remote Jobs
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1">
                🌍 18,500+ remote jobs
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1">
                🏢 3,200+ global companies
              </span>
              <span className="">
                Popular: React Developer, Product Designer, Data Analyst
              </span>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
