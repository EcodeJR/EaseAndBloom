import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const OurStory = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-indigo-900/80">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
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
        <div className="max-w-4xl mx-auto">
          {/* Opening */}
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-pink-500 tracking-wider uppercase mb-4 block">
              The Silence
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-8">
              There's a silence that surrounds <span className="text-pink-500">women's pain</span>
            </h2>
          </div>

          {/* Story Sections */}
          <div className="space-y-16">
            {/* First Section */}
            <div className="bg-gray-50/50 p-8 rounded-3xl shadow-sm">
              <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
                It lingers in classrooms, where girls shift uncomfortably in blood-stained uniforms.
              </p>
              <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
                In hospital waiting rooms, where no one explains why the bleeding won't stop.
              </p>
            </div>

            {/* Personal Story */}
            <div className="text-center">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
                  At seventeen, I bled for weeks.
                </p>
                <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-4">
                  Not metaphorically, literally.
                </p>
                <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
                  The kind of bleeding that interrupts exams, friendships, daily life.
                </p>
                <div className="space-y-4">
                  <p className="text-pink-500 font-medium text-xl md:text-2xl">
                    I missed school. I lost weight. I felt afraid of my own body.
                  </p>
                </div>
              </div>
            </div>

            {/* The Silence */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
                But what stayed with me most wasn't the pain.
              </h3>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl shadow-sm">
                <p className="text-2xl md:text-3xl font-medium text-pink-600 mb-6">
                  It was the silence.
                </p>
                <div className="space-y-4 text-gray-700 text-lg md:text-xl font-light leading-relaxed">
                  <p>No one talked about it.</p>
                  <p>Not the doctors. Not my teachers. Not even my friends.</p>
                  <p className="text-pink-500 font-medium">I thought I was cursed. I thought I was alone.</p>
                </div>
              </div>
            </div>

            {/* Realization */}
            <div className="text-center">
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
                  But I wasn't.
                </p>
                <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-8">
                  There are millions of girls and women who carry this quiet suffering, folding tissue paper into their underwear, keeping extra skirts in their school bags, hiding pain with polite smiles.
                </p>
              </div>
            </div>

            {/* Birth of Ease & Bloom */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
                Ease & Bloom was born from that silence.
              </h3>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl shadow-sm">
                <div className="space-y-6 text-gray-700 text-lg md:text-xl font-light leading-relaxed">
                  <p>It was born for the girl in the bathroom stall, crying softly.</p>
                  <p>For the woman who never had the words to explain her pain.</p>
                  <p className="text-purple-600 font-medium">For every cycle we were told to hide.</p>
                </div>
              </div>
            </div>

            {/* Final Message */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-3xl shadow-lg text-white">
                <h3 className="text-3xl md:text-4xl font-light mb-6">
                  This is our soft place to land.
                </h3>
                <div className="space-y-4 text-lg md:text-xl font-light leading-relaxed">
                  <p>Our circle of care.</p>
                  <p>Our community of truth-telling, healing, and rising.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-purple-500 tracking-wider uppercase mb-4 block">
              Our Commitment
            </span>
            <h2 className="text-5xl md:text-6xl font-light text-gray-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Compassion</h3>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                  We lead with kindness and understanding in everything we do.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Community</h3>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                  A space where every woman feels seen, heard, and valued.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Safety</h3>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                  Creating a safe space for vulnerability and healing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default OurStory;
