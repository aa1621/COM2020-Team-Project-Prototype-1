import { apiFetch } from "./client";

export type LoginResponse = {
  user: {
    user_id: string;
    username: string;
    display_name: string | null;
    role: string | null;
    group_id: string | null;
  };
};

export function loginDemo(username: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
