# Ease and Bloom Admin Control - Backend

This is the backend API for the Ease and Bloom admin control system, providing blog management and anonymous story submission functionality.

## Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **Blog Management**: CRUD operations for blog posts with rich text content
- **Story Submission**: Anonymous story submission and moderation system
- **Admin Management**: Role-based access control for multiple admin accounts
- **Email Notifications**: Automated email notifications for various events
- **Image Management**: Cloudinary integration for image uploads and optimization
- **Analytics**: Comprehensive analytics and reporting
- **Security**: Rate limiting, input validation, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Email**: NodeMailer
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account
- Email service (Gmail, SendGrid, etc.)

## Installation

1. **Clone and navigate to the backend directory**:
   ```bash
   cd AdminControl/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `env.example` to `.env`
   - Fill in all required environment variables:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easeandbloom?retryWrites=true&w=majority

   # JWT Secrets (generate strong random strings)
   JWT_ACCESS_SECRET=your-super-secret-access-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Email Configuration (using NodeMailer with Gmail)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**:
   - Create a MongoDB Atlas cluster or use local MongoDB
   - Update the `MONGODB_URI` in your `.env` file
   - The application will automatically create the necessary collections and indexes

5. **Cloudinary Setup**:
   - Sign up for a Cloudinary account
   - Get your cloud name, API key, and API secret from the dashboard
   - Update the Cloudinary variables in your `.env` file

6. **Email Setup**:
   - For Gmail: Enable 2-factor authentication and create an app password
   - For other services: Use appropriate SMTP credentials
   - Update the email variables in your `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current admin info

### Blogs
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:slug` - Get single blog by slug
- `POST /api/blogs` - Create new blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)
- `DELETE /api/blogs/:id` - Delete blog (admin only)

### Stories
- `GET /api/stories` - Get published stories (public)
- `GET /api/stories/:id` - Get single story by ID
- `POST /api/stories` - Submit new story (public)
- `GET /api/stories/admin/all` - Get all stories for admin
- `PUT /api/stories/:id/approve` - Approve story (admin only)
- `PUT /api/stories/:id/publish` - Publish story (admin only)
- `PUT /api/stories/:id/reject` - Reject story (admin only)
- `PUT /api/stories/:id` - Update story (admin only)
- `DELETE /api/stories/:id` - Delete story (admin only)

### Admin Management
- `GET /api/admins` - Get all admins (super admin only)
- `GET /api/admins/:id` - Get single admin (super admin only)
- `POST /api/admins` - Create new admin (super admin only)
- `PUT /api/admins/:id` - Update admin (super admin only)
- `DELETE /api/admins/:id` - Delete admin (super admin only)
- `PUT /api/admins/profile` - Update own profile
- `PUT /api/admins/change-password` - Change own password

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard overview
- `GET /api/analytics/blogs` - Get blog analytics
- `GET /api/analytics/stories` - Get story analytics
- `GET /api/analytics/views` - Get views analytics over time

## Database Schemas

### Admin
- `name`: Admin's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: super_admin, blog_manager, or story_moderator
- `permissions`: Object with specific permissions
- `isActive`: Account status
- `lastLogin`: Last login timestamp
- `createdBy`: Reference to admin who created this account

### Blog
- `title`: Blog post title
- `content`: Rich text HTML content
- `author`: Author name
- `featuredImage`: Cloudinary image data
- `tags`: Array of tags
- `categories`: Array of categories
- `slug`: URL-friendly slug
- `metaDescription`: SEO meta description
- `metaKeywords`: SEO keywords
- `status`: draft or published
- `publishDate`: Publication date
- `views`: View count
- `createdBy`: Reference to admin who created

### Story
- `title`: Story title
- `content`: Story content
- `submitterName`: Submitter name (default: "Anonymous")
- `submitterEmail`: Submitter email (optional, not public)
- `category`: Story category
- `status`: pending, approved, published, or rejected
- `rejectionReason`: Reason for rejection (optional)
- `views`: View count
- `reviewedAt`: Review timestamp
- `reviewedBy`: Reference to admin who reviewed
- `publishedAt`: Publication date

## Security Features

- **JWT Authentication**: Short-lived access tokens (15 minutes) with refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator for all inputs
- **CORS Protection**: Configured for specific frontend URL
- **Security Headers**: Helmet.js for security headers
- **NoSQL Injection Protection**: Mongoose schema validation

## Initial Setup

After starting the server, you'll need to create the first super admin account. You can do this by:

1. Using MongoDB Compass or a similar tool to connect to your database
2. Creating a new document in the `admins` collection with:
   ```json
   {
     "name": "Super Admin",
     "email": "admin@example.com",
     "password": "your-temp-password",
     "role": "super_admin",
     "isActive": true
   }
   ```
3. The password will be automatically hashed when you save the document
4. Log in with these credentials and change the password immediately

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional array of validation errors
}
```

## Development Notes

- All routes are protected except for public story submission and blog viewing
- Email notifications are sent asynchronously and won't fail the main operations
- Images are automatically optimized and resized before upload to Cloudinary
- Database indexes are automatically created for optimal query performance
- All timestamps are in UTC format

## Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a production MongoDB Atlas cluster
3. Configure production Cloudinary settings
4. Set up production email service
5. Use HTTPS for all communications
6. Set up monitoring and logging
7. Configure proper CORS origins for your production frontend

## Support

For issues or questions, please check the API documentation or contact the development team.
