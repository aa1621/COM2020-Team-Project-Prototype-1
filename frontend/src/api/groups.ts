import { apiFetch } from "./client";
import type { GroupsListResponse, JoinGroupResponse } from "./types";

export function getGroups() {
  return apiFetch<GroupsListResponse>("/groups");
}

export function joinGroup(group_id: string | null, demoUserId: string) {
  return apiFetch<JoinGroupResponse>("/groups/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": demoUserId,
    },
    body: JSON.stringify({ group_id }),
  });
}
