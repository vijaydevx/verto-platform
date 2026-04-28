"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, MapPin, CheckCircle2, FlaskConical, User } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "found",
    title: "Wallet found near library",
    time: "2 min ago",
    status: "Claim it",
    location: "by the engineering library",
    user: "System",
    icon: Wallet,
    color: "from-[#2E7D5B]/20 to-[#2E7D5B]/5",
    iconColor: "text-[#2E7D5B]",
    alignment: "self-start md:-ml-12",
  },
  {
    id: 2,
    type: "returned",
    title: "Bottle returned",
    time: "just now",
    status: "Confirmed pickup",
    user: "Richard S.",
    icon: FlaskConical,
    color: "from-[#006A4E]/20 to-[#006A4E]/5",
    iconColor: "text-[#006A4E]",
    alignment: "self-end md:-mr-12",
  },
];

export default function LiveActivity() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-32 z-30 font-sans">
      <div className="text-center mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <div className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2E7D5B]">
            Live Activity
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-[#1A1D1B] tracking-tight"
        >
          Real-time Feed
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-[#1A1D1B] font-medium text-lg tracking-wide max-w-xl mx-auto"
        >
          See the latest updates as items are found and returned in real-time.
        </motion.p>
      </div>

      <div className="relative flex flex-col gap-12 md:gap-20 max-w-3xl mx-auto">
        {/* Subtle connecting thread */}
        <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-[#2E7D5B]/20 to-transparent -translate-x-1/2 hidden md:block" />

        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2, type: "spring", bounce: 0.4 }}
            className={`relative w-full md:w-[85%] p-6 md:p-8 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${activity.alignment} group hover:bg-white/50 transition-colors`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Icon Box */}
              <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center border border-white/40 shadow-inner overflow-hidden relative`}>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                <activity.icon className={`w-7 h-7 relative z-10 ${activity.iconColor}`} strokeWidth={2} />
                {activity.type === 'returned' && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#2E7D5B] rounded-full flex items-center justify-center border-2 border-white z-20">
                    <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Content Box */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 w-full">
                  <h3 className="text-xl font-bold text-[#1A1D1B] tracking-tight">{activity.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {activity.type === 'returned' && <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />}
                    <span className="text-xs font-semibold text-[#1A1D1B]/50">{activity.time}</span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className={`text-sm font-semibold ${activity.type === 'returned' ? 'text-[#1A1D1B]/70' : 'text-[#2E7D5B]'}`}>
                    {activity.status}
                  </span>
                  
                  {activity.location && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1D1B]/50 bg-black/5 px-3 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {activity.location}
                    </div>
                  )}

                  {activity.user !== 'System' && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1D1B]/60 ml-auto">
                      <div className="w-6 h-6 rounded-full bg-[#1A1D1B]/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#1A1D1B]/50" />
                      </div>
                      {activity.user}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center relative z-10"
      >
        <button className="px-8 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#1A1D1B] font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:bg-white/60 transition-all hover:scale-105 active:scale-95">
          View All Activity
        </button>
      </motion.div>
    </section>
  );
}
