# Deployment Guide

This guide will help you deploy the CampusPapers application with frontend on Vercel and backend on a hosting platform.

## Frontend (Vercel) - Already Deployed ✅

Your frontend is already deployed on Vercel. Make sure you have set the environment variable:
- `VITE_API_BASE` = Your backend URL (e.g., `https://your-backend.onrender.com`)

## Backend Deployment Options

### Option 1: Deploy on Render (Recommended)

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `campuspapers` repository
   - Set the following:
     - **Name**: `campuspapers-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables**
   Add these environment variables in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   AI_SERVICE_URL=your_ai_service_url (if deployed separately)
   CLIENT_URL=https://your-vercel-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your backend
   - Copy the service URL (e.g., `https://campuspapers-backend.onrender.com`)

5. **Update Frontend Environment Variable**
   - Go to your Vercel project settings
   - Add/Update environment variable:
     - Key: `VITE_API_BASE`
     - Value: `https://campuspapers-backend.onrender.com`
   - Redeploy your frontend

### Option 2: Deploy on Railway

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Set Environment Variables**
   Add the same environment variables as Render (see above)

4. **Deploy**
   - Railway will auto-detect and deploy
   - Copy the generated URL

5. **Update Frontend**
   - Update `VITE_API_BASE` in Vercel with the Railway URL

### Option 3: Deploy Backend on Vercel

1. **Create a New Vercel Project for Backend**
   - Go to Vercel dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Set **Root Directory** to `backend`

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Set Environment Variables**
   Add all the environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Copy the deployment URL

5. **Update Frontend**
   - Update `VITE_API_BASE` in your frontend Vercel project

## AI Service Deployment (Optional)

If you want to deploy the AI service separately:

### Deploy on Render

1. Create a new Web Service
2. Root Directory: `ai-service`
3. Environment: `Python 3`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Set Environment Variable: `ALLOW_ORIGINS=*`
7. Update backend `AI_SERVICE_URL` with the Render URL

## Important Notes

1. **CORS Configuration**: The backend is configured to accept requests from your Vercel frontend URL. Make sure `CLIENT_URL` in backend matches your Vercel deployment URL.

2. **Environment Variables**: Never commit `.env` files. Always set them in your hosting platform's dashboard.

3. **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add your hosting platform's IP addresses.

4. **Cloudinary**: Ensure your Cloudinary account is set up and credentials are correct.

5. **Testing**: After deployment, test the `/api/health` endpoint to verify the backend is running.

## Troubleshooting

- **CORS Errors**: Make sure `CLIENT_URL` in backend matches your frontend URL exactly
- **Connection Errors**: Check MongoDB Atlas network access settings
- **Environment Variables**: Verify all required variables are set in your hosting platform
- **Build Failures**: Check build logs in your hosting platform dashboard

## Quick Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend `VITE_API_BASE` updated with backend URL
- [ ] All environment variables set in backend
- [ ] MongoDB Atlas network access configured
- [ ] Cloudinary credentials configured
- [ ] CORS configured correctly
- [ ] Test `/api/health` endpoint
- [ ] Test frontend-backend connection

