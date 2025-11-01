# 401 Unauthorized Login Fix

## Problem
Getting `401 Unauthorized from /api/auth/refresh` when trying to login.

## Root Cause
The refresh token cookie was set with `sameSite: 'strict'` which blocks cross-site cookies. Since your frontend (e.g., `admin-ease-and-bloom.vercel.app`) and backend (e.g., `ease-and-bloom-backend.vercel.app`) are on different domains, the browser blocks the cookie from being sent.

## Solution Applied

### Changed Cookie Settings
Updated `routes/auth.js` line 71:

**Before:**
```javascript
sameSite: 'strict'
```

**After:**
```javascript
sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
```

This allows cookies to be sent cross-site in production when using HTTPS.

## Requirements for This to Work

### 1. ✅ CORS Configuration (Already Set)
```javascript
cors({
  origin: [/* your frontend URLs */],
  credentials: true  // ✅ Already enabled
})
```

### 2. ✅ Trust Proxy (Already Set)
```javascript
app.set('trust proxy', 1);  // ✅ Already added
```

### 3. ✅ Secure Cookies in Production
```javascript
secure: process.env.NODE_ENV === 'production'  // ✅ Already set
```

### 4. ⚠️ Frontend Must Send Credentials
Make sure your frontend API calls include `withCredentials: true`:

```javascript
// In your api.jsx
const api = axios.create({
  baseURL: 'https://your-backend.vercel.app/api',
  withCredentials: true  // ✅ Must be set
});
```

## Testing Checklist

After deploying:

- [ ] Login works without 401 error
- [ ] Refresh token is stored in cookies (check DevTools > Application > Cookies)
- [ ] Refresh token endpoint works when access token expires
- [ ] Logout clears the cookie properly
- [ ] CORS headers are present in responses

## Common Issues

### Issue: Still getting 401
**Check:**
1. Frontend has `withCredentials: true` in axios config
2. Backend CORS includes your frontend URL in the `origin` array
3. Both frontend and backend are using HTTPS in production
4. Cookie is being set (check browser DevTools)

### Issue: Cookie not being set
**Check:**
1. `sameSite: 'none'` requires `secure: true` (HTTPS only)
2. CORS `credentials: true` is set
3. Frontend URL is in the CORS `origin` array

### Issue: Cookie set but not sent on subsequent requests
**Check:**
1. Frontend axios has `withCredentials: true`
2. Cookie domain matches the backend domain
3. Cookie hasn't expired (7 days max age)

## Environment Variables

Make sure these are set on Vercel:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
```

## Deploy Steps

1. Commit the changes to `routes/auth.js`
2. Push to your repository
3. Vercel will auto-deploy
4. Test login on production
5. Check browser console for any CORS errors
6. Verify cookie is set in DevTools

## Additional Notes

- `sameSite: 'none'` only works with HTTPS (`secure: true`)
- In development (localhost), `sameSite: 'lax'` is used
- The refresh token is valid for 7 days
- Access token expires after a shorter period (check JWT_EXPIRES_IN)
