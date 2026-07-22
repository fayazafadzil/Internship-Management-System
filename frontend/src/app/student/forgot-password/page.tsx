"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, GraduationCap, MailCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/Field";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StudentForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid university email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to initiate password reset.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        "A password reset link has been sent to your university email. Please check your inbox.",
      );
    } catch {
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#AEC0D4] relative">
      
      {/* Upper Area containing Back Button & Form Card */}
      <div className="flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative flex-1">
        
        {/* Back to Login Link - Top Left Corner */}
        <div className="absolute top-4 left-4 md:left-8">
          <Link
            href="/student/login"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-navy-deep transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-2xl border-none my-auto">
          
          {/* Header Section with Dark Blue Gradient */}
          <div className="bg-gradient-to-b from-[#1e3a63] to-[#132540] px-6 py-8 text-center text-white rounded-t-2xl">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
              <GraduationCap className="h-5 w-5 text-white/95" />
            </div>

            <h1 className="text-lg font-bold tracking-wide">
              Forgot your Password?
            </h1>
            <p className="mt-1 text-[11px] text-white/70 font-medium leading-relaxed max-w-[280px] mx-auto">
              Enter your university email to recover your account.
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  University Email
                </label>

                <div className="overflow-hidden rounded-xl bg-white border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all shadow-sm [&_input]:bg-transparent [&_input]:border-none [&_input]:outline-none">
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.ruh.ac.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-rose-50 p-2.5 border-l-4 border-rose-500 rounded-r-xl">
                  <p className="text-[11px] font-semibold text-rose-700 leading-tight">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#1e3a63] to-[#132540] py-3 text-xs font-bold text-white uppercase tracking-wider transition-all hover:opacity-95 shadow-md active:scale-[0.99] mt-2 disabled:opacity-50"
              >
                {loading ? "Sending reset link..." : "Send Reset Link"}
              </button>
            </form>

            {/* Success Banner */}
            {successMessage && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <MailCheck className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Password reset email sent</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-700/90">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assistance Box */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100">
              <p className="font-bold text-slate-800">Need assistance?</p>
              <p className="mt-1 leading-relaxed text-slate-500">
                If you don't see the message, please check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer stays at bottom properly */}
      <Footer />
    </div>
  );
}

