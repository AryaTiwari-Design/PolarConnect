# PolarConnect Frontend

React (Vite) + React Router + Tailwind CSS + Leaflet.

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

It starts in **demo mode** (`VITE_USE_MOCK=true` in `.env`): all data comes from `src/mocks/`, so you do not need the backend.

Demo accounts (password `ChangeMe123`): `student@`, `researcher@`, `admin@` + `polarconnect.test`.

## Connect the real backend

In `.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

Restart `npm run dev`. Nothing else changes: every page talks to the backend only through `src/services/`.

## Where things live

| Folder | What is inside |
| --- | --- |
| `src/pages/` | Home, Login, Register, Dashboard, Research, ResearchDetail, Search, Chat, Admin, Upload |
| `src/components/` | Navbar, Layout, ProtectedRoute, ChatUI, ResearchCard, StatusBadge, loading/empty/error states |
| `src/services/` | `api.js` (the only place that calls fetch), `auth.js`, `research.js`, `chat.js` |
| `src/context/` | `AuthContext.jsx` (login state, JWT in localStorage) |
| `src/modules/map/` | Antarctica map, station markers and popup, `services/stations.js` |
| `src/modules/education/` | Academy, lessons, quiz, XP bar, badges, `services/education.js` |
| `src/mocks/` | Demo data and the fake API (`mockServer.js`). Safe to delete once the backend is live |

## Response shapes the UI expects

Check these against `docs/api-contract.md` and change the services (not the pages) if they differ.

- `POST /auth/login`, `POST /auth/register` -> `{ token, user: { id, name, email, role } }`
- `GET /auth/me` -> `{ user }`
- `GET /research?q=&year=&category=&station=&limit=&mine=true` -> `{ items: [paper] }`
  paper: `{ id, title, authors, year, category, station, expedition, topic, abstract, pages, status }`
- `POST /research` (multipart: title, authors, year, category, station, expedition, topic, abstract, file)
- `GET /admin/research/pending` -> `{ items: [paper] }`
- `POST /chat { question }` -> `{ answer, sources: [{ paper_id, title, page }] }`
- `GET /chat/history` -> `{ items: [{ role, content, sources? }] }` (optional)
- `GET /stations` -> `{ items: [{ id, name, country, lat, lng, established, status, description, facts }] }`
- `GET /education` -> `{ items: [lesson] }`, lesson: `{ id, title, level, readMinutes, icon, summary, content[], quizId, completed, score, total }`
- `GET /quizzes/:id` -> `{ id, title, questions: [{ id, text, options }] }` (no answers)
- `POST /quizzes/:id/submit { answers: [index] }` -> `{ score, total, xpEarned, newBadges, results: [{ correct, correctIndex, explanation }], xp, level, levelStartXp, nextLevelXp }`
- `GET /users/me/xp` -> `{ xp, level, levelStartXp, nextLevelXp }`
- `GET /users/me/badges` -> `{ items: [{ id, name, icon, description, earned }] }`

Errors must look like `{ "error": "message" }`.

## Notes

- Map tiles load from OpenStreetMap, so the map needs an internet connection.
- The map uses the standard web projection, so Antarctica looks stretched. A polar projection (proj4leaflet, EPSG:3031) is a good Phase 3 upgrade.
- Role checks in the UI only hide pages. The backend must enforce access.
