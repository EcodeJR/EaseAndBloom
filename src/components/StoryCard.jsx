import React from 'react';
import { MessageSquare, Clock, User, ArrowRight } from 'lucide-react';

const StoryCard = ({ story, onReadClick, size = 'default' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Personal Experience': 'bg-pink-100 text-pink-800',
      'Support & Resources': 'bg-blue-100 text-blue-800',
      'Recovery Journey': 'bg-green-100 text-green-800',
      'Mental Health Awareness': 'bg-purple-100 text-purple-800',
      'Coping Strategies': 'bg-yellow-100 text-yellow-800',
      'Hope & Healing': 'bg-indigo-100 text-indigo-800',
      'Therapy Experience': 'bg-teal-100 text-teal-800',
      'Self-Discovery': 'bg-orange-100 text-orange-800',
      'Overcoming Challenges': 'bg-red-100 text-red-800',
      'Inspiration': 'bg-emerald-100 text-emerald-800',
      'Our Story': 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-900'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isLarge = size === 'large';
  
  return (
    <div className={`group bg-gradient-to-br from-white to-pink-50/40 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-pink-100 ${
      isLarge ? 'shadow-lg' : ''
    }`}>
      <div className={isLarge ? 'p-10' : 'p-6'}>
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold ${getCategoryColor(story.category)} ${
            isLarge ? 'text-sm' : 'text-xs'
          }`}>
            <MessageSquare className={`mr-1.5 ${isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
            {story.category}
          </span>
          {story.submittedAt && (
            <div className={`flex items-center text-gray-500 font-medium ${
              isLarge ? 'text-sm' : 'text-xs'
            }`}>
              <Clock className={`mr-1 ${isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
              {formatDate(story.submittedAt)}
            </div>
          )}
        </div>

        <h3 className={`font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors ${
          isLarge ? 'text-3xl md:text-4xl line-clamp-3' : 'text-xl line-clamp-2'
        }`}>
          {story.title}
        </h3>

        <p className={`text-gray-700 mb-6 leading-relaxed ${
          isLarge ? 'text-base md:text-lg line-clamp-6' : 'text-sm line-clamp-3'
        }`}>
          {story.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2.5 ${
              isLarge ? 'w-10 h-10' : 'w-8 h-8'
            }`}>
              <User className={isLarge ? 'h-5 w-5 text-white' : 'h-4 w-4 text-white'} />
            </div>
            <div>
              <p className={`font-bold text-gray-900 ${
                isLarge ? 'text-base' : 'text-sm'
              }`}>
                {story.isAnonymous ? 'Anonymous' : story.submitterName}
              </p>
            </div>
          </div>
          
          {onReadClick && (
            <button
              onClick={() => onReadClick(story)}
              className={`inline-flex items-center font-semibold text-pink-600 hover:text-pink-700 transition-colors group/btn ${
                isLarge ? 'text-base' : 'text-sm'
              }`}
            >
              Read Full Story
              <ArrowRight className={`ml-1 transition-transform group-hover/btn:translate-x-1 ${
                isLarge ? 'h-5 w-5' : 'h-4 w-4'
              }`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
