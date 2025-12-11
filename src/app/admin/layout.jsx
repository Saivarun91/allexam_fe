"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/admin/adminnavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Don't show sidebar/navbar on auth page
  if (pathname === "/admin/auth") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Section (Navbar + Content) - with left margin to account for fixed sidebar */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <AdminNavbar />
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
