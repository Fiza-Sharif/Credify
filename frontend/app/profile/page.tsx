"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { PredictionRecord } from "../predict/page";
import ScrollReveal from "../components/ScrollReveal";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, updateProfile, updateAvatar, removeAvatar, signout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        organization: user.organization || "",
      });
    }

    try {
      const storedHistory = localStorage.getItem("credify-history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }, [user]);

  const total = history.length;
  const approved = history.filter((r) => r.status === "approved").length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg("Full Name cannot be empty.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    const res = await updateProfile(formData);
    setSaving(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to update profile.");
    } else {
      setSuccessMsg("Profile information updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please upload an image (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const res = await updateAvatar(base64);
      if (res.success) {
        setSuccessMsg("Profile picture updated successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.error || "Failed to update avatar.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatarClick = async () => {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      const res = await removeAvatar();
      if (res.success) {
        setSuccessMsg("Profile picture removed.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    }
  };

  const handleSignOutClick = () => {
    signout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-16 text-center">
        <h1 className="text-2xl font-bold font-['Manrope'] mb-4">No Active User Session</h1>
        <p className="text-sm text-[var(--text-sub)] mb-6">Please sign in or create an account to view your profile.</p>
        <button
          onClick={() => router.push("/signup")}
          className="bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold px-6 py-3 rounded-xl shadow-md"
        >
          Go to Sign Up / Sign In
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      {/* Page Header */}
      <section className="mb-8 border-b border-[var(--card-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Manrope'] text-[var(--text-main)]">
            User Profile & Preferences
          </h1>
          <p className="text-sm text-[var(--text-sub)] mt-1">
            Manage your account credentials, avatar picture, and system settings.
          </p>
        </div>

        <button
          onClick={handleSignOutClick}
          className="bg-[#93000a]/15 text-[#93000a] dark:text-[#ffb4ab] border border-[#93000a]/30 hover:bg-[#93000a]/25 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out Account</span>
        </button>
      </section>

      {/* Notifications */}
      {errorMsg && (
        <div className="mb-8 bg-[#93000a]/15 border border-[#93000a]/50 text-[#93000a] dark:text-[#ffdad6] p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fadeInUp">
          <span className="material-symbols-outlined text-[#93000a] dark:text-[#ffb4ab]">error</span>
          <div>{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="mb-8 bg-[#C49A24]/15 border border-[#C49A24]/50 text-[#C49A24] dark:text-[#f2ca50] p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fadeInUp">
          <span className="material-symbols-outlined">check_circle</span>
          <div>{successMsg}</div>
        </div>
      )}

      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Profile Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
            
            {/* Profile Avatar Box */}
            <div className="relative mb-4 group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-[#C49A24]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-4xl flex items-center justify-center shadow-md border-2 border-[var(--card-border)]">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Avatar Management Actions */}
            <div className="flex items-center gap-2 mb-6">
              <label className="cursor-pointer bg-[var(--card-sub-bg)] border border-[var(--card-border)] hover:border-[#C49A24] dark:hover:border-[#d4af37] px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm text-[#C49A24] dark:text-[#f2ca50]">
                  photo_camera
                </span>
                <span>{user.avatar ? "Change Picture" : "Upload Picture"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
              </label>

              {user.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatarClick}
                  className="bg-[#93000a]/15 text-[#93000a] dark:text-[#ffb4ab] border border-[#93000a]/30 hover:bg-[#93000a]/25 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                  title="Remove Picture"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Remove</span>
                </button>
              )}
            </div>

            <h2 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)]">
              {user.name}
            </h2>
            <p className="text-xs text-[#C49A24] dark:text-[#f2ca50] font-semibold mt-1">
              {user.role}
            </p>
            <p className="text-xs text-[var(--text-sub)] mt-1">{user.organization}</p>

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

          {/* Right Column: Edit Account Form & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details Form */}
            <form onSubmit={handleSaveProfile} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4 mb-6">
                <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                  badge
                </span>
                <h3 className="text-lg font-bold font-['Manrope'] text-[var(--text-main)]">
                  Account Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label-luxury">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input-luxury"
                    required
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input-luxury"
                    required
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Job Title / Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Risk Analyst"
                    className="form-input-luxury"
                  />
                </div>

                <div>
                  <label className="form-label-luxury">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Global Fintech Partners"
                    className="form-input-luxury"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-[var(--card-border)] pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 ${
                    saving ? "opacity-80 pointer-events-none" : "hover:bg-[#B88A16] dark:hover:bg-[#ffe088]"
                  }`}
                >
                  {saving ? (
                    <>
                      <span>Saving Changes...</span>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

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
