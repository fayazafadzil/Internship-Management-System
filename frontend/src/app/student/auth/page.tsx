"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, KeyRound } from "lucide-react";
import { BackHome } from "@/components/layout/BackHome";
import { Footer } from "@/components/layout/Footer";
import { Field, Input } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";

export default function StudentSignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
  });
  const [submittedRequest, setSubmittedRequest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    const studentIdRegex = /^SC\/\d{4}\/\d{5}$/;
    if (!studentIdRegex.test(form.studentId.trim())) {
      setError("Format: SC/YYYY/DDDDD");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/account-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit request.");
        return;
      }
      setSubmittedRequest(true);
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <>
      
      <main className="relative flex min-h-screen flex-col items-center justify-start bg-[#AEC0D4] px-4 pt-2 pb-12">
        
        {/* Back to Home */}
        <div className="absolute top-2 left-4 md:left-8 transition-transform duration-200 hover:-translate-x-1">
          <BackHome />
        </div>

        {/* Card Component Container */}
        <div className="w-full max-w-[400px] mt-8">
          
          <div className="overflow-hidden bg-white shadow-xl rounded-2xl border border-slate-200/80">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-navy-deep to-navy px-6 py-6 text-center text-white">
              <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/10 backdrop-blur-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-wide">Student Portal</h1>
              <p className="mt-0.5 text-xs text-white/80 max-w-[280px] mx-auto leading-relaxed">
                Register to access your dashboard
              </p>
            </div>

            {/* Body */}
            <div className="bg-white p-6">
              {submittedRequest ? (
                <AccountCreated email={form.email} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name & Last Name Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field 
                      label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</span>} 
                      htmlFor="firstName"
                    >
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={set("firstName")}
                        className="mt-1 border-slate-200 rounded-xl py-2 text-sm focus:border-navy focus:ring-navy transition-all shadow-sm"
                        required
                      />
                    </Field>
                    <Field 
                      label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</span>} 
                      htmlFor="lastName"
                    >
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={set("lastName")}
                        className="mt-1 border-slate-200 rounded-xl py-2 text-sm focus:border-navy focus:ring-navy transition-all shadow-sm"
                        required
                      />
                    </Field>
                  </div>

                  {/* Student ID Input */}
                  <Field 
                    label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Student ID</span>} 
                    htmlFor="studentId"
                  >
                    <Input
                      id="studentId"
                      placeholder="e.g. SC/2020/12345"
                      value={form.studentId}
                      onChange={set("studentId")}
                      className="mt-1 border-slate-200 rounded-xl py-2 text-sm focus:border-navy focus:ring-navy transition-all shadow-sm"
                      required
                    />
                  </Field>

                  {/* University Email Input */}
                  <Field 
                    label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">University Email</span>} 
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.ruh.ac.lk"
                      value={form.email}
                      onChange={set("email")}
                      className="mt-1 border-slate-200 rounded-xl py-2 text-sm focus:border-navy focus:ring-navy transition-all shadow-sm"
                      required
                    />
                  </Field>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-rose-50 p-2.5 border-l-4 border-rose-500 rounded-r-xl">
                      <p className="text-xs font-semibold text-rose-700 leading-tight">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" variant="dark" className="w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 mt-2">
                    Create Account
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-xs text-navy-deep/70 pt-1">
                    Already have an account?{" "}
                    <Link
                      href="/student/login"
                      className="font-bold text-navy hover:text-navy-deep hover:underline transition-colors"
                    >
                      Log in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function AccountCreated({ email }: { email: string }) {
  return (
    <div className="py-1 text-center">
      {/* Success Icon */}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
        <KeyRound className="h-5 w-5 text-emerald-600" />
      </div>
      <h2 className="text-base font-bold text-navy-deep">Request Submitted</h2>
      <p className="mt-1 text-xs text-navy-deep/80 px-1 leading-normal">
        Your registration request has been successfully submitted.
      </p>

      {/* Verification Badge */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#294774]/30 bg-[#294774]/5 py-2 px-3 shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-[#294774] animate-pulse" />
        <code className="text-xs font-extrabold tracking-widest text-[#294774]">
          PENDING VERIFICATION
        </code>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-navy-deep/70 px-2">
        After verification, you will receive a temporary password via email to securely set up your account.
      </p>

      <LinkButton
        href={`/student/login?email=${encodeURIComponent(email)}`}
        variant="dark"
        className="mt-5 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95"
      >
        Go to Login
      </LinkButton>
    </div>
  );
}

