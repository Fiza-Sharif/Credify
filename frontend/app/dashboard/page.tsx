"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PredictionRecord } from "../predict/page";

const sampleRecords: PredictionRecord[] = [
  {
    id: "REC-948201",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    applicant_name: "Alexander Wright",
    gender: "Male",
    married: "Yes",
    education: "Graduate",
    income: 8500,
    coapplicant_income: 2500,
    loan_amount: 180,
    term: 360,
    credit_history: 1,
    property_area: "Urban",
    prediction: "Approved",
    status: "approved",
    confidence: 91,
  },
  {
    id: "REC-839210",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    applicant_name: "Sarah Jenkins",
    gender: "Female",
    married: "No",
    education: "Graduate",
    income: 4200,
    coapplicant_income: 0,
    loan_amount: 140,
    term: 360,
    credit_history: 1,
    property_area: "Semiurban",
    prediction: "Approved",
    status: "approved",
    confidence: 84,
  },
  {
    id: "REC-710492",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    applicant_name: "Marcus Vance",
    gender: "Male",
    married: "Yes",
    education: "Not Graduate",
    income: 2100,
    coapplicant_income: 0,
    loan_amount: 110,
    term: 180,
    credit_history: 0,
    property_area: "Rural",
    prediction: "Rejected",
    status: "rejected",
    confidence: 88,
  },
  {
    id: "REC-629104",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    applicant_name: "Elena Rostova",
    gender: "Female",
    married: "Yes",
    education: "Graduate",
    income: 12000,
    coapplicant_income: 4500,
    loan_amount: 320,
    term: 360,
    credit_history: 1,
    property_area: "Urban",
    prediction: "Approved",
    status: "approved",
    confidence: 96,
  },
];

export default function DashboardPage() {
  const [history, setHistory] = useState<PredictionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "rejected">("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("credify-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory(sampleRecords);
        localStorage.setItem("credify-history", JSON.stringify(sampleRecords));
      }
    } catch (err) {
      console.error("Error reading history:", err);
      setHistory(sampleRecords);
    }
  }, []);

  const total = history.length;
  const approved = history.filter((r) => r.status === "approved").length;
  const rejected = history.filter((r) => r.status === "rejected").length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const filteredHistory = history.filter((record) => {
    const matchesSearch =
      record.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.property_area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ? true : record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your prediction history?")) {
      setHistory([]);
      localStorage.removeItem("credify-history");
    }
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      {/* Header */}
      <section className="mb-8 border-b border-[var(--card-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Manrope'] text-[var(--text-main)]">
            Underwriting Dashboard
          </h1>
          <p className="text-sm text-[var(--text-sub)] mt-1">
            Real-time portfolio evaluation metrics & historical loan application audit log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/predict"
            className="bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-sm px-5 py-3 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Application
          </Link>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Total Predictions
            </span>
            <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
              analytics
            </span>
          </div>
          <div className="text-3xl font-bold font-['Manrope'] text-[var(--text-main)]">
            {total}
          </div>
          <span className="text-xs text-[var(--text-sub)] mt-2 block">
            Processed applications
          </span>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Approved
            </span>
            <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
              check_circle
            </span>
          </div>
          <div className="text-3xl font-bold font-['Manrope'] text-[#C49A24] dark:text-[#f2ca50]">
            {approved}
          </div>
          <span className="text-xs text-[var(--text-sub)] mt-2 block">
            Qualified low-risk tier
          </span>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Rejected
            </span>
            <span className="material-symbols-outlined text-[#93000a] dark:text-[#ffb4ab]">
              cancel
            </span>
          </div>
          <div className="text-3xl font-bold font-['Manrope'] text-[#93000a] dark:text-[#ffb4ab]">
            {rejected}
          </div>
          <span className="text-xs text-[var(--text-sub)] mt-2 block">
            High risk threshold
          </span>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Approval Rate
            </span>
            <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">
              query_stats
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[var(--text-main)]">
            {approvalRate}%
          </div>
          <span className="text-xs text-[var(--text-sub)] mt-2 block">
            Overall acceptance ratio
          </span>
        </div>
      </div>

      {/* Audit History Table Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--card-border)]">
          <div>
            <h3 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)]">
              Application History Log
            </h3>
            <p className="text-xs text-[var(--text-sub)] mt-0.5">
              Comprehensive audit trail of recent loan evaluations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-[var(--text-muted)]">
                search
              </span>
              <input
                type="text"
                placeholder="Search applicant or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[var(--card-sub-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C49A24] dark:focus:border-[#d4af37] transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="py-2 px-3 bg-[var(--card-sub-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C49A24] dark:focus:border-[#d4af37]"
            >
              <option value="all">All Verdicts</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-[var(--text-muted)] hover:text-[#93000a] dark:hover:text-[#ffb4ab] px-3 py-2 border border-[var(--card-border)] rounded-xl transition-colors"
                title="Clear history"
              >
                Clear Log
              </button>
            )}
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-sub)]">
            <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] mb-2">
              folder_off
            </span>
            <p className="text-sm font-medium">No matching prediction records found.</p>
            <Link
              href="/predict"
              className="mt-4 inline-block text-xs font-semibold text-[#C49A24] dark:text-[#f2ca50] hover:underline"
            >
              Submit a new application →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-sub)]">
              <thead className="bg-[var(--card-sub-bg)] text-[var(--text-muted)] font-semibold uppercase tracking-wider border-b border-[var(--card-border)]">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Income ($)</th>
                  <th className="py-3 px-4">Loan Amount</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Credit History</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {filteredHistory.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[var(--card-sub-bg)]/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--text-main)]">
                      {record.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--text-main)]">
                      {record.applicant_name || "Applicant"}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      ${record.income.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      ${record.loan_amount.toLocaleString()}k
                    </td>
                    <td className="py-3 px-4">{record.property_area}</td>
                    <td className="py-3 px-4">
                      {record.credit_history === 1 ? (
                        <span className="text-[#C49A24] dark:text-[#f2ca50] font-medium">Good (1.0)</span>
                      ) : (
                        <span className="text-[#93000a] dark:text-[#ffb4ab] font-medium">Bad (0.0)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          record.status === "approved"
                            ? "bg-[#C49A24]/15 text-[#C49A24] dark:text-[#f2ca50] border border-[#C49A24]/30"
                            : "bg-[#93000a]/15 text-[#93000a] dark:text-[#ffb4ab] border border-[#93000a]/30"
                        }`}
                      >
                        {record.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[var(--text-main)]">
                      {record.confidence ? `${record.confidence}%` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
