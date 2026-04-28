"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const DynamicLink = ({ href, normal, poetic, className = "" }: { href: string; normal: string; poetic: string; className?: string }) => {
  return (
    <Link to={href} className={`group relative block overflow-hidden h-4 ${className}`}>
      <div 
        className="flex flex-col transition-transform duration-500 ease-[0.16,1,0.3,1] transform group-hover:-translate-y-1/2"
      >
        <span className="text-[11px] font-bold text-[#1A1D1B]/40 h-4 flex items-center tracking-tight">{normal}</span>
        <span className="text-[11px] font-bold text-[#2E7D5B] h-4 flex items-center tracking-tight">{poetic}</span>
      </div>
    </Link>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Smoothly hide navbar when scrolling past the Hero section (~400px down)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setHidden(true);
      if (isOpen) setIsOpen(false); // Auto-close mobile menu just in case
    } else {
      setHidden(false);
    }
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-[1.5rem]');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <Link to="/" className="flex items-center group">
      <img src="/verto-logo.png" alt="Verto" className="h-8 w-auto transition-transform group-hover:scale-105" />
    </Link>
  );

  const navLinksData = [
    { label: 'Map', hover: 'Terra', href: '/map' },
    { label: 'Browse', hover: 'Echoes', href: '/dashboard' },
    { label: 'Secure', hover: 'Sanctum', href: '/safety' },
  ];

  return (
    <motion.header 
      variants={{
        visible: { y: 0, x: "-50%", opacity: 1 },
        hidden: { y: -100, x: "-50%", opacity: 0 }
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-6 left-1/2 z-50
                       flex flex-col items-center
                       px-2.5 py-1.5 backdrop-blur-3xl
                       ${headerShapeClass}
                       border border-white/40 bg-white/20 shadow-xl
                       w-[calc(100%-2.5rem)] sm:w-auto
                       transition-[border-radius] duration-500 ease-[0.16,1,0.3,1]`}
    >

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-10">
        <div className="flex items-center pl-1.5">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-6">
          {navLinksData.map((link) => (
            <DynamicLink key={link.href} href={link.href} normal={link.label} poetic={link.hover} />
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-4">
          <DynamicLink href="/auth/login" normal="Log In" poetic="Return" />
          <Link to="/auth/register">
            <button className="group relative overflow-hidden px-4 py-1.5 bg-[#2E7D5B] rounded-full hover:bg-[#235F45] shadow-sm transition-all active:scale-95 h-[1.8rem]">
              <div className="flex flex-col transition-transform duration-500 ease-[0.16,1,0.3,1] transform group-hover:-translate-y-1/2">
                <span className="text-[11px] font-bold text-white h-[1.8rem] flex items-center justify-center -mt-1.5">Sign Up</span>
                <span className="text-[11px] font-bold text-white h-[1.8rem] flex items-center justify-center">Belong</span>
              </div>
            </button>
          </Link>
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-[#1A1D1B]/60 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-[0.16,1,0.3,1] duration-500 overflow-hidden
                       ${isOpen ? 'max-h-[500px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-sm w-full">
          {navLinksData.map((link) => (
            <Link 
              key={link.href} 
              to={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-[#1A1D1B]/60 font-bold hover:text-[#2E7D5B] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-3 mt-6 w-full border-t border-black/5 pt-4">
          <Link to="/auth/login" className="text-[#1A1D1B]/60 font-bold text-xs uppercase tracking-widest">Log In</Link>
          <Link to="/auth/register" className="w-full px-6">
            <button className="w-full py-3 text-xs font-bold text-white bg-[#2E7D5B] rounded-full">Sign Up</button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
