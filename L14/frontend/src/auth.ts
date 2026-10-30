const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Me = { email: string; roles: string[] };

// Logging in sets a session cookie on the browser. There is nothing for us to
// store — no token in localStorage — the cookie *is* the login, and the browser
// sends it automatically on every request (with `credentials: "include"`).
export async function login(email: string, password: string) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
}

// Ask the server who we are. This still works after a full page refresh, because
// the session cookie outlives the React app's memory.
export async function getMe(): Promise<Me | null> {
  // Ask for JSON, so a logged-out visitor gets a 401 instead of a redirect
  // to the HTML login page.
  const res = await fetch(`${API}/api/me`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null; // 401 = not logged in
  return res.json();
}

export async function logout() {
  await fetch(`${API}/logout`, { method: "POST", credentials: "include" });
}
