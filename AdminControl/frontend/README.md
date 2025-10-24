# Ease and Bloom Admin Dashboard - Frontend

A modern React admin dashboard built with Vite, Tailwind CSS, and React Router for managing the Ease and Bloom blog and story submission system.

## 🚀 Features Implemented

### ✅ Core Features
- **Authentication System**: Login, logout, password reset
- **Protected Routes**: Role-based access control
- **Dashboard Home**: Analytics overview with stats cards
- **Blog Management**: List, view, and manage blog posts
- **Responsive Design**: Mobile-friendly interface
- **Toast Notifications**: User feedback for all actions

### 🎨 UI Components
- **Sidebar Navigation**: Collapsible sidebar with role-based menu items
- **Header**: User profile dropdown and notifications
- **Layout System**: Consistent layout across all pages
- **Loading States**: Spinner components for async operations
- **Status Badges**: Color-coded status indicators

### 🔐 Security Features
- **JWT Authentication**: Automatic token refresh
- **Permission-based Access**: Role-based route protection
- **Secure API Calls**: Axios interceptors for token management
- **Input Validation**: Form validation and error handling

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful SVG icons
- **Lucide React** - Additional icon library

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Header.jsx      # Top header bar
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Dashboard.jsx   # Dashboard home
│   └── Blogs.jsx      # Blog management
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state
├── services/          # API services
│   └── api.js         # Axios configuration
├── utils/             # Utility functions
│   └── helpers.js     # Helper functions
└── hooks/             # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend API running on port 5000

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd AdminControl/frontend/AdminControl_Ease_Bloom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `env.example` to `.env`
   - Update `VITE_API_URL` if your backend runs on a different port

4. **Start development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Integration
The frontend is configured to work with the backend API. Make sure:
1. Backend is running on port 5000
2. CORS is configured to allow frontend origin
3. Authentication endpoints are working

## 📱 Features Overview

### Authentication Flow
1. **Login Page**: Email/password authentication
2. **Token Management**: Automatic refresh token handling
3. **Protected Routes**: Redirect to login if not authenticated
4. **Role-based Access**: Different permissions for different roles

### Dashboard Features
- **Stats Cards**: Overview of blogs, stories, views, and pending items
- **Recent Activity**: Latest blog posts and story submissions
- **Quick Actions**: Direct links to create content or review stories
- **Real-time Updates**: Data refreshes automatically

### Blog Management
- **Blog List**: Paginated list of all blog posts
- **Status Indicators**: Visual status badges (draft/published)
- **Quick Actions**: Edit and delete buttons
- **Metadata Display**: Views, author, categories, and dates

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600, 700)
- **Success**: Green (100, 800)
- **Warning**: Yellow (100, 800)
- **Error**: Red (100, 800)
- **Info**: Blue (100, 800)

### Typography
- **Headings**: Font-bold, various sizes
- **Body**: Font-medium for labels, font-normal for content
- **Small Text**: Text-sm for metadata

### Spacing
- **Consistent**: Using Tailwind's spacing scale
- **Responsive**: Mobile-first approach
- **Padding**: px-4, py-6 for main containers

## 🔄 State Management

### Authentication Context
- **Global State**: Admin info, authentication status
- **Methods**: Login, logout, permission checks
- **Persistence**: LocalStorage for tokens

### API Integration
- **Axios Instance**: Configured with base URL and interceptors
- **Error Handling**: Automatic token refresh and error messages
- **Loading States**: Built-in loading indicators

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default styles
- **Tablet**: sm: breakpoint (640px+)
- **Desktop**: lg: breakpoint (1024px+)

### Mobile Features
- **Collapsible Sidebar**: Hamburger menu on mobile
- **Touch-friendly**: Large buttons and touch targets
- **Responsive Tables**: Horizontal scroll on small screens

## 🚀 Next Steps

### Planned Features
1. **Blog Editor**: Rich text editor for creating/editing blogs
2. **Story Moderation**: Review and approve story submissions
3. **Admin Management**: Create and manage admin accounts
4. **Analytics Dashboard**: Detailed analytics and reports
5. **Settings Page**: Profile and account management
6. **Image Upload**: Cloudinary integration for images

### Development Workflow
1. **Component Development**: Create reusable UI components
2. **Page Implementation**: Build individual page features
3. **API Integration**: Connect frontend to backend endpoints
4. **Testing**: Add unit and integration tests
5. **Optimization**: Performance and bundle size optimization

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Authentication Issues**: Check token storage and API endpoints
3. **Build Errors**: Verify all dependencies are installed
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Development Tips
- Use React DevTools for debugging
- Check browser console for API errors
- Verify environment variables are loaded
- Test on different screen sizes

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

The frontend is now ready for development and testing with the backend API!