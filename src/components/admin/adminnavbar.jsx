"use client";

import { useState, useEffect } from "react";

export default function AdminNavbar() {
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("Administrator");
  const [userInitial, setUserInitial] = useState("A");

  useEffect(() => {
    // Get user data from localStorage
    const name = localStorage.getItem("user_name") || localStorage.getItem("name");
    const email = localStorage.getItem("user_email") || localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (name) {
      setUserName(name);
      // Get first letter of name for avatar
      setUserInitial(name.charAt(0).toUpperCase());
    }

    if (email) {
      setUserEmail(email);
    } else if (role) {
      setUserEmail(role);
    }

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "user_name" || e.key === "name" || e.key === "user_email" || e.key === "email" || e.key === "role") {
        const updatedName = localStorage.getItem("user_name") || localStorage.getItem("name");
        const updatedEmail = localStorage.getItem("user_email") || localStorage.getItem("email");
        const updatedRole = localStorage.getItem("role");

        if (updatedName) {
          setUserName(updatedName);
          setUserInitial(updatedName.charAt(0).toUpperCase());
        }

        if (updatedEmail) {
          setUserEmail(updatedEmail);
        } else if (updatedRole) {
          setUserEmail(updatedRole);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-between px-6 bg-gradient-to-r from-white to-gray-50">
      {/* Left side - Empty for clean look */}
      <div className="flex items-center">
        {/* Empty - Logo is in sidebar now */}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

