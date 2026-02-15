import { apiFetch } from "./client";
import type { DecideSubmissionResponse, ModerationQueueResponse } from "./types";

type ModeratorRole = "moderator" | "maintainer";

export function getModerationQueue(
  demoUserId: string,
  role: ModeratorRole,
  options: { status?: string; limit?: number } = {}
) {
  const params = new URLSearchParams();
  if (options.status) params.set("status", options.status);
  if (options.limit) params.set("limit", String(options.limit));
  const suffix = params.toString() ? `?${params.toString()}` : "";

  return apiFetch<ModerationQueueResponse>(`/moderation/queue${suffix}`, {
    headers: {
      "x-user-id": demoUserId,
      "x-user-role": role,
    },
  });
}

export function decideSubmission(
  submissionId: string,
  decision: "approve" | "reject",
  demoUserId: string,
  role: ModeratorRole,
  reason?: string
) {
  return apiFetch<DecideSubmissionResponse>(
    `/moderation/submissions/${submissionId}/decision`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": demoUserId,
        "x-user-role": role,
      },
      body: JSON.stringify({
        decision,
        reason: reason?.trim() ? reason.trim() : null,
      }),
    }
  );
}
