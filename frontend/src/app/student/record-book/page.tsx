"use client";

import { useEffect, useState, useMemo } from "react";
import { Download, CheckCircle, Clock, AlertCircle, ChevronRight, FileText, Calendar, ShieldAlert } from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

interface LogRecord {
  _id?: string;
  periodNumber: number;
  periodStart: string;
  periodEnd: string;
  filePath: string;
  originalFilename: string;
  isLateSubmission: boolean;
  status: "Pending" | "Submitted" | "Missing";
  submittedAt?: string;
}

export default function RecordBookPage() {
  const { user, ready } = useAuth();
  useAuthGuard("student", "/student/login");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [internshipApproved, setInternshipApproved] = useState(false);
  const [internshipStartDate, setInternshipStartDate] = useState<string | null>(null);
  
  const [weeklyRecords, setWeeklyRecords] = useState<LogRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<LogRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const checkInternshipAndLoadRecords = async () => {
    try {
      const token = sessionStorage.getItem("ims.student.token");
      if (!token) return;

      const internRes = await fetch("http://localhost:5000/api/internships/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (internRes.ok) {
        const internData = await internRes.json();
        if (internData.application && internData.application.approved) {
          setInternshipApproved(true);
          setInternshipStartDate(internData.application.internshipStartDate);

          // Fetch weekly
          const wRes = await fetch("http://localhost:5000/api/weekly-records/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (wRes.ok) {
            const wData = await wRes.json();
            setWeeklyRecords(wData.records.map((r: any) => ({
              ...r, periodNumber: r.weekNumber, periodStart: r.weekStart, periodEnd: r.weekEnd
            })));
          }

          // Fetch monthly
          const mRes = await fetch("http://localhost:5000/api/monthly-records/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (mRes.ok) {
            const mData = await mRes.json();
            setMonthlyRecords(mData.records.map((r: any) => ({
              ...r, periodNumber: r.monthNumber, periodStart: r.monthStart, periodEnd: r.monthEnd
            })));
          }
        } else {
          setInternshipApproved(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user?.role === "student") {
      checkInternshipAndLoadRecords();
    }
  }, [ready, user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getStatusBadge = (record?: LogRecord, expectedEndStr?: string) => {
    if (!record || record.status === "Pending") {
      const end = new Date(expectedEndStr || "");
      const deadline = new Date(end);
      deadline.setHours(23, 59, 59, 999);
      
      const now = new Date();
      if (now < new Date(expectedEndStr || "")) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-900 ring-1 ring-blue-500/20 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-700" /> Upcoming
          </span>
        );
      } else if (now <= deadline) {
        const diffMs = deadline.getTime() - now.getTime();
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const daysLeft = Math.floor(totalHours / 24);
        const hoursLeft = totalHours % 24;
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-500/30 shadow-sm animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Due in {daysLeft}d {hoursLeft}h
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-900 ring-1 ring-rose-500/30 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" /> Missing (Overdue)
          </span>
        );
      }
    }

    if (record.status === "Submitted") {
      return record.isLateSubmission 
        ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-900 ring-1 ring-orange-500/30 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-orange-700" /> Submitted (Late)
          </span>
        )
        : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-900 ring-1 ring-emerald-500/30 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Submitted (On Time)
          </span>
        );
    }

    return null;
  };

  const handleDownload = async (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    try {
      showToast("Downloading document...");
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      showToast("Download failed. Please try again.");
    }
  };

  const weeksList = useMemo(() => {
    if (!internshipStartDate) return [];
    const baseDate = new Date(internshipStartDate);
    const list = [];
    
    const submittedWeeks = weeklyRecords.filter(r => r.status === "Submitted").map(r => r.periodNumber);

    for (let i = 1; i <= 24; i++) {
      const start = new Date(baseDate);
      start.setDate(baseDate.getDate() + (i - 1) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);

      const record = weeklyRecords.find((r) => r.periodNumber === i);
      const isFuture = new Date() < start;
      const deadline = new Date(end);
      deadline.setDate(deadline.getDate() + 3);
      const isPastDeadline = new Date() > deadline;

      let isLocked = false;
      let lockReason = "";
      if (isFuture) {
        isLocked = true;
        lockReason = `Available starting ${start.toLocaleDateString()}`;
      } else if (i > 1 && !submittedWeeks.includes(i - 1)) {
        isLocked = true;
        lockReason = `Must submit Week ${i - 1} first`;
      } else if (isPastDeadline && (!record || record.status !== "Submitted")) {
        isLocked = true;
        lockReason = "Deadline has passed";
      }

      const shouldShow = i === 1 || submittedWeeks.includes(i) || (!submittedWeeks.includes(i) && (i === 1 || submittedWeeks.includes(i - 1)));

      if (shouldShow) {
        list.push({
          num: i,
          startStr: start.toISOString().split("T")[0],
          endStr: end.toISOString().split("T")[0],
          record,
          isLocked,
          lockReason,
          isPastDeadline
        });
      }
    }
    return list;
  }, [internshipStartDate, weeklyRecords]);

  const monthsList = useMemo(() => {
    if (!internshipStartDate) return [];
    const baseDate = new Date(internshipStartDate);
    const list = [];
    
    const submittedMonths = monthlyRecords.filter(r => r.status === "Submitted").map(r => r.periodNumber);

    for (let i = 1; i <= 6; i++) {
      const start = new Date(baseDate);
      start.setDate(baseDate.getDate() + (i - 1) * 28);
      const end = new Date(start);
      end.setDate(start.getDate() + 27);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);

      const record = monthlyRecords.find((r) => r.periodNumber === i);
      const isFuture = new Date() < start;
      const deadline = new Date(end);
      deadline.setDate(deadline.getDate() + 5);
      const isPastDeadline = new Date() > deadline;

      let isLocked = false;
      let lockReason = "";
      if (isFuture) {
        isLocked = true;
        lockReason = `Available starting ${start.toLocaleDateString()}`;
      } else if (i > 1 && !submittedMonths.includes(i - 1)) {
        isLocked = true;
        lockReason = `Must submit Month ${i - 1} first`;
      } else if (isPastDeadline && (!record || record.status !== "Submitted")) {
        isLocked = true;
        lockReason = "Deadline has passed";
      }

      const shouldShow = i === 1 || submittedMonths.includes(i) || (!submittedMonths.includes(i) && (i === 1 || submittedMonths.includes(i - 1)));

      if (shouldShow) {
        list.push({
          num: i,
          startStr: start.toISOString().split("T")[0],
          endStr: end.toISOString().split("T")[0],
          record,
          isLocked,
          lockReason,
          isPastDeadline
        });
      }
    }
    return list;
  }, [internshipStartDate, monthlyRecords]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#7aaec4] via-[#9bc6d9] to-[#689bb3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1e3a5f] border-t-transparent"></div>
          <p className="text-xs font-extrabold text-[#1e3a5f] tracking-wider uppercase">Loading Record Book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen pb-20 relative bg-gradient-to-br from-[#7aaec4] via-[#9bc6d9] to-[#689bb3] text-[#1e3a5f] selection:bg-[#3F5D82] selection:text-white">
      <StudentNav />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1e3a5f]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/20 animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <main className="flex-grow mx-auto w-full max-w-5xl px-6 pt-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#3F5D82] tracking-widest uppercase mb-1">
              <FileText className="w-4 h-4" /> Student Portal
            </div>
            <h1 className="text-3xl font-black text-[#1e3a5f] tracking-tight">Internship Record Book</h1>
          </div>

          <a 
            href="http://localhost:5000/templates/Novation_Report_Template.docx" 
            download 
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#1e3a5f] px-5 py-3 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#152b47] hover:shadow-xl active:scale-[0.98]"
          >
            <Download className="h-4 w-4" /> Download Novation Template (.docx)
          </a>
        </div>

        {/* Content Area */}
        {!internshipApproved ? (
          <div className="rounded-3xl border border-amber-300/60 bg-amber-50/90 backdrop-blur-md p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-sm">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-amber-900 tracking-tight">Internship Approval Pending</h3>
            <p className="mt-2 text-xs text-amber-800 max-w-md mx-auto font-medium leading-relaxed">
              Your record book entries will unlock automatically once the department officially approves your internship placement request.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Tabs */}
            <div className="p-1.5 bg-white/40 border-b border-white/50 flex gap-1.5">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-2xl ${
                  activeTab === "weekly" 
                    ? "bg-[#3F5D82] text-white shadow-lg scale-[1.01]" 
                    : "text-[#3b6287] hover:text-[#1e3a5f] hover:bg-white/60"
                }`}
              >
                Weekly Logs
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-2xl ${
                  activeTab === "monthly" 
                    ? "bg-[#3F5D82] text-white shadow-lg scale-[1.01]" 
                    : "text-[#3b6287] hover:text-[#1e3a5f] hover:bg-white/60"
                }`}
              >
                Monthly Reports
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-8">
              {activeTab === "weekly" ? (
                <div className="space-y-4">
                  {weeksList.map((item) => (
                    <div 
                      key={item.num} 
                      className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        item.isLocked 
                          ? 'border-white/30 bg-white/30 opacity-65' 
                          : 'border-white/70 bg-white/80 shadow-md hover:shadow-lg hover:border-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-base font-black text-[#1e3a5f]">
                            Week {item.num.toString().padStart(2, '0')}
                          </h4>
                          {getStatusBadge(item.record, item.endStr)}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-[#3b6287]">
                          <Calendar className="w-3.5 h-3.5 text-[#3F5D82]" /> {item.startStr} — {item.endStr}
                        </p>
                        {item.isLocked && (
                          <p className="text-[11px] font-bold text-rose-700 pt-0.5">
                            🔒 {item.lockReason}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center gap-2.5">
                        {item.record?.status === "Submitted" && (
                          <button 
                            onClick={(e) => handleDownload(e, `http://localhost:5000/uploads/${item.record!.filePath.split(/[\\/]/).pop()}`, item.record!.originalFilename || `Week_${item.num}_Log.pdf`)}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm bg-white/80 text-[#1e3a5f] border border-white hover:bg-white active:scale-95"
                          >
                            <Download className="h-4 w-4 text-[#3F5D82]" /> PDF
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/student/record-book/entry/weekly/${item.num}`)}
                          disabled={item.isLocked}
                          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md active:scale-95 ${
                            item.isLocked 
                              ? 'bg-white/40 text-slate-400 cursor-not-allowed shadow-none border border-white/20' 
                              : 'bg-[#3F5D82] text-white hover:bg-[#152b47]'
                          }`}
                        >
                          Open Entry <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {monthsList.map((item) => (
                    <div 
                      key={item.num} 
                      className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        item.isLocked 
                          ? 'border-white/30 bg-white/30 opacity-65' 
                          : 'border-white/70 bg-white/80 shadow-md hover:shadow-lg hover:border-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-base font-black text-[#1e3a5f]">
                            Month {item.num.toString().padStart(2, '0')}
                          </h4>
                          {getStatusBadge(item.record, item.endStr)}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-[#3b6287]">
                          <Calendar className="w-3.5 h-3.5 text-[#3F5D82]" /> {item.startStr} — {item.endStr}
                        </p>
                        {item.isLocked && (
                          <p className="text-[11px] font-bold text-rose-700 pt-0.5">
                            🔒 {item.lockReason}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center gap-2.5">
                        {item.record?.status === "Submitted" && (
                          <button 
                            onClick={(e) => handleDownload(e, `http://localhost:5000/uploads/${item.record!.filePath.split(/[\\/]/).pop()}`, item.record!.originalFilename || `Month_${item.num}_Log.pdf`)}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm bg-white/80 text-[#1e3a5f] border border-white hover:bg-white active:scale-95"
                          >
                            <Download className="h-4 w-4 text-[#3F5D82]" /> PDF
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/student/record-book/entry/monthly/${item.num}`)}
                          disabled={item.isLocked}
                          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md active:scale-95 ${
                            item.isLocked 
                              ? 'bg-white/40 text-slate-400 cursor-not-allowed shadow-none border border-white/20' 
                              : 'bg-[#3F5D82] text-white hover:bg-[#152b47]'
                          }`}
                        >
                          Open Entry <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

