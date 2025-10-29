import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Tag } from 'lucide-react';
import { formatDate } from '../lib/utils';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { blogsAPI } from '../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First try to fetch by slug
      try {
        const { data } = await blogsAPI.getBySlug(slug);
        if (data.success) {
          setBlog(data.data.blog);
        } else {
          setError(data.message || 'Failed to fetch blog');
        }
      } catch {
        // If slug doesn't work, try to find by title (fallback)
        const { data: allBlogsData } = await blogsAPI.getAll({ limit: 100 });
        
        if (allBlogsData.success) {
          const foundBlog = allBlogsData.data.blogs.find(blog => 
            blog.slug === slug || 
            blog.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') === slug
          );
          
          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            setError('Blog not found');
          }
        } else {
          setError('Failed to fetch blogs');
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="default" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">{error || 'The blog you\'re looking for doesn\'t exist.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-[5vh]">
        <Link
          to="/blog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blogs
        </Link>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {blog.featuredImage?.url && (
            <div className="mb-8">
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            {blog.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              <span>{blog.views || 0} views</span>
            </div>
          </div>

          {blog.metaDescription && (
            <p className="text-xl text-gray-600 italic border-l-4 border-indigo-500 pl-4 mb-8">
              {blog.metaDescription}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="whitespace-pre-wrap leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {blog.content || 'No content available'}
          </div>
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta Keywords */}
        {blog.metaKeywords?.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keywords</h3>
            <p className="text-gray-600">
              {blog.metaKeywords.join(', ')}
            </p>
          </div>
        )}
      </article>

      {/* Related Blogs Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More Articles</h2>
          <div className="text-center">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;
