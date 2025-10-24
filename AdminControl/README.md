# Ease and Bloom Admin Control System

A comprehensive MERN stack blog management and anonymous story submission system for the Ease and Bloom mental health platform.

## 🏗️ Project Structure

```
AdminControl/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Authentication & validation middleware
│   ├── utils/              # Utility functions (JWT, email, Cloudinary)
│   ├── config/             # Database configuration
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend setup instructions
└── frontend/               # React admin dashboard (to be built)
```

## 🚀 Backend Implementation Status

### ✅ Completed Features

1. **Database Schemas** - Complete MongoDB models for:
   - Admin users with role-based permissions
   - Blog posts with rich text content and SEO
   - Story submissions with moderation workflow
   - Refresh tokens for secure authentication
   - Password reset tokens

2. **Authentication System** - JWT-based security with:
   - Access tokens (15 minutes) + refresh tokens (7 days)
   - Password hashing with bcrypt
   - Role-based access control (super_admin, blog_manager, story_moderator)
   - Password reset functionality
   - Secure cookie handling

3. **API Routes** - Complete REST API with:
   - Authentication endpoints (login, logout, refresh, forgot password)
   - Blog management (CRUD operations, public/private access)
   - Story submission and moderation workflow
   - Admin management (super admin only)
   - Analytics and reporting endpoints

4. **Email System** - Automated notifications for:
   - New story submissions to admins
   - Story approval/rejection to submitters
   - Password reset links
   - New admin account invitations

5. **Image Management** - Cloudinary integration for:
   - Automatic image optimization and resizing
   - CDN delivery
   - Secure upload handling
   - Image deletion on content removal

6. **Security Features**:
   - Rate limiting (100 requests per 15 minutes)
   - Input validation with express-validator
   - CORS protection
   - Security headers with Helmet
   - NoSQL injection protection

## 🛠️ Backend Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Email service (Gmail recommended)

### Quick Start

1. **Navigate to backend directory**:
   ```bash
   cd AdminControl/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `env.example` to `.env`
   - Fill in all required variables (see backend/README.md for details)

4. **Test database connection**:
   ```bash
   npm run test-db
   ```

5. **Create super admin account**:
   ```bash
   npm run create-admin
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📋 Next Steps

### Frontend Development (React Admin Dashboard)

The backend is complete and ready for frontend integration. The next phase involves building:

1. **React Admin Dashboard** with:
   - Authentication pages (login, forgot password, reset password)
   - Dashboard home with analytics overview
   - Blog management interface (create, edit, delete, publish)
   - Story moderation workflow (review, approve, reject, edit)
   - Admin management (super admin only)
   - Account settings and profile management

2. **Public Pages** for the main website:
   - Blog listing page with pagination and filters
   - Individual blog post pages with SEO
   - Story submission form
   - Published stories listing
   - Individual story pages

3. **Integration Features**:
   - Rich text editor (React Quill or TinyMCE)
   - Image upload with Cloudinary widget
   - Real-time notifications
   - Responsive design for mobile/tablet

## 🔧 API Documentation

### Authentication Flow
1. Login with email/password → receive access token
2. Use access token in Authorization header: `Bearer <token>`
3. When token expires, use refresh token to get new access token
4. Refresh token stored in HTTP-only cookie

### Key Endpoints

**Public Endpoints:**
- `GET /api/blogs` - List published blogs
- `GET /api/blogs/:slug` - Get single blog
- `GET /api/stories` - List published stories
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Submit new story

**Admin Endpoints:**
- `POST /api/auth/login` - Admin login
- `GET /api/analytics/dashboard` - Dashboard overview
- `POST /api/blogs` - Create blog post
- `PUT /api/stories/:id/publish` - Publish story
- `GET /api/admins` - List admins (super admin only)

## 🎯 Features Overview

### Blog Management
- Rich text editor with formatting options
- Featured image upload and optimization
- SEO meta tags and descriptions
- Category and tag management
- Draft/published status
- View tracking and analytics
- Auto-generated SEO-friendly slugs

### Story Submission System
- Anonymous story submission form
- Category-based organization
- Admin review and moderation workflow
- Email notifications for all parties
- Public story display after approval
- View tracking and analytics

### Admin Dashboard
- Role-based access control
- Real-time analytics and statistics
- Bulk operations for content management
- User management (super admin only)
- Email notification preferences
- Account settings and security

### Security & Performance
- JWT authentication with refresh tokens
- Rate limiting and input validation
- Image optimization and CDN delivery
- Database indexing for performance
- Comprehensive error handling
- Production-ready security headers

## 📊 Database Schema Summary

**Admin Collection:**
- User authentication and role management
- Permission-based access control
- Account status and activity tracking

**Blog Collection:**
- Rich content with SEO optimization
- Image management with Cloudinary
- Category and tag organization
- View tracking and analytics

**Story Collection:**
- Anonymous submission handling
- Moderation workflow states
- Email notification triggers
- Public display after approval

**Token Collections:**
- Refresh token management
- Password reset functionality
- Secure token storage and expiration

## 🚀 Deployment Ready

The backend is production-ready with:
- Environment-based configuration
- Comprehensive error handling
- Security best practices
- Performance optimizations
- Scalable architecture

## 📞 Support

For technical questions or issues:
1. Check the backend README.md for detailed setup instructions
2. Review the API documentation
3. Test database connection with `npm run test-db`
4. Verify environment variables are correctly set

The backend foundation is solid and ready for frontend development!
