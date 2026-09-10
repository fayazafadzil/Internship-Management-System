"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, User as UserIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Field, Input, Label, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SPECIALIZATIONS, type Specialization, type StudentProfile } from "@/lib/types";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, ready, profile, setProfile } = useAuth();
  useAuthGuard("student", "/student/login");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<StudentProfile>({
    name: "",
    studentId: "",
    email: "",
    specialization: "",
    specializationConfirmed: false,
    photo: undefined,
  });

  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm(profile);
      setConfirm(profile.specializationConfirmed);
    }
  }, [profile]);

  const locked = profile?.specializationConfirmed ?? false;

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.photo) {
      setError("Please upload a profile photo to continue.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }

    if (!form.studentId.trim()) {
      setError("Please enter your Student ID to continue.");
      return;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid university email address to continue.");
      return;
    }

    if (!form.specialization) {
      setError("Please select a specialization to continue.");
      return;
    }

    if (!locked && !confirm) {
      setError("Please confirm your specialization to continue.");
      return;
    }

    setError(null);
    setProfile({
      ...form,
      specializationConfirmed: locked || confirm,
    });
    router.push("/student/dashboard");
  };

  if (!ready || user?.role !== "student") {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#AEC0D4] text-slate-800 min-h-screen font-bold">
        <div className="flex items-center gap-3 bg-[#D4E9FC] px-6 py-3 rounded-2xl shadow-sm border border-[#1B4472]/20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1B4472] border-t-transparent" />
          <span>Loading Academic Profile…</span>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#AEC0D4]">
      
      <main className="flex-1 pt-8 sm:pt-12 px-4 pb-12 flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 w-full flex justify-center">
          
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-3xl bg-[#D4E9FC] p-6 sm:p-10 shadow-xl border border-white/60 transition-all text-slate-800"
          >
            <div className="border-b border-[#1B4472]/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B4472] text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Academic Identity</h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Provide details as they appear on official enrollment records.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-white/70 p-4 border border-[#1B4472]/15 shadow-sm">
              <div className="relative group shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-4 ring-white shadow-md transition-transform group-hover:scale-105">
                  {form.photo ? (
                    <img src={form.photo} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4472] text-white shadow-md hover:bg-[#294B72] hover:scale-110 active:scale-95 transition-all"
                  title="Upload Photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
              </div>

              <div className="flex flex-col text-center sm:text-left">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">Profile Photo</h2>
                <p className="text-xs text-slate-600 max-w-xs mt-0.5 leading-relaxed">
                  Upload a clear professional headshot with a solid background (400x400px recommended).
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-10 bg-white/90 text-slate-900 border-slate-300 focus:border-[#1B4472] focus:ring-2 focus:ring-[#1B4472]/20 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Student ID</label>
                  <Input
                    value={form.studentId}
                    disabled
                    className="h-10 bg-white/50 text-slate-600 border-slate-200 rounded-xl font-mono text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">University Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    disabled
                    className="h-10 bg-white/50 text-slate-600 border-slate-200 rounded-xl text-xs font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Academic Specialization
                </label>
                <Select
                  value={form.specialization}
                  disabled={locked}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value as Specialization | "" })}
                  className="h-10 bg-white/90 text-slate-900 border-slate-300 focus:border-[#1B4472] focus:ring-2 focus:ring-[#1B4472]/20 rounded-xl text-xs font-medium disabled:bg-white/50 disabled:text-slate-600 cursor-pointer"
                >
                  <option value="">Select your specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>

              <label
                className={`flex items-start gap-3 rounded-xl p-3.5 transition-all border ${
                  locked
                    ? "bg-white/50 border-slate-200 opacity-80 cursor-not-allowed"
                    : "bg-white/70 border-[#1B4472]/15 hover:bg-white/90 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={locked || confirm}
                  disabled={locked}
                  onChange={(e) => setConfirm(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1B4472] focus:ring-[#1B4472] cursor-pointer accent-[#1B4472]"
                />
                <span className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">I confirm that this is my correct specialization</span>
                  <span className="mt-0.5 block text-[11px] text-slate-500 leading-normal">
                    Specialization cannot be modified after saving.
                  </span>
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1B4472]/10 flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-[#1B4472] hover:bg-[#294B72] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Save & Continue →
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

