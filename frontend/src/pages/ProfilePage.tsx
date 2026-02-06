import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getGroups } from "../api/groups";
import { getDemoUser } from "../auth/demoAuth";
import type { Group } from "../api/types";

export default function ProfilePage() {
  // local fetch for group name + counts
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true); // keep simple for now
  const [error, setError] = useState<string | null>(null);
  const user = useMemo(() => getDemoUser(), []); // grab from localStorage

  useEffect(() => {
    // small fetch to pull groups so we can show the name and member count
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getGroups();
        setGroups(res.groups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // match group id -> group object for display
  const group = useMemo(() => {
    if (!user?.group_id) return null;
    return groups.find((g) => g.group_id === user.group_id) || null;
  }, [groups, user]);

  return (
    <PageShell title="Profile / Settings" subtitle="Manage your account and preferences.">
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!user && (
          <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
            Please log in to view your profile.
          </div>
        )}

        {user && (
          <div className="space-y-4">
            <div>
              {/* basic user info (all from localStorage demo auth) */}
              <div className="text-xs uppercase tracking-wide text-gray-500">Account</div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <div className="text-xs text-gray-500">Display name</div>
                  <div className="text-sm text-gray-900">
                    {user.display_name || "Not set"}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-xs text-gray-500">Username</div>
                  <div className="text-sm text-gray-900">{user.username}</div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="text-sm text-gray-900">{user.role || "Member"}</div>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-xs text-gray-500">User ID</div>
                  <div className="text-sm text-gray-900 break-all">{user.user_id}</div>
                </div>
              </div>
            </div>

            <div>
              {/* group info is looked up from the groups list */}
              <div className="text-xs uppercase tracking-wide text-gray-500">Group</div>
              <div className="mt-2 rounded-xl bg-white p-4">
                {loading && <div className="text-sm text-gray-600">Loading group...</div>}
                {!loading && group && (
                  <div>
                    <div className="text-sm text-gray-900">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      {group.type || "Society"} · {group.member_count || 0} members
                    </div>
                  </div>
                )}
                {!loading && !group && (
                  <div className="text-sm text-gray-700">No group joined yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
