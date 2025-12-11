"use client";

import { GraduationCap, Facebook, Twitter, Linkedin, Youtube, Shield, Mail, Phone, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { useSiteName } from "@/hooks/useSiteName";
import { useContactDetails } from "@/hooks/useContactDetails";

/**
 * Footer Component
 * 
 * IMPORTANT: This footer is IDENTICAL for both logged-in and non-logged-in users.
 * There is NO conditional rendering based on authentication status.
 * All sections and links are visible and functional for ALL users.
 */
const Footer = () => {
  const siteName = useSiteName();
  const contactDetails = useContactDetails();

  const footerLinks = {
    exams: ["AWS Certification", "Azure Exams", "CompTIA", "Cisco CCNA", "Google Cloud"],
    providers: ["Amazon Web Services", "Microsoft", "Cisco Systems", "CompTIA", "Google"],
    resources: ["Study Guides", "Practice Tests", "Exam Simulator", "Blog", "Success Stories", "FAQ"],
    company: ["About Us", "Contact", "Careers", "Press Kit", "Partners"],
    legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer", "Sitemap"],
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://www.facebook.com" },
    { icon: Twitter, label: "Twitter", url: "https://www.twitter.com" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com" },
    { icon: Youtube, label: "YouTube", url: "https://www.youtube.com" },
  ];

  // Check if any contact details are available (must be non-empty strings)
  const hasEmail = contactDetails.email && contactDetails.email.trim().length > 0;
  const hasPhone = contactDetails.phone && contactDetails.phone.trim().length > 0;
  const hasAddress = contactDetails.address && contactDetails.address.trim().length > 0;
  const hasWebsite = contactDetails.website && contactDetails.website.trim().length > 0;
  const hasContactDetails = hasEmail || hasPhone || hasAddress || hasWebsite;

  return (
    <footer className="bg-gradient-to-br from-[#0C1A35] to-[#0E2444] text-white border-t border-[#1A73E8]/20">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${hasContactDetails ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-6 md:gap-8 mb-8 md:mb-12`}>
          <div>
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Exams</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.exams.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Providers</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.providers.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Resources</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  {link === "FAQ" ? (
                    <Link
                      href="/FAQ"
                      className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm"
                    >
                      {link}
                    </Link>
                  ) : link === "Blog" ? (
                    <Link
                      href="/blog"
                      className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm"
                    >
                      {link}
                    </Link>
                  ) : (
                    <a href="#" className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm">
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Company</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Legal</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          {hasContactDetails && (
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-[#F5F8FF]">Contact Us</h3>
              <ul className="space-y-2 md:space-y-3">
                {hasEmail && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1A73E8] mt-0.5 flex-shrink-0" />
                    <a 
                      href={`mailto:${contactDetails.email.trim()}`}
                      className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm break-all"
                    >
                      {contactDetails.email.trim()}
                    </a>
                  </li>
                )}
                {hasPhone && (
                  <li className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1A73E8] mt-0.5 flex-shrink-0" />
                    <a 
                      href={`tel:${contactDetails.phone.trim().replace(/\s+/g, '')}`}
                      className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm"
                    >
                      {contactDetails.phone.trim()}
                    </a>
                  </li>
                )}
                {hasAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1A73E8] mt-0.5 flex-shrink-0" />
                    <span className="text-[#F0F4FF] text-xs md:text-sm whitespace-pre-line">
                      {contactDetails.address.trim()}
                    </span>
                  </li>
                )}
                {hasWebsite && (
                  <li className="flex items-start gap-2">
                    <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1A73E8] mt-0.5 flex-shrink-0" />
                    <a 
                      href={contactDetails.website.trim().startsWith('http') ? contactDetails.website.trim() : `https://${contactDetails.website.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors text-xs md:text-sm break-all"
                    >
                      {contactDetails.website.trim().replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-[#1A73E8]/15 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-[#1A73E8]" />
            <span className="font-bold text-base md:text-lg text-[#F5F8FF]">{siteName}</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F0F4FF] hover:text-[#1A73E8] transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-[#F0F4FF]">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>SSL Secure</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[#E7ECF6]/60 text-xs md:text-sm mt-6 md:mt-8 space-y-1 md:space-y-2">
          <p>© 2025 {siteName}. All rights reserved.</p>
          <p className="text-[10px] md:text-xs text-[#E7ECF6]/50">
            A Brand of TutorKhoj Private Limited
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
