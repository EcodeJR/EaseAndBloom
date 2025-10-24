import React from 'react';
import { X, Heart, MessageSquare, Clock, User, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoryDetailModal = ({ story, isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  if (!isOpen || !story) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Personal Story': 'bg-pink-100 text-pink-800',
      'Family Support': 'bg-blue-100 text-blue-800',
      'Health Journey': 'bg-green-100 text-green-800',
      'Breaking Silence': 'bg-purple-100 text-purple-800',
      'Workplace': 'bg-yellow-100 text-yellow-800',
      'Gratitude': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.content.substring(0, 100) + '...',
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
          className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl overflow-hidden border border-pink-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(story.category)}`}>
                <MessageSquare className="h-3 w-3 mr-1" />
                {story.category}
              </span>
              <div className="flex items-center text-white/80 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(story.submittedAt)}
              </div>
            </div>

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

            <h1 className="text-2xl md:text-3xl font-bold text-white pr-16">
              {story.title}
            </h1>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-12rem)]">
            {/* Author Info */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {story.isAnonymous ? 'Anonymous' : story.author}
                </p>
                <p className="text-sm text-gray-600">
                  {story.isAnonymous ? 'Shared anonymously' : 'Community Member'}
                </p>
              </div>
            </div>

            {/* Story Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed space-y-4">
                <p className="text-lg">
                  {story.content}
                </p>
                
                <p className="text-gray-700 italic">
                  "Every story shared is a step toward breaking the silence that has surrounded women's health for too long. Thank you for your courage in sharing your truth."
                </p>
                
                <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
                  <p className="text-gray-700 font-medium">
                    💜 Your story matters. Your voice matters. You are not alone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-white/80 backdrop-blur-sm border-t border-pink-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-pink-600 hover:text-pink-700 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                <span className="font-medium">{story.likes} Hearts</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span className="font-medium">Share Story</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300">
                Share Your Story
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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

export default StoryDetailModal;
