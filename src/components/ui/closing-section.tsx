"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   Each lost item: image + label in a glass card
   Uses `bottom` positioning so items always start below viewport
   and animate upward. Multiple instances with different delays
   create a truly continuous / endless stream.
───────────────────────────────────────────────────────────── */

interface ItemDef {
  img: string;
  label: string;
  alt: string;
}

const ITEMS: ItemDef[] = [
  {
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=120&q=80",
    label: "Brown Wallet",
    alt: "wallet",
  },
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=120&q=80",
    label: "House Keys",
    alt: "keys",
  },
  {
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80",
    label: "Backpack",
    alt: "bag",
  },
  {
    img: "https://images.unsplash.com/photo-1586495777744-4e6232bf2263?auto=format&fit=crop&w=120&q=80",
    label: "Water Bottle",
    alt: "bottle",
  },
  {
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=120&q=80",
    label: "Sneakers",
    alt: "sneakers",
  },
  {
    img: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=120&q=80",
    label: "iPhone",
    alt: "phone",
  },
];

/* 
  Each lane is: a specific x position, with multiple items
  staggered so when one fades out at top, the next is already rising.
  duration = time to travel full height
  We use `initialDelay` spread across instances to fill the timeline.
*/
interface LaneConfig {
  left: string;
  rotate: number;
  duration: number;
  xWave: number;  // horizontal sway px
  item: ItemDef;
  instances: number; // how many simultaneous copies staggered
  size: "sm" | "md";
}

const LANES: LaneConfig[] = [
  { left: "4%",  rotate: -8,  duration: 11, xWave: 18, item: ITEMS[0], instances: 3, size: "md" },
  { left: "18%", rotate: 5,   duration: 13, xWave: 14, item: ITEMS[1], instances: 3, size: "sm" },
  { left: "34%", rotate: -4,  duration: 10, xWave: 20, item: ITEMS[2], instances: 3, size: "md" },
  { left: "52%", rotate: 8,   duration: 12, xWave: 16, item: ITEMS[3], instances: 3, size: "sm" },
  { left: "68%", rotate: -6,  duration: 14, xWave: 22, item: ITEMS[4], instances: 3, size: "md" },
  { left: "82%", rotate: 4,   duration: 11, xWave: 12, item: ITEMS[5], instances: 3, size: "sm" },
];

interface FloatingCardProps {
  lane: LaneConfig;
  instanceIdx: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ lane, instanceIdx }) => {
  const { left, rotate, duration, xWave, item, instances, size } = lane;
  // Stagger each instance evenly across the duration so the stream is always filled
  const delay = (duration / instances) * instanceIdx;

  const imgClass = size === "sm" ? "w-20 h-20" : "w-28 h-28";

  return (
    <motion.div
      className="absolute pointer-events-none z-10 opacity-90"
      style={{ left, bottom: "-120px" }}
      animate={{
        y: [0, -(window?.innerHeight ?? 900) - 200],
        x: [0, xWave, -xWave * 0.6, xWave * 0.3, 0],
        rotate: [rotate, rotate + 6, rotate - 4, rotate + 2, rotate],
        opacity: [0, 0.85, 0.85, 0.85, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.1, 0.5, 0.9, 1],
        repeatDelay: 0,
      }}
    >
      {/* Feathered image, no distinct borders/corners */}
      <div
        className="flex flex-col items-center gap-3"
        style={{ minWidth: size === "sm" ? 100 : 130 }}
      >
        <div 
          className={`${imgClass}`}
          style={{
            WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 75%)",
            maskImage: "radial-gradient(circle, black 30%, transparent 75%)",
          }}
        >
          <img
            src={item.img}
            alt={item.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback: hide broken images gracefully
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <span className="text-[10px] font-semibold text-[#1A1D1B]/50 tracking-widest uppercase whitespace-nowrap leading-none">
          {item.label}
        </span>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Firefly particle
───────────────────────────────────────────── */
const Firefly: React.FC<{ delay: number; x: number; color: string }> = ({ delay, x, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 4, height: 4,
      backgroundColor: color,
      left: `${x}%`,
      bottom: "5%",
      boxShadow: `0 0 10px 3px ${color}`,
    }}
    animate={{ y: [0, -700], opacity: [0, 1, 0.7, 0], scale: [0.5, 1.6, 0.8, 0], x: [0, 18, -12, 6] }}
    transition={{ duration: 7 + (delay % 4), delay, repeat: Infinity, ease: "easeOut", repeatDelay: 0 }}
  />
);

/* ─────────────────────────────────────────────
   Floating organic petal
───────────────────────────────────────────── */
const Petal: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: `${x}%`,
      bottom: "6%",
      width: 10, height: 14,
      background: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(190,240,210,0.55))",
      borderRadius: "50% 20% 50% 20%",
    }}
    animate={{
      y: [0, -620],
      x: [0, 30, -25, 15],
      rotate: [0, 200, 360],
      opacity: [0, 0.85, 0.7, 0],
    }}
    transition={{ duration: 9 + (delay % 5), delay, repeat: Infinity, ease: "easeInOut", repeatDelay: 0 }}
  />
);

