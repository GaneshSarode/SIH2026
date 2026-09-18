"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Battery, Car, Zap, Globe } from "lucide-react";

const slides = [
  {
    title: "Real-time telemetry and automated power quality compensation",
    subtitle: "across microgrids, BESS, V2G, and cross-border power trade.",
    link: "/microgrids",
    linkText: "Explore More",
    icon: <Globe className="w-8 h-8 md:w-12 md:h-12 text-[#00a651] mb-4 md:mb-6" />
  },
  {
    title: "Commercial Battery Storage Systems (BESS)",
    subtitle: "Monitor State of Charge, health metrics, and autonomously dispatch surplus energy to stabilize the grid.",
    link: "/bess",
    linkText: "View BESS Analytics",
    icon: <Battery className="w-8 h-8 md:w-12 md:h-12 text-[#00a651] mb-4 md:mb-6" />
  },
  {
    title: "Vehicle-to-Grid (V2G) Bi-directional Charging",
    subtitle: "Transform EV fleets into mobile power banks. Command vehicles to discharge and support grid peaks.",
    link: "/v2g",
    linkText: "Monitor EV Fleets",
    icon: <Car className="w-8 h-8 md:w-12 md:h-12 text-[#00a651] mb-4 md:mb-6" />
  },
  {
    title: "Decentralized Solar & Wind Microgrids",
    subtitle: "Live telemetry of remote renewable generation, predicting load spikes and balancing household consumption.",
    link: "/microgrids",
    linkText: "View Microgrids",
    icon: <Zap className="w-8 h-8 md:w-12 md:h-12 text-[#00a651] mb-4 md:mb-6" />
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] bg-gradient-to-br from-[#f2fcf7] to-[#e2f5ec] overflow-hidden flex items-center">
      
      {/* Concentric rings background on the right */}
      <div className="absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 w-[clamp(280px,40vw,900px)] h-[clamp(280px,40vw,900px)] pointer-events-none">
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/20 scale-[0.6]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/15 scale-[0.8]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/10 scale-[1.0]"></div>
      </div>

      <div className="mx-auto px-4 md:px-[clamp(1rem,3vw,4rem)] w-full max-w-[90vw] 2xl:max-w-[1600px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 md:gap-0 relative z-10 h-full py-12 md:py-0">
        
        {/* Left Side: Text Content Slider */}
        <div className="w-full md:w-[55%] flex flex-col justify-center h-full pt-8 md:pt-0 text-center md:text-left items-center md:items-start relative min-h-[400px]">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 flex flex-col justify-center text-center md:text-left items-center md:items-start transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? "opacity-100 translate-y-0 pointer-events-auto" 
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              {slide.icon}
              <h1 className="font-light text-gray-800 mb-[clamp(1rem,1.5vw,2.5rem)] leading-[1.15] text-[clamp(28px,3.5vw,64px)]">
                {slide.title}
              </h1>
              <p className="text-gray-600 mb-[clamp(1.5rem,2vw,3rem)] max-w-[clamp(300px,35vw,700px)] leading-relaxed text-[clamp(16px,1.25vw,24px)]">
                {slide.subtitle}
              </p>
              <div>
                <Link href={slide.link} className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-[clamp(1.5rem,2vw,2.5rem)] py-[clamp(0.75rem,1vw,1.25rem)] rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(0,166,81,0.4)] hover:shadow-[0_6px_20px_rgba(0,166,81,0.6)] text-[clamp(14px,1vw,18px)]">
                  {slide.linkText} <ArrowRight className="w-[clamp(1rem,1.25vw,1.5rem)] h-[clamp(1rem,1.25vw,1.5rem)]" />
                </Link>
              </div>
            </div>
          ))}

          {/* Slider Indicators */}
          <div className="absolute bottom-0 md:-bottom-12 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentSlide ? "bg-[#00a651] w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Static Rotating Earth */}
        <div className="w-full md:w-[45%] flex items-center justify-center pointer-events-none opacity-80 md:opacity-100">
          <div className="relative w-[clamp(260px,38vw,750px)] h-[clamp(260px,38vw,750px)] flex-shrink-0">
            {/* Earth image cut in a circle and rotating slowly */}
            <div 
              className="w-full h-full rounded-full overflow-hidden"
              style={{ animation: 'spin 60s linear infinite', boxShadow: '0 0 60px rgba(0,166,81,0.15)' }}
            >
              <img 
                src="/india-earth.jpg" 
                alt="GridWatch Earth Ecosystem" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}