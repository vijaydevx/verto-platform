import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  external?: boolean;
}

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  tagline?: string;
  socialLinks: SocialLink[];
  columns: {
    heading: string;
    links: NavLink[];
  }[];
  legalLinks: NavLink[];
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
  logo,
  brandName,
  tagline,
  socialLinks,
  columns,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="relative w-full bg-[#0D1410]/95 backdrop-blur-xl border-t border-white/10 text-white font-sans">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label={brandName}>
              {logo}
              <span className="font-black text-2xl tracking-tight text-white">{brandName}</span>
            </Link>
            {tagline && (
              <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">{tagline}</p>
            )}
            {/* Social Icons */}
            <ul className="flex gap-2 list-none">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  {link.external ? (
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={link.label}
                      className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-[#2E7D5B]/60 text-white/70 hover:text-white transition-all duration-300"
                    >
                      {link.icon}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      aria-label={link.label}
                      className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-[#2E7D5B]/60 text-white/70 hover:text-white transition-all duration-300"
                    >
                      {link.icon}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns */}
          {columns.map((col, ci) => (
            <div key={ci}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D5B] mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3 list-none">
                {col.links.map((link, li) => (
                  <li key={li}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/55 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-white/55 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Copyright */}
        <div className="text-xs text-white/35 leading-relaxed">
          <span>{copyright.text}</span>
          {copyright.license && (
            <span className="ml-2 text-white/25">{copyright.license}</span>
          )}
        </div>

        {/* Legal links */}
        <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none">
          {legalLinks.map((link, i) => (
            <li key={i}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-white/80 transition-colors underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-xs text-white/40 hover:text-white/80 transition-colors underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
