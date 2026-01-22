import { useState } from "react";
import PageShell from "../components/PageShell";

type Tab = "Group challenges" | "Personal challenges";
type TimeFilter = "Daily" | "Weekly" | "Monthly" | "Seasonal";

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("Group challenges");
  const [time, setTime] = useState<TimeFilter>("Weekly");

  return (
    <PageShell
      title="Challenges"
      subtitle="Complete challenges to earn points (and unlock SDG characters later)."
      right={
        tab === "Personal challenges" ? (
          <select
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value as TimeFilter)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Seasonal</option>
          </select>
        ) : null
      }
    >
      <div className="flex gap-2">
        {(["Group challenges", "Personal challenges"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm space-y-4">
        {tab === "Group challenges" && (
          <>
            <div className="text-sm font-medium text-gray-900">This week’s society challenge</div>
            <div className="rounded-xl bg-white p-4 space-y-2">
              <div className="text-sm text-gray-800">Active travel week</div>
              <div className="text-xs text-gray-500">Goal: 200 km cycled across members</div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-2/3 bg-green-400" />
              </div>
              <button className="mt-2 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white">
                View / Contribute (demo)
              </button>
            </div>
          </>
        )}

        {tab === "Personal challenges" && (
          <>
            <div className="text-sm font-medium text-gray-900">
              Personal challenges • {time}
            </div>
            <div className="rounded-xl bg-white p-4 space-y-2">
              <div className="text-sm text-gray-800">Log 3 low-carbon actions</div>
              <div className="text-xs text-gray-500">Progress: 1 / 3</div>
              <button className="mt-2 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white">
                Start (demo)
              </button>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
