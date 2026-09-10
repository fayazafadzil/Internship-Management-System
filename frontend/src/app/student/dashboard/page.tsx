"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pencil, IdCard, Mail, Calculator, FileText, 
  Star, User as UserIcon, BookOpen, GraduationCap, ArrowRight
} from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ManagementHub() {
  const router = useRouter();
  const { user, ready, profile, setProfile } = useAuth();
  useAuthGuard("student", "/student/login");
  const [cgpa, setCgpa] = useState<number | null>(null);

  useEffect(() => {
    if (ready && user?.role === "student") {
      fetch("http://localhost:5000/api/results/my-performance", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("ims.student.token")}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.cgpa !== undefined) setCgpa(data.cgpa);
        })
        .catch(() => {});
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen bg-[#AEC0D4]">
        <div className="flex items-center gap-3 text-[#0F3D68] font-semibold">
          <span className="h-5 w-5 rounded-full border-2 border-[#0F3D68]/30 border-t-[#2563EB] animate-spin" />
          Loading…
        </div>
      </main>
    );
  }
  if (user?.role !== "student") return null;

  const safeProfile: any = profile ?? { name: "", studentId: "", email: "", specialization: "", linkedin: "", github: "", photo: "" };
  const updateLink = (key: "linkedin" | "github", value: string) => setProfile({ ...safeProfile, [key]: value });

  return (
    <>
      <StudentNav />
      <main className="flex-1 min-h-screen pb-16 relative overflow-hidden bg-[#9bc6d9]">
        {/* decorative background elements */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-[#0F3D68]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#2563EB]/[0.06] blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "radial-gradient(#0F3D68 0.5px, transparent 0.5px)", backgroundSize: "26px 26px" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#3F5D82]">Student Portal</p>
            <h1 className="mt-1 text-3xl font-extrabold text-navy-deep">Student Management Hub</h1>
            <p className="mt-1 text-sm text-navy-deep/60">Manage your academic progress and career records.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-10">
            {/* Sidebar */}
            <aside className="lg:col-span-3 relative rounded-[2rem] bg-gradient-to-br from-[#0B2545] via-[#123F6B] to-[#1B4472] p-7 shadow-2xl shadow-[#0B2545]/40 border border-white/15 h-fit overflow-hidden backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/[0.08] blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#60A5FA]/20 blur-2xl" />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#60A5FA]/60 to-[#2563EB]/40 blur-lg" />
                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-4 ring-[#60A5FA] shadow-2xl backdrop-blur-md">
                    {safeProfile.photo ? <img src={safeProfile.photo} className="h-full w-full object-cover" /> : <UserIcon className="h-14 w-14 text-white/50" />}
                  </div>
                  <Link href="/student/profile/edit" className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg ring-2 ring-[#0B2545] transition-all duration-300 hover:bg-[#60A5FA] hover:scale-110">
                    <Pencil className="h-3 w-3" />
                  </Link>
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">{safeProfile.name || "Student"}</h2>
                <p className="text-white/70 text-xs font-medium mt-0.5">Computer Science Undergraduate</p>
                <span className="mt-4 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#2563EB]/40 ring-1 ring-white/20">
                  CGPA : {cgpa !== null ? cgpa.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="relative mt-7 space-y-2.5 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm transition-colors duration-300 hover:bg-white/[0.20] hover:border-white/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <IdCard className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="min-w-0"><p className="text-[9px] uppercase font-bold tracking-wide text-white/50">Student ID</p><p className="font-semibold text-white text-xs truncate">{safeProfile.studentId || "—"}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm transition-colors duration-300 hover:bg-white/[0.20] hover:border-white/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="min-w-0 truncate"><p className="text-[9px] uppercase font-bold tracking-wide text-white/50">Email</p><p className="font-semibold text-white text-[11px] truncate">{safeProfile.email || "—"}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm transition-colors duration-300 hover:bg-white/[0.20] hover:border-white/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <GraduationCap className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="min-w-0"><p className="text-[9px] uppercase font-bold tracking-wide text-white/50">Specialization</p><p className="font-semibold text-white text-xs truncate">{safeProfile.specialization || "—"}</p></div>
                </div>
              </div>

              <div className="relative mt-7">
                <p className="text-[10px] font-bold tracking-widest text-white mb-3 px-1">PROFESSIONAL LINKS</p>
                <div className="space-y-2">
                  <LinkInput 
                    icon={
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    } 
                    placeholder="Enter LinkedIn URL" 
                    value={safeProfile.linkedin ?? ""} 
                    onChange={(v) => updateLink("linkedin", v)} 
                  />
                  <LinkInput 
                    icon={
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                    } 
                    placeholder="Enter GitHub URL" 
                    value={safeProfile.github ?? ""} 
                    onChange={(v) => updateLink("github", v)} 
                  />
                </div>
              </div>
            </aside>

            {/* Modules Grid */}
            <div className="lg:col-span-7 grid gap-6 grid-cols-1 md:grid-cols-2">
              <ModuleCard icon={<Calculator className="h-6 w-6" />} accent="academic" title="Academic Performance" body="View your CGPA, semester results, and detailed subject grades." cta="View Results" href="/student/academic-performance" />
              <ModuleCard icon={<FileText className="h-6 w-6" />} accent="portfolio" title="Portfolio" body="Manage your CV, certificates, and professional project documents." cta="Manage Files" href="/student/portfolio" />
              <ModuleCard icon={<Star className="h-6 w-6" />} accent="internship" title="Internship Status" body="Track application progress and submit your internship letters." cta="Check Updates" href="/student/internship-status" />
              <ModuleCard icon={<BookOpen className="h-6 w-6" />} accent="record" title="Record Book" body="Update your weekly and monthly progress logs and training records." cta="Go to Record Book" href="/student/record-book" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const ACCENTS = {
  academic: { card: "bg-[#3F5D82]", iconBg: "bg-[#0F2F4F]", iconRing: "group-hover:bg-[#2563EB]", icon: "text-white", bar: "from-[#1B4472] to-[#0F2F4F]" },
  portfolio: { card: "bg-[#3F5D82]", iconBg: "bg-[#123A5C]", iconRing: "group-hover:bg-[#2563EB]", icon: "text-white", bar: "from-[#2F5F98] to-[#123A5C]" },
  internship: { card: "bg-[#3F5D82]", iconBg: "bg-[#182E52]", iconRing: "group-hover:bg-[#2563EB]", icon: "text-white", bar: "from-[#344B7A] to-[#182E52]" },
  record: { card: "bg-[#3F5D82]", iconBg: "bg-[#0B2745]", iconRing: "group-hover:bg-[#2563EB]", icon: "text-white", bar: "from-[#486FAE] to-[#0B2745]" },
} as const;

function ModuleCard({
  icon, title, body, cta, href, accent,
}: { icon: React.ReactNode; title: string; body: string; cta: string; href: string; accent: keyof typeof ACCENTS }) {
  const a = ACCENTS[accent];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] ${a.card} border border-[#0B2545]/[0.25] shadow-lg shadow-[#0B2545]/20 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#0B2545]/35 min-h-[248px]`}
    >
      <div className="relative p-6 flex flex-col h-full">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-colors duration-500 ${a.iconBg} ${a.iconRing}`}>
          <span className={`transition-colors duration-500 ${a.icon}`}>{icon}</span>
        </div>

        <h3 className="mt-5 text-xl font-bold tracking-tight text-white drop-shadow-sm">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-white/90 font-medium">{body}</p>

        <div className="mt-auto pt-6 flex items-center text-white font-bold text-sm gap-1.5 transition-all duration-300 group-hover:gap-3">
          {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>

      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${a.bar} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />
    </Link>
  );
}

function LinkInput({ icon, placeholder, value, onChange }: { icon: React.ReactNode; placeholder: string; value: string; onChange: (value: string) => void; }) {
  return (
    <div className="group/input flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/15 backdrop-blur-md px-3 py-2.5 shadow-sm transition-all duration-300 hover:bg-white/[0.2] hover:border-white/40 hover:shadow-md hover:shadow-[#2563EB]/10 focus-within:border-[#60A5FA] focus-within:bg-white/25 focus-within:ring-2 focus-within:ring-[#60A5FA]/40">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0B2545] text-white/80 border border-white/10">
        {icon}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs font-medium text-white placeholder:text-white/60 focus:outline-none"
      />
    </div>
  );
}

