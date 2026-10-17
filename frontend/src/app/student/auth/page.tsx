"use client";

import { useState } from "react";

import Link from "next/link";

import { GraduationCap, KeyRound, ArrowRight } from "lucide-react";

import { LandingNav } from "@/components/layout/LandingNav";

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

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    // Check first name and last name
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    // Check Student ID format
    const studentIdRegex = /^SC\/\d{4}\/\d{5}$/;

    if (!studentIdRegex.test(form.studentId.trim())) {
      setError("Format: SC/YYYY/DDDDD");
      return;
    }

    // ==============================
    // UNIVERSITY EMAIL VALIDATION
    // ==============================

    const email = form.email.toLowerCase().trim();

    if (!email.endsWith("@usci.ruh.ac.lk")) {
      setError(
        "Please use your university email address (@usci.ruh.ac.lk)."
      );
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/account-requests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...form,
            email,
          }),
        }
      );

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
      <LandingNav />

      <main className="relative flex min-h-screen flex-col items-center justify-start bg-[#AEC0D4] px-4 pt-8 pb-12">
        <div className="w-full max-w-[400px]">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">

            {/* Header */}
            <div className="bg-gradient-to-b from-navy-deep to-navy px-6 py-6 text-center text-white">
              <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/10 backdrop-blur-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>

              <h1 className="text-xl font-bold tracking-wide">
                Student Portal
              </h1>

              <p className="mx-auto mt-0.5 max-w-[280px] text-xs leading-relaxed text-white/80">
                Register to access your dashboard
              </p>
            </div>

            {/* Body */}
            <div className="bg-white p-6">
              {submittedRequest ? (
                <AccountCreated email={form.email} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">

                    <Field
                      label={
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          First Name
                        </span>
                      }
                      htmlFor="firstName"
                    >
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={set("firstName")}
                        className="mt-1 rounded-xl border-slate-200 py-2 text-sm shadow-sm transition-all focus:border-navy focus:ring-navy"
                        required
                      />
                    </Field>

                    <Field
                      label={
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Last Name
                        </span>
                      }
                      htmlFor="lastName"
                    >
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={set("lastName")}
                        className="mt-1 rounded-xl border-slate-200 py-2 text-sm shadow-sm transition-all focus:border-navy focus:ring-navy"
                        required
                      />
                    </Field>

                  </div>

                  {/* Student ID */}
                  <Field
                    label={
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Student ID
                      </span>
                    }
                    htmlFor="studentId"
                  >
                    <Input
                      id="studentId"
                      placeholder="e.g. SC/2020/12350"
                      value={form.studentId}
                      onChange={set("studentId")}
                      className="mt-1 rounded-xl border-slate-200 py-2 text-sm shadow-sm transition-all focus:border-navy focus:ring-navy"
                      required
                    />
                  </Field>

                  {/* University Email */}
                  <Field
                    label={
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        University Email
                      </span>
                    }
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. kamal12350@usci.ruh.ac.lk"
                      value={form.email}
                      onChange={set("email")}
                      className="mt-1 rounded-xl border-slate-200 py-2 text-sm shadow-sm transition-all focus:border-navy focus:ring-navy"
                      required
                    />
                  </Field>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-r-xl border-l-4 border-rose-500 bg-rose-50 p-2.5">
                      <p className="text-xs font-semibold leading-tight text-rose-700">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Create Account Button */}
                  <Button
                    type="submit"
                    variant="dark"
                    className="mt-2 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95"
                  >
                    Create Account
                  </Button>

                  {/* Already Registered Section */}
                  <div className="mt-3 border-t border-slate-100 pt-3 text-center">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-navy">
                      Already Registered?
                    </p>

                    <Link
                      href="/student/login"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-navy-deep to-navy px-4 py-2.5 text-xs font-bold tracking-wide text-white shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-95"
                    >
                      Go to Login

                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>

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
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 shadow-sm">
        <KeyRound className="h-5 w-5 text-emerald-600" />
      </div>

      <h2 className="text-base font-bold text-navy-deep">
        Request Submitted
      </h2>

      <p className="mt-1 px-1 text-xs leading-normal text-navy-deep/80">
        Your registration request has been successfully submitted.
      </p>

      {/* Verification Badge */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#294774]/30 bg-[#294774]/5 px-3 py-2 shadow-sm">
        <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#294774]" />

        <code className="text-xs font-extrabold tracking-widest text-[#294774]">
          PENDING VERIFICATION
        </code>
      </div>

      <p className="mt-3 px-2 text-xs leading-relaxed text-navy-deep/70">
        After verification, you will receive a temporary password via email
        to securely set up your account.
      </p>

      {/* Go to Login Button */}
      <LinkButton
        href={`/student/login?email=${encodeURIComponent(email)}`}
        variant="dark"
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-navy-deep to-navy py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-95"
      >
        Go to Login
      </LinkButton>

    </div>
  );
}


