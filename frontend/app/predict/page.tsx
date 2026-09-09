"use client";

import { useState } from "react";
import Link from "next/link";

export interface PredictionRecord {
  id: string;
  timestamp: string;
  applicant_name?: string;
  gender: string;
  married: string;
  education: string;
  income: number;
  coapplicant_income: number;
  loan_amount: number;
  term: number;
  credit_history: number;
  property_area: string;
  prediction: "Approved" | "Rejected";
  status: "approved" | "rejected";
  confidence?: number;
  explanation?: string;
}

export function generateExplanation(record: {
  status: "approved" | "rejected";
  income: number;
  coapplicant_income: number;
  loan_amount: number;
  term: number;
  credit_history: number;
  property_area: string;
  education?: string;
  explanation?: string;
}): string {
  if (record.explanation) return record.explanation;

  const totalIncome = record.income + record.coapplicant_income;
  const creditGood = record.credit_history === 1;
  const isApproved = record.status === "approved";

  if (isApproved) {
    const factors: string[] = [];
    if (creditGood) factors.push("a verified credit history (1.0)");
    if (totalIncome > 0) factors.push(`a total household income of $${totalIncome.toLocaleString()}`);
    if (record.coapplicant_income > 0) factors.push("co-applicant income support");
    else if (record.property_area === "Semiurban") factors.push("semi-urban property location");

    const factorText = factors.length >= 2 ? `${factors[0]} and ${factors[1]}` : (factors[0] || "favorable application metrics");
    return `Approval was primarily driven by ${factorText} relative to the requested loan of $${record.loan_amount}k.`;
  } else {
    if (!creditGood) {
      return `The rejection was primarily affected by a missing or unestablished credit history (0.0). Establishing a positive repayment record before re-applying can significantly increase your approval chances.`;
    } else {
      const annualEst = totalIncome * 12;
      if (totalIncome > 0 && (record.loan_amount * 1000) / annualEst > 2.5) {
        return `The rejection was likely affected by a high requested loan amount ($${record.loan_amount}k) relative to your combined income ($${totalIncome.toLocaleString()}). Requesting a lower loan amount or adding a co-applicant with income may improve eligibility.`;
      } else if (record.coapplicant_income === 0) {
        return `The result was likely affected by single-applicant income limits for the requested $${record.loan_amount}k loan. Adding a co-applicant or requesting a smaller loan amount may help improve approval chances.`;
      } else {
        return `The result was likely affected by the combined risk profile of property area (${record.property_area}), loan term (${record.term} months), and debt ratio. Reducing the requested loan amount may help increase eligibility.`;
      }
    }
  }
}