/* ─────────────────────────────────────────────
   Main Closing Section
───────────────────────────────────────────── */
export default function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hoverBtn, setHoverBtn] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const springX = useSpring(mouse.x * 20, { stiffness: 55, damping: 18 });
  const springY = useSpring(mouse.y * 14, { stiffness: 55, damping: 18 });

  const fireflyColors = [
    "#FFD700","#00E5FF","#2E7D5B","#ADFF2F","#FFD700","#00E5FF",
    "#ADFF2F","#2E7D5B","#00E5FF","#FFD700","#ADFF2F","#2E7D5B",
    "#FFD700","#00E5FF","#ADFF2F","#FFD700","#2E7D5B","#00E5FF",
  ];

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden z-30"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), " +
          "linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)",
        WebkitMaskComposite: "destination-in",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), " +
          "linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)",
        maskComposite: "intersect",
      }}
    >
      {/* ── Volumetric light rays ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[12, 30, 50, 68, 86].map((left, i) => (
          <motion.div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${left}%`,
              width: 1,
              background: `linear-gradient(180deg, rgba(255,255,255,${0.07 + i * 0.012}) 0%, transparent 75%)`,
              transform: `rotate(${(i - 2) * 3}deg)`,
              transformOrigin: "top center",
            }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 }}
          />
        ))}
      </div>

      {/* ── Continuous floating item lanes ── */}
      {LANES.map((lane, li) =>
        Array.from({ length: lane.instances }).map((_, ii) => (
          <FloatingCard key={`${li}-${ii}`} lane={lane} instanceIdx={ii} />
        ))
      )}

      {/* ── Fireflies ── */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {fireflyColors.map((color, i) => (
          <Firefly key={i} delay={i * 0.55} x={(i * 5.4) % 96} color={color} />
        ))}
      </div>

      {/* ── Petals ── */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[4, 11, 19, 29, 40, 51, 62, 72, 81, 91].map((x, i) => (
          <Petal key={i} delay={i * 0.9} x={x} />
        ))}
      </div>

      {/* ── Central text + CTA (parallax layer) ── */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        style={{ x: springX, y: springY }}
      >
        {/* Spinning sparkle */}
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.25, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="mb-8 text-[#2E7D5B]/60"
        >
          <Sparkles className="w-9 h-9" />
        </motion.div>

        {/* Line 1 — Bold Sans */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight text-[#1A1D1B] leading-tight mb-3"
        >
          Nothing is truly lost.
        </motion.h2>

        {/* Line 2 — Italic serif */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl text-[#2E7D5B] leading-snug mb-14"
          style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 400 }}
        >
          It's just waiting to be found.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
            <Link to="/register">
              <motion.button
                onHoverStart={() => setHoverBtn(true)}
                onHoverEnd={() => setHoverBtn(false)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
                className="relative px-12 py-4 rounded-full text-white font-bold text-lg tracking-wide overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #2E7D5B 0%, #1B5E3B 55%, #3AAE74 100%)",
                  boxShadow: hoverBtn
                    ? "0 0 55px 18px rgba(46,125,91,0.6), 0 20px 60px rgba(0,0,0,0.22)"
                    : "0 0 28px 8px rgba(46,125,91,0.38), 0 10px 40px rgba(0,0,0,0.14)",
                  transition: "box-shadow 0.4s ease",
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute top-0 bottom-0 rounded-full pointer-events-none"
                  style={{ width: "45%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                  animate={{ x: ["-100%", "280%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.8 }}
                />
                {/* Expanding pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#5AD290] pointer-events-none"
                  animate={{ scale: [1, 1.35, 1.6], opacity: [0.7, 0.3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative z-10">Get Started →</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Sub-caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-6 text-xs text-[#1A1D1B]/40 font-semibold tracking-[0.25em] uppercase"
        >
          Free to join · Campus-wide coverage
        </motion.p>
      </motion.div>

      {/* ── Atmospheric glow orbs ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] rounded-full blur-3xl pointer-events-none z-5"
        style={{ background: "radial-gradient(ellipse, rgba(46,125,91,0.18) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-0 w-[280px] h-[280px] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.09) 0%, transparent 70%)" }} />
      <div className="absolute top-1/4 right-0 w-[260px] h-[260px] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)" }} />
    </div>
  );
}
