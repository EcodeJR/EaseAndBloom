import React from 'react';
import { X, Calendar, User, Eye, Heart, Share2, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BlogDetailModal = ({ blog, isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  const navigate = useNavigate();
  
  if (!isOpen || !blog) return null;

  const handleViewFullArticle = () => {
    onClose();
    navigate(`/blog/${blog.slug}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <img
              src={blog.featuredImage?.url || blog.featuredImage || blog.image}
              alt={blog.title}
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
          </div>

          {/* Content */}
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

            {/* Excerpt */}
            <div className="text-lg text-gray-700 mb-6 leading-relaxed">
              {blog.excerpt || (blog.content ? blog.content.substring(0, 200) + '...' : 'No excerpt available')}
            </div>

            {/* Full Content */}
            <div className="prose prose-lg max-w-none">
              {blog.content ? (
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-gray-800 leading-relaxed mb-4">
                  {blog.excerpt || 'No content available for this article.'}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-pink-600 hover:text-pink-700 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                <span className="font-medium">Like Article</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span className="font-medium">Share</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleViewFullArticle}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Article
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogDetailModal;
