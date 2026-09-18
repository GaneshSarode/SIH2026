import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSlider() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] bg-gradient-to-br from-[#f2fcf7] to-[#e2f5ec] overflow-hidden flex items-center">
      
      {/* Concentric rings background on the right */}
      <div className="absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 w-[clamp(280px,40vw,900px)] h-[clamp(280px,40vw,900px)] pointer-events-none">
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/20 scale-[0.6]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/15 scale-[0.8]"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-[#00a651]/10 scale-[1.0]"></div>
      </div>

      <div className="mx-auto px-4 md:px-[clamp(1rem,3vw,4rem)] w-full max-w-[90vw] 2xl:max-w-[1600px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 md:gap-0 relative z-10 h-full py-12 md:py-0">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-[55%] flex flex-col justify-center h-full pt-8 md:pt-0 text-center md:text-left items-center md:items-start">
          <h1 className="font-light text-gray-800 mb-[clamp(1rem,1.5vw,2.5rem)] leading-[1.15] text-[clamp(28px,3.5vw,64px)]">
            Real-time telemetry and automated power quality compensation
          </h1>
          <p className="text-gray-600 mb-[clamp(1.5rem,2vw,3rem)] max-w-[clamp(300px,35vw,700px)] leading-relaxed text-[clamp(16px,1.25vw,24px)]">
            across microgrids, BESS, V2G, and cross-border power trade.
          </p>
          <div>
            <Link href="/microgrids" className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-[clamp(1.5rem,2vw,2.5rem)] py-[clamp(0.75rem,1vw,1.25rem)] rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(0,166,81,0.4)] hover:shadow-[0_6px_20px_rgba(0,166,81,0.6)] text-[clamp(14px,1vw,18px)]">
              Explore More <ArrowRight className="w-[clamp(1rem,1.25vw,1.5rem)] h-[clamp(1rem,1.25vw,1.5rem)]" />
            </Link>
          </div>
        </div>

        {/* Right Side: Static Rotating Earth */}
        <div className="w-full md:w-[45%] flex items-center justify-center pointer-events-none opacity-80 md:opacity-100">
          <div className="relative w-[clamp(240px,28vw,600px)] h-[clamp(240px,28vw,600px)] flex-shrink-0">
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