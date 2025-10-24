import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import BlogDetailModal from './BlogDetailModal';
import LoadingSpinner from './LoadingSpinner';
import { blogsAPI } from '../services/api';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [recentBlog, setRecentBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy blog data as fallback
  const dummyBlogs = [
    {
      _id: 1,
      title: "Understanding Your Menstrual Cycle",
      excerpt: "A comprehensive guide to understanding the phases of your menstrual cycle and what they mean for your health and wellbeing.",
      author: "Dr. Sarah Johnson",
      publishedAt: "2024-01-15",
      publishDate: "2024-01-15",
      views: 1250,
      categories: ["Mental Health"],
      featuredImage: { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop" },
      content: "Your menstrual cycle is more than just your period. It's a complex interplay of hormones that affects your entire body..."
    },
    {
      _id: 2,
      title: "Breaking the Silence: Period Stigma",
      excerpt: "Exploring how period stigma affects women globally and what we can do to create a more supportive environment.",
      author: "Maria Rodriguez",
      publishedAt: "2024-01-12",
      publishDate: "2024-01-12",
      views: 980,
      categories: ["Support"],
      featuredImage: { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop" },
      content: "Period stigma is a global issue that affects millions of women and girls worldwide. It's time we break the silence..."
    },
    {
      _id: 3,
      title: "Self-Care During Your Period",
      excerpt: "Practical tips and gentle practices to help you feel your best during your menstrual cycle.",
      author: "Emma Thompson",
      publishedAt: "2024-01-10",
      publishDate: "2024-01-10",
      views: 2100,
      categories: ["Self-Care"],
      featuredImage: { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop" },
      content: "Self-care during your period isn't just about comfort—it's about honoring your body's natural rhythms..."
    },
    {
      _id: 4,
      title: "Nutrition and Your Cycle",
      excerpt: "How different foods can support your hormonal health throughout your menstrual cycle.",
      author: "Dr. Lisa Chen",
      publishedAt: "2024-01-08",
      publishDate: "2024-01-08",
      views: 1650,
      categories: ["Wellness"],
      featuredImage: { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop" },
      content: "What you eat can significantly impact how you feel throughout your menstrual cycle. Let's explore the connection..."
    },
    {
      _id: 5,
      title: "Building Supportive Communities",
      excerpt: "The importance of creating safe spaces where women can share their experiences and support each other.",
      author: "Jennifer Adams",
      publishedAt: "2024-01-05",
      publishDate: "2024-01-05",
      views: 890,
      categories: ["Support"],
      featuredImage: { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop" },
      content: "Community support is crucial for women's health and wellbeing. Here's how we can build stronger connections..."
    },
    {
      _id: 6,
      title: "Mental Health and Menstruation",
      excerpt: "Understanding the connection between your mental health and menstrual cycle, and strategies for managing mood changes.",
      author: "Dr. Rachel Green",
      publishedAt: "2024-01-03",
      publishDate: "2024-01-03",
      views: 1450,
      categories: ["Mental Health"],
      featuredImage: { url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop" },
      content: "The relationship between mental health and menstruation is complex and deeply personal. Let's explore this connection..."
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBlogs = async () => {
    try {
      console.log('🔄 Attempting to fetch blogs from backend...');
      // Try to fetch from backend first with content included
      const { data } = await blogsAPI.getAll({
        limit: 6,
        status: 'published',
        sort: 'newest',
        includeContent: 'true'
      });

      console.log('📡 Response received:', data);

      if (data.success && data.data.blogs.length > 0) {
        console.log('✅ Successfully fetched blogs from backend:', data.data.blogs.length);
        
        // Transform backend data to match frontend expectations
        const transformedBlogs = data.data.blogs.map(blog => ({
          ...blog,
          // Generate excerpt from content (remove HTML tags and limit length)
          excerpt: blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No excerpt available',
          // Use publishDate instead of publishedAt
          publishedAt: blog.publishDate,
          // Ensure views is a number
          views: blog.views || 0
        }));
        
        setBlogs(transformedBlogs);
        setRecentBlog(transformedBlogs[0]); // Most recent blog
      } else {
        console.log('⚠️ No blogs found in backend, using dummy data');
        // Fallback to dummy data
        setBlogs(dummyBlogs.slice(1)); // All except the first one
        setRecentBlog(dummyBlogs[0]); // First one as recent
      }
    } catch (error) {
      console.error('❌ Failed to fetch blogs from backend:', error.message);
      console.error('❌ Error details:', error);
      console.log('🔄 Falling back to dummy data');
      // Fallback to dummy data
      setBlogs(dummyBlogs.slice(1));
      setRecentBlog(dummyBlogs[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const getCurrentBlogIndex = () => {
    return blogs.findIndex(blog => blog._id === selectedBlog?._id);
  };

  const handleBlogNavigation = (direction) => {
    const currentIndex = getCurrentBlogIndex();
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedBlog(blogs[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < blogs.length - 1) {
      setSelectedBlog(blogs[currentIndex + 1]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="default" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and stories to support your mental wellness journey
          </p>
        </div>

        {/* Featured Blog - Compact Design */}
        {recentBlog && (
          <div className="mb-12">
            <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex flex-col sm:flex-row">
                {/* Compact Image */}
                <div className="sm:w-2/5 relative overflow-hidden">
                  <div className="aspect-[4/3] sm:h-full">
                    <img
                      src={recentBlog.featuredImage?.url || recentBlog.featuredImage || recentBlog.image}
                      alt={recentBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                        {recentBlog.categories?.[0] || 'Featured'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="sm:w-3/5 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {recentBlog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recentBlog.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>{recentBlog.author}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(recentBlog.publishedAt || recentBlog.publishDate || recentBlog.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>{recentBlog.views?.toLocaleString() || '0'} views</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBlogClick(recentBlog)}
                    className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors group/btn"
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Blogs Grid Carousel - Compact Cards */}
        {blogs.length > 0 && (
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">More Articles</h3>
              <Link
                to="/blog"
                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-out" 
                     style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                  {blogs.map((blog) => (
                    <div key={blog._id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                      <div
                        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-gray-100"
                      >
                        {/* Compact Image */}
                        <div className="relative overflow-hidden">
                          <div className="aspect-[16/9]">
                            <img
                              src={blog.featuredImage?.url || blog.featuredImage || blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute top-2 left-2">
                            <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                              {blog.categories?.[0] || 'Article'}
                            </span>
                          </div>
                        </div>

                        {/* Compact Content */}
                        <div className="p-4">
                          <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                            {blog.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[80px]">{blog.author}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                <span>{blog.views?.toLocaleString() || '0'}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBlogClick(blog)}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group/btn"
                          >
                            <span>Read More</span>
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimal Navigation */}
              {blogs.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Minimal Dots */}
            {blogs.length > 3 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: Math.ceil(blogs.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index * 3)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / 3) === index
                        ? 'w-6 bg-gradient-to-r from-pink-500 to-purple-600'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blog Detail Modal */}
        <BlogDetailModal
          blog={selectedBlog}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPrevious={() => handleBlogNavigation('prev')}
          onNext={() => handleBlogNavigation('next')}
          hasPrevious={getCurrentBlogIndex() > 0}
          hasNext={getCurrentBlogIndex() < blogs.length - 1}
        />
      </div>
    </section>
  );
};

export default BlogsSection;
