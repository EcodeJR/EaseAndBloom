"use client"

import { useEffect, useRef, useState } from "react"
import { FaRegHeart } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { TfiAnnouncement } from "react-icons/tfi";
import { LuHandshake } from "react-icons/lu";

export default function JoinMovementSection() {
  const sectionRef = useRef(null)
  const [visibleIndexes, setVisibleIndexes] = useState([])

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

  const actions = [
    {
      title: "Donate",
      description: "Support our monthly pad drives and community initiatives.",
      icon: <FaRegHeart />,
    },
    {
      title: "Volunteer",
      description: "Join our team of community champions and change-makers.",
      icon: <TbUsers />,
    },
    {
      title: "Spread the Word",
      description: "Help us reach more women who need this community.",
      icon: <TfiAnnouncement />,
    },
    {
      title: "Partner with Us",
      description: "Collaborate with like-minded organizations.",
      icon: <LuHandshake />,
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 join-action-item ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index="-1">
          <span className="text-sm font-medium text-pink-500 tracking-wider uppercase mb-4 block">Take Action</span>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900">Join Our Movement</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {actions.map((action, index) => (
            <div
              key={index}
              className={`bg-white border-[1px] border-white p-9 rounded-2xl text-center hover:bg-gray-50 hover:border-gray-200 hover:border-[1px] transition-bg flex flex-col items-center justify-center font-light join-action-item ${visibleIndexes.includes(index) ? 'animate-fade-in-up' : 'opacity-0'}`}
              data-index={index}
            >
              <div className="text-3xl mb-4 text-pink-500 bg-gray-100 rounded-xl p-4">{action.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{action.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{action.description}</p>
            </div>
          ))}
        </div>
        <div className={`bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 p-12 lg:p-20 rounded-3xl text-center text-white max-w-2xl mx-auto join-action-item ${visibleIndexes.includes(actions.length) ? 'animate-fade-in-up' : 'opacity-0'}`} data-index={actions.length}>
          <h3 className="text-4xl font-light mb-4">Ready to Join?</h3>
          <p className="text-xl my-8 opacity-90">
            Connect with thousands of women who understand. Your journey to healing and sisterhood starts here.
          </p>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 bg-white text-gray-900 hover:bg-gray-200 px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105">
            Join Our Movement →
          </button>
        </div>
      </div>
    </section>
  )
}
