"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TestProvider } from "@/contexts/TestContext";
import { usePathname } from "next/navigation";

// Dynamically import Header and Footer to reduce initial bundle size
const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: true,
  loading: () => <div className="h-20" />, // Placeholder to prevent layout shift
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => <div className="h-64" />, // Placeholder to prevent layout shift
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show Header and Footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  // Ensure title and meta description are set immediately for SEO - use requestIdleCallback to avoid blocking
  useEffect(() => {
    // Use requestIdleCallback to defer non-critical DOM operations
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Set document title
        if (document.title !== "AllExamQuestions - Master Your Certification Exams with Practice Tests") {
          document.title = "AllExamQuestions - Master Your Certification Exams with Practice Tests";
        }

        // Set or update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        const descriptionContent = "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam.";
        if (metaDescription.getAttribute('content') !== descriptionContent) {
          metaDescription.setAttribute('content', descriptionContent);
        }
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        if (document.title !== "AllExamQuestions - Master Your Certification Exams with Practice Tests") {
          document.title = "AllExamQuestions - Master Your Certification Exams with Practice Tests";
        }
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        const descriptionContent = "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam.";
        if (metaDescription.getAttribute('content') !== descriptionContent) {
          metaDescription.setAttribute('content', descriptionContent);
        }
      }, 0);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>AllExamQuestions - Master Your Certification Exams with Practice Tests</title>
        <meta name="description" content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam." />
        <meta name="keywords" content="certification exams, practice tests, exam questions, IT certification, AWS, Azure, Google Cloud, Cisco, CompTIA, exam preparation" />
        <meta property="og:title" content="AllExamQuestions - Master Your Certification Exams with Practice Tests" />
        <meta property="og:description" content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AllExamQuestions - Master Your Certification Exams with Practice Tests" />
        <meta name="twitter:description" content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam." />
        {/* Optimize resource loading order - DNS prefetch first, then preconnect */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"} />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"} crossOrigin="anonymous" />
        
        {/* Optimize font loading with font-display swap - inline to avoid render blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-display: swap;
            }
            /* Prevent layout shift during font load */
            body {
              font-display: swap;
            }
          `
        }} />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <TestProvider>

            {/* Header (client component) - Hide on admin pages */}
            {!isAdminPage && <Header />}

            {/* Main content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer (client component) - Hide on admin pages */}
            {!isAdminPage && <Footer />}

          </TestProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
