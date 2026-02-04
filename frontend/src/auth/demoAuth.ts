export type DemoUser = {
  user_id: string;
  username: string;
  display_name: string | null;
  role: string | null;
  group_id: string | null;
};

const STORAGE_KEY = "demo_user";

export function setDemoUser(user: DemoUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getDemoUser(): DemoUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function getDemoUserId(): string | null {
  return getDemoUser()?.user_id || null;
}

export function clearDemoUser() {
  localStorage.removeItem(STORAGE_KEY);
}
