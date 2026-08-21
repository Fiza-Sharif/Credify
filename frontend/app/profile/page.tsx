"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { PredictionRecord } from "../predict/page";
import ScrollReveal from "../components/ScrollReveal";

export default function ProfilePage() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState({
    name: "Alexander Wright",
    email: "alexander.wright@institution.com",
    role: "Senior Underwriter & Risk Analyst",
    organization: "Global Fintech Partners",
  });

  const [avatarChanging, setAvatarChanging] = useState(false);
  const [history, setHistory] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("credify-user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          role: parsed.role || prev.role,
          organization: parsed.organization || prev.organization,
        }));
      }

      const storedHistory = localStorage.getItem("credify-history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const total = history.length;
  const approved = history.filter((r) => r.status === "approved").length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const handleAvatarChange = () => {
    setAvatarChanging(true);
    setTimeout(() => {
      setAvatarChanging(false);
    }, 600);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      {/* Page Header */}
      <section className="mb-8 border-b border-[var(--card-border)] pb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-['Manrope'] text-[var(--text-main)]">
          User Profile & Preferences
        </h1>
      </section>

      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
            <div className="relative mb-4 group cursor-pointer" onClick={handleAvatarChange}>
              <div
                className={`w-24 h-24 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-3xl flex items-center justify-center shadow-md border-2 border-[var(--card-border)] transition-transform duration-500 group-hover:scale-105 ${
                  avatarChanging ? "scale-95 rotate-12" : ""
                }`}
              >
                {getInitials(profile.name)}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--card-sub-bg)] border border-[var(--card-border)] text-[var(--text-main)] flex items-center justify-center shadow-sm hover:border-[#C49A24] dark:hover:border-[#d4af37] transition-all duration-300 group-hover:scale-110"
                title="Change Avatar"
              >
                <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-45">
                  edit
                </span>
              </button>
            </div>

            <h2 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)]">
              {profile.name}
            </h2>
            <p className="text-xs text-[#C49A24] dark:text-[#f2ca50] font-semibold mt-1">
              {profile.role}
            </p>
            <p className="text-xs text-[var(--text-sub)] mt-1">{profile.organization}</p>

            <div className="w-full border-t border-[var(--card-border)] my-6"></div>

            {/* Quick Stats Summary */}
            <div className="w-full grid grid-cols-2 gap-4 text-center">
              <div className="bg-[var(--card-sub-bg)] p-3 rounded-xl border border-[var(--card-border)] transition-all duration-300 hover:border-[#C49A24]/30">
                <span className="text-xs text-[var(--text-muted)] block">Evaluations</span>
                <span className="text-lg font-bold font-mono text-[var(--text-main)]">
                  {total}
                </span>
              </div>
              <div className="bg-[var(--card-sub-bg)] p-3 rounded-xl border border-[var(--card-border)] transition-all duration-300 hover:border-[#C49A24]/30">
                <span className="text-xs text-[var(--text-muted)] block">Pass Rate</span>
                <span className="text-lg font-bold font-mono text-[#C49A24] dark:text-[#f2ca50]">
                  {approvalRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Account Details & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details Card */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4 mb-6">
                <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                  badge
                </span>
                <h3 className="text-lg font-bold font-['Manrope'] text-[var(--text-main)]">
                  Account Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="form-label-luxury">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => {
                      const updated = { ...profile, name: e.target.value };
                      setProfile(updated);
                      localStorage.setItem("credify-user", JSON.stringify(updated));
                    }}
                    className="form-input-luxury"
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Work Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      const updated = { ...profile, email: e.target.value };
                      setProfile(updated);
                      localStorage.setItem("credify-user", JSON.stringify(updated));
                    }}
                    className="form-input-luxury"
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Job Title</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => {
                      const updated = { ...profile, role: e.target.value };
                      setProfile(updated);
                      localStorage.setItem("credify-user", JSON.stringify(updated));
                    }}
                    className="form-input-luxury"
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Organization</label>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) => {
                      const updated = { ...profile, organization: e.target.value };
                      setProfile(updated);
                      localStorage.setItem("credify-user", JSON.stringify(updated));
                    }}
                    className="form-input-luxury"
                  />
                </div>
              </div>
            </div>

            {/* Preferences & Theme Card */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4 mb-6">
                <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                  tune
                </span>
                <h3 className="text-lg font-bold font-['Manrope'] text-[var(--text-main)]">
                  Application Preferences
                </h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--card-sub-bg)] rounded-xl border border-[var(--card-border)]">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">
                    Appearance Theme
                  </div>
                  <div className="text-xs text-[var(--text-sub)]">
                    Currently using <span className="font-semibold capitalize">{theme} Mode</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
