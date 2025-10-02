"use client"

import { useEffect, useRef, useState } from "react"
import { FaRegHeart } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BsLightningCharge } from "react-icons/bs";

export default function CoreValuesSection() {
  const sectionRef = useRef(null)
  const [visibleIndexes, setVisibleIndexes] = useState([])

  useEffect(() => {
    if (sectionRef.current) {
      const children = Array.from(sectionRef.current.querySelectorAll('.core-value-item'))
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

  const values = [
    {
      title: "Compassion",
      description: "We lead with kindness and understanding in everything we do.",
      icon: <FaRegHeart />,
    },
    {
      title: "Belonging",
      description: "A space where every woman feels seen, heard, and valued.",
      icon: <TbUsers />,
    },
    {
      title: "Consistency",
      description: "We commit to sustained care, not one-off charity.",
      icon: <IoMdTime />,
    },
    {
      title: "Vulnerability",
      description: "We believe open, honest stories heal and connect us.",
      icon: <IoChatbubbleOutline />,
    },
    {
      title: "Empowerment",
      description: "Tools and community to help women thrive.",
      icon: <BsLightningCharge />,
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 core-value-item" data-index="-1">
          <span className={`text-sm font-medium text-pink-500 tracking-wider uppercase mb-4 block ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`}>Our Principles</span>
          <h2 className={`text-5xl md:text-6xl font-light text-gray-900 ${visibleIndexes.includes(-1) ? 'animate-fade-in-up' : 'opacity-0'}`}>Core Values</h2>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`w-full bg-gray-50/90 border-[1px] border-gray-100 hover:bg-gray-50 hover:border-gray-200 p-8 rounded-3xl shadow-sm core-value-item ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                } ${visibleIndexes.includes(index) ? 'animate-fade-in-up' : 'opacity-0'}`} 
                data-index={index}
              >
                <div className="flex items-center mb-4">
                  <div className={`rounded-xl shadow-sm bg-white mr-3 text-2xl text-pink-500 p-3`}>{value.icon}</div>
                  <h3 className="text-2xl font-medium text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600 text-lg font-light leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
