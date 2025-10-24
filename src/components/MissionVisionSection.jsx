"use client"

import { useEffect, useRef, useState } from "react"
import { FiTarget } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
export default function MissionVisionSection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`py-20 px-6 bg-gray-50 transition-all duration-700 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-purple-500 tracking-wider uppercase mb-4 block">Our Purpose</span>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900">Mission & Vision</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="text-start md:text-left flex">
            <div className="text-pink-500 text-2xl mr-6 p-3 bg-white rounded-xl shadow h-fit"><FiEye /></div>
            <div className="flex flex-col items-start justify-start mb-4">
              
              <h3 className="text-2xl font-light text-gray-900 text-center my-4">Our Vision</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
              To create a <span className="text-pink-500">safe and empowering community</span> for women to freely discuss menstrual health, while providing <span className="font-bold">sustainable access to period care</span> for underserved communities.
            </p>
            </div>
            
          </div>

          <div className="text-start md:text-left flex">
            <div className="text-purple-500 text-2xl mr-6 p-3 bg-white rounded-xl shadow h-fit"><FiTarget /></div>
            <div className="flex flex-col items-start justify-start mb-4">
              
              <h3 className="text-2xl font-light text-gray-900 text-center my-4">Our Mission</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
              To <span className="text-purple-600">end period shame globally</span> and ensure no woman or girl ever feels alone, unworthy, or silenced during her menstrual journey.
            </p>
            </div>
            
          </div>
        </div>

        <hr className="bg-gray-100 border-0 h-px my-5" />
        <div className="text-center">
          <p className="text-4xl md:text-6xl font-light text-gray-700">
            We believe that <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text font-medium">no woman should suffer in
            silence</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
