# DevOps Command Center

## Project Goal

Build a DevOps learning application that runs on web, Android phones, and iPhones.

The first version will be a Progressive Web App, also called a PWA. This means one web application can be opened in a browser and installed on mobile devices from the browser.

## Main Learning Areas

- Linux commands
- Git and GitHub
- Docker and Docker Compose
- Node.js backend APIs
- React frontend
- PostgreSQL database
- EC2 deployment
- Nginx reverse proxy
- CI/CD with GitHub Actions

## Planned Services

- Frontend service: user interface for web and mobile
- Backend API service: handles app data and business logic
- Database service: stores commands, notes, and learning progress
- Reverse proxy service: routes traffic in production
- CI/CD service: automates testing and deployment later

## Current Progress

- Created project folder at `/home/pc-sam/devops-command-center`
- Created `PROJECT_NOTES.md`
- Initialized Git repository on branch `main`
- Created React frontend with Vite
- Created Node.js backend with Express
- Added backend `/health` route with database status
- Added backend `/api/commands` route
- Added backend `POST /api/commands` route
- Added backend `PUT /api/commands/:id` route
- Added backend `DELETE /api/commands/:id` route
- Connected frontend to backend commands API
- Added frontend create, edit, and delete controls
- Added frontend category dropdown
- Confirmed frontend runs on `http://localhost:5173`
- Confirmed backend runs on `http://localhost:4000`
- Added frontend environment variable support with `VITE_API_BASE_URL`
- Added Dockerfiles for frontend and backend
- Added Docker Compose for frontend, backend, and PostgreSQL
- Added persisted PostgreSQL volume named `postgres_data`

## Local Run Commands

Start the full stack:

```bash
docker compose up --build
```

Stop the full stack:

```bash
docker compose down
```

## Next Steps

- Add category filtering on the frontend
- Add production deployment documentation
- Add GitHub Actions CI for frontend lint/build and backend Docker build
