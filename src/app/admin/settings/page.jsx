"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner"; // toast notifications

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultUserRole, setDefaultUserRole] = useState("user");
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Contact Details States
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");

  // Admin credentials change states
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);

  // ✅ Fetch settings and admin profile on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await axios.get(`${API_BASE_URL}/api/settings/get/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          const d = res.data.data;
          setSiteName(d.site_name || "");
          setAdminEmail(d.admin_email || "");
          setEmailNotifications(d.email_notifications || false);
          setMaintenanceMode(d.maintenance_mode || false);
          setDefaultUserRole(d.default_user_role || "user");
          setSessionTimeout(Number(d.session_timeout) || 30);
          setContactEmail(d.contact_email || "");
          setContactPhone(d.contact_phone || "");
          setContactAddress(d.contact_address || "");
          setContactWebsite(d.contact_website || "");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("❌ Failed to fetch settings");
      }
    };

    fetchSettings();
  }, []);

  // ✅ Common reusable function to update settings
  const updateSettings = async (updatedFields, successMessage) => {
    try {
      const payload = {
        site_name: siteName,
        admin_email: adminEmail,
        email_notifications: emailNotifications,
        maintenance_mode: maintenanceMode,
        default_user_role: defaultUserRole,
        session_timeout: sessionTimeout,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        contact_address: contactAddress,
        contact_website: contactWebsite,
        ...updatedFields,
      };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await axios.post(`${API_BASE_URL}/api/settings/update/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success(<div className="text-green-600 font-medium">{successMessage}</div>);
        
        // Trigger events to refresh components
        if (typeof window !== 'undefined') {
          // If site name was updated, trigger site name update event
          if (updatedFields.site_name) {
            window.dispatchEvent(new CustomEvent('siteNameUpdated'));
            localStorage.removeItem('siteNameCache');
          }
          
          // If contact details were updated, trigger contact details update event
          if (updatedFields.contact_email || updatedFields.contact_phone || updatedFields.contact_address || updatedFields.contact_website) {
            window.dispatchEvent(new CustomEvent('contactDetailsUpdated'));
          }
        }
      } else {
        toast.error(res.data.message || "⚠️ Failed to update settings");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("❌ Something went wrong while saving");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Admin Settings</h1>
        <p className="text-gray-500">Manage platform-wide admin configurations.</p>
      </motion.div>

      {/* General Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Site Name:</label>
            <Input
              className="flex-1"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Admin Email:</label>
            <Input
              className="flex-1"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                { site_name: siteName, admin_email: adminEmail },
                "✅ General settings saved successfully!"
              )
            }
          >
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Contact Details Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Contact Email:</label>
            <Input
              className="flex-1"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Enter contact email (e.g., support@example.com)"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Contact Phone:</label>
            <Input
              className="flex-1"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Enter contact phone (e.g., +1 234-567-8900)"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <label className="w-40 font-medium text-gray-700 pt-2">Contact Address:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="Enter full contact address"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Contact Website:</label>
            <Input
              className="flex-1"
              type="url"
              value={contactWebsite}
              onChange={(e) => setContactWebsite(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                { 
                  contact_email: contactEmail, 
                  contact_phone: contactPhone,
                  contact_address: contactAddress,
                  contact_website: contactWebsite
                },
                "✅ Contact details saved successfully!"
              )
            }
          >
            Save Contact Details
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Email Notifications</span>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Maintenance Mode</span>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                {
                  email_notifications: emailNotifications,
                  maintenance_mode: maintenanceMode,
                },
                "📢 Notification settings saved successfully!"
              )
            }
          >
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Admin Credentials */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Change Admin Credentials</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">New Email Address</label>
              <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter new email address"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (required for password change)"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (leave empty to keep current)"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            )}

            <Button
              className="w-fit mt-2 bg-blue-700 hover:bg-blue-800"
              disabled={isUpdatingCredentials}
              onClick={async () => {
                if (newPassword && newPassword !== confirmPassword) {
                  toast.error("❌ New passwords do not match");
                  return;
                }

                if (newPassword && !currentPassword) {
                  toast.error("❌ Current password is required to change password");
                  return;
                }

                setIsUpdatingCredentials(true);
                try {
                  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
                  const payload = {};

                  if (newAdminEmail && newAdminEmail !== currentAdminEmail) {
                    payload.email = newAdminEmail;
                  }

                  if (newPassword) {
                    payload.password = newPassword;
                    payload.current_password = currentPassword;
                  }

                  if (Object.keys(payload).length === 0) {
                    toast.error("❌ Please enter new email or password to update");
                    setIsUpdatingCredentials(false);
                    return;
                  }

                  const res = await axios.put(
                    `${API_BASE_URL}/api/users/admin/update-credentials/`,
                    payload,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );

                  if (res.data.message) {
                    toast.success("✅ Credentials updated successfully!");
                    setCurrentAdminEmail(res.data.admin?.email || newAdminEmail);
                    setNewAdminEmail(res.data.admin?.email || newAdminEmail);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");

                    if (res.data.admin?.email) {
                      localStorage.setItem("user_name", res.data.admin.name || "Admin");
                    }
                  } else {
                    toast.error(res.data.error || "❌ Failed to update credentials");
                  }
                } catch (err) {
                  console.error("Error updating credentials:", err);
                  const errorMsg = err.response?.data?.error || "❌ Failed to update credentials";
                  toast.error(errorMsg);
                } finally {
                  setIsUpdatingCredentials(false);
                }
              }}
            >
              {isUpdatingCredentials ? "Updating..." : "Update Credentials"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Default User Role:</label>
            <select
              className="flex-1 border border-gray-300 rounded-lg p-2"
              value={defaultUserRole}
              onChange={(e) => setDefaultUserRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Session Timeout (mins):</label>
            <Input
              type="number"
              className="flex-1"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              placeholder="Enter minutes"
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                {
                  default_user_role: defaultUserRole,
                  session_timeout: sessionTimeout,
                },
                "⚙️ Advanced settings saved successfully!"
              )
            }
          >
            Save Advanced Settings
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Policy & Terms Management */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Privacy Policy & Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <PrivacyTermsManager />
        </CardContent>
      </Card>
    </div>
  );
}

// Privacy & Terms Management Component
function PrivacyTermsManager() {
  const [privacyContent, setPrivacyContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const token = localStorage.getItem("token");

        const [privacyRes, termsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/settings/privacy-policy/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/settings/terms-of-service/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (privacyRes.ok) {
          const data = await privacyRes.json();
          setPrivacyContent(data.content || "");
        }
        if (termsRes.ok) {
          const data = await termsRes.json();
          setTermsContent(data.content || "");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, []);

  const handleSavePrivacy = async () => {
    setLoadingPrivacy(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/settings/privacy-policy/update/`,
        { content: privacyContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("✅ Privacy Policy updated successfully!");
      } else {
        toast.error(res.data.error || "Failed to update privacy policy");
      }
    } catch (err) {
      console.error("Error updating privacy policy:", err);
      toast.error("❌ Failed to update privacy policy");
    } finally {
      setLoadingPrivacy(false);
    }
  };

  const handleSaveTerms = async () => {
    setLoadingTerms(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/settings/terms-of-service/update/`,
        { content: termsContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("✅ Terms of Service updated successfully!");
      } else {
        toast.error(res.data.error || "Failed to update terms of service");
      }
    } catch (err) {
      console.error("Error updating terms:", err);
      toast.error("❌ Failed to update terms of service");
    } finally {
      setLoadingTerms(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "privacy"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "terms"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Terms of Service
        </button>
      </div>

      {activeTab === "privacy" && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Privacy Policy Content
            </label>
            <textarea
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              rows={15}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter privacy policy content..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This content will be shown to users during signup
            </p>
          </div>
          <Button
            onClick={handleSavePrivacy}
            disabled={loadingPrivacy}
            className="bg-blue-700 hover:bg-blue-800"
          >
            {loadingPrivacy ? "Saving..." : "Save Privacy Policy"}
          </Button>
        </div>
      )}

      {activeTab === "terms" && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Terms of Service Content
            </label>
            <textarea
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              rows={15}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter terms of service content..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This content will be shown to users during signup
            </p>
          </div>
          <Button
            onClick={handleSaveTerms}
            disabled={loadingTerms}
            className="bg-blue-700 hover:bg-blue-800"
          >
            {loadingTerms ? "Saving..." : "Save Terms of Service"}
          </Button>
        </div>
      )}
    </div>
  );
}
