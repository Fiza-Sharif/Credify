"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Alexander Wright",
    email: "alexander@credify.ai",
    password: "password123",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validation
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    // Simulate account creation & save session
    setTimeout(() => {
      try {
        const userSession = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: "Senior Underwriter & Risk Analyst",
          organization: "Global Fintech Partners",
          signedUpAt: new Date().toISOString(),
        };
        localStorage.setItem("credify-user", JSON.stringify(userSession));
        setSuccessMsg("Account created successfully! Redirecting to loan predictor...");

        setTimeout(() => {
          router.push("/predict");
        }, 1000);
      } catch (err) {
        console.error("Signup error:", err);
        setErrorMsg("An error occurred while creating your account.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 flex items-center justify-center animate-pageEnter">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 shadow-lg relative overflow-hidden transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C49A24]/10 dark:bg-[#d4af37]/10 text-[#C49A24] dark:text-[#f2ca50] mb-4">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h1 className="text-2xl font-bold font-['Manrope'] text-[var(--text-main)]">
            Create Account
          </h1>
          <p className="text-sm text-[var(--text-sub)] mt-1">
            Access Credify Institutional Loan Predictor Engine
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 bg-[#93000a]/15 border border-[#93000a]/50 text-[#93000a] dark:text-[#ffdad6] p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-fadeInUp">
            <span className="material-symbols-outlined text-base text-[#93000a] dark:text-[#ffb4ab]">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 bg-[#C49A24]/15 border border-[#C49A24]/50 text-[#C49A24] dark:text-[#f2ca50] p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-fadeInUp">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="form-label-luxury">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alexander Wright"
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
              placeholder="alexander@institution.com"
              className="form-input-luxury"
              required
            />
          </div>

          <div>
            <label className="form-label-luxury">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="form-input-luxury"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold py-3.5 rounded-xl shadow-md transition-all text-base mt-2 flex items-center justify-center gap-2 ${
              loading
                ? "opacity-80 pointer-events-none"
                : "hover:bg-[#B88A16] dark:hover:bg-[#ffe088] hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <span>Creating Account...</span>
                <span className="material-symbols-outlined animate-spin text-lg">
                  progress_activity
                </span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Continue</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link
            href="/predict"
            className="text-[#C49A24] dark:text-[#f2ca50] hover:underline font-semibold"
          >
            Proceed directly to Predictor
          </Link>
        </div>
      </div>
    </main>
  );
}
