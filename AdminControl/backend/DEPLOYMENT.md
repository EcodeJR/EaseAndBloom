# Backend Deployment Guide for Vercel

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (for production database)
- Cloudinary account (for image storage)
- All environment variables ready

## Step 1: Prepare Your Backend

### 1.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 1.2 Verify package.json
Ensure your `package.json` has the correct start script:
```json
"scripts": {
  "start": "node server.js"
}
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare backend for Vercel deployment"
   git push origin main
   ```

2. **Import Project on Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `AdminControl/backend` folder as the root directory

3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: `AdminControl/backend`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add all from `.env.example`:
   
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   JWT_ACCESS_SECRET=your_generated_secret_key
   JWT_REFRESH_SECRET=your_generated_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@yourdomain.com
   SUPER_ADMIN_EMAIL=admin@yourdomain.com
   SUPER_ADMIN_PASSWORD=your_secure_password
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your backend will be available at: `https://your-backend.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Navigate to backend directory
cd AdminControl/backend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter your project name)
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_ACCESS_SECRET
# ... add all other variables

# Deploy to production
vercel --prod
```

## Step 4: Update Frontend Configuration

Update your frontend `.env` file with the new backend URL:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

## Step 5: Configure CORS

Update your backend `server.js` CORS configuration to include your production frontend URL:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://your-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

## Step 6: Test Your Deployment

1. **Test API endpoints**:
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```

2. **Test from frontend**:
   - Update frontend API URL
   - Test login functionality
   - Test blog creation/editing
   - Test image uploads

## Important Notes

### Vercel Serverless Functions
- Vercel runs Node.js apps as serverless functions
- Each request has a 10-second timeout on free tier
- Maximum payload size: 4.5MB
- Functions are stateless (no persistent file storage)

### Database Connections
- Use connection pooling for MongoDB
- Close connections properly
- Consider using MongoDB Atlas for better performance

### File Uploads
- Use Cloudinary or similar service for image storage
- Don't store files on Vercel's filesystem (it's ephemeral)

### Environment Variables
- Never commit `.env` files to Git
- Use Vercel's environment variable system
- Generate strong secrets for JWT tokens

### Monitoring
- Check Vercel dashboard for logs
- Set up error tracking (e.g., Sentry)
- Monitor MongoDB Atlas performance

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Ensure all dependencies are in `package.json` dependencies (not devDependencies)

### Issue: Database connection timeout
**Solution**: 
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Verify connection string is correct
- Check MongoDB Atlas cluster is running

### Issue: CORS errors
**Solution**: 
- Add your frontend URL to CORS origins
- Ensure credentials: true is set
- Check frontend is using correct API URL

### Issue: 500 Internal Server Error
**Solution**:
- Check Vercel function logs
- Verify all environment variables are set
- Check MongoDB connection

## Generate Strong Secrets

Use this command to generate secure JWT secrets:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] All environment variables configured
- [ ] MongoDB Atlas connection working
- [ ] CORS configured for frontend domain
- [ ] Cloudinary integration working
- [ ] Email service configured
- [ ] Frontend updated with backend URL
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Monitor logs for errors

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Test API endpoints with Postman
4. Check browser console for CORS errors

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
