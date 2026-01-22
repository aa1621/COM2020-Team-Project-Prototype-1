import AppLayout from "../layouts/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page heading */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Hi Flynn 👋</h1>
          <p className="text-sm text-gray-600">
            Here’s your sustainability progress so far.
          </p>
        </header>

        {/* Chart card */}
        <section className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-green-200/70" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Your carbon journey
              </h2>
              <p className="text-xs text-gray-500">
                Last 7 days • Estimated from logged actions
              </p>
            </div>
          </div>

          {/* Chart placeholder (swap later for Recharts/Chart.js) */}
          <div className="h-64 rounded-xl bg-gradient-to-b from-green-200/40 to-transparent" />

          <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                Date: last 7 days
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                Category: all
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">
                Confidence: Medium
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Estimates can vary by context.</span>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
