"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  MessageSquareLock,
  CalendarHeart,
  ImageIcon,
  Link2,
  CheckCircle2,
} from "lucide-react";

const particles = [
  { left: "8%", top: "14%", size: 2.8, drift: 10, duration: 6.2, delay: 0.1 },
  { left: "16%", top: "36%", size: 3.4, drift: 7, duration: 5.6, delay: 0.4 },
  { left: "27%", top: "68%", size: 2.4, drift: 8, duration: 6.8, delay: 0.8 },
  { left: "40%", top: "26%", size: 3.2, drift: 9, duration: 5.4, delay: 1.1 },
  { left: "52%", top: "57%", size: 2.6, drift: 11, duration: 6.5, delay: 0.2 },
  { left: "63%", top: "18%", size: 2.9, drift: 9, duration: 5.8, delay: 0.6 },
  { left: "75%", top: "42%", size: 3.1, drift: 8, duration: 6.1, delay: 0.9 },
  { left: "86%", top: "70%", size: 2.5, drift: 10, duration: 6.7, delay: 1.3 },
  { left: "92%", top: "28%", size: 2.7, drift: 7, duration: 5.2, delay: 1.6 },
];

interface ParticleFieldProps {
  colorA: string;
  colorB: string;
  count?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ colorA, colorB, count = 9 }) => (
  <>
    {particles.slice(0, count).map((particle, index) => {
      const color = index % 2 === 0 ? colorA : colorB;

      return (
        <motion.span
          key={`${particle.left}-${particle.top}-${index}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -particle.drift, 0],
            x: [0, index % 2 === 0 ? 3 : -3, 0],
            opacity: [0.2, 0.95, 0.3],
            scale: [0.9, 1.35, 0.9],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      );
    })}
  </>
);

interface SmartCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
  tintColor: string;
  borderColor: string;
  glowColor: string;
  sparkle1: string;
  sparkle2: string;
  iconColor: string;
}

const SmartCard: React.FC<SmartCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  tintColor,
  borderColor,
  glowColor,
  sparkle1,
  sparkle2,
  iconColor,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative group cursor-default rounded-[28px] overflow-hidden min-h-[240px]"
  >
    <div
      className="absolute inset-0 rounded-[28px]"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(234,246,255,0.93) 48%, rgba(233,248,240,0.95) 100%)",
        border: `1px solid ${borderColor}`,
        boxShadow:
          "0 16px 40px rgba(72, 121, 148, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -18px 32px rgba(176, 230, 210, 0.28)",
      }}
    />

    <div
      className="absolute inset-0 rounded-[28px] pointer-events-none"
      style={{
        background: `radial-gradient(circle at 78% 15%, ${tintColor} 0%, rgba(15, 23, 42, 0) 50%)`,
      }}
    />

    <motion.div
      className="absolute -left-12 top-1/2 h-20 w-[70%] -translate-y-1/2 blur-2xl pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.45), rgba(244, 114, 182, 0.36), transparent)",
      }}
      animate={{ x: ["-10%", "18%", "-10%"], opacity: [0.22, 0.55, 0.22] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />

    <div
      className="absolute -top-14 right-5 w-28 h-28 blur-3xl rounded-full pointer-events-none"
      style={{ backgroundColor: glowColor, opacity: 0.42 }}
    />

    <div
      className="absolute -bottom-10 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
      style={{ backgroundColor: glowColor, opacity: 0.34 }}
    />

    <ParticleField colorA={sparkle1} colorB={sparkle2} />

    <div className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-8">
      <div
        className="w-20 h-20 mb-5 rounded-full border border-sky-200/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
        style={{
          background:
            "radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.98), rgba(228, 241, 255, 0.88) 56%, rgba(214, 238, 229, 0.82) 100%)",
          boxShadow: `0 0 35px 3px ${glowColor}`,
        }}
      >
        <Icon className="w-10 h-10" style={{ color: iconColor }} strokeWidth={2} />
      </div>

      <h3 className="text-lg font-black text-[#1D4B3D] tracking-tight mb-2">{title}</h3>
      <p className="text-sm font-medium text-[#355C4E]/80 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

interface MicroCardProps {
  label: string;
  delay?: number;
  children: React.ReactNode;
}

const MicroCard: React.FC<MicroCardProps> = ({ label, delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-[300px] flex flex-col items-center gap-3"
  >
    <div
      className="w-full h-[182px] rounded-[24px] p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(235,247,255,0.92) 42%, rgba(239,250,244,0.94) 100%)",
        border: "1px solid rgba(165, 203, 224, 0.6)",
        boxShadow:
          "0 14px 34px rgba(86, 135, 160, 0.2), inset 0 1px 0 rgba(255,255,255,0.96), inset 0 -16px 26px rgba(188, 229, 214, 0.28)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(251, 113, 133, 0.2), transparent 40%), radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.2), transparent 45%)",
        }}
      />

      <motion.div
        className="absolute -left-10 top-1/2 -translate-y-1/2 h-24 w-[65%] blur-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.32), rgba(244,114,182,0.3), transparent)",
        }}
        animate={{ x: ["-12%", "22%", "-12%"], opacity: [0.2, 0.48, 0.2] }}
        transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute -top-12 -right-6 w-24 h-24 rounded-full bg-sky-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-full bg-pink-300/28 blur-3xl pointer-events-none" />

      <ParticleField colorA="rgba(56, 189, 248, 0.65)" colorB="rgba(251, 113, 133, 0.55)" count={8} />

      <div className="relative z-10 h-full">{children}</div>
    </div>

    <span className="text-xs text-[#2F5F51]/85 font-semibold tracking-wide">{label}</span>
  </motion.div>
);

export default function FeaturesSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-16 z-30 font-sans">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-[#F6FFFC]/94 via-[#EDF8FF]/96 to-[#F8F4FF]/98" />
        <div className="absolute inset-x-10 top-4 h-36 rounded-full bg-sky-300/22 blur-3xl" />
        <div className="absolute inset-x-20 bottom-5 h-36 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute left-8 top-20 w-52 h-52 rounded-full bg-pink-300/18 blur-[110px]" />
        <div className="absolute right-8 bottom-16 w-52 h-52 rounded-full bg-cyan-300/18 blur-[110px]" />
      </div>

      <div className="mb-14">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#173F33] tracking-tight drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]"
          >
            Micro Interactions
          </motion.h2>
          <p className="text-sm text-[#356255]/75 mt-2">Airy micro states with pastel glow and clean depth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 place-items-center">
          <MicroCard label="Upload preview">
            <div className="h-full flex flex-col">
              <div className="relative h-[72px] mb-3 rounded-xl border border-sky-200/55 bg-white/72 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, rgba(251,113,133,0.2), transparent 45%)" }} />
                <ImageIcon className="w-9 h-9 text-sky-500/70" />
                <div className="absolute bottom-2 right-2 bg-emerald-400/85 rounded-full p-1 border border-emerald-100/80 shadow-[0_0_10px_rgba(16,185,129,0.55)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-400 to-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.45)]">
                  <ImageIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sky-100/80 rounded-full mb-1" />
                  <div className="h-1.5 w-3/4 bg-emerald-100/75 rounded-full" />
                </div>
              </div>

              <div className="w-full h-1.5 bg-sky-100/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "78%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #4ade80 0%, #38bdf8 55%, #7dd3fc 100%)",
                    boxShadow: "0 0 12px rgba(56, 189, 248, 0.55)",
                  }}
                />
              </div>

              <p className="text-[11px] text-[#2A5A4A]/85 font-semibold mt-2">Uploading... 78%</p>
            </div>
          </MicroCard>

          <MicroCard label="Matching system" delay={0.16}>
            <div className="h-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-full gap-3 mb-5 relative">
                <div className="absolute inset-0 flex items-center z-0">
                  <motion.div
                    animate={{ scaleX: [0.1, 1, 0.1], opacity: [0.4, 0.95, 0.4] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[2px] w-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, #38bdf8, #fb7185, transparent)",
                      transformOrigin: "center",
                      boxShadow: "0 0 9px rgba(56, 189, 248, 0.6)",
                    }}
                  />
                </div>

                <div className="w-10 h-10 rounded-full bg-white/78 backdrop-blur-md border border-sky-200/80 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.3)] z-10 shrink-0">
                  <Search className="w-4 h-4 text-emerald-500" />
                </div>

                <div
                  className="w-[54px] h-[54px] rounded-full border border-sky-200/80 flex items-center justify-center z-20 shrink-0"
                  style={{
                    background: "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.95), rgba(218,236,249,0.9) 55%)",
                    boxShadow: "0 0 20px rgba(125,211,252,0.45)",
                  }}
                >
                  <Link2 className="w-5 h-5 text-sky-500" />
                </div>

                <div className="w-10 h-10 rounded-full bg-white/78 backdrop-blur-md border border-pink-200/80 flex items-center justify-center shadow-[0_0_14px_rgba(251,113,133,0.28)] z-10 shrink-0">
                  <Heart className="w-4 h-4 text-pink-500" />
                </div>
              </div>

              <motion.div
                animate={{
                  y: [-2, 2, -2],
                  boxShadow: [
                    "0 0 10px rgba(56,189,248,0.22)",
                    "0 0 18px rgba(251,113,133,0.28)",
                    "0 0 10px rgba(56,189,248,0.22)",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/78 backdrop-blur-lg px-4 py-1.5 rounded-full border border-sky-200/80 flex items-center gap-1.5"
              >
                <span className="text-xs font-semibold text-[#1E4F40]">Match found!</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </motion.div>

              <div className="flex gap-1.5 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.75)]" : "bg-sky-100/90"}`}
                  />
                ))}
              </div>
            </div>
          </MicroCard>

          <MicroCard label="Notification UI" delay={0.28}>
            <div className="h-full flex flex-col justify-between">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-pink-200/55 shadow-[0_10px_22px_rgba(102,137,158,0.2)]">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#1E4B3D] mb-1">Wallet found near library</p>
                    <div className="flex items-center gap-1.5">
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=30&h=30"
                        alt="avatar"
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                      <span className="text-[9px] font-medium text-[#3A6659]/80">Richard S. just confirmed pickup</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ x: [-6, 6, -6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-end pr-2"
              >
                <div className="h-7 w-[72px] bg-white/72 rounded-full border border-sky-200/65 flex items-center overflow-hidden shadow-inner">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 shrink-0 -translate-x-0.5 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                  <div className="w-2 h-2 rounded-full bg-sky-200 ml-1.5 opacity-70" />
                </div>
              </motion.div>
            </div>
          </MicroCard>
        </div>
      </div>

      <div>
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#173F33] tracking-tight drop-shadow-[0_0_18px_rgba(251,113,133,0.22)]"
          >
            Smart Features
          </motion.h2>
          <p className="text-sm text-[#356255]/75 mt-2">Milky light cards with soft sky and floral glow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <SmartCard
            icon={Search}
            title="Advanced search"
            description="Find and filter lost items quickly with precision controls."
            delay={0.1}
            tintColor="rgba(74, 222, 128, 0.28)"
            borderColor="rgba(74, 222, 128, 0.35)"
            glowColor="rgba(74, 222, 128, 0.35)"
            sparkle1="rgba(74, 222, 128, 0.72)"
            sparkle2="rgba(125, 211, 252, 0.7)"
            iconColor="#0f766e"
          />

          <SmartCard
            icon={Heart}
            title="Smart matches"
            description="Our system finds matches efficiently using context-aware signals."
            delay={0.2}
            tintColor="rgba(251, 113, 133, 0.24)"
            borderColor="rgba(251, 113, 133, 0.34)"
            glowColor="rgba(251, 113, 133, 0.34)"
            sparkle1="rgba(251, 113, 133, 0.68)"
            sparkle2="rgba(244, 114, 182, 0.63)"
            iconColor="#be185d"
          />

          <SmartCard
            icon={MessageSquareLock}
            title="Secure messaging"
            description="Communicate safely and privately with built-in protection."
            delay={0.3}
            tintColor="rgba(125, 211, 252, 0.3)"
            borderColor="rgba(56, 189, 248, 0.32)"
            glowColor="rgba(56, 189, 248, 0.34)"
            sparkle1="rgba(56, 189, 248, 0.7)"
            sparkle2="rgba(14, 165, 233, 0.62)"
            iconColor="#0369a1"
          />

          <SmartCard
            icon={CalendarHeart}
            title="Automatic reminders"
            description="Get timely nudges and updates for faster item returns."
            delay={0.4}
            tintColor="rgba(196, 181, 253, 0.28)"
            borderColor="rgba(196, 181, 253, 0.34)"
            glowColor="rgba(196, 181, 253, 0.34)"
            sparkle1="rgba(196, 181, 253, 0.72)"
            sparkle2="rgba(253, 186, 116, 0.62)"
            iconColor="#7c3aed"
          />
        </div>
      </div>
    </section>
  );
}
