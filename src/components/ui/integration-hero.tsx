"use client";

import React from "react";
import { motion } from "framer-motion";

// Google's super-reliable Favicon API caches high-quality logos globally. No CORS blocking or hotlink issues.
const getGoogleFavicon = (domain: string) => 
  `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;

const CAMPUSES_ROW1 = [
  { name: "IIT Bombay", domain: "iitb.ac.in" },
  { name: "IIT Delhi", domain: "iitd.ac.in" },
  { name: "BITS Pilani", domain: "bits-pilani.ac.in" },
  { name: "IIT Kanpur", domain: "iitk.ac.in" },
  { name: "NIT Trichy", domain: "nitt.edu" },
  { name: "IIT Madras", domain: "iitm.ac.in" },
];

const CAMPUSES_ROW2 = [
  { name: "IIT Kharagpur", domain: "iitkgp.ac.in" },
  { name: "NIT Surathkal", domain: "nitk.ac.in" },
  { name: "VIT Vellore", domain: "vit.ac.in" },
  { name: "IIT Roorkee", domain: "iitr.ac.in" },
  { name: "Delhi Univ", domain: "du.ac.in" },
  { name: "IIT Guwahati", domain: "iitg.ac.in" },
];

// Duplicate once for a seamless marquee loop (0% -> -50%)
const loopCampuses = (campuses: any[]) => [...campuses, ...campuses];

export default function IntegrationHero() {
  return (
    <section className="relative py-24 overflow-hidden w-full">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center z-10 mb-16">
        <span className="inline-block px-5 py-2 mb-6 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-[#2E7D5B]/20 bg-[#2E7D5B]/5 text-[#2E7D5B] shadow-sm backdrop-blur-md">
          🏛️ Trusted Campuses
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#1A1D1B] tracking-tight text-shadow-sm">
          Connecting Top Institutions
        </h2>
        <p className="mt-6 text-lg text-[#1A1D1B]/70 font-bold max-w-2xl mx-auto leading-relaxed">
          Verto bridges the gap across prestigious universities, ensuring lost items always find their way back securely.
        </p>
      </div>

      {/* Edge-to-edge Carousel with CSS Mask for edge fading */}
      <div 
        className="w-full overflow-hidden relative pb-8 z-10"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* Row 1 */}
        <motion.div
          className="flex gap-6 whitespace-nowrap w-max will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {loopCampuses(CAMPUSES_ROW1).map((campus, i) => (
            <div key={`r1-${i}`} className="h-[4.5rem] px-6 flex-shrink-0 rounded-[1rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-center gap-4 transition-transform hover:scale-105 hover:bg-white/80 group">
              <img 
                src={getGoogleFavicon(campus.domain)} 
                alt={`${campus.name} Logo`} 
                className="h-8 w-8 object-contain filter grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100" 
              />
              <span className="font-bold text-[#1A1D1B]/50 transition-colors duration-300 group-hover:text-[#1A1D1B] text-sm tracking-wide">
                {campus.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Row 2 */}
        <motion.div
          className="flex gap-6 whitespace-nowrap mt-6 w-max ml-[-120px] will-change-transform"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {loopCampuses(CAMPUSES_ROW2).map((campus, i) => (
            <div key={`r2-${i}`} className="h-[4.5rem] px-6 flex-shrink-0 rounded-[1rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-center gap-4 transition-transform hover:scale-105 hover:bg-white/80 group">
              <img 
                src={getGoogleFavicon(campus.domain)} 
                alt={`${campus.name} Logo`} 
                className="h-8 w-8 object-contain filter grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100" 
              />
              <span className="font-bold text-[#1A1D1B]/50 transition-colors duration-300 group-hover:text-[#1A1D1B] text-sm tracking-wide">
                {campus.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
