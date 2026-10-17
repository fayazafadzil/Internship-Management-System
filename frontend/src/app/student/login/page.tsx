"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LandingNav } from "@/components/layout/LandingNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFailedAttempts((prev) => prev + 1);
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      if (data.user.role !== "student") {
        setError("Unauthorized access. This portal is for students only.");
        return;
      }

      await login(
        {
          role: "student",
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          studentId: data.user.studentId,
          email: data.user.email,
        },
        data.token
      );

      if (data.user.mustResetPassword) {
        router.push(`/student/set-password?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/student/dashboard");
      }
    } catch {
      setError("Unable to connect to the backend server.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#AEC0D4]">
      
      {/* Landing Navigation එක මෙතනින් එකතු කළා */}
      <LandingNav />

      {/* Content Wrapper */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Card Container (Square Corners - rounded-none) */}
        <div className="mx-auto flex w-full max-w-4xl overflow-hidden rounded-none bg-white shadow-2xl">
          
          {/* Left Side: Image */}
          <div className="relative hidden w-1/2 bg-[#1B4472] md:block">
            <Image
              src="/login1.jpeg"
              alt="University of Ruhuna"
              fill
              priority
              className="object-cover opacity-90 rounded-none"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-8 text-white rounded-none">
              <p className="text-sm font-bold tracking-wide">Internship Management System</p>
              <p className="mt-1 text-xs text-white/60">University of Ruhuna</p>
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="w-full px-8 py-10 md:w-1/2 md:px-12 md:py-12 flex flex-col justify-center">
            
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1B4472]">IMS</h1>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#1B4472]">
                University System
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
              Sign in with your university credentials to access the Internship Management System.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-700">
                  University Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kamal12769@sci.ruh.ac.lk"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4472] focus:outline-none focus:ring-2 focus:ring-[#1B4472]/10 transition-all shadow-sm"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="mb-1.5">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                </div>

                {/* Password input replaced with standard type="password" to remove the eye icon */}
                <div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4472] focus:outline-none focus:ring-2 focus:ring-[#1B4472]/10 transition-all shadow-sm"
                  />
                </div>

                <div className="mt-2 text-right">
                  <Link
                    href="/student/forgot-password"
                    className="text-xs font-bold text-[#1B4472] hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1B4472] focus:ring-[#1B4472]/20 accent-[#1B4472]"
                />
                Remember Me
              </label>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-rose-50 p-3 border border-rose-100">
                  <p className="text-xs font-semibold text-rose-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#1B4472] py-3 text-sm font-bold text-white transition-all hover:bg-[#1B4472]/90 shadow-md active:scale-[0.99]"
              >
                Login
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/student/auth"
                  className="font-bold text-[#1B4472] hover:underline transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-1 items-center justify-center bg-[#AEC0D4] text-[#1B4472]">
          <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Loading…</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}



