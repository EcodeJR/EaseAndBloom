"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function LoadingScreen() {
  const spinnerRef = useRef(null)

  useEffect(() => {
    // GSAP animation for the loading spinner
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
    })
  }, [])

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div ref={spinnerRef} className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 rounded-full" />
    </div>
  )
}
