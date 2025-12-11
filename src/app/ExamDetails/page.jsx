"use client";

import { useRouter ,useSearchParams} from "next/navigation";
import Link from "next/link";
import { Star, Clock, Users, TrendingUp, CheckCircle2, BookOpen, Target, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock data
const examData = {
  "aws/saa-c03": {
    title: "AWS Certified Solutions Architect — Associate",
    code: "SAA-C03",
    provider: "AWS",
    category: ["Cloud", "Architecture"],
    difficulty: "Intermediate",
    lastUpdated: "2 days ago",
    passRate: 94,
    rating: 4.8,
    reviews: 2847,
    learners: 145000,
    practiceTests: 5,
    totalQuestions: 850,
    duration: "130 minutes",
    passingScore: "720/1000",
    about: "The AWS Certified Solutions Architect - Associate certification validates your ability to design distributed systems on AWS. This certification is ideal for individuals who perform a solutions architect role and want to validate their knowledge of designing applications and systems on AWS.",
    whatsIncluded: [
      "5 full-length practice tests (850+ questions)",
      "Real exam-style difficulty and format",
      "Detailed explanations for every question",
      "Timed mode and Review mode available",
      "Unlimited attempts on all practice tests",
      "Performance tracking and analytics",
      "Mobile-friendly interface"
    ],
    whyMatters: "AWS certifications are among the most sought-after credentials in cloud computing. The Solutions Architect Associate certification demonstrates your expertise in designing scalable, cost-effective, and secure applications on AWS. This certification can significantly boost your career prospects and earning potential in cloud architecture roles.",
    topics: [
      { name: "Design Resilient Architectures", weight: 30 },
      { name: "Design High-Performing Architectures", weight: 28 },
      { name: "Design Secure Applications", weight: 24 },
      { name: "Design Cost-Optimized Architectures", weight: 18 }
    ],
    practiceTestsList: [
      { id: 1, name: "Practice Test 1", questions: 65, difficulty: "Intermediate", progress: 0 },
      { id: 2, name: "Practice Test 2", questions: 65, difficulty: "Intermediate", progress: 0 },
      { id: 3, name: "Practice Test 3", questions: 65, difficulty: "Advanced", progress: 0 },
      { id: 4, name: "Practice Test 4", questions: 65, difficulty: "Intermediate", progress: 0 },
      { id: 5, name: "Practice Test 5", questions: 65, difficulty: "Advanced", progress: 0 }
    ],
    testimonials: [
      {
        name: "Sarah Mitchell",
        role: "Cloud Solutions Architect",
        rating: 5,
        review: "These practice tests were incredibly accurate. I passed my SAA-C03 exam on the first try with a score of 892/1000. The explanations helped me understand the concepts deeply.",
        verified: true
      },
      {
        name: "Raj Patel",
        role: "DevOps Engineer",
        rating: 5,
        review: "Best exam prep resource I've used. The questions matched the real exam difficulty perfectly. I studied for 3 weeks using only these practice tests and passed confidently.",
        verified: true
      },
      {
        name: "Emily Chen",
        role: "Senior Cloud Engineer",
        rating: 5,
        review: "The detailed explanations for each answer made all the difference. I not only passed but gained practical knowledge I use daily in my job. Worth every penny!",
        verified: true
      }
    ],
    faqs: [
      {
        question: "Is this practice pack enough to pass the SAA-C03 exam?",
        answer: "Yes! 94% of our users who completed all 5 practice tests passed their exam on the first attempt."
      },
      {
        question: "Are the questions similar to the real AWS exam?",
        answer: "Absolutely. Our questions are designed by AWS-certified professionals and reviewed regularly."
      }
    ]
  }
};

const ExamDetails = () => {
  const router = useRouter();
  const searchparams = useSearchParams();
  const provider = searchparams.get('provider');
  const examCode = searchparams.get('examCode');

  if (!provider || !examCode) return null;

  const examKey = `${provider}/${examCode}`;
  const exam = examData[examKey];
  const practiceUrl = `/exams/${provider}/${examCode}/practice`;

  if (!exam) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#0C1A35] mb-4">Exam Not Found</h1>
          <p className="text-gray-600 mb-6">The exam you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/exams/${provider}`}>{exam.provider}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{exam.code}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Rest of UI (Hero, Summary Card, About, Topics, Practice Tests, Testimonials, FAQ) */}
        {/* You can copy the same JSX from your React code here without any changes */}
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <Button
          asChild
          className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-[0_4px_14px_rgba(26,115,232,0.4)] h-12 text-base font-semibold"
        >
          <a href={practiceUrl}>Start Practicing →</a>
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default ExamDetails;


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import { Button } from "@/components/ui/button";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// const ExamDetails = () => {
//   const router = useRouter();
//   const { provider, examCode } = router.query;

//   const [exam, setExam] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   // Fetch exam data dynamically from backend
//   useEffect(() => {
//     if (!provider || !examCode) return;

//     const fetchExam = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/exams/${provider}/${examCode}/`
//         );
//         if (!res.ok) throw new Error("Exam not found");
//         const data = await res.json();
//         setExam(data);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//         setLoading(false);
//       }
//     };

//     fetchExam();
//   }, [provider, examCode]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading exam details...
//       </div>
//     );
//   }

//   if (error || !exam) {
//     return (
//       <div className="min-h-screen bg-white">
//         <Header />
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h1 className="text-3xl font-bold text-[#0C1A35] mb-4">Exam Not Found</h1>
//           <p className="text-gray-600 mb-6">
//             The exam you're looking for doesn't exist or has been moved.
//           </p>
//           <Button asChild>
//             <Link href="/">Return Home</Link>
//           </Button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const practiceUrl = `/exams/${provider}/${examCode}/practice`;

//   return (
//     <div className="min-h-screen bg-white">
//       <Header />

//       <main className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <Breadcrumb className="mb-6">
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/">Home</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href={`/exams/${provider}`}>{exam.provider}</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbPage>{exam.code}</BreadcrumbPage>
//           </BreadcrumbList>
//         </Breadcrumb>

//         {/* Exam Hero Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-[#0C1A35] mb-2">{exam.title}</h1>
//           <p className="text-muted-foreground">{exam.about}</p>
//           <div className="flex gap-4 mt-4 flex-wrap">
//             <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{exam.difficulty}</span>
//             <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{exam.passRate}% pass rate</span>
//             <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{exam.totalQuestions} questions</span>
//           </div>
//           <div className="mt-6">
//             <Button asChild className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-6 py-2">
//               <a href={practiceUrl}>Start Practicing →</a>
//             </Button>
//           </div>
//         </div>

//         {/* Topics Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Topics Covered</h2>
//           <ul className="list-disc list-inside space-y-1">
//             {exam.topics?.map((topic, idx) => (
//               <li key={idx}>
//                 {topic.name} — {topic.weight}%
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Practice Tests Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Practice Tests</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             {exam.practiceTestsList?.map((test) => (
//               <div key={test.id} className="p-4 border rounded shadow-sm">
//                 <h3 className="font-medium">{test.name}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   {test.questions} Questions — {test.difficulty}
//                 </p>
//                 <div className="mt-2">
//                   <Progress value={test.progress} />
//                 </div>
//                 <Button asChild className="mt-2 w-full bg-primary hover:bg-primary/90">
//                   <Link href={`${practiceUrl}/${test.id}`}>Start Test</Link>
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FAQs Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
//           <div className="space-y-2">
//             {exam.faqs?.map((faq, idx) => (
//               <div key={idx} className="border p-4 rounded">
//                 <p className="font-medium">{faq.question}</p>
//                 <p className="text-muted-foreground mt-1">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Sticky Mobile CTA */}
//       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
//         <Button
//           asChild
//           className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-[0_4px_14px_rgba(26,115,232,0.4)] h-12 text-base font-semibold"
//         >
//           <a href={practiceUrl}>Start Practicing →</a>
//         </Button>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ExamDetails;
