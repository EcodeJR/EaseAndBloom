"use client"

import { useEffect, useRef } from "react"

export default function MainContent() {
  const contentRef = useRef(null)

  useEffect(() => {
    // GSAP animation for content entrance
    if (typeof window !== "undefined" && window.gsap) {
      const { gsap } = window

      gsap.fromTo(contentRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
    }
  }, [])

  return (
    <div ref={contentRef} className="min-h-screen bg-white">
      {/* Hero Section - Will be populated with slider when you provide screenshots */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Clone Ready</h1>
          <p className="text-lg text-gray-600">
            Waiting for hero slider and landing page screenshots to complete the build
          </p>
        </div>
      </section>
    </div>
  )
}
