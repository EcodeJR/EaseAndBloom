import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function LoadingSpinner({ size = "default", fullScreen = false }) {
  const spinnerRef = useRef(null)

  useEffect(() => {
    // GSAP animation for the loading spinner
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1,
      })
    }
  }, [])

  // Size variants
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    default: "w-10 h-10 border-2",
    large: "w-16 h-16 border-3"
  }

  const spinnerClass = sizeClasses[size] || sizeClasses.default

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div 
          ref={spinnerRef} 
          className={`${spinnerClass} border-gray-300 border-t-gray-900 rounded-full`}
        />
      </div>
    )
  }

  return (
    <div 
      ref={spinnerRef} 
      className={`${spinnerClass} border-gray-300 border-t-gray-900 rounded-full`}
    />
  )
}
