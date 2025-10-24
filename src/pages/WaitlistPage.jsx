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
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-pink-900/80">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
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

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our Mobile App Will Transform Your Mental Wellness Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience mental wellness support like never before with our innovative mobile app designed for modern life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always With You</h3>
              <p className="text-gray-600">
                Access your personalized mental wellness tools, mood tracking, and resources anywhere, anytime through our intuitive mobile app.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Connection</h3>
              <p className="text-gray-600">
                Connect instantly with our supportive community, share experiences, and find encouragement through our mobile-first social features.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your mental health data is protected with bank-level security, end-to-end encryption, and complete privacy controls on your device.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Get AI-powered insights, personalized recommendations, and progress tracking based on evidence-based mental health practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Be the First to Download Our Mobile App
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our exclusive waitlist and get early access to the Ease & Bloom mobile app when we launch. You'll also receive exclusive updates, beta testing opportunities, and special launch offers.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WaitlistPage;
