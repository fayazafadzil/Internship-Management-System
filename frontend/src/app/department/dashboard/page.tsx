"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, Users, ClockAlert, Download, X } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { DepartmentNav } from "@/components/layout/DepartmentNav";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const cards = [
  {
    title: "Registration Verifications",
    badge: "Email Tracking",
    badgeLabel: "New",
    metric: "0",
    subtitle: "Verification Status",
    button: "Manage Verifications",
    href: "/department/verification",
    icon: ShieldCheck,
    bg: "bg-gradient-to-br from-[#133257] via-[#1B4472] to-[#25568F]",
  },
  {
    title: "Student Details",
    badge: "Active Repository",
    badgeLabel: null,
    metric: "0",
    subtitle: "Total Registered Students",
    button: "Manage Student Details",
    href: "/department/student-details",
    icon: Users,
    bg: "bg-gradient-to-br from-[#1E416C] via-[#2F5F98] to-[#3C73B5]",
  },
  {
    title: "Pending Approvals",
    badge: "Urgent Action",
    badgeLabel: null,
    metric: "0",
    subtitle: "Tasks Outstanding",
    button: "Review Actions",
    href: "/department/approvals",
    icon: ClockAlert,
    bg: "bg-gradient-to-br from-[#385B8F] via-[#486FAE] to-[#5D85C2]",
  },
  {
    title: "GPA Management",
    badge: "Academic Performance",
    badgeLabel: null,
    metric: null,
    body: "Upload and manage student grade records via Excel to track departmental academic performance and generate cumulative metrics.",
    button: "Manage GPA Records →",
    href: "/department/gpa-management",
    icon: GraduationCap,
    bg: "bg-gradient-to-br from-[#243B66] via-[#344B7A] to-[#466099]",
  },
];

interface StudentPlacement {
  name: string;
  position: string;
}

interface CompanyPlacement {
  name: string;
  count: number;
  students: StudentPlacement[];
}

interface DashboardStats {
  registrationRequestsCount: number;
  activeStudentsCount: number;
  pendingApprovalsCount: number;
  companyPlacements: CompanyPlacement[];
}

