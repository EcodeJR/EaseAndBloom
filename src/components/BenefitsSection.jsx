"use client"

import { useEffect, useRef, useState } from "react"
import { MdChatBubbleOutline } from "react-icons/md";
import { FiBookOpen } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";

export default function BenefitsSection() {
  const sectionRef = useRef(null)
  const [visibleIndexes, setVisibleIndexes] = useState([])

  useEffect(() => {
    if (sectionRef.current) {
      const children = Array.from(sectionRef.current.querySelectorAll('.benefit-item'))
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

  const benefits = [
    {
      title: "Daily Emotional Support",
      description: "Check-ins and genuine understanding from women who get it.",
      icon: <MdChatBubbleOutline />,
    },
    {
      title: "Educational Wellness Content",
      description: "Access to judgment-free resources on menstrual health.",
      icon: <FiBookOpen />,
    },
    {
      title: "A Safe Space to Heal",
      description: "Vent, share, ask questions, or find comfort in our community.",
      icon: <FaRegHeart />,
    },
    {
      title: "Pad Drives & Outreach",
      description: "Meaningful initiatives for underserved communities.",
      icon: <TbUsers />,
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gray-50 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 benefit-item" data-index="-1">
          <span className={`text-sm font-medium text-purple-500 tracking-wider uppercase mb-4 block ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`}>Our Sisterhood</span>
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`}>Benefits of Joining</h2>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 w-full">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`
                  w-full bg-white border-[1px] border-gray-200 p-8 rounded-2xl benefit-item 
                  ${visibleIndexes.includes(index) ? 'animate-fade-in-up' : 'opacity-0'}
                  ${index === 1 || index === 2 ? 'lg:col-span-2' : 'lg:col-span-1'}
                `} 
                data-index={index}
              >
                <div className="flex items-start flex-col mb-4">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-white shadow-sm rounded-md mt-2 mr-4 flex-shrink-0 text-2xl md:text-3xl text-purple-500 p-3">{benefit.icon}</div>
                    <h3 className="text-2xl text-start font-medium text-gray-900">{benefit.title}</h3>
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg font-thin leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`max-w-4xl mx-auto bg-gradient-to-tr from-purple-100 via-pink-100 to-rose-100 rounded-3xl p-12 border border-gray-200 text-center benefit-item ${visibleIndexes.includes(benefits.length) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index={benefits.length}>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4">A Note For You</h3>
          <p className="text-gray-700 font-light leading-relaxed text-2xl">
            This space is for <span className="text-pink-500 font-medium">all women</span>. Whether you struggle with period issues or not, you are welcome here.{' '}
            <span className="text-purple-600 font-medium">This is your space too</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
