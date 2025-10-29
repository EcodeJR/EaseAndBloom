import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "/E&BlogoPink.png"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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

  // Helper function to check if a link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Get active link styles
  const getActiveLinkClass = (path) => {
    const active = isActive(path)
    if (active) {
      return isScrolled 
        ? "text-pink-600 font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-pink-500 after:to-purple-600 after:rounded-full" 
        : "text-white font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full"
    }
    return isScrolled 
      ? "text-gray-800 hover:text-pink-600" 
      : "text-white/90 hover:text-white"
  }

  // Get mobile active link styles
  const getMobileActiveLinkClass = (path) => {
    const active = isActive(path)
    return active
      ? "text-pink-600 font-semibold text-lg relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-gradient-to-b before:from-pink-500 before:to-purple-600 before:rounded-full"
      : "text-gray-600 text-lg font-light hover:text-pink-500"
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
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <img 
                src={logo}
                alt="Ease & Bloom Logo" 
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
              />
              <span className={`font-semibold text-lg ${isScrolled ? "text-gray-800" : "text-white"} group-hover:opacity-80 transition-opacity`}>Ease & Bloom</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/our-story" className={`${getActiveLinkClass('/our-story')} transition-all duration-300`}>
                Our Story
              </Link>
              <Link to="/blog" className={`${getActiveLinkClass('/blog')} transition-all duration-300`}>
                Blog
              </Link>
              <Link to="/share-story" className={`${getActiveLinkClass('/share-story')} transition-all duration-300`}>
                Share Your Story
              </Link>
              <Link 
                to="/waitlist" 
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  isActive('/waitlist')
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50 scale-105'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                Join Waitlist
              </Link>
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
          <Link to="/our-story" className={`${getMobileActiveLinkClass('/our-story')} transition-all duration-300 mt-3`} onClick={handleMenuToggle}>
            Our Story
          </Link>
          <Link to="/blog" className={`${getMobileActiveLinkClass('/blog')} transition-all duration-300`} onClick={handleMenuToggle}>
            Blog
          </Link>
          <Link to="/share-story" className={`${getMobileActiveLinkClass('/share-story')} transition-all duration-300`} onClick={handleMenuToggle}>
            Share Your Story
          </Link>
          <Link 
            to="/waitlist" 
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 w-full text-center mb-3 ${
              isActive('/waitlist')
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
            onClick={handleMenuToggle}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </>
  )
}
