import { apiFetch } from "./client";
import type { CreateActionLogRequest, CreateActionLogResponse } from "./types";

export function createActionLog(body: CreateActionLogRequest, demoUserId: string) {
  return apiFetch<CreateActionLogResponse>("/actionLogs", {
    method: "POST",
    headers: {
      "x-user-id": demoUserId,
    },
    body: JSON.stringify(body),
  });
}
