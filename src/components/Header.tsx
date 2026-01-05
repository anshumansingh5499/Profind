import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-center pt-6 md:pt-6  mt-[-25px] ">
      <div
        className="
          w-[100%] md:w-[100%] 
          bg-white border border-white/20 
         
          backdrop-blur-xl 
          flex items-center justify-between
          px-8 md:px-12 py-1.5 md:py-1.5 
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          
          <div className="flex flex-col leading-tight">
              <img
            src="/logo.png"
            alt="ProFind logo"
            className="h-11 w-auto object-contain  p-2 rounded-full"
          />
          </div>
        </div>

        {/* Nav + actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Middle nav (hidden on very small screens if you want) */}
          <nav className="hidden sm:flex items-center gap-3 md:gap-5 text-xs md:text-sm ">
            <button className="text-black hover:text-slate-900 transition">
              Post Job
            </button>
            <button className="text-black hover:text-slate-900 transition">
              Affiliate
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Optional: secondary link on mobile */}
            <button className="sm:hidden text-[11px] text-black">
              Post Job
            </button>

            <button
              className="
                text-xs md:text-sm font-medium
                px-3 md:px-4 py-1.5 md:py-2 
                
                bg-blue-500
                text-white shadow-md
                hover:shadow-lg hover:brightness-105
                active:scale-[0.97]
                transition rounded-xl
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
