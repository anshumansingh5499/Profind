import React, { useState } from "react";

export const JobAlertsForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly">("Daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    alert(
      `✅ Mock: job alert created for "${keyword || "Any role"}" in "${
        location || "Any location"
      }" (${frequency})`
    );
    setKeyword("");
    setLocation("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-[11px]">
      <p className="text-xs font-semibold text-slate-800 mb-1">Job alerts (UI only)</p>
      <p className="text-[11px] text-slate-500 mb-2">
        Get notified when new jobs match your preferences. (Mock only, no email is sent.)
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs"
          placeholder="Keyword (ReactJS Developer)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs"
          placeholder="Location (e.g., Noida, Remote)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs"
          value={frequency}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setFrequency(e.target.value as any)}
        >
          <option>Daily</option>
          <option>Weekly</option>
        </select>
        <button
          type="submit"
          className="w-full mt-1 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-500"
        >
          Create alert
        </button>
      </form>
    </div>
  );
};
