# 🚀 Deployment Guide - Sacred Journeys

This guide will walk you through deploying the Sacred Journeys Tours & Travel application.

## Prerequisites

- GitHub account
- Netlify account (free tier works)
- Render account (free tier works)
- MongoDB Atlas account (free tier works)

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write access
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string: `mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/sacred_journeys`

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `sacred-journeys-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-strong-secret>
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-app.netlify.app
   ```
6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Note your backend URL: `https://sacred-journeys-api.onrender.com`

### Option B: Using render.yaml Blueprint

1. Push the code to GitHub
2. Go to Render Dashboard → **Blueprints**
3. Select your repository
4. Render will automatically detect `backend/render.yaml`
5. Fill in the sync environment variables
6. Deploy!

## Step 3: Deploy Frontend to Netlify

### Option A: Using Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `web/dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://sacred-journeys-api.onrender.com/api
   ```
6. Click **Deploy site**
7. Wait for deployment (2-3 minutes)
8. Your site is live! Note the URL.

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to web directory
cd web

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Step 4: Configure CORS

After deployment, update your backend environment variable on Render:

```
CLIENT_URL=https://your-site-name.netlify.app
```

Redeploy the backend for changes to take effect.

## Step 5: Create Admin User

1. Use the API directly or create a seeder script:

```bash
# Connect to your backend
curl -X POST https://sacred-journeys-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securepassword",
    "phone": "9876543210"
  }'
```

2. Update the user role in MongoDB Atlas:
   - Go to your cluster → Browse Collections
   - Find the `users` collection
   - Find your admin user
   - Change `role` from `user` to `admin`

## Step 6: Deploy Mobile App (Optional)

### For Testing (Expo Go)

1. Install Expo Go on your phone
2. Update API URL in `mobile/src/services/api.js`:
   ```js
   const API_URL = 'https://sacred-journeys-api.onrender.com/api';
   ```
3. Run `npx expo start`
4. Scan QR code with Expo Go

### For Production (App Stores)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Troubleshooting

### Backend Issues

**Problem**: Server crashes on Render
**Solution**: Check logs in Render dashboard, ensure MongoDB URI is correct

**Problem**: CORS errors
**Solution**: Verify `CLIENT_URL` environment variable matches your Netlify URL exactly

### Frontend Issues

**Problem**: API calls failing
**Solution**: Check `VITE_API_URL` in Netlify environment variables

**Problem**: Blank page after deploy
**Solution**: Check build logs, ensure `netlify.toml` redirects are configured

### Mobile App Issues

**Problem**: Network errors
**Solution**: Ensure API URL is using HTTPS for production

**Problem**: Can't connect to local backend
**Solution**: Use your computer's IP instead of localhost (e.g., `http://192.168.1.100:5000/api`)

## Environment Variables Summary

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key-here` |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://app.netlify.app` |

### Frontend (Netlify)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.onrender.com/api` |

## Post-Deployment Checklist

- [ ] Backend health check passes (`/api/health`)
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Tours display correctly
- [ ] Admin dashboard accessible
- [ ] Emergency alerts work
- [ ] File uploads work

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Open an issue on GitHub

---

**Happy Deploying! 🎉**

