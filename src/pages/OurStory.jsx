import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StoryCard from '../components/StoryCard';
import StoriesGridCarousel from '../components/StoriesGridCarousel';
import StoryDetailModal from '../components/StoryDetailModal';
import story from '/story.JPG'

const OurStory = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ourStory = {
    title: "The Silence",
    content: `There's a silence that surrounds women's pain. It lingers in classrooms, where girls shift uncomfortably in blood-stained uniforms. In hospital waiting rooms, where no one explains why the bleeding won't stop.

At seventeen, I bled for weeks. Not metaphorically, literally. The kind of bleeding that interrupts exams, friendships, daily life. I missed school. I lost weight. I felt afraid of my own body.

But what stayed with me most wasn't the pain. It was the silence. No one talked about it. Not the doctors. Not my teachers. Not even my friends. I thought I was cursed. I thought I was alone.

But I wasn't. There are millions of girls and women who carry this quiet suffering, folding tissue paper into their underwear, keeping extra skirts in their school bags, hiding pain with polite smiles.

Ease & Bloom was born from that silence. It was born for the girl in the bathroom stall, crying softly. For the woman who never had the words to explain her pain. For every cycle we were told to hide.

This is our soft place to land. Our circle of care. Our community of truth-telling, healing, and rising.`,
    category: "Our Story",
    submitterName: "Ease & Bloom Team",
    isAnonymous: false,
    submittedAt: null
  };

  const handleReadStory = (story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={story} 
            alt="Our Story Background"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Breaking the silence that surrounds women's pain
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>

      {/* Main Story Content */}
      <section
        ref={sectionRef}
        className={`py-20 px-6 bg-white transition-all duration-700 ${
          visible ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Opening Story Card */}
          <StoryCard
            story={ourStory}
            size="large"
            onReadClick={handleReadStory}
          />
        </div>
      </section>

      {/* Stories Grid Carousel Section */}
      <StoriesGridCarousel />

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-12 rounded-3xl shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Join Our Circle of <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text font-medium">Care</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Be part of a community that breaks the silence and creates space for healing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#join-community"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join Our Community
              </Link>
              <Link
                to="/waitlist"
                className="px-8 py-4 bg-white border-2 border-pink-500 text-pink-500 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Join Our Waitlist
              </Link>
              <Link
                to="/share-story"
                className="px-8 py-4 bg-white border-2 border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Share Your Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Story Detail Modal */}
      <StoryDetailModal
        story={selectedStory}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default OurStory;
