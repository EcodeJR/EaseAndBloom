# Deployment Guide - Ease & Bloom

## 📋 Overview

This guide covers deploying the Ease & Bloom application to Vercel with proper environment variable configuration.

## 🗂️ Project Structure

- **Main App** (`/`) - User-facing website
- **Admin Frontend** (`/AdminControl/frontend`) - Admin dashboard
- **Admin Backend** (`/AdminControl/backend`) - API server

---

## 🚀 Deployment Steps

### 1. Main App Deployment

#### Local Setup
1. Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:5000
```

#### Vercel Deployment
1. Connect repository to Vercel
2. Set root directory to: `/`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app`
4. Deploy

---

### 2. Admin Backend Deployment

#### Vercel Setup
1. Create new Vercel project
2. Set root directory to: `AdminControl/backend`
3. Add all required environment variables (see below)
4. Deploy

#### Required Environment Variables:
```env
MONGODB_URI=<your_mongodb_atlas_connection_string>
FRONTEND_URL=<your_admin_frontend_vercel_url>
JWT_ACCESS_SECRET=<generate_secure_random_string>
JWT_REFRESH_SECRET=<generate_secure_random_string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_email>
EMAIL_PASSWORD=<your_app_password>
EMAIL_FROM=<noreply_email>
SUPER_ADMIN_EMAIL=<admin_email>
SUPER_ADMIN_PASSWORD=<secure_password>
NODE_ENV=production
```

---

### 3. Admin Frontend Deployment

#### Local Setup
1. Create `.env` file in `AdminControl/frontend`:
```env
VITE_API_URL=http://localhost:5000
```

#### Vercel Setup
1. Create new Vercel project
2. Set root directory to: `AdminControl/frontend`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app`
4. Deploy

---

## 📝 API Configuration

### Main App (`/src/services/api.js`)

The centralized API service automatically uses environment variables:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**Updated Files:**
- ✅ `/src/pages/BlogPosts.jsx`
- ✅ `/src/pages/BlogDetail.jsx`
- ✅ `/src/pages/AnonymousMessages.jsx`
- ✅ `/src/components/WaitlistForm.jsx`
- ✅ `/src/components/BlogsSection.jsx`
- ⚠️ `/src/components/StoriesSection.jsx` (needs manual fix - see below)

---

## ⚠️ Manual Fix Required

### StoriesSection.jsx

There's a syntax error in `/src/components/StoriesSection.jsx` around line 91-96. 

**Fix needed:**
Remove the duplicate code and ensure proper try-catch structure. The file should look like:

```javascript
const storiesWithContent = await Promise.all(
  data.data.stories.map(async (story) => {
    try {
      const { data: storyData } = await storiesAPI.getById(story._id);
      return storyData.success ? storyData.data.story : story;
    } catch (error) {
      console.error(`Failed to fetch content for story ${story._id}:`, error);
      return story;
    }
  })
);
```

---

## 🔒 Security Checklist

- [ ] All API URLs use environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] MongoDB Atlas IP whitelist includes Vercel IPs
- [ ] JWT secrets are strong random strings
- [ ] Email app password (not regular password) is used
- [ ] CORS is configured with actual frontend URLs

---

## 🧪 Testing

### Local Testing
```bash
# Main app
npm run dev

# Admin frontend
cd AdminControl/frontend && npm run dev

# Admin backend
cd AdminControl/backend && npm start
```

### Production Testing
1. Test all API endpoints
2. Verify environment variables are loaded
3. Check CORS configuration
4. Test file uploads (Cloudinary)
5. Test email notifications

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas IP Whitelist](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [Cloudinary Setup](https://cloudinary.com/documentation)

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] All hardcoded URLs replaced with environment variables
- [ ] `.env.example` files created
- [ ] Dependencies up to date
- [ ] Build succeeds locally

### After Deployment
- [ ] Environment variables set in Vercel
- [ ] Backend URL updated in frontend env vars
- [ ] Frontend URL updated in backend CORS
- [ ] Database connection working
- [ ] File uploads working
- [ ] Email notifications working

---

## 🆘 Troubleshooting

### API Connection Failed
- Check `VITE_API_URL` is set correctly
- Verify backend is deployed and running
- Check browser console for CORS errors

### Database Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### File Upload Failed
- Verify Cloudinary credentials
- Check file size limits
- Review Cloudinary dashboard for errors

---

**Last Updated:** October 24, 2025
