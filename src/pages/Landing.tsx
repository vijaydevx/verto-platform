import { Link, Navigate } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Heart, 
  Sparkles,
  Zap,
  CheckCircle2,
  Package,
  Check,
  Music,
  Music2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, Variants, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/hooks/useAuth";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";

const BACKGROUND_MUSIC_URL = "/music.mp3";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
    },
  },
};

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <motion.div 
    variants={itemVariants}
    className="group relative overflow-hidden rounded-[32px] bg-white p-10 shadow-premium transition-all hover:shadow-2xl hover:-translate-y-2 border border-black/5"
  >
    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-2xl font-bold text-foreground leading-tight tracking-tight">{title}</h3>
    <p className="mt-4 text-muted-foreground leading-relaxed font-medium">
      {description}
    </p>
    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 transition-transform group-hover:scale-x-100" />
  </motion.div>
);

const Petal = ({ delay, x, scale = 1, blur = 1, duration = 12 }: { delay: number; x: string; scale?: number; blur?: number; duration?: number }) => {
  // Use delay as a sort of pseudo-random seed to create organic variety without triggering React hydration issues
  const sway = (delay * 15) % 150 + 50; 
  const rotationDirection = delay % 2 === 0 ? 1 : -1;
  const initialRotate = (delay * 37) % 360;

  return (
    <motion.div
      initial={{ y: "-10vh", opacity: 0, rotateX: 0, rotateY: 0, rotateZ: initialRotate, x: x }}
      animate={{ 
        y: ["0vh", "120vh"], 
        opacity: [0, 1, 1, 0],
        rotateZ: [initialRotate, initialRotate + (360 * rotationDirection)],
        rotateX: [0, 180, 360],
        rotateY: [0, 90, 180],
        x: [x, `calc(${x} + ${sway}px)`, `calc(${x} - ${sway/2}px)`]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      className="absolute pointer-events-none z-10"
      style={{ left: x, scale: scale, filter: `blur(${blur}px)` }}
    >
      <div 
        style={{
          width: "16px",
          height: "26px",
          background: "linear-gradient(135deg, rgba(253,242,248,0.95) 0%, rgba(251,207,232,0.85) 50%, rgba(244,114,182,0.6) 100%)",
          /* The magic CSS for a realistic petal shape: sharp at opposite ends, rounded at the others */
          borderRadius: "20px 2px 20px 2px",
          boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.7), -1px 2px 4px rgba(0,0,0,0.05)",
        }}
      />
    </motion.div>
  );
};

type HowItWorksCardProps = {
  title: string;
  description: string;
  icon: any;
  accent: string;
  glow: string;
  borderGlow: string;
  delay: number;
  featured?: boolean;
  badge?: string;
};

const HowItWorksCard = ({
  title,
  description,
  icon: Icon,
  accent,
  glow,
  borderGlow,
  delay,
  featured = false,
  badge,
}: HowItWorksCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 26, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -14, scale: 1.05 }}
    className={`relative group ${featured ? "md:-mt-7 md:scale-[1.08] z-20" : "z-10"} w-full`}
  >
    {badge ? (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
        <span
          className="rounded-full px-3 py-1 text-[10px] tracking-[0.24em] font-bold text-white"
          style={{
            background: "linear-gradient(90deg, rgba(8,145,178,0.95), rgba(126,34,206,0.95))",
            boxShadow: "0 6px 22px rgba(56, 189, 248, 0.4)",
          }}
        >
          {badge}
        </span>
      </div>
    ) : null}

    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: featured ? 6.6 : 7.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: featured ? 0.4 : 0.8,
      }}
      className="relative rounded-[28px] p-[1px]"
      style={{
        background: `conic-gradient(from 0deg, transparent 0deg, ${borderGlow} 110deg, transparent 235deg, ${glow} 335deg, transparent 360deg)`,
      }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-[28px] opacity-65 blur-[2px]"
        style={{
          background: `conic-gradient(from 60deg, transparent 0deg, ${glow} 100deg, transparent 260deg, ${borderGlow} 330deg, transparent 360deg)`,
        }}
      />

      <div
        className="relative rounded-[27px] overflow-hidden px-6 py-7 md:py-8 text-center backdrop-blur-xl border border-white/45 bg-white/42"
        style={{
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.75)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-32 w-[80%] bg-gradient-to-b from-white/70 to-transparent blur-xl" />
          <div className="absolute -left-14 -bottom-16 h-28 w-28 rounded-full blur-3xl opacity-40" style={{ backgroundColor: glow }} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-5">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: glow }}
            />
            <div
              className={`relative ${featured ? "h-20 w-20" : "h-16 w-16"} rounded-full border border-white/70 flex items-center justify-center bg-white/75 shadow-lg transition-transform duration-500 group-hover:scale-110`}
            >
              <Icon className={`${featured ? "h-9 w-9" : "h-7 w-7"}`} style={{ color: accent }} strokeWidth={2.4} />
            </div>
          </div>

          <h3 className={`${featured ? "text-2xl" : "text-xl"} font-black text-[#152321] tracking-tight`}>{title}</h3>
          <p className="mt-2 text-sm text-[#243837]/65 font-medium max-w-[21ch] mx-auto">{description}</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

import { Navbar } from "@/components/ui/mini-navbar";
import IntegrationHero from "@/components/ui/integration-hero";
import LiveActivity from "@/components/ui/live-activity";
import TrustSection from "@/components/ui/trust-section";
import FeaturesSection from "@/components/ui/features-section";
import ClosingSection from "@/components/ui/closing-section";
import { VertoFooter } from "@/components/ui/verto-footer";


export function LandingPage() {
  const { user, initialized, loading } = useAuth();
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress into background blur
  const bgBlur = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6], [0, 4, 8, 4]);

  // Transform "How it works" section specifically into grayscale black and white
  const howItWorksRef = useRef<HTMLElement>(null);
  const { scrollYProgress: hwProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"]
  });
  const bgGrayscale = useTransform(hwProgress, [0, 0.2, 0.8, 1], [0, 100, 100, 0]);
  const hwFarLayerY = useTransform(hwProgress, [0, 1], [-10, 10]);
  const hwNearLayerY = useTransform(hwProgress, [0, 1], [-18, 18]);
  const combinedFilter = useMotionTemplate`blur(${bgBlur}px) grayscale(${bgGrayscale}%)`;

  if (initialized && !loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const [activeVideo, setActiveVideo] = useState<'A' | 'B'>('A');
  const [fade, setFade] = useState(false);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const { showToast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [showMusicTooltip, setShowMusicTooltip] = useState(false);

  const toggleMusic = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BACKGROUND_MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      showToast({
        variant: "error",
        title: "Unable to play music",
        description: "Please try clicking the button again.",
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMusicMuted;
      setIsMusicMuted(!isMusicMuted);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const fadeDuration = 1000; 
    const blendThreshold = 1.0; 
    const preStartThreshold = 1.5;
    
    // Step 1: Pre-start and lock the underneath video
    if (video.duration - video.currentTime < preStartThreshold) {
      const nextVideo = activeVideo === 'A' ? videoBRef.current : videoARef.current;
      if (nextVideo && nextVideo.paused) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
    }

    // Step 2: Visual Dissolve (Timed carefully to finish BEFORE the swap)
    if (video.duration - video.currentTime < blendThreshold && !fade) {
      setFade(true);
      
      // We swap the active video state slightly AFTER the fade finishes
      // to ensure the outgoing layer is completely gone before being moved back.
      setTimeout(() => {
        setActiveVideo(activeVideo === 'A' ? 'B' : 'A');
        setFade(false);
      }, fadeDuration + 200); 
    }
  };

  return (
    <PageTransition>
      <Navbar />
      
      {/* Floating Music Controls */}
      <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3">
        <div
          className="relative"
          onMouseEnter={() => setShowMusicTooltip(true)}
          onMouseLeave={() => setShowMusicTooltip(false)}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold shadow-premium transition-all ${
              isMusicPlaying
                ? "border-primary/40 bg-white/80 text-primary backdrop-blur-md"
                : "border-black/10 bg-white/80 text-slate-600 backdrop-blur-md hover:text-primary"
            }`}
            aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
          >
            {isMusicPlaying ? (
              <>
                <Music2 className="h-4 w-4" />
                <span>Music On</span>
              </>
            ) : (
              <>
                <Music className="h-4 w-4" />
                <span>Music Off</span>
              </>
            )}
          </motion.button>
          
          {showMusicTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl bg-slate-900/90 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-sm"
            >
              {isMusicPlaying ? "Click to pause music" : "Click to play music"}
              <div className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-slate-900/90" />
            </motion.div>
          )}
        </div>

        {isMusicPlaying && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/80 text-slate-600 shadow-premium backdrop-blur-md transition hover:text-primary"
            aria-label={isMusicMuted ? "Unmute music" : "Mute music"}
          >
            {isMusicMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </motion.button>
        )}
      </div>

      <div className="relative min-h-screen w-full bg-[#F7F9F8] overflow-hidden">
        {/* Anti-Flicker Liquid Radial Wipe - Full Screen */}
        <motion.div 
          style={{ filter: combinedFilter }}
          className="fixed inset-0 z-0 overflow-hidden bg-[#F7F9F8]"
        >
          {/* Video Player A */}
          <motion.video
            ref={videoARef}
            onTimeUpdate={activeVideo === 'A' ? handleTimeUpdate : undefined}
            autoPlay
            muted
            playsInline
            initial={false}
            animate={{
              opacity: (activeVideo === 'A' && fade) ? 0 : 1
            }}
            style={{
              WebkitMaskImage: (activeVideo === 'A' && fade) 
                ? 'radial-gradient(circle, transparent 0%, transparent 60%, black 100%)' 
                : 'radial-gradient(circle, black 100%, black 100%)',
              maskImage: (activeVideo === 'A' && fade) 
                ? 'radial-gradient(circle, transparent 0%, transparent 60%, black 100%)' 
                : 'radial-gradient(circle, black 100%, black 100%)',
            }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className={`absolute inset-0 h-full w-full object-cover ${
              activeVideo === 'A' ? "z-20" : "z-10"
            }`}
          >
            <source src="/loop.mp4" type="video/mp4" />
          </motion.video>

          {/* Video Player B */}
          <motion.video
            ref={videoBRef}
            onTimeUpdate={activeVideo === 'B' ? handleTimeUpdate : undefined}
            muted
            playsInline
            initial={false}
            animate={{
              opacity: (activeVideo === 'B' && fade) ? 0 : 1
            }}
            style={{
              WebkitMaskImage: (activeVideo === 'B' && fade) 
                ? 'radial-gradient(circle, transparent 0%, transparent 60%, black 100%)' 
                : 'radial-gradient(circle, black 100%, black 100%)',
              maskImage: (activeVideo === 'B' && fade) 
                ? 'radial-gradient(circle, transparent 0%, transparent 60%, black 100%)' 
                : 'radial-gradient(circle, black 100%, black 100%)',
            }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className={`absolute inset-0 h-full w-full object-cover ${
              activeVideo === 'B' ? "z-20" : "z-10"
            }`}
          >
            <source src="/loop.mp4" type="video/mp4" />
          </motion.video>
          
          {/* Atmospheric Aerial Perspective Haze */}
          <div className="absolute inset-0 z-5 bg-gradient-to-b from-[#B9E2FC]/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Mid-Ground Floating Elements (Behind Content) */}
          <div className="fixed inset-0 pointer-events-none z-10">
            {[...Array(8)].map((_, i) => (
              <Petal key={`mid-${i}`} delay={i * 2} x={`${Math.random() * 100}%`} scale={0.6} blur={1} duration={15} />
            ))}
          </div>

          {/* Cinematic Vignette to mask watermark and focus eye */}
          <div className="absolute inset-0 z-15 bg-[radial-gradient(circle_at_20%_80%,rgba(247,249,248,0.8)_0%,transparent_25%)] pointer-events-none" />
          
          {/* Atmospheric Overlay - Pure Clarity Version */}
          <div className="absolute inset-0 bg-[#F7F9F8]/2 z-20" />
        </motion.div>

        {/* Foreground Macro Blur Layer (In front of everything) */}
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {[...Array(4)].map((_, i) => (
            <Petal key={`fore-${i}`} delay={i * 4} x={`${Math.random() * 100}%`} scale={2.5} blur={8} duration={8} />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#F7F9F8]/40 to-transparent blur-3xl pointer-events-none" />
        </div>

        {/* Persistent Mid-Layer Floating Petals */}
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(10)].map((_, i) => (
            <Petal key={`main-${i}`} delay={i * 1.5} x={`${Math.random() * 100}%`} scale={1} blur={0.5} />
          ))}
        </div>

        {/* Refined Hero Content (Mid-Plane) */}
        <div className="relative z-30 flex flex-col w-full">
          <main className="min-h-screen w-full flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-6 pt-[100px] md:pt-[120px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <h1 className="text-[3.5rem] md:text-[5.5rem] font-bold text-[#1A1D1B] tracking-tight leading-[1.02]">
                Find what matters,<br />
                <motion.span 
                  className="font-serif italic font-medium block -mt-2 text-[#2E7D5B] drop-shadow-sm"
                >
                  return what counts.
                </motion.span>
              </h1>
              
              <p className="mx-auto max-w-xl text-lg md:text-xl text-[#E1D9CF] font-medium leading-relaxed drop-shadow-sm">
                A calm, secure way for students, faculty, and staff <br className="hidden md:block" />
                to return lost items across campus.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 mb-36">
                <Link to="/auth/register">
                  <Button size="lg" className="h-[3.25rem] px-8 rounded-full text-base font-bold bg-[#2E7D5B] hover:bg-[#235F45] shadow-2xl transition-all hover:scale-105 active:scale-95 group flex items-center gap-2">
                    Start your search <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/post">
                  <Button variant="secondary" size="lg" className="h-[3.25rem] px-8 rounded-full text-base font-bold bg-white/40 backdrop-blur-xl border-none text-[#1A1D1B] hover:bg-white/60 transition-all hover:scale-105 active:scale-95 group flex items-center gap-2">
                    Report an item <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Precision Glass Stats Section - Unified Flow */}
              <section className="relative w-full max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 shadow-2xl flex items-center gap-8 group cursor-default hover:bg-white/40 transition-colors"
                  >
                    <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Package className="h-7 w-7 text-[#1A1D1B]/60" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1D1B]/40 mb-1">Active Listings</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#1A1D1B]">248</span>
                        <span className="text-sm font-medium text-[#1A1D1B]/60 italic">listed</span>
                      </div>
                      <p className="mt-1 text-sm text-[#1A1D1B]/60 font-medium">
                        Browse campus reports quickly and easily.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 shadow-2xl flex items-center gap-8 group cursor-default hover:bg-white/40 transition-colors"
                  >
                    <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-7 w-7 text-[#1A1D1B]/60" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1D1B]/40 mb-1">Verified Users</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#1A1D1B]">12,543</span>
                        <span className="text-sm font-medium text-[#1A1D1B]/60 italic">users</span>
                      </div>
                      <p className="mt-1 text-sm text-[#1A1D1B]/60 font-medium">
                        Verified throughout campus for trusted returns.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          </main>

          <IntegrationHero />

          <section
            ref={howItWorksRef}
            className="relative z-30 py-28 w-full max-w-7xl mx-auto px-6 overflow-hidden"
            style={{ fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif" }}
          >
            <motion.div style={{ y: hwFarLayerY }} className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -left-16 top-14 h-44 w-44 rounded-full bg-cyan-300/18 blur-[110px]" />
              <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-purple-300/16 blur-[110px]" />
              <div className="absolute left-1/2 top-[54%] -translate-x-1/2 h-40 w-[340px] rounded-full bg-yellow-200/24 blur-[80px]" />
            </motion.div>

            <motion.div style={{ y: hwNearLayerY }} className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-[16%] top-[38%] h-[2px] w-44 bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent blur-[1px]" />
              <div className="absolute right-[16%] top-[42%] h-[2px] w-48 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent blur-[1px]" />
            </motion.div>

            <div className="text-center mb-16 relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-[#1A1D1B] tracking-tight"
              >
                How it works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-[#1A1D1B]/75 font-medium text-sm md:text-base tracking-wide"
              >
                A simple path from lost to found
              </motion.p>
            </div>

            <div className="relative max-w-6xl mx-auto mt-10">
              <motion.div
                style={{ y: hwNearLayerY }}
                className="pointer-events-none absolute left-1/2 top-[44%] hidden md:block -translate-x-1/2 h-56 w-72 rounded-full bg-gradient-to-b from-cyan-200/35 via-purple-200/25 to-yellow-100/10 blur-[76px] z-0"
              />

              <div className="pointer-events-none absolute inset-x-6 top-[36%] h-24 hidden md:block z-0">
                <svg width="100%" height="100%" viewBox="0 0 1000 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="how-it-works-path" x1="60" y1="85" x2="940" y2="85" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#22D3EE" stopOpacity="0.15" />
                      <stop offset="0.48" stopColor="#A855F7" stopOpacity="0.88" />
                      <stop offset="1" stopColor="#FACC15" stopOpacity="0.16" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M60 112 C 255 34, 420 34, 500 84 C 580 134, 745 134, 940 56"
                    stroke="url(#how-it-works-path)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  <motion.path
                    d="M60 112 C 255 34, 420 34, 500 84 C 580 134, 745 134, 940 56"
                    stroke="url(#how-it-works-path)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeDasharray="14 16"
                    animate={{ strokeDashoffset: [0, -150], opacity: [0.45, 0.95, 0.45] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                <motion.div
                  className="absolute left-[8%] top-[54%] h-4 w-20 -translate-y-1/2 rounded-full blur-xl"
                  style={{ background: "linear-gradient(90deg, rgba(34,211,238,0), rgba(168,85,247,0.85), rgba(250,204,21,0))" }}
                  animate={{ x: ["0%", "580%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.16fr_1fr] gap-7 md:gap-8 items-end">
                <HowItWorksCard
                  title="Report"
                  description="Report your lost item in seconds with key details."
                  icon={Search}
                  accent="#0891b2"
                  glow="rgba(34,211,238,0.42)"
                  borderGlow="rgba(56,189,248,0.95)"
                  delay={0.1}
                />

                <HowItWorksCard
                  title="Match"
                  description="AI finds likely matches fast using smart campus signals."
                  icon={Zap}
                  accent="#7c3aed"
                  glow="rgba(168,85,247,0.42)"
                  borderGlow="rgba(196,181,253,0.95)"
                  badge="SMART MATCH"
                  featured
                  delay={0.2}
                />

                <HowItWorksCard
                  title="Return"
                  description="Coordinate safely and return items to the right owner."
                  icon={Heart}
                  accent="#ca8a04"
                  glow="rgba(250,204,21,0.36)"
                  borderGlow="rgba(250,204,21,0.85)"
                  delay={0.3}
                />
              </div>
            </div>

            <motion.div style={{ y: hwNearLayerY }} className="pointer-events-none absolute inset-0 z-0">
              {[...Array(14)].map((_, i) => {
                const left = ((i * 7.7) % 96) + 2;
                const top = ((i * 11.3) % 76) + 10;
                const size = 2 + (i % 3);
                const colors = [
                  "rgba(34, 211, 238, 0.8)",
                  "rgba(168, 85, 247, 0.65)",
                  "rgba(250, 204, 21, 0.72)",
                ];
                const color = colors[i % colors.length];

                return (
                  <motion.span
                    key={`hw-particle-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                    animate={{
                      y: [0, -12, 0],
                      x: [0, i % 2 === 0 ? 3 : -3, 0],
                      opacity: [0.2, 0.85, 0.25],
                    }}
                    transition={{
                      duration: 3.6 + (i % 4) * 0.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    }}
                  />
                );
              })}
            </motion.div>
          </section>

          <LiveActivity />

          <TrustSection />

          <FeaturesSection />

          <ClosingSection />

        </div>
      </div>

      <VertoFooter />

    </PageTransition>
  );
}
