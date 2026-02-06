import { apiFetch } from "./client";
import type { UserLeaderboardsResponse } from "./types";

export function getUserLeaderboards(groupId?: string) {
  const params = new URLSearchParams();
  if (groupId) params.set("group_id", groupId);
  const suffix = params.toString() ? `?${params.toString()}` : "";

  return apiFetch<UserLeaderboardsResponse>(`/leaderboards/users${suffix}`);
}
