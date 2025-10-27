import { FaInstagram } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { logo } from "../../public/E&BlogoPink.png"

export default function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`bg-slate-900 text-white transition-all duration-700 ${
        visible ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img 
                src={logo} 
                alt="Ease & Bloom Logo" 
                className="w-12 h-12"
              />
              <span className="text-white font-light text-3xl">
                Ease & Bloom
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Building communities globally</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:easeandblooom@gmail.com">
                  easeandblooom@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-white text-xl font-light mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/our-story"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/share-story"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link
                  to="/waitlist"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Join Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="text-white font-light mb-6 text-xl">Connect</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://x.com/_easeandbloom?s=21&t=ugcb_jYgY45NnGc5HyN1_g"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaXTwitter className="text-pink-400" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/gluconfectioneries/"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaLinkedin className="text-pink-400" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/share/BARfkQZx2k"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaInstagram className="text-pink-400" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/15H6CWb3tW/?mibextid=wwXIfr"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FiFacebook className="text-pink-400" />
                  Facebook
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MdOutlineMailOutline className="text-pink-400" />
                  Email
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="border-t border-gray-700 mt-12 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-white text-2xl font-light mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-500 mb-8">
              Be the first to know about our community events, wellness content,
              and ways to get involved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link 
                to="/waitlist"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 text-center"
              >
                Join Our Waitlist
              </Link>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Ease & Bloom. A safe space for women's health and empowerment.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
