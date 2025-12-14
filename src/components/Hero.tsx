import React, { useState } from "react";
import { FiSearch, FiMapPin, FiWifi } from "react-icons/fi";
import {
  SiGoogle,
  SiNetflix,
  SiMeta,
  SiAmazon,
  SiAdobe,
  SiApple,
  SiAirbnb,
  SiUber,
  SiOracle,
  SiSalesforce,
  SiSpotify,
  SiStripe,
  SiShopify,
  SiDell,
  SiIntel,
  SiSlack,
  SiAccenture,
  SiCisco,
  SiSiemens,
  SiTesla,
  SiX,
  SiZoom,
  SiLinkedin,
  SiAtlassian,
} from "react-icons/si";

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

  // ✨ Icon list (brand colors preserved)
  const companyIcons = [
    { id: "google", Icon: SiGoogle },
    { id: "netflix", Icon: SiNetflix },
    { id: "meta", Icon: SiMeta },
    { id: "amazon", Icon: SiAmazon },
    { id: "adobe", Icon: SiAdobe },
    { id: "apple", Icon: SiApple },
    { id: "airbnb", Icon: SiAirbnb },
    { id: "uber", Icon: SiUber },
    { id: "oracle", Icon: SiOracle },
    { id: "salesforce", Icon: SiSalesforce },
    { id: "spotify", Icon: SiSpotify },
    { id: "stripe", Icon: SiStripe },
    { id: "shopify", Icon: SiShopify },
    { id: "dell", Icon: SiDell },
    { id: "intel", Icon: SiIntel },
    { id: "slack", Icon: SiSlack },
    { id: "accenture", Icon: SiAccenture },
    { id: "cisco", Icon: SiCisco },
    { id: "siemens", Icon: SiSiemens },
    { id: "tesla", Icon: SiTesla },
    { id: "twitter", Icon: SiX },
    { id: "zoom", Icon: SiZoom },
    { id: "linkedin", Icon: SiLinkedin },
    { id: "atlassian", Icon: SiAtlassian },

    // 🔁 Duplicate for seamless marquee
    { id: "google2", Icon: SiGoogle },
    { id: "netflix2", Icon: SiNetflix },
    { id: "meta2", Icon: SiMeta },
    { id: "amazon2", Icon: SiAmazon },
    { id: "adobe2", Icon: SiAdobe },
    { id: "apple2", Icon: SiApple },
    { id: "airbnb2", Icon: SiAirbnb },
    { id: "uber2", Icon: SiUber },
    { id: "oracle2", Icon: SiOracle },
    { id: "salesforce2", Icon: SiSalesforce },
    { id: "spotify2", Icon: SiSpotify },
    { id: "stripe2", Icon: SiStripe },
    { id: "shopify2", Icon: SiShopify },
    { id: "dell2", Icon: SiDell },
    { id: "intel2", Icon: SiIntel },
    { id: "slack2", Icon: SiSlack },
    { id: "accenture2", Icon: SiAccenture },
    { id: "cisco2", Icon: SiCisco },
    { id: "siemens2", Icon: SiSiemens },
    { id: "tesla2", Icon: SiTesla },
    { id: "twitter2", Icon: SiX },
    { id: "zoom2", Icon: SiZoom },
    { id: "linkedin2", Icon: SiLinkedin },
    { id: "atlassian2", Icon: SiAtlassian },
  ];

  return (
    <header className="relative overflow-hidden text-slate-900">
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

      {/* 🔥 Infinite Marquee */}
      <div className="w-full overflow-hidden border-y border-slate-200 bg-slate-100 backdrop-blur-sm">
        <div className="flex min-w-max items-center py-2 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, loopIndex) => (
            <div
              key={loopIndex}
              className="flex items-center gap-10 px-6 md:px-10"
            >
              {companyIcons.map(({ id, Icon }) => (
                <div
                  key={`${id}-${loopIndex}`}
                  className="flex items-center justify-center text-2xl transition hover:scale-110"
                >
                  <Icon className="opacity-90 hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-12 lg:py-16">
        {/* Text */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
            ✧ AI SMART JOB MATCHING
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-4">
            Find your next{" "}
            <span
              className="
                inline-flex items-center gap-2
                px-3 py-1
                bg-blue-400 text-white
                border border-slate-500
                rotate-6
              "
            >
              <FiWifi className="text-sm" />
              Remote
            </span>{" "}
            role
          </h1>

          <p className="text-sm sm:text-base text-slate-500">
            Discover curated remote opportunities tailored to your skills,
            experience, and preferred locations — all in one minimal, focused view.
          </p>
        </div>

        {/* Search Card */}
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
              <div className="md:w-64 border border-slate-200 bg-white px-4 py-3 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-200 transition">
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
                  bg-blue-400 text-white
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
