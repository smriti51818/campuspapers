# CampusPapers Backend

Express.js backend API for CampusPapers application.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173
```

For production, set `CLIENT_URL` to your frontend URL (e.g., `https://your-app.vercel.app`).

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/papers` - Get all papers
- `POST /api/papers/upload` - Upload a paper (auth required)
- `GET /api/papers/:id` - Get paper by ID
- `PUT /api/papers/:id` - Update paper (owner/admin)
- `DELETE /api/papers/:id` - Delete paper (owner/admin)
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/badges/:userId` - Get user badges

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

