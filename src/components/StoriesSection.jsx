import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, MessageSquare, Clock, User, ArrowRight } from 'lucide-react';
import StoryDetailModal from './StoryDetailModal';
import LoadingSpinner from './LoadingSpinner';
import { storiesAPI } from '../services/api';

// Dummy story data as fallback
const dummyStories = [
  {
    _id: 1,
    title: "Finding My Voice",
    content: "For years, I suffered in silence. Heavy periods, excruciating pain, and the shame that came with it. I thought I was alone until I found this community. Now I know I'm not broken - I'm human.",
    submitterName: "Anonymous",
    category: "Personal Experience",
    submittedAt: "2024-01-14",
    views: 45,
    isAnonymous: true
  },
  {
    _id: 2,
    title: "A Mother's Journey",
    content: "Watching my daughter struggle with her first periods broke my heart. I wish I had known then what I know now about supporting her through this transition. Every mother should have access to this knowledge.",
    submitterName: "Sarah M.",
    category: "Support & Resources",
    submittedAt: "2024-01-13",
    views: 32,
    isAnonymous: false
  },
  {
    _id: 3,
    title: "Endometriosis Warrior",
    content: "After 10 years of being told my pain was 'normal,' I finally got diagnosed with endometriosis. The journey was long and painful, but finding others who understood made all the difference.",
    submitterName: "Anonymous",
    category: "Recovery Journey",
    submittedAt: "2024-01-12",
    views: 67,
    isAnonymous: true
  },
  {
    _id: 4,
    title: "Breaking the Cycle",
    content: "I grew up in a household where periods were never discussed. Now, I make sure to talk openly with my friends and family. Breaking generational silence starts with us.",
    submitterName: "Maria L.",
    category: "Mental Health Awareness",
    submittedAt: "2024-01-11",
    views: 28,
    isAnonymous: false
  },
  {
    _id: 5,
    title: "Workplace Understanding",
    content: "Having supportive colleagues who understand when I need to take breaks during difficult days has been life-changing. Everyone deserves this kind of workplace compassion.",
    submitterName: "Anonymous",
    category: "Coping Strategies",
    submittedAt: "2024-01-10",
    views: 41,
    isAnonymous: true
  },
  {
    _id: 6,
    title: "Gratitude and Hope",
    content: "To all the women who shared their stories before me - thank you. Your courage gave me the strength to share mine. Together, we're building a world where no one suffers in silence.",
    submitterName: "Anonymous",
    category: "Hope & Healing",
    submittedAt: "2024-01-09",
    views: 89,
    isAnonymous: true
  }
];

const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [recentStory, setRecentStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      // Try to fetch from backend first - we need content for display, so we'll fetch individual stories
      const { data } = await storiesAPI.getAll({ limit: 6, sort: 'newest' });

      if (data.success && data.data.stories.length > 0) {
        console.log('✅ Successfully fetched stories from backend:', data.data.stories.length);
        
        // Fetch full content for each story since the list endpoint excludes content
        const storiesWithContent = await Promise.all(
          data.data.stories.map(async (story) => {
            try {
              const { data: storyData } = await storiesAPI.getById(story._id);
              return storyData.success ? storyData.data.story : story;
            } catch (error) {
              console.error(`Failed to fetch content for story ${story._id}:`, error);
              return story;
            }
          })
        );

        // Transform database structure to match component expectations
        const transformedStories = storiesWithContent.map(story => ({
          _id: story._id,
          title: story.title,
          content: story.content,
          submitterName: story.submitterName || 'Anonymous',
          category: story.category,
          submittedAt: story.publishedAt || story.createdAt,
          views: story.views || 0,
          isAnonymous: story.submitterName === 'Anonymous' || !story.submitterName
        }));
        setStories(transformedStories.slice(1)); // All except the first one
        setRecentStory(transformedStories[0]); // First one as recent
      } else {
        console.log('⚠️ No stories found in backend, using dummy data');
        // Fallback to dummy data
        setStories(dummyStories.slice(1)); // All except the first one
        setRecentStory(dummyStories[0]); // First one as recent
      }
    } catch (error) {
      console.error('❌ Failed to fetch stories from backend:', error.message);
      console.log('🔄 Falling back to dummy data');
      // Fallback to dummy data
      setStories(dummyStories.slice(1));
      setRecentStory(dummyStories[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  const getCurrentStoryIndex = () => {
    return stories.findIndex(story => story._id === selectedStory?._id);
  };

  const handleStoryNavigation = (direction) => {
    const currentIndex = getCurrentStoryIndex();
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedStory(stories[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < stories.length - 1) {
      setSelectedStory(stories[currentIndex + 1]);
    }
  };

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
      'Inspiration': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="default" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stories from Our Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences, shared courage, and the power of breaking silence together
          </p>
        </div>

        {/* Featured Story - Compact Design */}
        {recentStory && (
          <div className="mb-12">
            <div className="group bg-gradient-to-br from-white to-pink-50/40 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${getCategoryColor(recentStory.category)}`}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    {recentStory.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(recentStory.submittedAt)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {recentStory.title}
                </h3>

                <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
                  {recentStory.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2.5">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {recentStory.isAnonymous ? 'Anonymous' : recentStory.submitterName}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStoryClick(recentStory)}
                    className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors group/btn"
                  >
                    Read Story
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid Carousel - Compact Cards */}
        {stories.length > 0 && (
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">More Stories</h3>
              <Link
                to="/share-story"
                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Share Yours
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-out" 
                     style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                  {stories.map((story) => (
                    <div key={story._id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                      <div
                        className="group bg-gradient-to-br from-white to-pink-50/40 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-pink-100"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(story.category)}`}>
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {story.category}
                            </span>
                            <div className="flex items-center text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                              <Heart className="h-3 w-3 mr-1" />
                              <span className="text-xs font-bold">{story.views || 0}</span>
                            </div>
                          </div>

                          <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                            {story.title}
                          </h4>

                          <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
                            {story.content}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
                                <User className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                                {story.isAnonymous ? 'Anonymous' : story.submitterName}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => handleStoryClick(story)}
                              className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors inline-flex items-center group/btn"
                            >
                              Read
                              <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimal Navigation */}
              {stories.length > 3 && (
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
            {stories.length > 3 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: Math.ceil(stories.length / 3) }).map((_, index) => (
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

        {/* Story Detail Modal */}
        <StoryDetailModal
          story={selectedStory}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPrevious={() => handleStoryNavigation('prev')}
          onNext={() => handleStoryNavigation('next')}
          hasPrevious={getCurrentStoryIndex() > 0}
          hasNext={getCurrentStoryIndex() < stories.length - 1}
        />
      </div>
    </section>
  );
};

export default StoriesSection;
