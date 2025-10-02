import './App.css';
import BenefitsSection from './components/BenefitsSection';
import CoreValuesSection from './components/CoreValuesSection';
import Footer from './components/Footer';
import HeroSlider from './components/HeroSlider';
import JoinMovementSection from './components/JoinMovementSection';
import MainContent from './components/MainContent';
import MissionVisionSection from './components/MissionVisionSection';
import Navigation from './components/Navigation';
import OurStorySection from './components/OurStorySection';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navigation />
      <HeroSlider />
      <OurStorySection />
      {/* <MainContent /> */}
      <MissionVisionSection />
      <CoreValuesSection />
      <BenefitsSection />
      <JoinMovementSection />
      <Footer />
    </div>
  );
}

export default App;
