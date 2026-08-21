import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      <section className="mb-12 border-b border-[var(--card-border)] pb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-['Manrope'] text-[var(--text-main)]">
          How Credify Works
        </h1>
        <p className="text-base text-[var(--text-sub)] mt-2 max-w-2xl">
          Learn how our K-Nearest Neighbors (KNN) classification model processes applicant data from submission to verdict.
        </p>
      </section>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl relative shadow-sm hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Data Input</h3>
          <p className="text-sm text-[var(--text-sub)]">
            Applicant metrics (Income, Loan Amount, Credit History, Property Area) are submitted via the Next.js frontend form.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl relative shadow-sm hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Preprocessing</h3>
          <p className="text-sm text-[var(--text-sub)]">
            Missing values are filled using dataset medians and modes. Categorical attributes are encoded via get_dummies and scaled with StandardScaler.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl relative shadow-sm hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">KNN Classification</h3>
          <p className="text-sm text-[var(--text-sub)]">
            The trained KNN model calculates Euclidean distance metrics across historical training samples to assign the classification.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl relative shadow-sm hover:border-[#C49A24]/40 dark:hover:border-[#d4af37]/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold flex items-center justify-center mb-4">
            4
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Verdict Returned</h3>
          <p className="text-sm text-[var(--text-sub)]">
            FastAPI returns the formatted prediction JSON to Next.js, rendering either the Approved or Rejected result card instantly.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/predict"
          className="inline-flex items-center gap-3 bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-base px-10 py-4 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] transition-all hover:scale-105 active:scale-95"
        >
          Try Loan Predictor Now
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
