const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

// ---------- ADS ----------
export async function fetchAds() {
  const response = await fetch(`${API_BASE}/ads/`);
  if (!response.ok) throw new Error("Failed to fetch ads");
  return response.json();
}

// ---------- USERS ----------
export async function createUser(email: string) {
  const response = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}
