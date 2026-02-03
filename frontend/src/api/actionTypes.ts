import { apiFetch } from "./client";
import type { GetActionTypesResponse } from "./types";

export function getActionTypes() {
  // backend comment says GET /action-types
  return apiFetch<GetActionTypesResponse>("/action-types");
}