export default function DepartmentDashboard() {
  const { user, ready } = useAuth();
  useAuthGuard("department", "/department/auth");

  const [stats, setStats] = useState<DashboardStats>({
    registrationRequestsCount: 0,
    activeStudentsCount: 0,
    pendingApprovalsCount: 0,
    companyPlacements: [],
  });

  const [gpaFilter, setGpaFilter] = useState("");
  const [internTypeFilter, setInternTypeFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyPlacement | null>(null);

  useEffect(() => {
    if (!ready || user?.role !== "department") return;
    
    async function fetchStats() {
      try {
        const token = sessionStorage.getItem("ims.department.token");
        const params = new URLSearchParams();
        if (gpaFilter) params.append("gpa", gpaFilter);
        if (internTypeFilter) params.append("internType", internTypeFilter);
        
        const url = `http://localhost:5000/api/students/dashboard-stats/count?${params.toString()}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    }
    fetchStats();
  }, [ready, user, gpaFilter, internTypeFilter]);

  const handleDownloadAnalytics = () => {
    let csv = "Company,Count,Student Name,Position\n";
    stats.companyPlacements.forEach((comp) => {
      if (!comp.students || comp.students.length === 0) {
        csv += `"${comp.name}",${comp.count},,\n`;
      } else {
        comp.students.forEach((student) => {
          csv += `"${comp.name}",${comp.count},"${student.name || ''}","${student.position || ''}"\n`;
        });
      }
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "company_placements_analytics.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const dynamicCards = useMemo(() => {
    return cards.map(card => {
      let metric = card.metric;
      if (card.title === "Registration Verifications") {
        metric = stats.registrationRequestsCount.toString();
      } else if (card.title === "Student Details") {
        metric = stats.activeStudentsCount.toString();
      } else if (card.title === "Pending Approvals") {
        metric = stats.pendingApprovalsCount.toString();
      }
      return { ...card, metric };
    });
  }, [stats]);

  if (!ready || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#294B72] text-white">
        <div className="flex items-center gap-3 font-semibold">
          <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-[#A5C3EF] animate-spin" />
          Loading…
        </div>
      </main>
    );
  }

  const maxPlacementCount = stats.companyPlacements.length > 0 
    ? Math.max(...stats.companyPlacements.map(c => c.count)) 
    : 0;

  return (
    <div className="min-h-screen bg-[#294B72] flex flex-col font-sans antialiased relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#1B4472]/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-[#A5C3EF]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-[#1B4472]/30 blur-3xl" />

      <DepartmentNav notificationCount={stats.registrationRequestsCount} />

      <main className="relative mx-auto w-full max-w-[1400px] px-6 py-10 space-y-10 flex-grow">
        
        {/* Title Section Container */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#D4E9FC] px-10 py-12 shadow-xl shadow-black/20 border border-white/40">
          <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#A5C3EF]/40 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1B4472]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1B4472]">
              Department Dashboard
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f2a4a]">
              Department Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Managing student internship placements and department progress for this academic year.
            </p>
          </div>
        </section>

        {/* Action Grid Cards Section */}
        <section className="grid gap-6 md:grid-cols-4">
          {dynamicCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.title} 
                className={`group relative overflow-hidden rounded-3xl p-8 shadow-xl shadow-black/20 border-2 border-[#A5C3EF]/40 hover:border-[#A5C3EF] flex flex-col justify-between min-h-[380px] text-white transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl active:scale-[0.98] ${card.bg}`}
              >
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:opacity-90 group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-90">
                        {card.badge}
                      </p>
                    </div>
                    {card.badgeLabel ? (
                      <span className="rounded-md bg-[#B3555F] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        {card.badgeLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.18] shadow-inner ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/25">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {card.title === "GPA Management" ? (
                    <>
                      <h2 className="mt-6 text-lg font-bold tracking-wide">{card.title}</h2>
                      <p className="mt-3 text-xs text-white/75 leading-relaxed pr-2 font-light">
                        {card.body}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-6 text-xl font-bold tracking-wide">{card.title}</h2>
                      <p className="mt-3 text-xs text-white/75 leading-relaxed max-w-xs">
                        {card.title === "Registration Verifications" && "Monitor and re-send registration verification emails to students with pending or unverified accounts."}
                        {card.title === "Student Details" && "Access and manage the centralized repository of all departmental internship enrollments."}
                        {card.title === "Pending Approvals" && "Internship applications and site validations requiring immediate department review."}
                      </p>
                    </>
                  )}
                </div>

                <div className="relative">
                  {card.metric !== null && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{card.subtitle}</p>
                      <p className="text-5xl font-black mt-1 tracking-tight inline-block origin-left transition-transform duration-300 group-hover:scale-105">{card.metric}</p>
                    </>
                  )}
                  
                  <Link
                    href={card.href}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl py-3 text-xs font-semibold bg-[#D4E9FC] text-[#1B4472] shadow-md transition-all duration-300 hover:bg-white hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl active:scale-95"
                  >
                    {card.button}
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* Company Placement Analytics */}
        <section className="relative overflow-hidden mt-6 rounded-[32px] bg-gradient-to-br from-[#D4E9FC] via-[#D4E9FC] to-[#C3DDF5] p-10 shadow-2xl shadow-[#0F172A]/30 border-2 border-white/50 ring-1 ring-[#1B4472]/20">
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#A5C3EF]/30 blur-3xl" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#1B4472]/10 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0F2747] tracking-wide">Company Placement Analytics</h2>
              <p className="text-sm text-slate-600 mt-1">Top recruiting partners by student selection count</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={gpaFilter}
                onChange={(e) => setGpaFilter(e.target.value)}
                className="bg-white border-2 border-[#A5C3EF] text-[#1B4472] text-xs font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4472]/30 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md focus:scale-[1.02]"
              >
                <option value="">All GPAs</option>
                <option value="high">GPA ≥ 3.5</option>
                <option value="mid">GPA 3.0 - 3.49</option>
                <option value="low">GPA &lt; 3.0</option>
              </select>

              <select
                value={internTypeFilter}
                onChange={(e) => setInternTypeFilter(e.target.value)}
                className="bg-white border-2 border-[#A5C3EF] text-[#1B4472] text-xs font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4472]/30 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md focus:scale-[1.02]"
              >
                <option value="">All Roles</option>
                <option value="Software Engineering Intern">Software Engineering</option>
                <option value="QA Intern">QA Intern</option>
                <option value="Data Science Intern">Data Science</option>
                <option value="DevOps Intern">DevOps</option>
                <option value="UI/UX Intern">UI/UX</option>
                <option value="Business Analyst Intern">Business Analyst</option>
              </select>

              <button 
                onClick={handleDownloadAnalytics}
                className="flex items-center gap-2 bg-[#1B4472] hover:bg-[#294B72] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 active:scale-95 border border-white/20"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-b from-white via-[#F4F9FF] to-[#E5F0FF] rounded-[24px] p-8 mt-2 shadow-[inset_0_2px_12px_rgba(27,68,114,0.1)] border-2 border-[#A5C3EF]/60">
            <div className="flex h-64 pb-4">
              {/* Y Axis */}
              {stats.companyPlacements.length > 0 && (
                <div className="flex flex-col justify-between items-end h-full border-r-2 border-[#A5C3EF]/60 pr-4 mr-4 text-[11px] font-bold text-[#1B4472] min-w-[40px]">
                  <span>{maxPlacementCount}</span>
                  <span>{Math.round(maxPlacementCount * 0.75)}</span>
                  <span>{Math.round(maxPlacementCount * 0.5)}</span>
                  <span>{Math.round(maxPlacementCount * 0.25)}</span>
                  <span>0</span>
                </div>
              )}

             {/* Chart Bars */}
             <div className="flex-1 flex items-end justify-around h-full border-b-2 border-[#A5C3EF]/80 relative">
               {stats.companyPlacements.length > 0 ? (
                 stats.companyPlacements.map((company) => {
                   const maxCount = Math.max(maxPlacementCount, 1);

                   return (
                     <div
                       key={company.name}
                       className="flex flex-col items-center justify-end w-full relative group h-full cursor-pointer"
                       onClick={() => setSelectedCompany(company)}
                     >
                       {/* Tooltip */}
                       <div className="absolute bottom-full mb-3 bg-[#1B4472] text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                         {company.count} Student{company.count !== 1 ? "s" : ""}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1B4472]"></div>
                       </div>

                       {/* Bar */}
                       <div
                         className="
                           w-14
                           rounded-t-xl
                           bg-gradient-to-t
                           from-[#16365C]
                           via-[#244B78]
                           to-[#4F78B3]
                           shadow-lg
                           shadow-[#1B4472]/25
                           border-t-2
                           border-x
                           border-[#A5C3EF]/60
                           transition-all
                           duration-300
                           ease-out
                           origin-bottom
                           group-hover:from-[#112946]
                           group-hover:via-[#1B4472]
                           group-hover:to-[#6C96D4]
                           group-hover:scale-x-110
                           group-hover:-translate-y-2
                           group-hover:shadow-2xl
                           group-hover:shadow-[#1B4472]/40
                         "
                         style={{
                           height: `${(company.count / maxCount) * 100}%`,
                           minHeight: "14px",
                         }}
                       ></div>

                       {/* Company Name */}
                       <div
                         className="
                           absolute
                           -bottom-10
                           w-full
                           px-1
                           mt-4
                           text-center
                           text-xs
                           font-semibold
                           tracking-wide
                           text-[#1B4472]
                           transition-all
                           duration-300
                           group-hover:text-[#0F2747]
                           group-hover:font-bold
                         "
                       >
                         {company.name}
                       </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="w-full flex items-center justify-center text-slate-500 text-sm">
                   No placement data available yet.
                 </div>
               )}
             </div>
          </div>
          <div className="h-6"></div>
        </div>
        </section>

      </main>

      {/* Selected Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B4472]/[.55] backdrop-blur-md p-4">
          <div className="bg-[#D4E9FC] rounded-3xl border-2 border-white/60 shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-6 border-b-2 border-[#A5C3EF] flex justify-between items-center bg-[#1B4472]">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedCompany.name} Placements</h3>
                <p className="text-sm text-[#D4E9FC] mt-1">{selectedCompany.count} student{selectedCompany.count !== 1 ? 's' : ''} selected</p>
              </div>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 p-2 rounded-full hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-[#E5F0FF] custom-scrollbar">
              <div className="grid gap-3">
                {selectedCompany.students?.map((student, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 flex justify-between items-center border-2 border-[#A5C3EF] shadow-sm transition-all duration-300 hover:border-[#1B4472]/50 hover:bg-[#D4E9FC]/40 hover:translate-x-1 hover:shadow-md">
                    <div>
                      <p className="text-sm font-bold text-[#0F2747]">{student.name || "Unknown Student"}</p>
                      <p className="text-xs text-slate-600 mt-1">{student.position || "Intern"}</p>
                    </div>
                    <div className="bg-[#1B4472] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      Accepted
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

