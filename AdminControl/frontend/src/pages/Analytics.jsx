import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsAPI } from '../services/api.jsx';
import { fillMissingViewsData } from '../utils/helpers.js';
import {
  BarChart3,
  Eye,
  FileText,
  BookOpen,
  TrendingUp,
  Calendar,
  XCircle,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
// Recharts color palette
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const dateRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [blogAnalytics, setBlogAnalytics] = useState(null);
  const [storyAnalytics, setStoryAnalytics] = useState(null);
  const [viewsAnalytics, setViewsAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'blogs', name: 'Blogs', icon: FileText },
    { id: 'stories', name: 'Stories', icon: BookOpen },
    { id: 'views', name: 'Views', icon: Eye },
  ];

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogAnalytics = useCallback(async () => {
    try {
      const response = await analyticsAPI.getBlogs({ period: dateRange });
      setBlogAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch blog analytics:', error);
    }
  }, [dateRange]);

  const fetchStoryAnalytics = useCallback(async () => {
    try {
      const response = await analyticsAPI.getStories({ period: dateRange });
      setStoryAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch story analytics:', error);
    }
  }, [dateRange]);

  const fetchViewsAnalytics = useCallback(async () => {
    try {
      const response = await analyticsAPI.getViews({ period: dateRange, type: 'all' });
      setViewsAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch views analytics:', error);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogAnalytics();
    } else if (activeTab === 'stories') {
      fetchStoryAnalytics();
    } else if (activeTab === 'views') {
      fetchViewsAnalytics();
    }
  }, [activeTab, dateRange, fetchBlogAnalytics, fetchStoryAnalytics, fetchViewsAnalytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed performance metrics and insights
          </p>
        </div>

        {activeTab !== 'overview' && (
          <div className="flex items-center space-x-2">
            <label htmlFor="dateRange" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Period:
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <TabIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
        {activeTab === 'blogs' && <BlogsTab blogAnalytics={blogAnalytics} dateRange={dateRange} />}
        {activeTab === 'stories' && <StoriesTab storyAnalytics={storyAnalytics} />}
        {activeTab === 'views' && <ViewsTab analytics={analytics} viewsAnalytics={viewsAnalytics} dateRange={dateRange} />}
      </div>
    </div>
  );
};

const OverviewTab = ({ analytics }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Transform views data for Recharts format (memoized for performance)
  const viewsChartData = useMemo(() => {
    if (!analytics?.viewsTrend) return [];
    const viewsChartDataRaw = fillMissingViewsData(analytics.viewsTrend, '30d');
    return viewsChartDataRaw.labels.map((label, index) => ({
      date: label,
      views: viewsChartDataRaw.data[index] || 0
    }));
  }, [analytics?.viewsTrend]);

  useEffect(() => {
    // Wait for browser to calculate layout dimensions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMounted(true);
      });
    });
  }, []);

  if (!analytics) return null;
  
  // Safety check: Ensure overview exists and is an object
  if (!analytics.overview || typeof analytics.overview !== 'object') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">
          <p>Unable to load analytics data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Blog Posts',
      value: Number(analytics.overview?.totalBlogs) || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Stories',
      value: Number(analytics.overview?.totalStories) || 0,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Pending Stories',
      value: Number(analytics.overview?.pendingStories) || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'negative',
    },
    {
      name: 'Total Views',
      value: Number(analytics.overview?.totalViews) || 0,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+25%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : '0'}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <TrendingUp className={`self-center flex-shrink-0 h-4 w-4 ${stat.changeType === 'negative' ? 'rotate-180' : ''
                          }`} />
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-4">
              Views Trend (Last 30 Days)
            </h3>
            <div className="h-48 sm:h-64" style={{ minHeight: '192px' }}>
              {isMounted && viewsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <LineChart data={viewsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No views data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-4">
              Content Distribution
            </h3>
            <div className="h-48 sm:h-64" style={{ minHeight: '192px' }}>
              {isMounted && ((analytics.overview?.totalBlogs || 0) + (analytics.overview?.publishedStories || 0) + (analytics.overview?.pendingStories || 0)) > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Published Blogs', value: Number(analytics.overview?.totalBlogs) || 0 },
                        { name: 'Published Stories', value: Number(analytics.overview?.publishedStories) || 0 },
                        { name: 'Pending Stories', value: Number(analytics.overview?.pendingStories) || 0 },
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Published Blogs', value: Number(analytics.overview?.totalBlogs) || 0 },
                        { name: 'Published Stories', value: Number(analytics.overview?.publishedStories) || 0 },
                        { name: 'Pending Stories', value: Number(analytics.overview?.pendingStories) || 0 },
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No content data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          {analytics.recentActivity?.blogs?.length > 0 || analytics.recentActivity?.stories?.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {analytics.recentActivity?.blogs?.slice(0, 3).map((blog, blogIdx) => (
                <li key={blog._id}>
                  <div className="relative pb-8">
                    {blogIdx !== analytics.recentActivity.blogs.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <FileText className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Blog post <span className="font-medium text-gray-900">{blog.title}</span> was{' '}
                            <span className={`font-medium ${blog.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                              {blog.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={blog.createdAt}>
                            {formatDate(blog.createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {analytics.recentActivity?.stories?.slice(0, 2).map((story, storyIdx) => (
                <li key={story._id}>
                  <div className="relative pb-8">
                    {storyIdx !== analytics.recentActivity.stories.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <BookOpen className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Story <span className="font-medium text-gray-900">{story.title}</span> by{' '}
                            <span className="font-medium text-gray-900">{story.submitterName}</span> was{' '}
                            <span className={`font-medium ${story.status === 'published' ? 'text-green-600' :
                              story.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {story.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={story.submittedAt}>
                            {formatDate(story.submittedAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogsTab = ({ blogAnalytics, dateRange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!blogAnalytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Transform top blogs data for Recharts format
  const topBlogsChartData = blogAnalytics.topBlogs && blogAnalytics.topBlogs.length > 0
    ? blogAnalytics.topBlogs.slice(0, 10).map(blog => ({
        title: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title,
        views: blog.views
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Blog Stats */}
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
                  <dd className="text-lg font-medium text-gray-900">{blogAnalytics.stats?.totalBlogs || 0}</dd>
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
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd className="text-lg font-medium text-gray-900">{blogAnalytics.stats?.totalViews || 0}</dd>
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {blogAnalytics.stats?.totalBlogs > 0 ? Math.round((blogAnalytics.stats?.totalViews || 0) / blogAnalytics.stats.totalBlogs) : 0}
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
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Period</dt>
                  <dd className="text-lg font-medium text-gray-900">{blogAnalytics.stats?.totalBlogs || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Blog Performance ({dateRanges.find(r => r.value === dateRange)?.label})
          </h3>
          <div className="h-64" style={{ minHeight: '256px' }}>
            {isMounted && topBlogsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                <BarChart data={topBlogsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="title" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No blog data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StoriesTab = ({ storyAnalytics }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!storyAnalytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Transform category data for Recharts format
  const categoryChartData = storyAnalytics.storiesByCategory && storyAnalytics.storiesByCategory.length > 0
    ? storyAnalytics.storiesByCategory.map(cat => ({
        category: cat._id || 'Uncategorized',
        count: cat.count
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Story Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  <dd className="text-lg font-medium text-gray-900">{storyAnalytics.stats?.totalStories || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                  <dd className="text-lg font-medium text-gray-900">{storyAnalytics.stats?.publishedStories || 0}</dd>
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
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{storyAnalytics.stats?.pendingStories || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-red-500">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                  <dd className="text-lg font-medium text-gray-900">{storyAnalytics.stats?.rejectedStories || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Story Categories
          </h3>
          <div className="h-64" style={{ minHeight: '256px' }}>
            {isMounted && categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No story data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewsTab = ({ analytics, viewsAnalytics, dateRange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Calculate blog and story views from analytics data
  const blogViewsTotal = viewsAnalytics?.blogViews?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
  const storyViewsTotal = viewsAnalytics?.storyViews?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
  const totalViewsFromData = blogViewsTotal + storyViewsTotal;

  // Use actual data if available, otherwise fall back to overview
  const displayBlogViews = totalViewsFromData > 0 ? blogViewsTotal : Math.round((analytics?.overview.totalViews || 0) * 0.6);
  const displayStoryViews = totalViewsFromData > 0 ? storyViewsTotal : Math.round((analytics?.overview.totalViews || 0) * 0.4);

  // Transform views trend data for Recharts format
  const viewsTrendDataRaw = viewsAnalytics 
    ? fillMissingViewsData(
        [...(viewsAnalytics.blogViews || []), ...(viewsAnalytics.storyViews || [])]
          .reduce((acc, item) => {
            const existing = acc.find(a => 
              a._id.year === item._id.year && 
              a._id.month === item._id.month && 
              a._id.day === item._id.day
            );
            if (existing) {
              existing.views += item.views || 0;
            } else {
              acc.push({ ...item });
            }
            return acc;
          }, []),
        dateRange
      )
    : { labels: [], data: [] };
  
  // Convert to Recharts format
  const viewsTrendData = viewsTrendDataRaw.labels.map((label, index) => ({
    date: label,
    views: viewsTrendDataRaw.data[index] || 0
  }));

  return (
    <div className="space-y-6">
      {/* Views Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics?.overview.totalViews || 0}</dd>
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Daily Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview.totalViews ? Math.round(analytics.overview.totalViews / 30) : 0}
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
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Blog Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayBlogViews.toLocaleString()}
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
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Story Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayStoryViews.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Views Trend ({dateRanges.find(r => r.value === dateRange)?.label})
            </h3>
            <div className="h-64" style={{ minHeight: '256px' }}>
              {isMounted && viewsTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <LineChart data={viewsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No views trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Views Distribution by Content Type
            </h3>
            <div className="h-64" style={{ minHeight: '256px' }}>
              {isMounted && (displayBlogViews > 0 || displayStoryViews > 0) ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Blog Views', value: displayBlogViews },
                        { name: 'Story Views', value: displayStoryViews },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No views distribution data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
