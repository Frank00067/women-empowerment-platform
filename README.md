## Women Empowerment Platform

Digital learning and career development platform to empower young African women with essential digital skills (Microsoft Word, Excel, digital literacy), CV/resume preparation, and job‑readiness tools.


This project is split into:
- **server** – Node.js/Express TypeScript API (auth, courses, progress, certificates, resources)
- **client** – React + Vite + TypeScript frontend

---

### 1. Prerequisites

- **Node.js** (LTS, e.g. 18+), which also installs `npm`
- **Git** (for pushing to GitHub, optional for local runs)

Verify:

```bash
node -v
npm -v
```

---

### 2. Backend (server) – Run locally

From the project root:

```bash
cd "server"
npm install
npm run dev
```

The API will start at `http://localhost:4000`.

#### Environment variables

`server/.env`:

```env
JWT_SECRET=super-secret-key
PORT=4000
```

You can change `JWT_SECRET` and `PORT` as needed.

---

### 3. Frontend (client) – Run locally

In a **second terminal**, keep the server running and then:

```bash
cd "client"
npm install
npm run dev
```

Vite will show a URL like:

```text
http://localhost:5173/
```

Open this in your browser to use the app.

The frontend is configured in `vite.config.ts` to proxy `/api` calls to the backend during local development.

---

### 4. Main features

- **Authentication**
  - Email/password registration and login
  - JWT‑based auth with role support: `learner` and `admin`
- **Digital skills modules**
  - Courses for Word, Excel, digital skills, and career topics
  - Admin can create/update/delete courses and lessons (via API)
  - Learner progress tracking and automatic completion detection
- **Career tools**
  - CV/Resume builder with guided fields and live preview
- **Dashboards**
  - Learner dashboard: course progress and earned certificates
  - Admin dashboard: users, courses, certificates stats
- **Certificates**
  - Certificate record automatically created when all lessons in a course are completed
- **Mentorship & resources**
  - Mentorship resources (PDFs, links, videos) managed by admin, visible to learners

---

### 5. Important directories

- `server/src`
  - `app.ts` – Express app configuration and route mounting
  - `server.ts` – HTTP server entry
  - `routes/` – auth, courses, dashboard, resources APIs
  - `middleware/authMiddleware.ts` – JWT auth and role checks
  - `models.ts` / `store.ts` – data models and in‑memory store
- `client/src`
  - `App.tsx` – routing and layout
  - `context/AuthContext.tsx` – auth state and API calls
  - `pages/` – landing, login, register, dashboards, courses, CV builder, mentorship, certificates
  - `components/ProtectedRoute.tsx` – route guarding by auth/role
  - `styles.css` – global styles and responsive layout

---

### 6. Basic usage flow

1. **Start backend**: `cd server && npm run dev`
2. **Start frontend**: `cd client && npm run dev`
3. In the browser:
   - Open `http://localhost:5173`
   - Click **Get Started** → **Register** to create a learner account
   - Log in to access learner dashboard, courses, CV builder, mentorship and certificates
4. (Optional) Use Postman/HTTP client as an admin to:
   - Create courses via `POST /api/courses`
   - Add mentorship resources via `POST /api/resources`

---



