"use client"

import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"

const slides = [
	{
		id: 1,
		label: "WELCOME TO",
		title: "Ease & Bloom",
		description:
			"A safe, supportive community where women feel seen, heard, and held—especially during their most vulnerable moments.",
		image:
			"https://images.unsplash.com/photo-1580494412804-90550d4638a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fHN1cHBvcnRpdmUlMjBjb21tdW5pdHklMjBvZiUyMHlvdW5nJTIwYmxhY2slMjB3b21lbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600&crop=center", // women together, community
	},
	{
		id: 2,
		label: "OUR MISSION",
		title: "End Period Shame",
		description:
			"Creating a world where every woman has access to dignity, emotional support, and the care she deserves.",
		image:
			"https://images.unsplash.com/photo-1508204841652-6c134d77ce0c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGVtb3Rpb25hbCUyMHN1cHBvcnRpdmUlMjB5b3VuZyUyMGJsYWNrJTIwd29tZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600&crop=center", // Updated URL
	},
	{
		id: 3,
		label: "OUR PROMISE",
		title: "A Safe Space to Be Seen & Supported",
		description:
			"More than conversations, we are building a trusted community for menstrual wellness, sisterhood, and support through every cycle.",
		image:
			"https://images.unsplash.com/photo-1654184488778-3141459d7afc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHNpc3Rlcmhvb2QlMkMlMjBoZWFsaW5nJTJDJTIweW91bmclMjBibGFjayUyMHdvbWVufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600&crop=center", // sisterhood, healing
	},
]

export default function HeroSlider() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const slideRef = useRef(null)

	useEffect(() => {
		const interval = setInterval(() => {
			nextSlide()
		}, 10000)

		return () => clearInterval(interval)
	}, [currentSlide])

	useEffect(() => {
		if (slideRef.current) {
			// Animate slide content on mount and slide change
			gsap.fromTo(
				slideRef.current,
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1, ease: "power2.out" }
			)
		}
	}, [currentSlide])

	const nextSlide = () => {
		if (isAnimating) return
		setIsAnimating(true)

		setTimeout(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length)
			setIsAnimating(false)
		}, 300)
	}

	const prevSlide = () => {
		if (isAnimating) return
		setIsAnimating(true)

		setTimeout(() => {
			setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
			setIsAnimating(false)
		}, 300)
	}

	const goToSlide = (index) => {
		if (isAnimating || index === currentSlide) return
		setIsAnimating(true)

		setTimeout(() => {
			setCurrentSlide(index)
			setIsAnimating(false)
		}, 300)
	}

	return (
		<section className="relative h-screen overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0">
				<img
					src={slides[currentSlide].image || "/placeholder.svg"}
					alt={slides[currentSlide].title}
					className="w-full h-full object-cover brightness-75"
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 h-full flex items-center font-poppins">
				<div className="max-w-7xl mx-auto px-6 md:p-32 w-full">
					<div ref={slideRef} className="max-w-2xl">
						<p className="text-pink-400 text-xs font-medium tracking-[0.2em] mb-6 uppercase">
							{slides[currentSlide].label}
						</p>
						<h1 className="text-white text-6xl md:text-8xl lg:text-8xl font-extralight tracking-tight leading-[0.85] mb-12">
							{slides[currentSlide].title}
						</h1>
						<p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
							{slides[currentSlide].description}
						</p>
						<a 
							href="#join-community" 
							className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 group"
						>
							Join Our Community
							<svg
								className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			{/* Navigation Arrows */}
			<button
				onClick={prevSlide}
				className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				onClick={nextSlide}
				className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>

			{/* Slide Indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{slides.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							index === currentSlide ? "bg-white" : "bg-white/40"
						}`}
					/>
				))}
			</div>
		</section>
	)
}
