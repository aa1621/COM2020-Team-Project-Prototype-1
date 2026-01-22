import PageShell from "../components/PageShell";

export default function LeaderboardsPage() {
  return (
    <PageShell title="Leaderboards" subtitle="See top societies and members.">
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-900">Society leaderboard (placeholder)</div>
        <div className="mt-4 space-y-2">
          {["Eco Society", "Cycling Club", "Hiking Society"].map((name, i) => (
            <div key={name} className="flex items-center justify-between rounded-xl bg-white p-3">
              <span className="text-sm text-gray-800">{i + 1}. {name}</span>
              <span className="text-sm text-gray-600">{(120 - i * 15).toFixed(0)} pts</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
