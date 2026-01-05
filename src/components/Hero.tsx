import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import {
  SiGoogle,
  SiNetflix,
  SiMeta,
  SiAmazon,
  SiStripe,
  SiShopify,
} from "react-icons/si";
import { Header } from "./Header";

interface HeroProps {
  onSearch: (keyword: string, location: string) => void;
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim(), location.trim());
  };

  const companies = [
    SiGoogle,
    SiNetflix,
    SiMeta,
    SiAmazon,
    SiStripe,
    SiShopify,
  ];

  return (
    <header className="relative overflow-hidden bg-[#fafafa] text-slate-900">
      {/* Minimal Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[140px]" />
        <div className="absolute bottom-[-30%] left-1/3 h-[360px] w-[360px] rounded-full bg-sky-200/40 blur-[140px]" />
      </div>

      <Header />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-20 sm:pt-20 sm:pb-28"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-600 shadow-sm">
            ✨ AI-powered job matching
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight"
        >
          Find remote jobs
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            without the noise
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-xl text-center text-sm sm:text-base text-slate-600"
        >
          A clean, modern job search platform that uses AI to surface
          high-quality remote roles tailored to your skills.
        </motion.p>

        {/* Search */}
        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="
            mx-auto mt-10 flex max-w-2xl flex-col gap-3
            rounded-2xl border border-slate-200 bg-white p-3
            shadow-[0_20px_40px_rgba(15,23,42,0.06)]
            sm:flex-row
          "
        >
          <div className="flex flex-1 items-center gap-3 px-3">
            <FiSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Role, skill, or company"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 px-3 sm:w-56">
            <FiMapPin className="text-slate-400" />
            <input
              type="text"
              placeholder="Remote / Worldwide"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-slate-900 px-6 py-3
              text-sm font-semibold text-white
              transition hover:bg-slate-800
            "
          >
            Search jobs
            <FiArrowRight />
          </motion.button>
        </motion.form>

        {/* Social Proof */}
        <motion.div
          variants={item}
          className="mt-12 text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">
            Trusted by professionals from
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-2xl text-slate-400">
            {companies.map((Icon, i) => (
              <Icon key={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
};
