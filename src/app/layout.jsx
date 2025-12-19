import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { TestProvider } from "@/contexts/TestContext";

/* ================= METADATA (SERVER-SIDE SEO) ================= */

export const metadata = {
  title: "AllExamQuestions - Master Your Certification Exams with Practice Tests",
  description:
    "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification. Practice with real exam questions and pass your certification exam.",
  keywords:
    "certification exams, practice tests, exam questions, IT certification, AWS, Azure, Google Cloud, Cisco, CompTIA, exam preparation",
  alternates: {
    canonical: "https://allexamquestions.com/",
  },
  openGraph: {
    title:
      "AllExamQuestions - Master Your Certification Exams with Practice Tests",
    description:
      "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification.",
    type: "website",
    url: "https://allexamquestions.com/",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AllExamQuestions - Master Your Certification Exams with Practice Tests",
    description:
      "Accurate, updated, exam-style questions trusted by thousands of professionals preparing for their next big certification.",
  },
};

/* ================= DYNAMIC COMPONENTS ================= */

const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: true,
  loading: () => <div className="h-20" />,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => <div className="h-64" />,
});

/* ================= ROOT LAYOUT ================= */

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">

        {/* ================= GOOGLE ANALYTICS ================= */}
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
            });
          `}
        </Script>

        <AuthProvider>
          <TestProvider>
            {/* Header/Footer visibility handled internally */}
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </TestProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
