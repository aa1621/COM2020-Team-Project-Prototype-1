import { apiFetch } from "./client";
import type { GroupsListResponse, JoinGroupResponse } from "./types";

export function getGroups() {
  // simple list of all groups (used by groups page + profile page)
  return apiFetch<GroupsListResponse>("/groups");
}

export function joinGroup(group_id: string | null, demoUserId: string) {
  // group_id null = leave group
  return apiFetch<JoinGroupResponse>("/groups/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": demoUserId,
    },
    body: JSON.stringify({ group_id }),
  });
}
