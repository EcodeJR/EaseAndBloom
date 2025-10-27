"use client"

import { useEffect, useRef, useState } from "react"
import { FaRegHeart } from "react-icons/fa";
import { CheckCircle, ArrowRight } from "lucide-react";
import GoogleFormConfirmation from './GoogleFormConfirmation';

export default function JoinCommunitySection() {
  const sectionRef = useRef(null)
  const [visibleIndexes, setVisibleIndexes] = useState([])
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (sectionRef.current) {
      const children = Array.from(sectionRef.current.querySelectorAll('.join-action-item'))
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleIndexes((prev) => [...prev, Number(entry.target.dataset.index)])
          }
        })
      }, { threshold: 0.2 })
      children.forEach((child) => observer.observe(child))
      return () => observer.disconnect()
    }
  }, [])

  const handleJoinCommunity = () => {
    // Show confirmation message immediately
    setShowConfirmation(true);
  }

  const handleContinueToGuidelines = () => {
    setShowConfirmation(false);
    setShowGuidelines(true);
  }

  const handleAcceptGuidelines = () => {
    // Redirect to Telegram/WhatsApp group
    window.open('https://t.me/+J6xbUHVZcdY5ZjBk', '_blank');
  }

  const benefits = [
    {
      title: "Express Interest Intentionally",
      description: "You've made a conscious decision to be part of our supportive community.",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Read Community Rules",
      description: "You understand our guidelines and agree to maintain a respectful environment.",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Give Consent to Join Respectfully",
      description: "You're committed to contributing positively to our sisterhood.",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
  ]

  if (showConfirmation) {
    return <GoogleFormConfirmation onContinue={handleContinueToGuidelines} />;
  }

  if (showGuidelines) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen" id="join-community">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
                <FaRegHeart className="h-8 w-8 text-pink-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Community Guidelines
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Welcome to Ease & Bloom! Please read our community guidelines to ensure a safe and supportive environment for everyone.
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Community Values</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Respect and kindness towards all members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Confidentiality and privacy protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Supportive and non-judgmental environment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>No spam, self-promotion, or harmful content</span>
                  </li>
                </ul>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What to Expect</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Daily support and encouragement from fellow members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Expert advice and resources shared regularly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Safe space to share your experiences and challenges</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Access to exclusive events and workshops</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">
                By clicking below, you agree to follow these guidelines and contribute positively to our community.
              </p>
              <button 
                onClick={handleAcceptGuidelines}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                I Accept & Join
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white" id="join-community">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 join-action-item ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index="-1">
          <span className="text-sm font-medium text-pink-500 tracking-wider uppercase mb-4 block">Join Our Community</span>
          
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className={`text-center mb-12 join-action-item ${visibleIndexes.includes(10) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index="10">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Every member should:</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 join-action-item ${visibleIndexes.includes(index + 20) ? 'animate-fade-in-up' : 'opacity-0'}`}
                data-index={index + 20}
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 p-12 lg:p-20 rounded-3xl text-center text-white max-w-2xl mx-auto join-action-item ${visibleIndexes.includes(30) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index="30">
          <h3 className="text-4xl font-light mb-4">Ready to Join?</h3>
          <p className="text-xl my-8 opacity-90">
            Connect with thousands of women who understand. Your journey to healing and sisterhood starts here.
          </p>
          <button 
            onClick={handleJoinCommunity}
            className="inline-flex items-center justify-center gap-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white text-gray-900 hover:bg-gray-200 px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-medium transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <span className="hidden sm:inline">I Understand & Accept - Take Me to the Community</span>
            <span className="sm:hidden">Join the Community</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </section>
  )
}
