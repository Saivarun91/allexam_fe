"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
const USER_REGISTER_URL = `${API_BASE_URL}/api/users/register/`;

function SignupPageContent() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
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

  // Privacy & Terms
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

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
          recaptcha_token: captchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registration successful! Please login now.");
        router.push("/auth/login");
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

          {/* Right side Signup form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h3>
                  <p className="text-gray-600 text-sm">Create your account to get started</p>
                </div>

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
                  
                  {/* Terms and Privacy */}
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
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}

