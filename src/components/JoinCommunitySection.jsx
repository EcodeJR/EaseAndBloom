"use client"

import { useEffect, useRef, useState } from "react"
import { FaRegHeart } from "react-icons/fa";
import { ArrowRight, Mail, ExternalLink } from "lucide-react";

export default function JoinCommunitySection() {
  const sectionRef = useRef(null)
  const [visibleIndexes, setVisibleIndexes] = useState([])
  const [showFormInfo, setShowFormInfo] = useState(false)

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
    setShowFormInfo(true);
  }

  if (showFormInfo) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen flex items-center justify-center" id="join-community">
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
                <FaRegHeart className="h-10 w-10 text-pink-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Join Our Community
              </h1>
              <p className="text-xl text-gray-600">
                We're excited to welcome you to Ease & Bloom!
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Fill Out the Registration Form</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Click the button below to complete our quick registration form. Please provide a valid email address.
                  </p>
                  <a 
                    href="https://forms.gle/JuyrDjNapxkXxBir6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Open Registration Form
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-blue-500" />
                    Check Your Email
                  </h3>
                  <p className="text-lg text-gray-700 mb-3">
                    After submitting the form, <strong>you'll receive an email</strong> with:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>A link to join our community</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Community guidelines and rules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Welcome information</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    💡 Please check your spam/junk folder if you don't see the email within a few minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setShowFormInfo(false)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back
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
        {/* <div className="mb-16">
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
        </div> */}

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
