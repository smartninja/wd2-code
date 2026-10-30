import type { Recipe } from "./types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type RecipeInput = { name: string; tag: string; servings: number | null };

// The backend hands us a readable XSRF-TOKEN cookie. We echo it back in a header
// on every write, which proves the request came from our own app and not a
// malicious cross-site page (a cross-site page can't read the cookie). That's the
// price of using cookies for auth — and it's a price worth paying.
function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeHeaders() {
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": getCookie("XSRF-TOKEN"),
  };
}

export async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API}/api/recipes`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load recipes");
  return res.json();
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const res = await fetch(`${API}/api/recipes`, {
    method: "POST",
    credentials: "include",
    headers: writeHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export async function updateRecipe(
  id: number,
  input: RecipeInput,
): Promise<Recipe> {
  const res = await fetch(`${API}/api/recipes/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: writeHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API}/api/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: writeHeaders(),
  });
  if (!res.ok) throw new Error("Delete failed");
}
