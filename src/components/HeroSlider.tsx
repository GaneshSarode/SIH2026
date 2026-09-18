"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Accelerating Global Energy Transition",
    subtitle: "Real-time telemetry and automated power quality compensation across microgrids, BESS, V2G, and cross-border power trade.",
    link: "/microgrids"
  },
  {
    title: "Intelligent Battery Energy Management",
    subtitle: "Optimize charge cycles and maintain grid stability with advanced HESS logic.",
    link: "/bess"
  },
  {
    title: "Bidirectional Vehicle-to-Grid Integration",
    subtitle: "Turn electric vehicle fleets into dynamic power assets for grid resilience.",
    link: "/v2g"
  },
  {
    title: "International Renewable Energy Trading",
    subtitle: "Blockchain-verified cross-border power flow and settlement.",
    link: "/trade"
  },
  {
    title: "Real-time Grid Economics & Pricing",
    subtitle: "AI-driven price optimization based on active demand.",
    link: "/pricing"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-[600px] bg-gradient-to-br from-[#f2fcf7] to-[#e2f5ec] overflow-hidden flex items-center">
      
      {/* Concentric rings background on the right */}
      <div className="absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/20 scale-[0.6]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/15 scale-[0.8]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/10 scale-[1.0]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center justify-between relative z-10 h-full">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full pt-12 md:pt-0">
          <div className="relative h-64 w-full">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6 leading-[1.1]">
                  {slide.title}
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link href={slide.link} className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(0,166,81,0.4)] hover:shadow-[0_6px_20px_rgba(0,166,81,0.6)]">
                  Explore More <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-8 bg-[#00a651]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={prevSlide} className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-[#00a651] hover:border-[#00a651] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextSlide} className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-[#00a651] hover:border-[#00a651] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Static Rotating Earth */}
        <div className="w-full md:w-1/2 absolute md:relative right-[-10%] md:right-[2%] top-1/4 md:top-auto flex items-center justify-center pointer-events-none opacity-40 md:opacity-100">
          <div className="relative w-[400px] md:w-[600px] h-[400px] md:h-[600px]">
            {/* Earth image cut in a circle and rotating slowly */}
            <div 
              className="w-full h-full rounded-full overflow-hidden shadow-2xl"
              style={{ animation: 'spin 60s linear infinite' }}
            >
              <img 
                src="/india-earth.jpg" 
                alt="GridWatch Earth Ecosystem" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}