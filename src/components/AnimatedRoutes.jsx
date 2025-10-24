import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import WaitlistPage from '../pages/WaitlistPage';
import BlogPosts from '../pages/BlogPosts';
import BlogDetail from '../pages/BlogDetail';
import AnonymousMessages from '../pages/AnonymousMessages';
import OurStory from '../pages/OurStory';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/waitlist" element={
          <PageTransition>
            <WaitlistPage />
          </PageTransition>
        } />
        <Route path="/blog" element={
          <PageTransition>
            <BlogPosts />
          </PageTransition>
        } />
        <Route path="/blog/:slug" element={
          <PageTransition>
            <BlogDetail />
          </PageTransition>
        } />
        <Route path="/share-story" element={
          <PageTransition>
            <AnonymousMessages />
          </PageTransition>
        } />
        <Route path="/our-story" element={
          <PageTransition>
            <OurStory />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
