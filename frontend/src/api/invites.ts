import { apiFetch } from "./client";
import type {
  CreateInviteRequest,
  CreateInviteResponse,
  ListInvitesResponse,
  RespondToInviteResponse,
} from "./types";

export function getInvites(demoUserId: string) {
  return apiFetch<ListInvitesResponse>("/invites", {
    headers: {
      "x-user-id": demoUserId,
    },
  });
}

export function respondToInvite(
  inviteId: string,
  decision: "accept" | "decline",
  demoUserId: string
) {
  return apiFetch<RespondToInviteResponse>(`/invites/${inviteId}/respond`, {
    method: "POST",
    headers: {
      "x-user-id": demoUserId,
    },
    body: JSON.stringify({ decision }),
  });
}

export function createInvite(
  groupId: string,
  payload: CreateInviteRequest,
  demoUserId: string
) {
  return apiFetch<CreateInviteResponse>(`/groups/${groupId}/invites`, {
    method: "POST",
    headers: {
      "x-user-id": demoUserId,
    },
    body: JSON.stringify(payload),
  });
}
