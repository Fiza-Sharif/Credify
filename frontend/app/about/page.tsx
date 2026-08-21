export default function AboutPage() {
  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-16 py-12 animate-pageEnter">
      <section className="mb-12 border-b border-[var(--card-border)] pb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-['Manrope'] text-[var(--text-main)]">
          Institutional Credit Intelligence
        </h1>
        <p className="text-base text-[var(--text-sub)] mt-2 max-w-2xl">
          Empowering loan officers and applicant evaluation teams with transparent, data-driven Machine Learning classification models.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-['Manrope'] text-[#C49A24] dark:text-[#f2ca50]">
            Our Technology Stack
          </h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            Credify integrates modern frontend user experiences built with Next.js and Tailwind CSS alongside high-performance Python FastAPI backend services. Machine Learning pipelines are trained on empirical data using Scikit-Learn.
          </p>

          <ul className="space-y-3 text-sm text-[var(--text-main)]">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">check_circle</span>
              Next.js App Router & Client Components
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">check_circle</span>
              FastAPI RESTful Backend with Pydantic Validation
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">check_circle</span>
              K-Nearest Neighbors (KNN) Classifier Model
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#C49A24] dark:text-[#f2ca50]">check_circle</span>
              StandardScaler & Missing Value Imputation
            </li>
          </ul>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl flex flex-col justify-center shadow-sm">
          <h3 className="text-xl font-bold font-['Manrope'] text-[var(--text-main)] mb-4">
            Underwriting Standards
          </h3>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed mb-6">
            By removing human bias and applying consistent statistical normalization, Credify helps streamline loan approval workflows while maintaining rigorous financial prudence.
          </p>
          <div className="p-4 bg-[var(--card-sub-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-muted)]">
            Model Version: v1.0-knn-k7 | Training Dataset: Loan Prediction (train.csv)
          </div>
        </div>
      </div>
    </main>
  );
}
