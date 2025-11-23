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
    <header
      className="
        relative overflow-hidden 
        text-slate-900
      "
    >
      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute -inset-40 -z-10">
        <div
          className="
            h-full w-full
            origin-center rotate-[-18deg]
            bg-[linear-gradient(#999b9e_1px,transparent_1px),linear-gradient(90deg,#999b9e_1px,transparent_1px)]
            bg-[length:80px_80px]
            opacity-70
          "
        />
      </div>

      <Header />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-12 lg:py-16">
        {/* Text block */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
            SMART JOB MATCHING
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-4">
            Find your next{" "}
            <span
              className="
                inline-block px-3 py-1
               
                bg-sky-100 text-sky-700
                border border-sky-200
                rotate-6
              "
            >
              Remote
            </span>{" "}
            role
          </h1>

          <p className="text-sm sm:text-base text-slate-500">
            Discover curated remote opportunities tailored to your skills,
            experience, and preferred locations — all in one minimal, focused view.
          </p>
        </div>

        {/* Search card */}
        <div
          className="
            max-w-3xl mx-auto
             border border-slate-200 bg-white/80
            shadow-[0_18px_45px_rgba(15,23,42,0.06)]
            backdrop-blur
          "
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Keyword */}
              <div className="flex-1 border border-slate-200 bg-white px-4 py-3 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-200 transition">
                <div className="flex items-center gap-3">
                  <FiSearch className="text-slate-400 text-lg" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    placeholder="Job title, skill, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:w-64  border border-slate-200 bg-white px-4 py-3 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-200 transition">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-slate-400 text-lg" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    placeholder="Remote, Worldwide, Europe, etc."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="
                  md:w-auto w-full 
                  bg-slate-900 text-white
                  px-7 py-3 text-sm font-semibold
                  shadow-md hover:shadow-lg
                  hover:bg-black
                  transition
                "
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
