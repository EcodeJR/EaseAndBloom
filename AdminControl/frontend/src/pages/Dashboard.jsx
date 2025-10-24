import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, storiesAPI, blogsAPI } from '../services/api.jsx';
import {
  FileText,
  BookOpen,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  MessageSquare,
  Users,
} from 'lucide-react';
import { getRelativeTime } from '../utils/helpers';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingStories, setPendingStories] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, storiesRes, blogsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        storiesAPI.getAllAdmin({ status: 'pending', limit: 5 }),
        blogsAPI.getAll({ limit: 5 })
      ]);
      
      setAnalytics(analyticsRes.data.data);
      setPendingStories(storiesRes.data.data?.stories || []);
      setRecentBlogs(blogsRes.data.data?.blogs || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const quickActions = [
    {
      name: 'Create New Blog',
      description: 'Write and publish a new blog post',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/admin/blogs/new',
    },
    {
      name: 'Review Stories',
      description: `${analytics?.overview?.pendingStories || 0} stories pending review`,
      icon: CheckCircle,
      color: 'bg-yellow-500',
      href: '/admin/stories',
    },
    {
      name: 'View Analytics',
      description: 'Check detailed performance metrics',
      icon: Eye,
      color: 'bg-purple-500',
      href: '/admin/analytics',
    },
    {
      name: 'Manage Admins',
      description: 'Add or modify admin accounts',
      icon: Users,
      color: 'bg-green-500',
      href: '/admin/admins',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quick actions and recent activity overview
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.name} to={action.href} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-900 truncate">
                        {action.name}
                      </dt>
                      <dd className="text-sm text-gray-500">
                        {action.description}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Blogs</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview?.totalBlogs || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-500">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Stories</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview?.totalStories || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-yellow-500">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview?.pendingStories || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview?.totalViews || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Stories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Stories Pending Review
              </h3>
              <Link 
                to="/admin/stories" 
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {pendingStories.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {pendingStories.map((story) => (
                    <li key={story._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-yellow-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {story.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {story.submitterName} • {getRelativeTime(story.submittedAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/admin/stories/${story._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No stories pending review</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Blog Posts
              </h3>
              <Link 
                to="/admin/blogs" 
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {recentBlogs.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentBlogs.map((blog) => (
                    <li key={blog._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {blog.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {blog.status} • {getRelativeTime(blog.createdAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/admin/blogs/${blog._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No blog posts yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;