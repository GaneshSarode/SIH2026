"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/hero_earth_ecosystem.jpg",
    title: "Real-time telemetry and automated power quality compensation",
    subtitle: "across microgrids, BESS, V2G, and cross-border power trade.",
    link: "/microgrids"
  },
  {
    image: "/card-bess.jpg",
    title: "Intelligent Battery Energy Storage Management",
    subtitle: "Optimize charge cycles and maintain grid stability with HESS logic.",
    link: "/bess"
  },
  {
    image: "/card-v2g.jpg",
    title: "Bidirectional Vehicle-to-Grid Integration",
    subtitle: "Turn electric vehicle fleets into dynamic power assets.",
    link: "/v2g"
  },
  {
    image: "/card-trade.png",
    title: "International Renewable Energy Trading",
    subtitle: "Blockchain-verified cross-border power flow.",
    link: "/trade"
  },
  {
    image: "/card-pricing.png",
    title: "Real-time Grid Economics & Dynamic Pricing",
    subtitle: "AI-driven price optimization based on active demand.",
    link: "/pricing"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-[600px] bg-gray-900 overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className={`absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
          />
        </div>
      ))}
      
      {/* Waaree Signature Blue Text Box (Bottom Left) */}
      <div className="absolute bottom-0 left-0 w-full md:w-[600px] bg-[#004b87] p-10 md:p-14 z-10 text-white">
        <h2 className="text-[#00a651] font-bold tracking-widest uppercase mb-2 text-sm">GridWatch Platform</h2>
        
        <div className="relative h-40">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute top-0 left-0 w-full transition-all duration-700 ${index === currentSlide ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
              <h1 className="text-3xl md:text-4xl font-black mb-4 leading-[1.15] text-white">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg font-light text-gray-200 mb-6 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link href={slides[currentSlide].link} className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-6 py-3 font-bold uppercase tracking-wide transition-colors rounded-sm">
            Launch Platform <ArrowRight className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2">
            <button onClick={prevSlide} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={nextSlide} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1.5 transition-all duration-300 ${index === currentSlide ? 'bg-[#00a651]' : 'bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}