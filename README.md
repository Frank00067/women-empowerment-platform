## Women Empowerment Platform

Digital learning and career development platform to empower young African women with essential digital skills (Microsoft Word, Excel, digital literacy), CV/resume preparation, and job‑readiness tools.

**Live demo:** [Women Empowerment Platform](https://Frank00067.github.io/women-empowerment-platform/)

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
SEED_DATA=true
DEFAULT_ADMIN_EMAIL=admin@demo.com
DEFAULT_ADMIN_PASSWORD=password123
```

You can change `JWT_SECRET` and `PORT` as needed.

#### Default admin (local dev)

When `SEED_DATA=true`, the server will automatically create an admin user (only if no admin exists yet):

- **Email**: `admin@demo.com`
- **Password**: `password123`

Log in from the frontend at `http://localhost:5173/login`, then open the admin dashboard at `http://localhost:5173/admin`.

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

### 7. Deploying frontend to GitHub Pages (step-by-step)

This project has a **frontend** (`client`) and a **backend** (`server`).

- **GitHub Pages deploys only the frontend** (static files).
- The backend must be hosted elsewhere (Render/Railway/VPS) if you want the deployed site to have login, courses, admin tools, etc.

#### Step A — Push your code to GitHub

In the project root:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Frank00067/women-empowerment-platform.git
git push -u origin main
```

#### Step B — Set Vite base path (required for GitHub Pages)

In `client/vite.config.ts` make sure you have:

```ts
base: "/women-empowerment-platform/"
```

#### Step C — Add GitHub Actions deploy workflow

Create this file in your repo:

`/.github/workflows/deploy-client.yml`

```yaml
name: Deploy client to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install and build client
        working-directory: client
        run: |
          npm install
          npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: client/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Commit and push:

```bash
git add .github/workflows/deploy-client.yml client/vite.config.ts
git commit -m "Deploy client to GitHub Pages"
git push
```

#### Step D — Enable Pages

In GitHub:

- Repo → **Settings** → **Pages**
- **Build and deployment** → Source: **GitHub Actions**

#### Step E — Check Actions and open your site

- Repo → **Actions** → wait for “Deploy client to GitHub Pages” to turn green.
- Your site will be available at:

Public URL (once Pages is enabled and workflow succeeds):

```text
https://Frank00067.github.io/women-empowerment-platform/
```

#### Common issue (important)

On GitHub Pages, your frontend cannot call `http://localhost:4000` (that only works on your computer).

If you want login/courses/admin tools to work on the live site, deploy the backend to a public host and then update the frontend to use that API base URL.

