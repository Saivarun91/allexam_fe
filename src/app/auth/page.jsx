"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GraduationCap, Mail, Lock, User, Phone } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

// ----------------------- API URLs -----------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
const USER_LOGIN_URL = `${API_BASE_URL}/api/users/login/`;
const USER_REGISTER_URL = `${API_BASE_URL}/api/users/register/`;
const FORGOT_PASSWORD_URL = `${API_BASE_URL}/api/users/forgot-password/`;
const VERIFY_OTP_URL = `${API_BASE_URL}/api/users/verify-otp/`;
const RESET_PASSWORD_URL = `${API_BASE_URL}/api/users/reset-password/`;
const GOOGLE_OAUTH_URL = `${API_BASE_URL}/api/users/google-oauth/`;

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupError, setSignupError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // reCAPTCHA states
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState("email"); // email, otp, reset
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  // Privacy & Terms
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  // Google Sign-In
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);

  // Check URL parameter for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      console.log("Attempting login to:", USER_LOGIN_URL);
      console.log("Email:", loginEmail);
      
      const res = await fetch(USER_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const data = await res.json();
        console.log("Error response:", data);
        setLoginError(data.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user?.fullname || "");
        localStorage.setItem("email", data.user?.email || "");
        localStorage.setItem("role", data.user?.role || "student");

        // Dispatch login event to update header without refresh
        window.dispatchEvent(new CustomEvent("userLoggedIn"));

        // Check for redirect parameter
        const redirectUrl = searchParams.get('redirect');
        
        if (redirectUrl) {
          // Redirect to the requested URL
          router.push(decodeURIComponent(redirectUrl));
        } else if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/Dashboard");
        }
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoginError("Network Error: Cannot connect to server. Please ensure the backend is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reCAPTCHA change
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (signupError && signupError.includes("captcha")) {
      setSignupError("");
    }
  };

  // Handle reCAPTCHA expiration
  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  // Handle reCAPTCHA error
  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setSignupError("reCAPTCHA error occurred. Please refresh the page and try again.");
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError("");

    if (!acceptedTerms || !acceptedPrivacy) {
      setSignupError("Please accept the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Validate reCAPTCHA
    if (!captchaToken) {
      setSignupError("Please complete the captcha verification");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(USER_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: signupName,
          email: signupEmail,
          password: signupPassword,
          phone_number: signupPhone,
          captcha_token: captchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registration successful! Please login now.");
        setActiveTab("login");
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        setSignupPhone("");
        setAcceptedTerms(false);
        setAcceptedPrivacy(false);
        setCaptchaToken(null);
        // Reset captcha
        if (captchaRef.current) {
          captchaRef.current.reset();
        }
      } else {
        setSignupError(data.error || "Signup failed");
        // Reset captcha on error so user can try again
        if (captchaRef.current) {
          captchaRef.current.reset();
        }
        setCaptchaToken(null);
      }
    } catch (err) {
      console.error(err);
      setSignupError("Something went wrong. Try again.");
      // Reset captcha on error
      if (captchaRef.current) {
        captchaRef.current.reset();
      }
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await fetch(FORGOT_PASSWORD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotMessage("✅ OTP sent to your email. Please check your inbox.");
        setForgotStep("otp");
      } else {
        setForgotError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setForgotError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotMessage("✅ OTP verified! Please set your new password.");
        setForgotStep("reset");
      } else {
        setForgotError(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setForgotError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotError("");
    setForgotMessage("");

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(RESET_PASSWORD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotEmail, 
          otp: otp, 
          new_password: newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotMessage("✅ Password reset successful! Please login with your new password.");
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotStep("email");
          setForgotEmail("");
          setOtp("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotMessage("");
          setForgotError("");
        }, 2000);
      } else {
        setForgotError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setForgotError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleButtonClick = async () => {
    try {
      setIsLoading(true);
      setLoginError("");
      setShowGoogleDialog(true);
      
      // Get Google Client ID from environment or use a placeholder
      // In production, this should be set in .env.local file
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      
      // Wait for Google library to load (with more retries)
      let retries = 0;
      const maxRetries = 20; // Increased retries
      while (!window.google && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 200));
        retries++;
      }
      if (!window.google) {
        setLoginError("Google Sign-In library is loading. Please wait a moment and try again.");
        setShowGoogleDialog(false);
        setIsLoading(false);
        return;
      }

      // If no client ID is configured, show helpful message
      if (!googleClientId || googleClientId.trim() === "" || googleClientId.includes("your-google-client-id-here")) {
        setLoginError(
          "Google Sign-In is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file. " +
          "Get your Client ID from: https://console.cloud.google.com/apis/credentials"
        );
        setShowGoogleDialog(false);
        setIsLoading(false);
        console.warn("Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file");
        console.warn("Setup instructions: 1) Go to https://console.cloud.google.com/ 2) Create OAuth 2.0 Client ID 3) Add to .env.local");
        return;
      }

      // Use Google Identity Services (GSI) OAuth2 for sign-in
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile',
        callback: async (tokenResponse) => {
          try {
            if (tokenResponse.error) {
              console.error("Google OAuth error:", tokenResponse.error);
              setLoginError("Google sign-in was cancelled or failed. Please try again.");
              setShowGoogleDialog(false);
              setIsLoading(false);
              return;
            }

            if (!tokenResponse.access_token) {
              setLoginError("Failed to get access token from Google.");
              setShowGoogleDialog(false);
              setIsLoading(false);
              return;
            }

            // Fetch user info from Google
            const userInfoRes = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
            );
            
            if (!userInfoRes.ok) {
              const errorText = await userInfoRes.text();
              console.error("Google API error:", errorText);
              throw new Error("Failed to fetch user info from Google");
            }

            const userInfo = await userInfoRes.json();

            if (!userInfo.email || !userInfo.id) {
              throw new Error("Invalid user information from Google");
            }

            const googleData = {
              google_id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name || userInfo.email.split('@')[0],
              profile_picture: userInfo.picture || "",
            };

            // Send to backend
            const res = await fetch(GOOGLE_OAUTH_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(googleData),
            });

            const data = await res.json();

            if (res.ok && data.token) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("name", data.user?.fullname || "");
              localStorage.setItem("email", data.user?.email || "");
              localStorage.setItem("role", data.user?.role || "student");
              
              // Dispatch login event to update header without refresh
              window.dispatchEvent(new CustomEvent("userLoggedIn"));
              
              setShowGoogleDialog(false);
              
              // Check for redirect parameter first
              const redirectUrl = searchParams.get('redirect');
              
              if (redirectUrl) {
                // Redirect to the requested URL
                router.push(decodeURIComponent(redirectUrl));
              } else {
                // Check if user needs to enroll after login
                if (typeof window !== 'undefined') {
                  const enrollAfterLogin = sessionStorage.getItem('enrollAfterLogin');
                  const enrollCourseId = sessionStorage.getItem('enrollCourseId');
                  const enrollCategoryId = sessionStorage.getItem('enrollCategoryId');
                  const enrollDuration = sessionStorage.getItem('enrollDuration');
                  const enrollTestId = sessionStorage.getItem('enrollTestId');
                  
                  if (enrollAfterLogin === 'true') {
                    // Clear the flags
                    sessionStorage.removeItem('enrollAfterLogin');
                    sessionStorage.removeItem('enrollCourseId');
                    sessionStorage.removeItem('enrollCategoryId');
                    sessionStorage.removeItem('enrollDuration');
                    sessionStorage.removeItem('enrollTestId');
                    sessionStorage.removeItem('returnUrl');
                    
                    // Redirect to enrollment page
                    if (enrollCourseId) {
                      router.push(`/enroll?courseId=${enrollCourseId}&duration=${enrollDuration || '1-month'}`);
                    } else if (enrollCategoryId) {
                      router.push(`/enroll?categoryId=${enrollCategoryId}&duration=${enrollDuration || '1-month'}`);
                    }
                    return;
                  }
                }
                
                // Default redirect
                if (data.user?.role === "admin") {
                  router.push("/admin");
                } else {
                  router.push("/Dashboard");
                }
              }
            } else {
              setLoginError(data.error || "Google sign-in failed. Please try again.");
              setShowGoogleDialog(false);
            }
          } catch (err) {
            console.error("Google sign-in error:", err);
            setLoginError(err.message || "Failed to complete Google sign-in. Please try again.");
            setShowGoogleDialog(false);
          } finally {
            setIsLoading(false);
          }
        },
      });

      // Request access token (this will open Google sign-in popup)
      tokenClient.requestAccessToken();
      
    } catch (err) {
      console.error("Google button click error:", err);
      setLoginError("An error occurred. Please try again.");
      setShowGoogleDialog(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col justify-center text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-3 justify-center lg:justify-start">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                AllExam
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Start Your Success Journey Today
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of students preparing for their dream certification exams with our comprehensive practice platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">1000+ Practice Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Updated Daily</span>
              </div>
            </div>
          </motion.div>

          {/* Right side Auth forms */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg p-1">
                    <TabsTrigger 
                      value="login"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-5">
                      {loginError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-red-600 text-sm">{loginError}</p>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="login-email" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input 
                          id="login-email"
                          type="email" 
                          value={loginEmail} 
                          onChange={(e) => setLoginEmail(e.target.value)} 
                          required 
                          placeholder="Enter your email" 
                          className="mt-2 h-11"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="login-password" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Password
                        </Label>
                        <Input 
                          id="login-password"
                          type="password" 
                          value={loginPassword} 
                          onChange={(e) => setLoginPassword(e.target.value)} 
                          required 
                          placeholder="Enter your password" 
                          className="mt-2 h-11"
                        />
                      </div>

                      {/* Forgot Password Link */}
                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>

                      {/* Google Sign-In Button - Only in Login */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 border-gray-300 hover:bg-gray-50"
                        onClick={handleGoogleButtonClick}
                        disabled={isLoading}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                      </Button>
                      
                      <p className="text-xs text-center text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("signup")}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sign up here
                        </button>
                      </p>
                    </form>
                  </TabsContent>

                  {/* Signup Form */}
                  <TabsContent value="signup">
                    <form className="space-y-4" onSubmit={handleSignup}>
                      {signupError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-red-600 text-sm">{signupError}</p>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="fullname" className="text-gray-700 font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input 
                          id="fullname"
                          type="text" 
                          value={signupName} 
                          onChange={(e) => setSignupName(e.target.value)} 
                          required 
                          placeholder="Enter your full name" 
                          className="mt-2 h-11"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </Label>
                        <Input 
                          id="email"
                          type="email" 
                          value={signupEmail} 
                          onChange={(e) => setSignupEmail(e.target.value)} 
                          required 
                          placeholder="Enter your email" 
                          className="mt-2 h-11"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </Label>
                        <Input 
                          id="phone"
                          type="tel" 
                          value={signupPhone} 
                          onChange={(e) => setSignupPhone(e.target.value)} 
                          required 
                          placeholder="Enter your phone number" 
                          className="mt-2 h-11"
                        />
                        <p className="text-xs text-gray-500 mt-1">Required for account verification</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Password *
                        </Label>
                        <Input 
                          id="password"
                          type="password" 
                          value={signupPassword} 
                          onChange={(e) => setSignupPassword(e.target.value)} 
                          required 
                          minLength={6}
                          placeholder="Create a password (min. 6 characters)" 
                          className="mt-2 h-11"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Confirm Password *
                        </Label>
                        <Input 
                          id="confirmPassword"
                          type="password" 
                          value={signupConfirmPassword} 
                          onChange={(e) => setSignupConfirmPassword(e.target.value)} 
                          required 
                          minLength={6}
                          placeholder="Confirm your password" 
                          className="mt-2 h-11"
                        />
                      </div>
                      
                      {/* Terms and Privacy - IN SIGNUP FORM */}
                      <div className="space-y-3 pt-2 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="terms" 
                            checked={acceptedTerms} 
                            onCheckedChange={setAcceptedTerms}
                            className="mt-1"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                            I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setShowTermsDialog(true)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Terms of Service
                            </button>
                          </label>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="privacy" 
                            checked={acceptedPrivacy} 
                            onCheckedChange={setAcceptedPrivacy}
                            className="mt-1"
                          />
                          <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                            I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyDialog(true)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Privacy Policy
                            </button>
                          </label>
                        </div>
                      </div>
                      
                      {/* reCAPTCHA */}
                      <div className="pt-2 flex justify-center">
                        <ReCAPTCHA
                          ref={captchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                          onChange={handleCaptchaChange}
                          onExpired={handleCaptchaExpired}
                          onError={handleCaptchaError}
                          theme="light"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg" 
                        disabled={isLoading || !acceptedTerms || !acceptedPrivacy || !captchaToken}
                      >
                        {isLoading ? "Creating account..." : "Sign Up"}
                      </Button>
                      
                      <p className="text-xs text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Login here
                        </button>
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Reset Password</DialogTitle>
            <DialogDescription>
              {forgotStep === "email" && "Enter your email to receive a password reset code"}
              {forgotStep === "otp" && "Enter the OTP sent to your email"}
              {forgotStep === "reset" && "Create your new password"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {forgotMessage && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-600 text-sm">{forgotMessage}</p>
              </div>
            )}
            
            {forgotError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{forgotError}</p>
              </div>
            )}

            {/* Step 1: Email */}
            {forgotStep === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mt-2"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Check your email for the OTP</p>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotStep("email")}
                  className="w-full"
                >
                  Back
                </Button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter new password (min. 6 characters)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    className="mt-2"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Privacy Policy</DialogTitle>
            <DialogDescription>
              Please read our privacy policy carefully before accepting.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none p-6">
            <h3 className="font-bold text-lg mb-3">Information We Collect</h3>
            <p className="mb-4">We collect information you provide directly to us, including your name, email address, phone number, and any other information you choose to provide.</p>
            
            <h3 className="font-bold text-lg mb-3">How We Use Your Information</h3>
            <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users.</p>
            
            <h3 className="font-bold text-lg mb-3">Information Sharing</h3>
            <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only with your consent or as required by law.</p>
            
            <h3 className="font-bold text-lg mb-3">Data Security</h3>
            <p className="mb-4">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h3 className="font-bold text-lg mb-3">Your Rights</h3>
            <p>You have the right to access, update, or delete your personal information at any time. Contact us if you wish to exercise these rights.</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Terms of Service Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Terms of Service</DialogTitle>
            <DialogDescription>
              Please read our terms of service carefully before accepting.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none p-6">
            <h3 className="font-bold text-lg mb-3">Acceptance of Terms</h3>
            <p className="mb-4">By accessing and using AllExamQuestions, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h3 className="font-bold text-lg mb-3">Use License</h3>
            <p className="mb-4">Permission is granted to temporarily access the materials on AllExamQuestions for personal, non-commercial use only.</p>
            
            <h3 className="font-bold text-lg mb-3">User Account</h3>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
            
            <h3 className="font-bold text-lg mb-3">Prohibited Uses</h3>
            <p className="mb-4">You may not use our service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.</p>
            
            <h3 className="font-bold text-lg mb-3">Termination</h3>
            <p>We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
