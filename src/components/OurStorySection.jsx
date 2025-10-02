"use client"

import { useEffect, useRef, useState } from "react"

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
          <p className="text-gray-700 text-xl md:text-2xl font-light leading-relaxed mb-6">
            I was{" "}
            <span className="text-pink-500 font-medium">
              17 when I started bleeding excessively
            </span>
            . It wasn't just the blood—it was the missed classes, the hospital
            visits, the shame, and the terrifying thought that I was cursed.
          </p>
          <p className="text-purple-500 font-medium text-xl md:text-2xl mb-6">
            I felt broken. Alone. Silent.
          </p>
        </div>

        <blockquote className="text-2xl md:text-3xl font-thin text-gray-500 italic leading-relaxed">
          "But as I grew older, I realized something heartbreaking: I wasn't the
          only one."
        </blockquote>
      </div>
    </section>
  )
}
