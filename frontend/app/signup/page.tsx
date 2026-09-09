"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signup, signin } = useAuth();

  const [mode, setMode] = useState<"signup" | "signin">("signup");

  const [formData, setFormData] = useState({
    name: "Alexander Wright",
    email: "alexander@credify.ai",
    password: "password123",
  });

  const [avatarBase64, setAvatarBase64] = useState<string | undefined>(undefined);
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file format. Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
      if (errorMsg) setErrorMsg(null);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarBase64(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "signup") {
      // Signup Validation
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
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: avatarBase64,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Signup failed.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting to loan predictor...");
      setTimeout(() => {
        router.push("/predict");
      }, 900);
    } else {
      // Signin Validation
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Please enter a valid work email address.");
        return;
      }
      if (!formData.password) {
        setErrorMsg("Please enter your password.");
        return;
      }

      setLoading(true);
      const res = await signin({
        email: formData.email,
        password: formData.password,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Signed in successfully! Redirecting to loan predictor...");
      setTimeout(() => {
        router.push("/predict");
      }, 900);
    }
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 flex items-center justify-center animate-pageEnter">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 shadow-lg relative overflow-hidden transition-colors duration-300">
        
        {/* Mode Toggle Tabs */}
        <div className="flex bg-[var(--card-sub-bg)] p-1 rounded-xl border border-[var(--card-border)] mb-8">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] shadow-sm"
                : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] shadow-sm"
                : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C49A24]/10 dark:bg-[#d4af37]/10 text-[#C49A24] dark:text-[#f2ca50] mb-3">
            <span className="material-symbols-outlined text-2xl">
              {mode === "signup" ? "person_add" : "login"}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-['Manrope'] text-[var(--text-main)]">
            {mode === "signup" ? "Create Credify Account" : "Sign In to Credify"}
          </h1>
          <p className="text-xs text-[var(--text-sub)] mt-1">
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
          {mode === "signup" && (
            <>
              {/* Optional Profile Picture Upload & Preview */}
              <div>
                <label className="form-label-luxury">Profile Picture (Optional)</label>
                <div className="flex items-center gap-4 mt-1">
                  {avatarBase64 ? (
                    <div className="relative group">
                      <img
                        src={avatarBase64}
                        alt="Avatar Preview"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#C49A24]"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-1 -right-1 bg-[#93000a] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md"
                        title="Remove Image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--card-sub-bg)] border border-[var(--card-border)] text-[var(--text-muted)] flex items-center justify-center text-xs font-semibold">
                      No Image
                    </div>
                  )}

                  <label className="flex-1 cursor-pointer bg-[var(--card-sub-bg)] border border-[var(--card-border)] hover:border-[#C49A24] dark:hover:border-[#d4af37] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-main)] flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-base text-[#C49A24] dark:text-[#f2ca50]">
                      cloud_upload
                    </span>
                    <span>{avatarBase64 ? "Change Picture" : "Upload Picture"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

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
            </>
          )}

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
                <span>{mode === "signup" ? "Creating Account..." : "Signing In..."}</span>
                <span className="material-symbols-outlined animate-spin text-lg">
                  progress_activity
                </span>
              </>
            ) : (
              <>
                <span>{mode === "signup" ? "Create Account & Continue" : "Sign In & Continue"}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-[#C49A24] dark:text-[#f2ca50] hover:underline font-semibold"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-[#C49A24] dark:text-[#f2ca50] hover:underline font-semibold"
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
