"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TestProvider } from "@/contexts/TestContext";
import { usePathname } from "next/navigation";

// Dynamically import Header and Footer to reduce initial bundle size
const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: true,
  loading: () => <div className="h-20" />,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => <div className="h-64" />,
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Don't show Header and Footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(() => {
        if (
          document.title !==
          "AllExamQuestions - Master Your Certification Exams with Practice Tests"
        ) {
          document.title =
            "AllExamQuestions - Master Your Certification Exams with Practice Tests";
        }

        let metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (!metaDescription) {
          metaDescription = document.createElement("meta");
          metaDescription.setAttribute("name", "description");
          document.head.appendChild(metaDescription);
        }

        const descriptionContent =
          "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam.";

        if (metaDescription.getAttribute("content") !== descriptionContent) {
metaDescription.setAttribute("content", descriptionContent);
        }

        // Set default canonical URL for homepage (other pages will override this)
        if (pathname === "/" || !pathname) {
          let canonicalLink = document.querySelector('link[rel="canonical"]');
          if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
          }
          canonicalLink.setAttribute("href", "https://allexamquestions.com/");
        }
      });
    }
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>
          AllExamQuestions - Master Your Certification Exams with Practice Tests
        </title>
        <meta
          name="description"
          content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam."
        />
        <meta
          name="keywords"
          content="certification exams, practice tests, exam questions, IT certification, AWS, Azure, Google Cloud, Cisco, CompTIA, exam preparation"
        />

        <meta
          property="og:title"
          content="AllExamQuestions - Master Your Certification Exams with Practice Tests"
        />
        <meta
          property="og:description"
          content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification."
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AllExamQuestions - Master Your Certification Exams with Practice Tests"
        />
        <meta
          name="twitter:description"
          content="Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification."
        />

        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          rel="dns-prefetch"
          href={
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
          }
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href={
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
          }
          crossOrigin="anonymous"
        />
        <link rel="canonical" href="https://allexamquestions.com/" />
      </head>

      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">

        {/* ================= GOOGLE ANALYTICS START ================= */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PEVC55BHV2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PEVC55BHV2', {
              anonymize_ip: true,
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* ================= GOOGLE ANALYTICS END ================= */}

        <AuthProvider>
          <TestProvider>
            {!isAdminPage && <Header />}

            <main className="flex-1">{children}</main>

            {!isAdminPage && <Footer />}
          </TestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
