import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePageRedirect from './components/HomePageRedirect';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import BlogEditor from './pages/BlogEditor';
import Stories from './pages/Stories';
import Admins from './pages/Admins';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import StorySubmission from './pages/StorySubmission';
import PublicBlogs from './pages/PublicBlogs';
import WaitlistManagement from './pages/WaitlistManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Root route - redirects based on authentication status */}
            <Route path="/" element={<HomePageRedirect />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Blog routes */}
              <Route path="blogs" element={
                <ProtectedRoute requiredPermission="canManageBlogs">
                  <Blogs />
                </ProtectedRoute>
              } />
              <Route path="blogs/new" element={
                <ProtectedRoute requiredPermission="canManageBlogs">
                  <BlogEditor />
                </ProtectedRoute>
              } />
              <Route path="blogs/:id/edit" element={
                <ProtectedRoute requiredPermission="canManageBlogs">
                  <BlogEditor />
                </ProtectedRoute>
              } />
              
              {/* Story routes */}
              <Route path="stories" element={
                <ProtectedRoute requiredPermission="canManageStories">
                  <Stories />
                </ProtectedRoute>
              } />
              
              {/* Waitlist routes */}
              <Route path="waitlist" element={
                <ProtectedRoute requiredPermission="canManageWaitlist">
                  <WaitlistManagement />
                </ProtectedRoute>
              } />
              
              {/* Admin management routes */}
              <Route path="admins" element={
                <ProtectedRoute superAdminOnly={true}>
                  <Admins />
                </ProtectedRoute>
              } />
              
              {/* Analytics routes */}
              <Route path="analytics" element={
                <ProtectedRoute requiredPermission="canViewAnalytics">
                  <Analytics />
                </ProtectedRoute>
              } />
              
              {/* Settings routes */}
              <Route path="settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Public Routes */}
            <Route path="/blogs" element={<PublicBlogs />} />
            <Route path="/submit-story" element={<StorySubmission />} />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
