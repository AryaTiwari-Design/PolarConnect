const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("polarconnect_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.error || "Request failed");
  }
  return data;
}

export const authApi = {
  login: (payload) => api("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => api("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => api("/auth/me"),
};

export const researchApi = {
  list: (params = {}) => api(`/research?${new URLSearchParams(params)}`),
  create: (payload) => api("/research", { method: "POST", body: JSON.stringify(payload) }),
  pending: () => api("/admin/research/pending"),
  approve: (id) => api(`/admin/research/${id}/approve`, { method: "POST" }),
  reject: (id) => api(`/admin/research/${id}/reject`, { method: "POST" }),
};

export const chatApi = {
  ask: (question) => api("/chat", { method: "POST", body: JSON.stringify({ question }) }),
  history: () => api("/chat/history"),
};

export const stationApi = {
  list: () => api("/stations"),
};

export const educationApi = {
  lessons: () => api("/education"),
  quiz: (id) => api(`/quizzes/${id}`),
  submit: (id, answers) => api(`/quizzes/${id}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
  progress: () => api("/users/me/progress"),
};