export default function PredictPage() {
  const [formData, setFormData] = useState({
    ApplicantName: "Alexander Wright",
    Gender: "Male",
    Married: "Yes",
    Dependents: "0",
    Education: "Graduate",
    Self_Employed: "No",
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "360",
    Credit_History: "1",
    Property_Area: "Urban",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionRecord | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validation
    if (!formData.ApplicantIncome || parseFloat(formData.ApplicantIncome) < 0) {
      setErrorMsg("Please enter a valid non-negative Applicant Income.");
      return;
    }
    if (
      formData.CoapplicantIncome === "" ||
      parseFloat(formData.CoapplicantIncome) < 0
    ) {
      setErrorMsg("Please enter a valid Co-Applicant Income.");
      return;
    }
    if (!formData.LoanAmount || parseFloat(formData.LoanAmount) <= 0) {
      setErrorMsg("Please enter a valid Loan Amount greater than 0.");
      return;
    }
    if (
      !formData.Loan_Amount_Term ||
      parseFloat(formData.Loan_Amount_Term) <= 0
    ) {
      setErrorMsg("Please enter a valid Loan Term in months.");
      return;
    }
    if (formData.Credit_History === "") {
      setErrorMsg("Please select a Credit History status.");
      return;
    }

    setLoading(true);

    const payload = {
      Gender: formData.Gender,
      Married: formData.Married,
      Dependents: formData.Dependents,
      Education: formData.Education,
      Self_Employed: formData.Self_Employed,
      ApplicantIncome: parseFloat(formData.ApplicantIncome),
      CoapplicantIncome: parseFloat(formData.CoapplicantIncome),
      LoanAmount: parseFloat(formData.LoanAmount),
      Loan_Amount_Term: parseFloat(formData.Loan_Amount_Term),
      Credit_History: parseFloat(formData.Credit_History),
      Property_Area: formData.Property_Area,
    };

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            "Failed to complete loan prediction. Please verify inputs."
        );
      }

      const resData = await response.json();

      const newRecord: PredictionRecord = {
        id: "REC-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString(),
        applicant_name: formData.ApplicantName || "Applicant",
        gender: formData.Gender,
        married: formData.Married,
        education: formData.Education,
        income: parseFloat(formData.ApplicantIncome),
        coapplicant_income: parseFloat(formData.CoapplicantIncome),
        loan_amount: parseFloat(formData.LoanAmount),
        term: parseFloat(formData.Loan_Amount_Term),
        credit_history: parseFloat(formData.Credit_History),
        property_area: formData.Property_Area,
        prediction: resData.prediction,
        status: resData.status,
        confidence: resData.confidence,
        explanation: resData.explanation,
      };

      setResult(newRecord);

      // Save to localStorage history
      try {
        const existingHistory = JSON.parse(
          localStorage.getItem("credify-history") || "[]"
        );
        const updatedHistory = [newRecord, ...existingHistory];
        localStorage.setItem("credify-history", JSON.stringify(updatedHistory));
      } catch (err) {
        console.error("Failed to save history to localStorage:", err);
      }
    } catch (err: any) {
      console.error("API error:", err);
      setErrorMsg(
        err.message ||
          "Unable to connect to prediction server. Please ensure the backend service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <main className="flex-1 px-4 md:px-16 py-8 max-w-[1440px] mx-auto w-full animate-pageEnter">
      {/* Clean Header Banner */}
      <section className="mb-8 border-b border-[var(--card-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Manrope'] text-[var(--text-main)]">
            Loan Approval Prediction
          </h1>
          <p className="text-base text-[var(--text-sub)] mt-1 max-w-2xl">
            Input applicant financial variables below. Our K-Nearest Neighbors (KNN) model evaluates risk factors and delivers instant approval decisions.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--text-sub)] bg-[var(--card-sub-bg)] px-4 py-2.5 rounded-xl border border-[var(--card-border)] shadow-sm">
          <div>
            <span className="text-[var(--text-muted)] block">Model</span>
            <span className="font-semibold text-[var(--text-main)]">Tuned KNN (K=7)</span>
          </div>
          <div className="h-8 w-px bg-[var(--card-border)]"></div>
          <div>
            <span className="text-[var(--text-muted)] block">Dataset</span>
            <span className="font-semibold text-[var(--text-main)]">train.csv (614 entries)</span>
          </div>
        </div>
      </section>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="mb-8 bg-[#93000a]/15 border border-[#93000a]/50 text-[#93000a] dark:text-[#ffdad6] p-4 rounded-xl flex items-center gap-3 animate-fadeInUp">
          <span className="material-symbols-outlined text-[#93000a] dark:text-[#ffb4ab]">error</span>
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Prediction Result View */}
      {result ? (
        <section className="my-8 animate-slideUpFade">
          <div className="max-w-4xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden transition-colors duration-300">
            {/* Status Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[var(--card-border)] pb-8 relative z-10">
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${
                    result.status === "approved"
                      ? "bg-[#C49A24]/15 border-[#C49A24] text-[#C49A24] dark:text-[#f2ca50]"
                      : "bg-[#93000a]/15 border-[#93000a] text-[#93000a] dark:text-[#ffb4ab]"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {result.status === "approved" ? "check_circle" : "cancel"}
                  </span>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                    Reference: {result.id}
                  </div>
                  <h2
                    className={`text-3xl font-bold font-['Manrope'] mt-1 ${
                      result.status === "approved"
                        ? "text-[#C49A24] dark:text-[#f2ca50]"
                        : "text-[#93000a] dark:text-[#ffb4ab]"
                    }`}
                  >
                    Loan {result.prediction}
                  </h2>
                </div>
              </div>

              {/* Confidence Meter Badge */}
              {result.confidence !== undefined && (
                <div className="bg-[var(--card-sub-bg)] border border-[var(--card-border)] px-5 py-3 rounded-xl flex flex-col items-end shadow-sm">
                  <span className="text-xs text-[var(--text-muted)]">Model Confidence</span>
                  <span className="text-xl font-bold text-[#C49A24] dark:text-[#f2ca50]">
                    {result.confidence}%
                  </span>
                </div>
              )}
            </div>

            {/* 1–2 Line Dynamic Prediction Explanation Box */}
            <div
              className={`my-6 p-4.5 rounded-xl border text-sm leading-relaxed relative z-10 flex items-start gap-3.5 transition-all duration-300 ${
                result.status === "approved"
                  ? "bg-[#C49A24]/10 border-[#C49A24]/30 text-[var(--text-main)]"
                  : "bg-[#93000a]/10 border-[#93000a]/30 text-[var(--text-main)]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl mt-0.5 shrink-0 ${
                  result.status === "approved"
                    ? "text-[#C49A24] dark:text-[#f2ca50]"
                    : "text-[#93000a] dark:text-[#ffb4ab]"
                }`}
              >
                {result.status === "approved" ? "verified" : "lightbulb"}
              </span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-[var(--text-sub)] mb-1">
                  {result.status === "approved"
                    ? "Key Approval Factors"
                    : "Likely Risk Factors & Recommendation"}
                </span>
                <p className="text-sm font-medium text-[var(--text-main)]">
                  {generateExplanation(result)}
                </p>
              </div>
            </div>

            {/* Applicant Financial Metrics Grid */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              <div className="bg-[var(--card-sub-bg)] p-4 rounded-xl border border-[var(--card-border)]">
                <span className="text-xs text-[var(--text-muted)] block">Applicant</span>
                <span className="text-base font-semibold text-[var(--text-main)] truncate block">
                  {result.applicant_name}
                </span>
              </div>
              <div className="bg-[var(--card-sub-bg)] p-4 rounded-xl border border-[var(--card-border)]">
                <span className="text-xs text-[var(--text-muted)] block">Applicant Income</span>
                <span className="text-lg font-semibold font-mono text-[var(--text-main)]">
                  ${result.income.toLocaleString()}
                </span>
              </div>
              <div className="bg-[var(--card-sub-bg)] p-4 rounded-xl border border-[var(--card-border)]">
                <span className="text-xs text-[var(--text-muted)] block">Co-Applicant Income</span>
                <span className="text-lg font-semibold font-mono text-[var(--text-main)]">
                  ${result.coapplicant_income.toLocaleString()}
                </span>
              </div>
              <div className="bg-[var(--card-sub-bg)] p-4 rounded-xl border border-[var(--card-border)]">
                <span className="text-xs text-[var(--text-muted)] block">Loan Amount</span>
                <span className="text-lg font-semibold font-mono text-[var(--text-main)]">
                  ${result.loan_amount.toLocaleString()} (k)
                </span>
              </div>
            </div>

            {/* Diagnostics Summary */}
            <div className="bg-[var(--card-sub-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-8 relative z-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50] text-base">
                  analytics
                </span>
                Underwriting Summary
              </h3>
              {result.status === "approved" ? (
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                  The application satisfies primary underwriting criteria. Credit history reliability and income ratio satisfy requirements for the <span className="text-[#C49A24] dark:text-[#f2ca50] font-semibold">Low Risk</span> tier.
                </p>
              ) : (
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                  The application fell short of the classification threshold. Primary risk factors relate to credit history weighting or debt-to-income limits.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--card-border)] relative z-10">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Make Another Prediction
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto text-center border border-[var(--card-border)] hover:border-[#C49A24] dark:hover:border-[#d4af37] text-[var(--text-sub)] hover:text-[#C49A24] dark:hover:text-[#f2ca50] font-medium px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View Dashboard History</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Clean Form View */
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 animate-fadeInUp"
        >
          {/* Section 1: Personal Details */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                person
              </span>
              <h2 className="font-['Manrope'] text-xl font-semibold text-[var(--text-main)]">
                Applicant Profile
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label-luxury">Full Name</label>
                <input
                  type="text"
                  name="ApplicantName"
                  value={formData.ApplicantName}
                  onChange={handleChange}
                  placeholder="e.g. Alexander Wright"
                  className="form-input-luxury"
                />
              </div>
              <div>
                <label className="form-label-luxury">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="form-label-luxury">Marital Status</label>
                <select
                  name="Married"
                  value={formData.Married}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="Yes">Married</option>
                  <option value="No">Single / Unmarried</option>
                </select>
              </div>
              <div>
                <label className="form-label-luxury">Dependents</label>
                <select
                  name="Dependents"
                  value={formData.Dependents}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="0">0 Dependents</option>
                  <option value="1">1 Dependent</option>
                  <option value="2">2 Dependents</option>
                  <option value="3+">3+ Dependents</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Education & Employment */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                work
              </span>
              <h2 className="font-['Manrope'] text-xl font-semibold text-[var(--text-main)]">
                Employment & Qualifications
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label-luxury">Education</label>
                <select
                  name="Education"
                  value={formData.Education}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="Graduate">Graduate</option>
                  <option value="Not Graduate">Not Graduate</option>
                </select>
              </div>
              <div>
                <label className="form-label-luxury">Employment Type</label>
                <select
                  name="Self_Employed"
                  value={formData.Self_Employed}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="No">Salaried / Employed</option>
                  <option value="Yes">Self-Employed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Metrics */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                payments
              </span>
              <h2 className="font-['Manrope'] text-xl font-semibold text-[var(--text-main)]">
                Financial Metrics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label-luxury">Applicant Income ($)</label>
                <input
                  type="number"
                  name="ApplicantIncome"
                  value={formData.ApplicantIncome}
                  onChange={handleChange}
                  placeholder="e.g. 5849"
                  className="form-input-luxury font-mono"
                  required
                />
              </div>
              <div>
                <label className="form-label-luxury">Co-Applicant Income ($)</label>
                <input
                  type="number"
                  name="CoapplicantIncome"
                  value={formData.CoapplicantIncome}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  className="form-input-luxury font-mono"
                  required
                />
              </div>
              <div>
                <label className="form-label-luxury">Loan Amount ($k)</label>
                <input
                  type="number"
                  name="LoanAmount"
                  value={formData.LoanAmount}
                  onChange={handleChange}
                  placeholder="e.g. 128"
                  className="form-input-luxury font-mono"
                  required
                />
              </div>
              <div>
                <label className="form-label-luxury">Loan Term (Months)</label>
                <input
                  type="number"
                  name="Loan_Amount_Term"
                  value={formData.Loan_Amount_Term}
                  onChange={handleChange}
                  placeholder="360"
                  className="form-input-luxury font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Credit & Collateral */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
                verified_user
              </span>
              <h2 className="font-['Manrope'] text-xl font-semibold text-[var(--text-main)]">
                Credit & Collateral
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="form-label-luxury">Credit History</label>
                <select
                  name="Credit_History"
                  value={formData.Credit_History}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="1">1 - Good / Meets Guidelines</option>
                  <option value="0">0 - Bad / Below Requirements</option>
                </select>
              </div>
              <div>
                <label className="form-label-luxury">Property Area</label>
                <select
                  name="Property_Area"
                  value={formData.Property_Area}
                  onChange={handleChange}
                  className="form-select-luxury"
                >
                  <option value="Urban">Urban</option>
                  <option value="Semiurban">Semi-Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="md:col-span-2 flex flex-col items-center justify-center pt-6 border-t border-[var(--card-border)] mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`relative group overflow-hidden bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-['Manrope'] text-lg font-bold px-12 py-4 rounded-xl shadow-md transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-3 ${
                loading
                  ? "opacity-80 pointer-events-none"
                  : "hover:bg-[#B88A16] dark:hover:bg-[#ffe088] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <span className="relative z-10">Analyzing Application...</span>
                  <span className="material-symbols-outlined relative z-10 animate-spin">
                    progress_activity
                  </span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Predict Loan Approval</span>
                  <span className="material-symbols-outlined relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
