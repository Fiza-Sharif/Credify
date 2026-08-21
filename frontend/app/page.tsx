import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";

export default function HomePage() {
  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 border-b border-[var(--card-border)]">
        <div className="flex-1 space-y-6 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-bold font-['Manrope'] tracking-tight leading-tight text-[var(--text-main)]">
            Precision Wealth &amp; <span className="text-[#C49A24] dark:text-[#f2ca50] transition-colors duration-300">Smart Loan</span> Decisions
          </h1>
          <p className="text-lg text-[var(--text-sub)] leading-relaxed max-w-xl">
            Evaluate loan eligibility instantly using our trained K-Nearest Neighbors (KNN) classification model. Standardized feature preprocessing and statistical scoring deliver unbiased risk intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/predict"
              className="bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-base px-8 py-4 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-3 group"
            >
              Start Loan Prediction
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/how-it-works"
              className="border border-[var(--card-border)] hover:border-[#C49A24] dark:hover:border-[#d4af37] text-[var(--text-sub)] hover:text-[#C49A24] dark:hover:text-[#f2ca50] font-medium text-base px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Visual Hero Card */}
        <div className="flex-1 w-full max-w-lg bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 hover:-translate-y-1">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--card-border)]">
            <div>
              <div className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider">Active Model</div>
              <div className="text-lg font-bold text-[#C49A24] dark:text-[#f2ca50] font-['Manrope']">
                KNN Classifier (K=7)
              </div>
            </div>
            <span className="material-symbols-outlined text-2xl text-[#C49A24] dark:text-[#f2ca50] transition-transform duration-300 hover:scale-110">
              account_balance
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3.5 bg-[var(--card-sub-bg)] rounded-xl border border-[var(--card-border)] transition-colors duration-300 hover:border-[#C49A24]/30">
              <span className="text-sm text-[var(--text-sub)]">Test Set Accuracy</span>
              <span className="font-mono text-sm text-[#C49A24] dark:text-[#f2ca50] font-bold">
                78.86%
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-[var(--card-sub-bg)] rounded-xl border border-[var(--card-border)] transition-colors duration-300 hover:border-[#C49A24]/30">
              <span className="text-sm text-[var(--text-sub)]">Feature Normalization</span>
              <span className="font-mono text-sm text-[var(--text-main)]">StandardScaler</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-[var(--card-sub-bg)] rounded-xl border border-[var(--card-border)] transition-colors duration-300 hover:border-[#C49A24]/30">
              <span className="text-sm text-[var(--text-sub)]">Input Features</span>
              <span className="font-mono text-sm text-[var(--text-main)]">11 Core Variables</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid with Scroll Reveal */}
      <section className="py-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#C49A24]/10 dark:bg-[#d4af37]/10 text-[#C49A24] dark:text-[#f2ca50] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-2xl">database</span>
              </div>
              <h3 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)] mb-2 group-hover:text-[#C49A24] dark:group-hover:text-[#f2ca50] transition-colors">
                Real Dataset Training
              </h3>
              <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                Trained on authentic historical loan records (`train.csv`), utilizing median numerical imputation and categorical mode filling.
              </p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#C49A24]/10 dark:bg-[#d4af37]/10 text-[#C49A24] dark:text-[#f2ca50] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-2xl">speed</span>
              </div>
              <h3 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)] mb-2 group-hover:text-[#C49A24] dark:group-hover:text-[#f2ca50] transition-colors">
                Instant Predictions
              </h3>
              <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                FastAPI microsecond inference pipelines process applicant profiles and return real-time approval or rejection verdicts.
              </p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#C49A24]/10 dark:bg-[#d4af37]/10 text-[#C49A24] dark:text-[#f2ca50] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <h3 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)] mb-2 group-hover:text-[#C49A24] dark:group-hover:text-[#f2ca50] transition-colors">
                Institutional Privacy
              </h3>
              <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                Applicant identification parameters (e.g. Loan_ID) are stripped prior to feature scaling to preserve strict privacy guarantees.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
