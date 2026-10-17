"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { isStrongPassword } from "@/lib/accounts";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

// Landing Navigation Component
const links = [
  { label: "Overview", href: "/#overview" },
  { label: "Features", href: "/#features" },
  { label: "Contact", href: "/#contact" },
];

function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0B1528]/85 backdrop-blur-md border-b border-white/10 text-white shadow-lg transition-all">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        
        {/* IMS Logo Section */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src="/ruhuna.png"
            alt="IMS Logo"
            className="h-10 w-auto object-contain drop-shadow"
          />
          <span className="text-xl font-extrabold tracking-wider text-white leading-tight">
            IMS
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label}>
                <Link 
                  href={l.href} 
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    active 
                      ? "text-white bg-white/10" 
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0B1528] px-6 py-4 md:hidden flex flex-col gap-2">
          {links.map((l) => (
            <Link 
              key={l.label}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-200 hover:text-white py-2"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function SetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const email = params.get("email") ?? "";
  const queryToken = params.get("token") ?? "";

  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(next)) {
      setError(
        "Password must be at least 8 characters with a mix of letters, numbers & symbols.",
      );
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (queryToken) {
        const res = await fetch("http://localhost:5000/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: queryToken, newPassword: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to reset password.");
          return;
        }
        setError(null);
        login(data.user, data.token);
        router.push("/student/dashboard");
      } else {
        const token = sessionStorage.getItem("ims.student.token");
        if (!token) {
          setError("Session expired. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/activate-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to activate account.");
          return;
        }
        setError(null);
        
        login(
          {
            role: "student",
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            studentId: data.user.studentId,
            email: data.user.email,
          },
          token
        );
        router.push("/student/profile/edit");
      }
    } catch {
      setError("Unable to connect to the backend server.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col justify-center bg-[#AEC0D4] px-4 py-12 sm:px-6 lg:px-8 relative">

      {/* Card Container */}
      <div className="mx-auto w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-2xl border-none">
        
        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#1e3a63] to-[#132540] px-6 py-8 text-center text-white rounded-t-2xl">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
            <GraduationCap className="h-5 w-5 text-white/95" />
          </div>
          
          <h1 className="text-lg font-bold tracking-wide">
            Set Your New Password
          </h1>
          <p className="mt-1 text-[11px] text-white/70 font-medium leading-relaxed max-w-[280px] mx-auto">
            Create a strong password to secure your portal access.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Password Field */}
            <div className="space-y-1">
              <label htmlFor="new" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                New Password
              </label>
              
              <div className="overflow-hidden rounded-xl bg-white border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all shadow-sm">
                <input
                  id="new"
                  type="password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <p className="text-[10px] font-medium leading-normal text-slate-400 pl-1">
                Must be at least 8 characters with letters, numbers &amp; symbols.
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirm" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Confirm Password
              </label>

              <div className="overflow-hidden rounded-xl bg-white border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all shadow-sm">
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
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
              className="w-full rounded-xl bg-gradient-to-r from-[#1e3a63] to-[#132540] py-3 text-xs font-bold text-white uppercase tracking-wider transition-all hover:opacity-95 shadow-md active:scale-[0.99] mt-2"
            >
              {queryToken ? "Reset Password" : "Activate Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-[#AEC0D4] text-navy-deep min-h-screen">
            <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Loading…</div>
          </div>
        }
      >
        <SetPasswordForm />
      </Suspense>
      <Footer />
    </div>
  );
}

