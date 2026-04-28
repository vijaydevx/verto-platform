import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using Verto, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use our platform. These terms apply to all users, including students, staff, and campus administrators.`,
    },
    {
      title: "Eligibility",
      content: `Verto is available to verified members of partner campuses. You must be at least 16 years old and have a valid campus email address to register. You are responsible for ensuring your account information is accurate and up-to-date.`,
    },
    {
      title: "Acceptable Use",
      content: `You agree to use Verto only for its intended purpose — reporting lost or found items on your campus. You must not submit false, misleading, or fraudulent item reports. You must not harass, intimidate, or harm other users. Misuse of the platform may result in immediate account termination.`,
    },
    {
      title: "Item Reporting",
      content: `When you report a found item, you take responsibility for keeping it safe until the verified owner claims it. Verto facilitates communication but is not responsible for the safe transfer of physical items. We recommend meeting in public, campus-monitored locations for item handoffs.`,
    },
    {
      title: "Intellectual Property",
      content: `All content, features, and functionality of the Verto platform — including but not limited to text, graphics, logos, and software — are owned by Verto and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission.`,
    },
    {
      title: "Limitation of Liability",
      content: `Verto is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform or inability to recover lost items. Our total liability to you shall not exceed the amount you paid us in the past 12 months (if any).`,
    },
    {
      title: "Indemnification",
      content: `You agree to indemnify and hold Verto, its officers, directors, employees, and partners harmless from any claims, losses, or damages arising from your use of the platform, your violation of these Terms, or your infringement of any third-party rights.`,
    },
    {
      title: "Termination",
      content: `We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or behavior that harms the campus community. You may delete your account at any time through your account settings.`,
    },
    {
      title: "Governing Law",
      content: `These Terms are governed by the laws of the applicable jurisdiction, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.`,
    },
    {
      title: "Changes to Terms",
      content: `We may update these Terms at any time. Continued use of Verto after changes constitutes acceptance of the updated Terms. We will notify users of material changes via email at least 14 days before they take effect.`,
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
              <FileText className="w-6 h-6 text-[#4CAF82]" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Terms of Service</h1>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-4">Last updated: April 12, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#1A1D1B]/70 text-base leading-relaxed mb-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          Please read these Terms of Service carefully before using the Verto platform. By creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
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
            Questions about these terms?{" "}
            <a href="mailto:legal@verto.app" className="text-[#2E7D5B] font-semibold hover:underline">
              legal@verto.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
