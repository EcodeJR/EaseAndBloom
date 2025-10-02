"use client"

import { useEffect, useState } from "react"
import { FaRegHeart } from "react-icons/fa";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/70 backdrop-blur-md border-b border-white/20 text-gray-800" : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-36 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className={`w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isScrolled ? "" : ""}`}>
                <FaRegHeart className="text-white text-lg" />
              </div>
              <span className={`font-semibold text-lg ${isScrolled ? "text-gray-800" : "text-white"}`}>Ease & Bloom</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className={`${isScrolled ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"} transition-colors`}>
                Our Story
              </a>
              <a href="#" className={`${isScrolled ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"} transition-colors`}>
                Our Mission
              </a>
              <a href="#" className={`${isScrolled ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"} transition-colors`}>
                Get Involved
              </a>
              <button className={`bg-white ${isScrolled ? "text-gray-900" : "text-gray-900"} px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors`}>
                Join Community
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className={`md:hidden ${isScrolled ? "text-gray-800" : "text-white"}`} onClick={handleMenuToggle} aria-label="Open menu">
              {menuOpen ? (
                // X icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // 3-bar icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed top-[64px] left-0 right-0 z-40 transition-all duration-300 ${
          menuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        } origin-top bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg`}
        style={{ minHeight: menuOpen ? '180px' : '0', overflow: 'hidden' }}
      >
        <div className="flex flex-col items-start gap-6 p-8">
          <a href="#" className="text-gray-600 text-lg font-light hover:text-pink-500 transition-colors mt-3" onClick={handleMenuToggle}>
            Our Story
          </a>
          <a href="#" className="text-gray-600 text-lg font-light hover:text-pink-500 transition-colors" onClick={handleMenuToggle}>
            Our Mission
          </a>
          <a href="#" className="text-gray-600 text-lg font-light hover:text-pink-500 transition-colors mb-3" onClick={handleMenuToggle}>
            Get Involved
          </a>
          <button className="bg-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors w-full" onClick={handleMenuToggle}>
            Join Community
          </button>
        </div>
      </div>
    </>
  )
}
