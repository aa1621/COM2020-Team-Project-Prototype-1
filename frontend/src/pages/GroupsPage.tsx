import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getGroups, joinGroup } from "../api/groups";
import { getDemoUser, setDemoUser } from "../auth/demoAuth";
import type { Group } from "../api/types";

type Tab = "Invites" | "My groups" | "Find group" | "Send invite";

export default function GroupsPage() {
  // tabs UI state - keep basic for now
  const [tab, setTab] = useState<Tab>("My groups");
  const tabs: Tab[] = ["My groups", "Find group", "Invites", "Send invite"];

  // data + UI flags
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true); // true while we fetch groups list
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState<string | null>(null); // group id being joined
  const [user, setUser] = useState(() => getDemoUser()); // read once at start

  useEffect(() => {
    // initial page load: fetch all groups for list + current group lookup
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getGroups();
        // backend returns { groups: [] }, just drop into state
        setGroups(res.groups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // pull user's current group from loaded group list
  const currentGroup = useMemo(() => {
    if (!user?.group_id) return null;
    return groups.find((group) => group.group_id === user.group_id) || null;
  }, [groups, user]);

  const filteredGroups = useMemo(() => {
    // simple client-side filter so we don't hit backend on every keypress
    const term = search.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((group) => group.name.toLowerCase().includes(term));
  }, [groups, search]);

  async function handleJoin(groupId: string | null) {
    // groupId === null means "leave group"
    if (!user) {
      setError("Please log in before joining a group.");
      return;
    }

    setJoining(groupId || "leave"); // used to disable the button + change label
    setError(null);
    try {
      // NOTE: this updates the user record with group_id on backend
      const res = await joinGroup(groupId, user.user_id);
      setDemoUser(res.user);
      setUser(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update group.");
    } finally {
      setJoining(null);
    }
  }

  return (
    <PageShell title="Groups" subtitle="Join societies, manage invites, and build community.">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
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

      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="text-sm text-gray-600">Loading groups...</div>}

        {!loading && tab === "My groups" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Your group</div>
            {currentGroup ? (
              <div className="rounded-xl bg-white p-4">
                <div className="text-sm text-gray-800">{currentGroup.name}</div>
                <div className="text-xs text-gray-500">
                  {currentGroup.type || "Society"} · {currentGroup.member_count || 0} members
                </div>
                <button
                  onClick={() => handleJoin(null)}
                  className="mt-3 rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-800"
                  disabled={joining === "leave"}
                >
                  {joining === "leave" ? "Leaving..." : "Leave group"}
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
                You are not in a group yet. Head to "Find group" to join one.
              </div>
            )}
          </div>
        )}

        {!loading && tab === "Find group" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Find a group</div>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Search societies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-2">
              {filteredGroups.length === 0 && (
                <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
                  No groups match your search.
                </div>
              )}
              {filteredGroups.map((group) => {
                const isCurrent = user?.group_id === group.group_id;
                return (
                  <div key={group.group_id} className="rounded-xl bg-white p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-800">{group.name}</div>
                      <div className="text-xs text-gray-500">
                        {group.type || "Society"} · {group.member_count || 0} members
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoin(group.group_id)}
                      className={`rounded-xl px-3 py-2 text-xs ${
                        isCurrent ? "bg-gray-200 text-gray-700" : "bg-gray-900 text-white"
                      }`}
                      disabled={isCurrent || joining === group.group_id}
                    >
                      {isCurrent ? "Current" : joining === group.group_id ? "Joining..." : "Join"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && tab === "Invites" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Pending invites</div>
            <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
              Invites are not wired up yet.
            </div>
          </div>
        )}

        {!loading && tab === "Send invite" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Send an invite</div>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Search for a user (name or email)..."
            />
            <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <option>Invite to... (choose a society you are in)</option>
              {currentGroup && <option>{currentGroup.name}</option>}
            </select>
            <button className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white">
              Send invite (demo)
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
