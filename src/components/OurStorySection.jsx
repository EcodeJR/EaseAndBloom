"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function OurStorySection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-6 bg-white transition-all duration-700 ${
        visible ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4">
          <span className="text-xs font-medium text-pink-500 tracking-wider uppercase">
            Our Story
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
          Breaking the <span className="text-pink-500">Silence</span>
        </h2>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed">
            I was{" "}
            <span className="text-pink-500 font-medium">
              17 when I started bleeding excessively
            </span>
            . It wasn't just the blood—it was the missed classes, the hospital
            visits, the shame, and the terrifying thought that I was cursed.
          </p>
        </div>

        <Link 
          to="/our-story"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
        >
          Read Full Story
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
