import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck, Lock, UserCheck, MapPin } from "lucide-react";

interface CardData {
  id: string | number;
  isFeature?: boolean;
  title: string;
  description: string;
  icon?: React.ElementType;
  metaIcon?: React.ElementType;
  metaText?: string;
  avatar?: string;
}

const VERIFIED_CARDS: CardData[] = [
  { id: "v1", isFeature: true, title: "Verified users", description: "Posts by verified students and staff ensure trust.", icon: UserCheck, metaIcon: MapPin, metaText: "by the engineering library" },
  { id: "v2", title: "Sarah Jenkins", description: "“I love knowing exactly who I am meeting for hand-offs. It feels completely secure.”", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Found AirPods" },
  { id: "v3", title: "Alex Chen", description: "“The verified student badges make returning items so much less awkward.”", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Returned Notebook" },
  { id: "v4", title: "Prof. Davis", description: "“A wonderful and trustworthy system for our entire campus community.”", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Faculty" }
];

const SAFETY_CARDS: CardData[] = [
  { id: "s1", isFeature: true, title: "Campus-wide safety", description: "Keep track of lost items safely across campus.", icon: ShieldCheck, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Richard S. • just now" },
  { id: "s2", title: "Library Desk", description: "“We use this daily to log items turned into the front desk. Very organized.”", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Staff" },
  { id: "s3", title: "Campus Security", description: "“The real-time feed helps us monitor high-traffic areas securely.”", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Admin" },
  { id: "s4", title: "Emma W.", description: "“Found my keys at the dining hall within minutes. Safe and fast!”", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Student" }
];

const PRIVACY_CARDS: CardData[] = [
  { id: "p1", isFeature: true, title: "Data protection", description: "Your information is secured with full data privacy.", icon: Lock, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Richard S." },
  { id: "p2", title: "Privacy First", description: "“I love that I don't have to share my personal phone number to coordinate a return.”", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Anna P." },
  { id: "p3", title: "Encrypted Chat", description: "“The in-app messaging keeps everything anonymous until we decide to meet.”", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Marcus T." },
  { id: "p4", title: "Secure Hand-offs", description: "“The whole process feels completely private and respects my boundaries.”", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", metaText: "Elena R." }
];

function SwipeDeck({ cards }: { cards: CardData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number>(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) { // Lower threshold for easier swiping on small cards
      setExitX(info.offset.x);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setExitX(0);
      }, 200);
    }
  };

  return (
    <div className="relative w-full max-w-[320px] h-80 mx-auto">
      {cards.map((card, index) => {
        const isCurrentCard = index === currentIndex;
        const isPrevCard = index === (currentIndex + 1) % cards.length;
        const isNextCard = index === (currentIndex + 2) % cards.length;

        // Only render the top 3 cards in the deck to save DOM nodes
        if (!isCurrentCard && !isPrevCard && !isNextCard) return null;

        return (
          <motion.div
            key={card.id}
            className={cn(
              "absolute w-full h-full rounded-[2rem] cursor-grab active:cursor-grabbing p-6 sm:p-8 flex flex-col items-center justify-between text-center",
              "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            )}
            style={{
              zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
            }}
            drag={isCurrentCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={isCurrentCard ? handleDragEnd : undefined}
            initial={{
              scale: 0.95,
              opacity: 0,
              y: isCurrentCard ? 0 : isPrevCard ? 12 : 24,
              rotate: isCurrentCard ? 0 : isPrevCard ? -3 : -6,
            }}
            animate={{
              scale: isCurrentCard ? 1 : 0.95,
              opacity: isCurrentCard ? 1 : isPrevCard ? 0.8 : 0.4,
              x: isCurrentCard ? exitX : 0,
              y: isCurrentCard ? 0 : isPrevCard ? 12 : 24,
              rotate: isCurrentCard ? exitX / 20 : isPrevCard ? -3 : -6,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {card.isFeature && card.icon ? (
              // Feature Top Icon Layout
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#2E7D5B]/10 flex items-center justify-center border border-[#2E7D5B]/20 mb-2 shrink-0">
                <card.icon className="w-8 h-8 text-[#2E7D5B]" strokeWidth={2} />
              </div>
            ) : card.avatar ? (
              // Testimonial Top Avatar Layout
              <img src={card.avatar} alt={card.title} className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white mb-2 shrink-0" />
            ) : null}

            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <h3 className="text-xl font-bold text-[#1A1D1B] mb-2 leading-tight">
                {card.title}
              </h3>
              <p className={cn(
                "text-sm font-medium leading-relaxed", 
                card.isFeature ? "text-[#1A1D1B]/60 font-semibold" : "text-[#1A1D1B]/70 italic"
              )}>
                {card.description}
              </p>
            </div>

            {/* Footer Badge */}
            {(card.metaText) && (
              <div className="flex items-center gap-2 bg-[#1A1D1B]/5 px-4 py-2 rounded-full shrink-0 mt-4">
                {card.isFeature && card.avatar ? (
                  <img src={card.avatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover shadow-sm bg-white" />
                ) : card.metaIcon ? (
                  <card.metaIcon className="w-4 h-4 text-[#1A1D1B]/50" />
                ) : null}
                <span className="text-xs font-bold text-[#1A1D1B]/70 tracking-wide">
                  {card.metaText}
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-30 font-sans">
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <div className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2E7D5B]">
            Trust & Safety
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-[#1A1D1B] tracking-tight"
        >
          Verified Community
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-[#1A1D1B] font-medium text-lg tracking-wide max-w-xl mx-auto"
        >
          Verified community, campus-wide security, and secure data.
        </motion.p>
      </div>

      {/* 3-Column Grid for the 3 Decks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-10 mt-16 pb-12 w-full place-items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full">
          <SwipeDeck cards={VERIFIED_CARDS} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-full">
          <SwipeDeck cards={SAFETY_CARDS} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="w-full">
          <SwipeDeck cards={PRIVACY_CARDS} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex justify-center relative z-10"
      >
        <button className="px-8 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#1A1D1B] font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:bg-white/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          Swipe cards to view reviews <span className="opacity-50">&rarr;</span>
        </button>
      </motion.div>
    </section>
  );
}
