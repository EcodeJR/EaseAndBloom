import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../services/api.jsx';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';
import { formatDate, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';
import BlogPreviewModal from '../components/BlogPreviewModal';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(''); // Local search input
  const [isSearching, setIsSearching] = useState(false); // Debounce indicator
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'newest'
  });
  const searchTimeoutRef = useRef(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        sort: filters.sort
      };
      
      // Add filters if not default values
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      
      const response = await blogsAPI.getAll(params);
      setBlogs(response.data.data.blogs);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await blogsAPI.delete(id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        console.error('Failed to delete blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Debounced search handler
  const handleSearchInput = (value) => {
    setSearchInput(value);
    setIsSearching(true);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout to update filters after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: value
      }));
      setCurrentPage(1);
      setIsSearching(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Immediately apply search on form submit
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setIsSearching(false);
    setFilters(prev => ({
      ...prev,
      search: searchInput
    }));
    setCurrentPage(1);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handlePreview = async (blog) => {
    try {
      setIsLoadingPreview(true);
      setIsPreviewOpen(true);
      // Fetch full blog details including content
      const response = await blogsAPI.getById(blog._id);
      setSelectedBlog(response.data.data.blog);
    } catch (error) {
      console.error('Failed to fetch blog details:', error);
      toast.error('Failed to load blog preview');
      setIsPreviewOpen(false);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedBlog(null);
  };

  const handleNextBlog = async () => {
    const currentIndex = blogs.findIndex(b => b._id === selectedBlog._id);
    if (currentIndex < blogs.length - 1) {
      try {
        setIsLoadingPreview(true);
        const response = await blogsAPI.getById(blogs[currentIndex + 1]._id);
        setSelectedBlog(response.data.data.blog);
      } catch (error) {
        console.error('Failed to fetch next blog:', error);
        toast.error('Failed to load next blog');
      } finally {
        setIsLoadingPreview(false);
      }
    }
  };

  const handlePreviousBlog = async () => {
    const currentIndex = blogs.findIndex(b => b._id === selectedBlog._id);
    if (currentIndex > 0) {
      try {
        setIsLoadingPreview(true);
        const response = await blogsAPI.getById(blogs[currentIndex - 1]._id);
        setSelectedBlog(response.data.data.blog);
      } catch (error) {
        console.error('Failed to fetch previous blog:', error);
        toast.error('Failed to load previous blog');
      } finally {
        setIsLoadingPreview(false);
      }
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isSearching ? 'text-indigo-500 animate-pulse' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-indigo-600">Searching...</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="sm:ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                Search
              </button>
            </form>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {blogs.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row">
                      {/* Blog Image */}
                      {blog.featuredImage?.url && (
                        <div className="flex-shrink-0 sm:mr-4 mb-3 sm:mb-0">
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            className="h-32 sm:h-16 w-full sm:w-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {blog.title}
                          </h3>
                          <span
                            className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              blog.status
                            )}`}
                          >
                            {blog.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(blog.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{blog.views} views</span>
                          <span className="mx-2">•</span>
                          <span>by {blog.author}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {blog.categories?.map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(blog)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Preview blog"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/admin/blogs/${blog._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit blog"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete blog"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new blog post.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/blogs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Blog Post
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        blog={selectedBlog}
        isOpen={isPreviewOpen}
        isLoading={isLoadingPreview}
        onClose={handleClosePreview}
        onNext={handleNextBlog}
        onPrevious={handlePreviousBlog}
        hasNext={selectedBlog && blogs.findIndex(b => b._id === selectedBlog._id) < blogs.length - 1}
        hasPrevious={selectedBlog && blogs.findIndex(b => b._id === selectedBlog._id) > 0}
      />
    </div>
  );
};

export default Blogs;
