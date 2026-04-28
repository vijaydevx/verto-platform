import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, including your name, email address, campus affiliation, and any item descriptions or images you submit. We also automatically collect certain device and usage information when you access our platform, such as your IP address, browser type, and pages visited.`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to operate and improve Verto, facilitate item reporting and matching, send you notifications about your items, communicate with you about your account, and ensure the safety and security of our campus community. We never sell your personal data to third parties.`,
    },
    {
      title: "Campus Data Sharing",
      content: `Verto operates on a campus-by-campus basis. Your profile and item reports are visible only to verified members of your registered campus. Campus administrators may access aggregated, anonymized statistics to understand platform usage.`,
    },
    {
      title: "Data Security",
      content: `We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest using AES-256 encryption.`,
    },
    {
      title: "Data Retention",
      content: `We retain your account information for as long as your account is active. Resolved item reports are archived and deleted after 90 days. You may request deletion of your account and associated data at any time by contacting our support team.`,
    },
    {
      title: "Your Rights",
      content: `You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing of your data. To exercise these rights, contact us at privacy@verto.app. We will respond within 30 days.`,
    },
    {
      title: "Cookies",
      content: `We use essential cookies to operate our service and optional analytics cookies to improve it. You can control cookie preferences through your browser settings. We do not use advertising or tracking cookies.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. The date of the last update is shown at the top of this page.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      {/* Header */}
      <div className="bg-[#0D1410] text-white pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D5B]/20 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verto
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2E7D5B]/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#4CAF82]" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-4">Last updated: April 12, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#1A1D1B]/70 text-base leading-relaxed mb-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          At Verto, we are committed to protecting your privacy and ensuring the security of your personal information. This Policy explains how we collect, use, and safeguard your data when you use our campus lost-and-found platform.
        </p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <h2 className="text-lg font-black text-[#1A1D1B] mb-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                {s.title}
              </h2>
              <p className="text-[#1A1D1B]/65 text-sm leading-relaxed pl-10">{s.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-[#2E7D5B]/8 rounded-2xl border border-[#2E7D5B]/20 text-center">
          <p className="text-sm text-[#1A1D1B]/60 leading-relaxed">
            Questions about this policy?{" "}
            <a href="mailto:privacy@verto.app" className="text-[#2E7D5B] font-semibold hover:underline">
              privacy@verto.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
