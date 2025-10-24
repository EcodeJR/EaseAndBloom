import React from 'react';
import { X, Calendar, User, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

const BlogPreviewModal = ({ blog, isOpen, isLoading, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading State with Skeleton */}
        {isLoading ? (
          <div className="animate-pulse">
            {/* Skeleton Header */}
            <div className="relative h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-4"></div>
                    <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto"></div>
                  </div>
                  <p className="text-gray-800 font-bold text-xl mb-2">Loading Blog</p>
                  <p className="text-gray-600 text-sm">Fetching content...</p>
                  
                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Content */}
            <div className="p-8">
              <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
              <div className="flex gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Header */}
        {blog && (
          <div className="relative">
            <img
              src={blog.featuredImage?.url || blog.featuredImage || blog.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23f3f4f6" width="800" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
              alt={blog.title || 'Blog'}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation Arrows */}
            {hasPrevious && (
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {blog.categories?.[0] || blog.category || 'Article'}
              </span>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                blog.status === 'published' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {blog.status}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {blog && (
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(blog.publishedAt || blog.publishDate || blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>{(blog.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {blog.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="text-lg text-gray-700 mb-6 leading-relaxed bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
              {blog.excerpt}
            </div>
          )}

          {/* Full Content */}
          <div className="prose prose-lg max-w-none">
            {(blog.content || blog.body) ? (
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content || blog.body }}
              />
            ) : blog.excerpt ? (
              <div className="text-gray-800 leading-relaxed">
                <p className="mb-4">{blog.excerpt}</p>
                <p className="text-sm text-gray-500 italic">Full content not available in preview.</p>
              </div>
            ) : (
              <p className="text-gray-800 leading-relaxed mb-4">
                No content available for this article.
              </p>
            )}
          </div>
        </div>
        )}

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPreviewModal;
