"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSiteName } from "@/hooks/useSiteName";
import {
  Home,
  Layers,
  Users,
  FileText,
  Mail,
  Settings,
  BarChart3,
  Search,
  BookOpen,
  LogOut,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Star,
  Clock,
  HelpCircle,
  Award,
  Quote,
  DollarSign,
  Building2,
  Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const siteName = useSiteName();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState(["home-management"]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: Home },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Pricing Plans", path: "/admin/pricing-plans", icon: DollarSign },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
    { name: "Enrollments", path: "/admin/enrollments", icon: Users },
    { name: "Email Templates", path: "/admin/email-templates", icon: Mail },
    { name: "Reviews", path: "/admin/reviews", icon: FileText },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Search Logs", path: "/admin/search-logs", icon: Search },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Home Page Management Sections
  const homeManagementSections = {
    id: "home-management",
    name: "Home Page Management",
    icon: Home,
    submenu: [
      { name: "Hero Section", path: "/admin/home/hero", icon: Sparkles },
      { name: "Featured Exams", path: "/admin/home/featured-exams", icon: Award },
      { name: "Exam Details Manager", path: "/admin/home/exam-details-manager", icon: BookOpen },
      { name: "Exams Page Manager", path: "/admin/home/exams-page-manager", icon: Search },
      { name: "Value Propositions", path: "/admin/home/value-propositions", icon: Star },
      { name: "Top Categories", path: "/admin/home/top-categories", icon: Layers },
      { name: "Popular Providers", path: "/admin/home/popular-providers", icon: Building2 },
      { name: "Testimonials", path: "/admin/home/testimonials", icon: Quote },
      { name: "Blog Posts", path: "/admin/home/blog-posts", icon: FileText },
      { name: "Recently Updated", path: "/admin/home/recently-updated", icon: Clock },
      { name: "FAQs", path: "/admin/home/faqs", icon: HelpCircle },
      { name: "Email Subscribe (CTA)", path: "/admin/home/email-subscribe", icon: Mail },
    ],
  };

  // Courses Management Section
  const coursesSection = {
    id: "courses-management",
    name: "Courses Management",
    icon: GraduationCap,
    path: "/admin/courses",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/admin/auth");
  };

  const isPathActive = (path) => {
    return pathname === path || (path !== "/admin" && pathname?.startsWith(path));
  };

  const isSectionActive = (section) => {
    if (section.path) {
      return isPathActive(section.path);
    }
    if (section.submenu) {
      return section.submenu.some((item) => isPathActive(item.path));
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#0C1A35] to-[#0E2444] border-r border-[#1A73E8]/20 shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-[#1A73E8]/20 px-4 bg-[#0C1A35]">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#1A73E8]" />
            <span className="text-xl font-bold text-white">{siteName}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#1A73E8] text-white font-semibold shadow-md"
                        : "text-[#E7ECF6] hover:bg-[#1A73E8]/20 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}

            {/* Home Page Management Section - Collapsible */}
            <li>
              <button
                onClick={() => toggleSection(homeManagementSections.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  isSectionActive(homeManagementSections)
                    ? "bg-[#1A73E8] text-white font-semibold shadow-md"
                    : "text-[#E7ECF6] hover:bg-[#1A73E8]/20 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <homeManagementSections.icon className="w-5 h-5" />
                  <span>{homeManagementSections.name}</span>
                </div>
                {expandedSections.includes(homeManagementSections.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* Submenu */}
              {expandedSections.includes(homeManagementSections.id) && (
                <ul className="mt-1 ml-4 space-y-1">
                  {homeManagementSections.submenu.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isActive = isPathActive(subItem.path);
                    
                    return (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-[#1A73E8] text-white font-medium shadow-md"
                              : "text-[#E7ECF6]/80 hover:bg-[#1A73E8]/30 hover:text-white"
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

          </ul>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-[#1A73E8]/20 p-4 bg-[#0C1A35]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#E7ECF6] hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

