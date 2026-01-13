# CampusPapers

A MERN + FastAPI microservices app for uploading and browsing past year question papers with AI authenticity checks.

## Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose) + Cloudinary
- AI Service: FastAPI (Python)
- Auth: JWT + bcrypt

## Monorepo Structure

campuspapers/
- backend/
- ai-service/
- frontend/

## Backend: Scripts

- install: npm install
- dev: npm run dev
- start: npm start

## AI Service: Scripts

- create venv and install: pip install -r requirements.txt
- run: uvicorn app:app --host 0.0.0.0 --port 8000 --reload

## Frontend: Scripts

- install: npm install
- dev: npm run dev
- build: npm run build
- preview: npm run preview

## API Overview

- Auth
  - POST /api/auth/signup
  - POST /api/auth/login
- Papers
  - GET /api/papers
  - POST /api/papers/upload (auth)
  - GET /api/papers/:id
  - PUT /api/papers/:id (owner)
  - DELETE /api/papers/:id (owner)
  - POST /api/papers/:id/view
- Admin
  - GET /api/admin/papers (admin)
  - PUT /api/admin/papers/:id/approve (admin)
  - PUT /api/admin/papers/:id/reject (admin)
- Leaderboard
  - GET /api/leaderboard?type=uploads
  - GET /api/leaderboard?type=views
  - GET /api/badges/:userId

## Features

- 🔐 User authentication (Signup/Login)
- 📄 Paper upload with AI authenticity checking
- 🏆 Badge system and achievements
- 📊 Leaderboard (Top Contributors & Most Popular)
- 👥 Admin panel for paper approval

## Quick Start

- Backend: copy backend/.env.example to .env and fill values, then npm i && npm run dev
- AI Service: copy ai-service/.env.example to .env, create venv, pip install -r requirements.txt, run uvicorn
- Frontend: copy frontend/.env.example to .env, npm i && npm run dev
