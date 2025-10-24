import React, { useEffect } from 'react';
import BenefitsSection from '../components/BenefitsSection';
import CoreValuesSection from '../components/CoreValuesSection';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import JoinCommunitySection from '../components/JoinCommunitySection';
import MainContent from '../components/MainContent';
import MissionVisionSection from '../components/MissionVisionSection';
import Navigation from '../components/Navigation';
import OurStorySection from '../components/OurStorySection';
import BlogsSection from '../components/BlogsSection';
import StoriesSection from '../components/StoriesSection';

const HomePage = () => {
  // Handle scrolling to hash anchor when navigating from other pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navigation />
      <HeroSlider />
      <OurStorySection />
      {/* <MainContent /> */}
      <MissionVisionSection />
      <CoreValuesSection />
      <BenefitsSection />
      
      {/* Blogs Section */}
      <BlogsSection />

      {/* Stories Section */}
      <StoriesSection />

      <JoinCommunitySection />
      <Footer />
    </div>
  );
};

export default HomePage;
