import React from "react";
import { Footer } from "@/components/ui/footer";
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";

export function VertoFooter() {
  return (
    <Footer
      logo={
        <img src="/verto-logo.png" alt="Verto" className="h-12 w-auto brightness-0 invert" />
      }
      brandName=""
      tagline="The smart campus lost & found platform. Reuniting people with what matters most — one campus at a time."
      socialLinks={[
        {
          icon: <Twitter className="w-4 h-4" />,
          href: "https://twitter.com",
          label: "Twitter",
          external: true,
        },
        {
          icon: <Instagram className="w-4 h-4" />,
          href: "https://instagram.com",
          label: "Instagram",
          external: true,
        },
        {
          icon: <Github className="w-4 h-4" />,
          href: "https://github.com",
          label: "GitHub",
          external: true,
        },
        {
          icon: <Linkedin className="w-4 h-4" />,
          href: "https://linkedin.com",
          label: "LinkedIn",
          external: true,
        },
      ]}
      columns={[
        {
          heading: "Platform",
          links: [
            { href: "/", label: "Home" },
            { href: "/auth/register", label: "Get Started" },
            { href: "/auth/login", label: "Sign In" },
            { href: "/campuses/register", label: "Register Campus" },
            { href: "/dashboard", label: "Dashboard" },
          ],
        },
        {
          heading: "Features",
          links: [
            { href: "/post", label: "Report Lost Item" },
            { href: "/post", label: "Report Found Item" },
            { href: "/my-items", label: "My Items" },
            { href: "/dashboard", label: "Smart Matching" },
            { href: "/dashboard", label: "Secure Messaging" },
          ],
        },
        {
          heading: "Company",
          links: [
            { href: "/about", label: "About Us" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "mailto:hello@verto.app", label: "Contact Us", external: true },
            { href: "mailto:support@verto.app", label: "Support", external: true },
          ],
        },
      ]}
      legalLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "mailto:hello@verto.app", label: "Contact", external: true },
      ]}
      copyright={{
        text: `© ${new Date().getFullYear()} Verto. All rights reserved.`,
        license: "Made with ♥ for campus communities.",
      }}
    />
  );
}
