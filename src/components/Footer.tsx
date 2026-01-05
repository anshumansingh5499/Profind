import React from "react";
import { Linkedin, Github, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 bg-gradient-to-b from-slate-100 via-slate-150 to-white text-slate-300">
      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40  blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ProFind AI"
                className="h-10 w-auto"
              />
             
            </div>

            <p className="mt-4 text-sm text-black leading-relaxed max-w-sm">
              ProFind AI helps you align your resume with the right opportunities
              using intelligent matching, skill analysis, and AI-driven insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-black mb-4">
              Product
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Resume Assistant
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Job Matching
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  AI Copilot
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  ATS Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-black mb-4">
              Company
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-semibold text-black mb-4">
              Resources
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Resume Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition text-black">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-200 font-medium">
              ProFind AI
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:contact@profind.ai"
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
