# Backend Setup Instructions

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
cd AdminControl/backend
./start-backend.sh  # On Linux/Mac
# OR
start-backend.bat   # On Windows
```

### Option 2: Manual setup
```bash
cd AdminControl/backend
npm install
npm start
```

## Environment Configuration

The startup script will create a basic `.env` file if one doesn't exist. You'll need to update it with your actual values:

### Required for MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easeandbloom
```

### Required for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/easeandbloom
```

## API Endpoints

Once running, the backend will be available at `http://localhost:5000` with these endpoints:

- `GET /api/health` - Health check
- `GET /api/blogs` - Get published blogs
- `GET /api/stories` - Get published stories
- `POST /api/stories` - Submit new story
- `POST /api/waitlist` - Join waitlist

## Frontend Integration

The frontend will automatically:
1. Try to connect to the backend at `http://localhost:5000`
2. Show connection status in the bottom-right corner
3. Fall back to dummy data if backend is unavailable
4. Display console logs for debugging

## Troubleshooting

### Backend won't start:
1. Check if port 5000 is available
2. Ensure MongoDB is running (if using local)
3. Check the console for error messages

### Frontend shows "Backend Offline":
1. Make sure backend is running on port 5000
2. Check browser console for CORS errors
3. Verify the backend health endpoint: `http://localhost:5000/api/health`

### Database connection issues:
1. Update the `MONGODB_URI` in `.env`
2. Ensure MongoDB Atlas cluster is accessible
3. Check network connectivity
