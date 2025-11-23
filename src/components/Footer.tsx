// src/components/Footer.tsx
import React from "react";
import { Linkedin, Github, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="
        mt-10
        bg-white/20 backdrop-blur-lg
        border-t border-white/30
        shadow-[0_4px_30px_rgba(0,0,0,0.05)]
      "
    >
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[13px]">
        {/* Brand */}
        <div>
          <img
            src="/logo.png"
            alt="ProFind logo"
            className="h-11 w-auto object-contain  p-2 "
          />
          <p className="text-slate-600 mt-2">
            Empowering job seekers with AI-driven insights and smart search.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 text-slate-600">
          <a className="hover:text-indigo-600 transition" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-indigo-600 transition" href="#">
            Terms of Service
          </a>
          <a className="hover:text-indigo-600 transition" href="#">
            Help & Support
          </a>
        </div>

        {/* Social */}
        <div>
          <p className="text-slate-600 mb-2">Connect with us</p>
          <div className="flex gap-3">
            <a
              href="#"
              className="p-2 rounded-full hover:bg-indigo-100 transition"
            >
              <Linkedin size={16} className="text-indigo-600" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-indigo-100 transition"
            >
              <Github size={16} className="text-indigo-600" />
            </a>
            <a
              href="mailto:contact@jobfinder.ai"
              className="p-2 rounded-full hover:bg-indigo-100 transition"
            >
              <Mail size={16} className="text-indigo-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="text-[11px] text-center py-3 border-t border-white/20 
                   bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
      >
        © {new Date().getFullYear()} <span className="font-medium">JobFinder AI</span>. All rights reserved.
      </div>
    </footer>
  );
};
