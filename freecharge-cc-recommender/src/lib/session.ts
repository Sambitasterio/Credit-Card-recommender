// Tiny sessionStorage helper to carry the built profile from the profiler /
// demo picker to the recommendation page (client-side only).

import type { UserProfile } from "@/lib/scorer";

const PROFILE_KEY = "ccProfile";
const DEMO_KEY = "ccDemoKey";

export function saveProfile(profile: UserProfile, demoKey?: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  if (demoKey) sessionStorage.setItem(DEMO_KEY, demoKey);
  else sessionStorage.removeItem(DEMO_KEY);
}

export function loadProfile(): {
  profile: UserProfile | null;
  demoKey: string | null;
} {
  if (typeof window === "undefined") return { profile: null, demoKey: null };
  const raw = sessionStorage.getItem(PROFILE_KEY);
  const demoKey = sessionStorage.getItem(DEMO_KEY);
  return {
    profile: raw ? (JSON.parse(raw) as UserProfile) : null,
    demoKey,
  };
}
