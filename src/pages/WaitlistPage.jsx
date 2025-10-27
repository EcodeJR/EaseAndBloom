// import { useState } from 'react';
import WaitlistForm from '../components/WaitlistForm';
import { Heart, Users, Shield, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const WaitlistPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section with Background */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&q=80" 
            alt="Waitlist Background"
            className="w-full h-full object-cover brightness-75"
            loading="eager"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-12 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                <Heart className="h-20 w-20 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              The Ease & Bloom
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Mobile App
              </span>
              is Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Get ready for a revolutionary mobile experience that brings personalized mental wellness tools, community support, and expert resources right to your fingertips. Join our waitlist to be the first to know when we launch!
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-60 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>

      {/* Waitlist Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WaitlistForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WaitlistPage;
