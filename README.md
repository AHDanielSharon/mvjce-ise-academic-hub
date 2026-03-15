# MVJCE ISE 4th Semester Academic Hub

Production-ready full-stack monorepo for MVJCE ISE 4th semester academic workflows, including role-based authentication, smart timetable logic, assignment manager, notes library, ADA lab repository, announcements, internal marks, and smart search.

## Monorepo Structure

```
/backend
/frontend
package.json
render.yaml
README.md
```

## Tech Stack
- Frontend: React (Vite), TailwindCSS, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Auth: JWT + role-based access (Student / Teacher / Admin)

## Features Included
- Smart Timetable (ISE 4A/4B, current class, next class, break/lunch, odd/even Saturday rules with admin config)
- Subject Dashboard (notes, PPTs, PYQs, assignments, links, ADA lab programs)
- Notes Library (search + preview/download links)
- Assignment Manager (create, deadlines, submit, status)
- ADA Lab Repository (problem/program cards + code preview)
- Faculty Information board
- Announcement board
- Internal marks tracker with chart
- Smart search across subjects/resources/assignments/faculty
- Responsive dashboard UI + dark mode toggle

## Local Setup

### 1) Install dependencies
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2) Configure environment
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<strong_secret>
NODE_ENV=development
```

### 3) (Optional) Seed sample data
```bash
npm run seed --prefix backend
```
Sample users after seeding:
- admin@mvjce.edu.in / password123
- teacher@mvjce.edu.in / password123
- student@mvjce.edu.in / password123

### 4) Run
Backend:
```bash
npm run dev --prefix backend
```
Frontend:
```bash
npm run dev --prefix frontend
```

## Render Deployment (No Code Changes Required)
This repo already includes a compatible `render.yaml`:
- Build command: `npm install && npm run build`
- Start command: `node backend/src/server.js`

Set environment variables in Render dashboard:
- `MONGO_URI`
- `JWT_SECRET`

`NODE_ENV=production` is configured in `render.yaml`.

## Required Build Commands
The project supports:
```bash
npm install
npm run build
npm start
```

## API Highlights
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/timetable/today/:section`, `PUT /api/timetable/settings/saturday`
- `GET /api/subjects`, `GET /api/subjects/:id/dashboard`
- `GET/POST /api/assignments`, `POST /api/assignments/:id/submit`
- `GET/POST /api/announcements`
- `GET /api/marks/mine`, `POST /api/marks`
- `GET /api/resources`, `POST /api/resources`
- `GET /api/search?q=`

## Notes
- NSS is intentionally excluded.
- Backend gracefully starts even when `MONGO_URI` is missing (for build/runtime safety), but DB features require MongoDB Atlas.
