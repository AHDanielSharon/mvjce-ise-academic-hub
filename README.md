# ISE Nexus – Intelligent Academic Operating System (MVJCE ISE)

A production-ready full-stack departmental platform with role-based experiences for Students, Teachers, Lab Instructors, Department Admin, and HOD.

## Repository Structure

```
/backend
/frontend
package.json
render.yaml
README.md
```

## Core Capabilities
- Smart timetable for ISE 4A and ISE 4B (today + weekly grid, current/next class, breaks, room numbers)
- Saturday policy engine: odd Saturdays holiday, even Saturdays map to configurable weekday
- Subject knowledge hub, notes/resource library, assignment lifecycle, ADA lab repository
- Role-aware dashboards and analytics (student/teacher/lab instructor/admin/HOD)
- Collaborative doubt forum with helpful answer highlighting
- Notification center for announcements/resources/assignments
- Faculty directory, smart search, internal marks tracker
- PWA install support with **Install App** button and manifest/service worker

## Tech Stack
- Frontend: React + Vite + TailwindCSS + React Router + Axios
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas
- Auth: JWT + role-based authorization

## Render Deployment
`render.yaml` is preconfigured:
- Build: `npm install && npm run build`
- Start: `node backend/src/server.js`

Set env vars in Render:
- `MONGO_URI`
- `JWT_SECRET`

## Local Setup
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=<mongodb_atlas_uri>
JWT_SECRET=<strong_secret>
NODE_ENV=development
```

Seed (official sample users and real timetable structure):
```bash
npm run seed --prefix backend
```

Run:
```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

## Build Validation Commands
```bash
npm install
npm run build
npm start
```
