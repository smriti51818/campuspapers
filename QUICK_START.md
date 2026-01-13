# Quick Start: Connect Frontend to Backend

## Step 1: Deploy Backend

Choose one of these platforms:

### Render (Easiest)
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables (see below)
6. Copy the URL (e.g., `https://campuspapers-backend.onrender.com`)

### Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Add environment variables
5. Copy the URL

## Step 2: Set Backend Environment Variables

Add these in your backend hosting platform:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-frontend.vercel.app
AI_SERVICE_URL=http://127.0.0.1:8000 (or your AI service URL)
```

**Important**: Replace `CLIENT_URL` with your actual Vercel frontend URL!

## Step 3: Update Frontend on Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add/Update:
   - Key: `VITE_API_BASE`
   - Value: `https://your-backend-url.onrender.com` (your backend URL)
4. Save and redeploy

## Step 4: Test Connection

1. Visit your frontend URL
2. Open browser console (F12)
3. Check Network tab for API calls
4. Test login/signup functionality

## Troubleshooting

- **CORS Error**: Make sure `CLIENT_URL` in backend matches your Vercel URL exactly
- **404 Errors**: Verify `VITE_API_BASE` is set correctly in Vercel
- **Connection Failed**: Check if backend is running and accessible

