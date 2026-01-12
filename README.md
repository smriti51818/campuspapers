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

## Environment Variables

Create `.env` files based on the samples below.

### backend/.env

- PORT=5000
- MONGO_URI=your_mongodb_atlas_connection_string
- JWT_SECRET=super_secret_string
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- AI_SERVICE_URL=http://127.0.0.1:8000
- CLIENT_URL=http://127.0.0.1:5173

### ai-service/.env

- ALLOW_ORIGINS=*

### frontend/.env

- VITE_API_BASE=http://127.0.0.1:5000

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
- 🎨 Gamified UI with interactive elements

## Quick Start

- Backend: copy backend/.env.example to .env and fill values, then npm i && npm run dev
- AI Service: copy ai-service/.env.example to .env, create venv, pip install -r requirements.txt, run uvicorn
- Frontend: copy frontend/.env.example to .env, npm i && npm run dev
