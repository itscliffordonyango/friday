const API_BASE = "http://127.0.0.1:5000/api";

export const fetchMedia = async () => {
  const response = await fetch(`${API_BASE}/media/`);

  if (!response.ok) {
    throw new Error("Failed to fetch media");
  }

  return await response.json();
};