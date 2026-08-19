QC Frontend (Vite + React + TypeScript + Tailwind)

This repository contains a frontend scaffold for the QC application described in prompt-frontend-agent.md.

Quick start (local development):

1. Install dependencies
   - cd frontend
   - npm install

2. Run dev server:
   - npm run dev
   - open the Vite dev URL (default http://localhost:5173)

Environment variables
 - VITE_API_BASE_URL: Base URL of the backend API used by the frontend. Defaults to http://localhost:4000/api/v1
   Example (Linux/macOS): export VITE_API_BASE_URL=http://localhost:4000/api/v1
   Example (Windows PowerShell): $env:VITE_API_BASE_URL = "http://localhost:4000/api/v1"

Docker (multi-stage build + nginx):

- Build and run with docker compose (this compose file includes placeholder `api` and `db` services; update the `api` service image to your backend image or run your backend separately and set VITE_API_BASE_URL accordingly):

  docker compose up --build

- Frontend will be available at http://localhost:3000 (nginx). Inside the compose network the frontend uses VITE_API_BASE_URL=http://api:4000/api/v1 by default.

What is included
- React 18 + Vite + TypeScript
- TailwindCSS
- React Router routes for the 9 QC screens
- Basic AuthProvider (in-memory access token + refresh best-effort)
- Axios API client with automatic Idempotency-Key header and postWithIdempotency helper
- Offline queue (localforage) with FormData/file serialization and replay on reconnect
- Example implementations of pages: Incoming inspection (multipart upload), In-process readings, Alerts (polling), Final inspection & Decision, NCR tracking, Dashboard & Reports
- Dockerfile (multi-stage build) and docker-compose.yml with a frontend service

Role-based UI
- AuthProvider reads `role` from login response (if provided) and Layout shows supervisor/admin links when role === 'supervisor' or 'admin'. Adjust to match backend role values.

Validation checklist (manual)
- [ ] npm install and npm run dev: app starts in dev mode and pages load
- [ ] Login: POST /login must return { accessToken, role } or { token, role }
- [ ] Incoming inspection: POST /lots/:id/incoming-inspection accepts multipart uploads
- [ ] Offline: go offline and submit incoming inspection -> queued in localforage, reconnect -> queued item is replayed
- [ ] Alerts: GET /alerts available; acknowledge/stop-line/escalate endpoints exist
- [ ] Dashboard: GET /dashboard/summary available and auto-refreshes
- [ ] Docker: docker compose up --build brings up frontend; confirm frontend at http://localhost:3000

Notes & next steps
 - This scaffold implements many core features; remaining improvements include stronger token refresh flow aligned with backend, UX polish for mobile/tablet, and form-level validation and unit tests.
 - For large file uploads, consider compressing or storing Blobs directly to avoid base64 bloat in the offline queue.
