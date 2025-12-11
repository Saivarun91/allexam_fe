"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Layers, 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  BarChart3,
  Search,
  BookOpen,
  Home
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // ------------------ Auth Check ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin/auth");
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { name: "Categories", path: "/admin/categories", icon: Layers, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { name: "Enrollments", path: "/admin/enrollments", icon: Users, color: "from-green-500 to-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { name: "Email Templates", path: "/admin/email-templates", icon: Mail, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    { name: "Reviews", path: "/admin/reviews", icon: FileText, color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3, color: "from-indigo-500 to-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
    { name: "Settings", path: "/admin/settings", icon: Settings, color: "from-gray-500 to-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
    { name: "Search Logs", path: "/admin/search-logs", icon: Search, color: "from-teal-500 to-teal-600", bgColor: "bg-teal-50", borderColor: "border-teal-200" },
    { name: "Blog", path: "/admin/blog", icon: FileText, color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your platform, content, and users from one central location
          </p>
        </motion.div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={link.path}>
                  <div className={`${link.bgColor} border-2 ${link.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage {link.name.toLowerCase()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Home Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-blue-600" />
              Home Page Management
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/home/hero" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">Hero Sections</p>
              </Link>
              <Link href="/admin/home/features" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">Features</p>
              </Link>
              <Link href="/admin/home/testimonials" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">Testimonials</p>
              </Link>
              <Link href="/admin/home/faqs" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">FAQs</p>
              </Link>
              <Link href="/admin/home/providers" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center border-2 border-blue-200">
                <p className="font-semibold text-blue-700">Providers</p>
              </Link>
              <Link href="/admin/home/blog-posts" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">Blog Posts</p>
              </Link>
              <Link href="/admin/home/value-propositions" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">Value Props</p>
              </Link>
              <Link href="/admin/home/cta" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <p className="font-semibold text-gray-700">CTA Section</p>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
