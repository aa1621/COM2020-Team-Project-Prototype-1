import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getUserLeaderboards } from "../api/leaderboards";
import { getDemoUser } from "../auth/demoAuth";
import type { UserLeaderboardEntry } from "../api/types";

type Scope = "all" | "group";

export default function LeaderboardsPage() {
  // main data list + UI flags
  const [entries, setEntries] = useState<UserLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true); // show spinner text
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("all"); // all users vs my group
  const user = useMemo(() => getDemoUser(), []); // cached user read

  useEffect(() => {
    // refresh list when scope changes (all users vs my group)
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // if "My group" is selected, pass group_id to backend
        const groupId = scope === "group" ? user?.group_id || undefined : undefined;
        const res = await getUserLeaderboards(groupId);
        // backend returns { leaderboards: [] }
        setEntries(res.leaderboards || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboards.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [scope, user]);

  return (
    <PageShell title="Leaderboards" subtitle="See who is leading on points.">
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-medium text-gray-900">Member leaderboard</div>
          <div className="flex gap-2">
            <button
              onClick={() => setScope("all")}
              className={`rounded-full px-3 py-1 text-xs ${
                scope === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              All users
            </button>
            <button
              onClick={() => setScope("group")}
              className={`rounded-full px-3 py-1 text-xs ${
                scope === "group" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
              }`}
              disabled={!user?.group_id}
            >
              My group
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="mt-4 text-sm text-gray-600">Loading leaderboard...</div>}

        {!loading && !error && (
          <div className="mt-4 space-y-2">
            {entries.length === 0 && (
              <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
                No leaderboard entries yet.
              </div>
            )}
            {entries.map((entry, index) => {
              // highlight the current user in the list
              const isMe = user?.user_id === entry.user_id;
              const displayName = entry.display_name || entry.username;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center justify-between rounded-xl p-3 ${
                    isMe ? "bg-green-50 border border-green-100" : "bg-white"
                  }`}
                >
                  <div>
                    <div className="text-sm text-gray-800">
                      {index + 1}. {displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.group_name || "No group"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{entry.points} pts</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
