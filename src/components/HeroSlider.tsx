import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSlider() {
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
        <div className="w-full md:w-[55%] flex flex-col justify-center h-full pt-12 md:pt-0">
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-light text-gray-800 mb-6 leading-[1.15]">
            Real-time telemetry and automated power quality compensation
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            across microgrids, BESS, V2G, and cross-border power trade.
          </p>
          <div>
            <Link href="/microgrids" className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(0,166,81,0.4)] hover:shadow-[0_6px_20px_rgba(0,166,81,0.6)]">
              Explore More <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right Side: Static Rotating Earth */}
        <div className="w-full md:w-[45%] absolute md:relative right-[-10%] md:right-[2%] top-1/4 md:top-auto flex items-center justify-center pointer-events-none opacity-40 md:opacity-100">
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