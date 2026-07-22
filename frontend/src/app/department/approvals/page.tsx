"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Download, X, ClipboardList, BookOpenCheck, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { DepartmentNav } from "@/components/layout/DepartmentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface PlacementRequest {
  _id: string;
  student: string;
  id: string; // studentId
  email: string;
  studentUserId: string;
  photo?: string;
  company: string;
  role: string;
  date: string;
  status: "Approved" | "Rejected" | "Pending Review";
  offerFileName: string;
  offerMimeType: string;
  offerDataUrl: string;
  internshipStartDate: string;
  duration?: string;
  rejectionReason: string;
}

interface LogRecordData {
  _id?: string;
  weekNumber?: number;
  monthNumber?: number;
  weekStart?: string;
  weekEnd?: string;
  monthStart?: string;
  monthEnd?: string;
  isLateSubmission?: boolean;
  status?: "Pending" | "Submitted" | "Missing";
  submittedAt?: string;
}

export default function DepartmentApprovalsPage() {
  const { user, ready } = useAuth();
  useAuthGuard("department", "/department/auth");
  const router = useRouter();

  const [placements, setPlacements] = useState<PlacementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState<PlacementRequest | null>(null);
  const [isRecordBookOpen, setIsRecordBookOpen] = useState(false);
  const [studentWeeks, setStudentWeeks] = useState<LogRecordData[]>([]);
  const [studentMonths, setStudentMonths] = useState<LogRecordData[]>([]);
  const [recordBookTab, setRecordBookTab] = useState<"weekly" | "monthly">("weekly");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchPlacements = async () => {
    try {
      const token = sessionStorage.getItem("ims.department.token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/internships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlacements(data.applications || []);
      }
    } catch {
      setError("Failed to fetch placement requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user?.role === "department") {
      fetchPlacements();
    }
  }, [ready, user]);

  const filteredPlacements = useMemo(() => {
    let list = placements;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.student?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.company?.toLowerCase().includes(q)
      );
    }

    return list.filter((p) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return p.status === "Pending Review";
      if (activeTab === "approved") return p.status === "Approved";
      if (activeTab === "rejected") return p.status === "Rejected";
      return true;
    });
  }, [placements, activeTab, searchQuery]);

  const handleDownloadPlacements = () => {
    const headers = ["Student Name", "Registration No", "Company", "Job Position", "Start Date", "Status"];
    let csv = headers.join(",") + "\n";
    filteredPlacements.forEach((p) => {
      csv += `"${p.student || ''}","${p.id || ''}","${p.company || ''}","${p.role || ''}","${p.internshipStartDate || ''}","${p.status || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "internship_approvals.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openReview = (request: PlacementRequest) => {
    router.push(`/department/approvals/${request._id}`);
  };

  const closeOverlay = () => {
    setIsRecordBookOpen(false);
    setActiveRequest(null);
  };

  const openRecordBook = async (request: PlacementRequest) => {
    setActiveRequest(request);
    setActionMessage(null);
    setRecordBookTab("weekly");

    try {
      const token = sessionStorage.getItem("ims.department.token");
      const wRes = await fetch(`http://localhost:5000/api/weekly-records/student/${request.studentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mRes = await fetch(`http://localhost:5000/api/monthly-records/student/${request.studentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (wRes.ok && mRes.ok) {
        const wData = await wRes.json();
        const mData = await mRes.json();
        setStudentWeeks(wData.records || []);
        setStudentMonths(mData.records || []);
        setIsRecordBookOpen(true);
      } else {
        alert("Failed to access student's record book.");
      }
    } catch {
      alert("Unable to connect to backend server.");
    }
  };


  const handleDownloadOfferLetter = () => {
    if (!activeRequest || !activeRequest.offerDataUrl) return;
    const link = document.createElement("a");
    link.href = activeRequest.offerDataUrl;
    link.download = activeRequest.offerFileName || "offer_letter.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseBaseDate = () => {
    if (!activeRequest || !activeRequest.internshipStartDate) return new Date();
    let baseDate;
    try {
      const parts = activeRequest.internshipStartDate.split("/");
      if (parts.length === 3) {
        baseDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      } else {
        baseDate = new Date(activeRequest.internshipStartDate);
      }
    } catch {
      baseDate = new Date();
    }
    if (isNaN(baseDate.getTime())) baseDate = new Date();
    return baseDate;
  };

  const getStatusDisplay = (record: any, endStr: string, graceDays: number) => {
    if (!record || record.status === "Pending") {
      const end = new Date(endStr);
      const deadline = new Date(end);
      deadline.setDate(deadline.getDate() + graceDays);
      deadline.setHours(23,59,59,999);
      
      const now = new Date();
      if (now < new Date(endStr)) return "Upcoming";
      if (now <= deadline) return "Pending";
      return "Missing";
    }
    if (record.status === "Submitted") {
      return record.isLateSubmission ? "Submitted (Late)" : "Submitted";
    }
    return record.status;
  };

  const fullWeeksList = useMemo(() => {
    const baseDate = parseBaseDate();
    const list = [];
    for (let i = 1; i <= 24; i++) {
      const start = new Date(baseDate);
      start.setDate(baseDate.getDate() + (i - 1) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);

      const match = studentWeeks.find((w) => w.weekNumber === i);
      const endStr = end.toISOString().split("T")[0];
      
      list.push({
        num: i,
        period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        status: getStatusDisplay(match, endStr, 3),
        record: match,
      });
    }
    return list;
  }, [activeRequest, studentWeeks]);

  const fullMonthsList = useMemo(() => {
    const baseDate = parseBaseDate();
    const list = [];
    for (let i = 1; i <= 6; i++) {
      const start = new Date(baseDate);
      start.setDate(baseDate.getDate() + (i - 1) * 28);
      const end = new Date(start);
      end.setDate(start.getDate() + 27);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);

      const match = studentMonths.find((w) => w.monthNumber === i);
      const endStr = end.toISOString().split("T")[0];
      
      list.push({
        num: i,
        period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        status: getStatusDisplay(match, endStr, 5),
        record: match,
      });
    }
    return list;
  }, [activeRequest, studentMonths]);

  const completedWeeksCount = useMemo(() => studentWeeks.filter(w => w.status === "Submitted").length, [studentWeeks]);
  const completedMonthsCount = useMemo(() => studentMonths.filter(w => w.status === "Submitted").length, [studentMonths]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EAF3FF] via-[#F3F7FC] to-[#DCEBFF] text-[#0b1b33]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1B4472]/20 border-t-[#1B4472]" />
          <span className="text-sm font-medium tracking-wide text-[#1B4472]/70">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#294B72] via-[#24405f] to-[#1c344f] flex flex-col font-sans text-slate-800">
      <DepartmentNav />

      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 py-10">
        <div className="rounded-[32px] border border-white/50 bg-[#D4E9FC]/95 p-6 sm:p-8 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#1B4472]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#1a446c]">
                Approvals
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f2a4a]">Internship Requests</h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-slate-500 leading-relaxed">
                Centralized management for student internship placements. Review pending records, verify company details, and track approval workflows.
              </p>
            </div>

          </div>

          {actionMessage && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-xs font-medium text-emerald-800 shadow-sm">
              {actionMessage}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs font-medium text-rose-800 shadow-sm">
              {error}
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/60 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-[#EAF3FF] to-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex flex-nowrap items-center gap-1 rounded-2xl bg-[#EAF3FF] p-1.5 shadow-inner overflow-x-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ease-out ${
                    activeTab === "all"
                      ? "bg-[#1B4472] text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.5)] scale-[1.02]"
                      : "text-slate-500 hover:bg-white hover:text-[#1B4472] hover:shadow-sm"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ease-out ${
                    activeTab === "pending"
                      ? "bg-[#1B4472] text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.5)] scale-[1.02]"
                      : "text-slate-500 hover:bg-white hover:text-[#1B4472] hover:shadow-sm"
                  }`}
                >
                  Pending Review
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ease-out ${
                    activeTab === "approved"
                      ? "bg-[#1B4472] text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.5)] scale-[1.02]"
                      : "text-slate-500 hover:bg-white hover:text-[#1B4472] hover:shadow-sm"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ease-out ${
                    activeTab === "rejected"
                      ? "bg-[#1B4472] text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.5)] scale-[1.02]"
                      : "text-slate-500 hover:bg-white hover:text-[#1B4472] hover:shadow-sm"
                  }`}
                >
                  Rejected
                </button>
              </div>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="relative w-full sm:w-[240px]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Search size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Name, ID, Company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-full border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                  />
                </div>
                <button
                  onClick={handleDownloadPlacements}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-[#1B4472] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153556] hover:shadow-[0_8px_20px_-4px_rgba(27,68,114,0.5)] whitespace-nowrap"
                >
                  <Download size={15} />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="max-h-[600px] overflow-auto">
              <table className="min-w-full text-left text-xs">
  <thead className="bg-gradient-to-r from-[#1B4472] to-[#20507F] text-white uppercase tracking-wider text-[10px] font-bold sticky top-0 z-10 shadow-sm">
    <tr>
      <th className="px-6 py-4">No</th>
      <th className="px-6 py-4">Student & ID</th>
      <th className="px-6 py-4">Company</th>
      <th className="px-6 py-4">Job Position</th>
      <th className="px-6 py-4">Duration</th>
      <th className="px-6 py-4">Date Submitted</th>
      <th className="px-6 py-4">Status</th>
      <th className="px-6 py-4 text-right">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100">
    {filteredPlacements.filter((row) => row.student && row.student.trim() !== "").length === 0 ? (
      <tr>
        <td colSpan={8} className="px-6 py-14">
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <ClipboardList size={26} className="text-slate-300" />
            <p className="text-xs font-medium italic">No placement requests in this filter criteria.</p>
          </div>
        </td>
      </tr>
    ) : (
      filteredPlacements
        .filter((row) => row.student && row.student.trim() !== "")
        .map((row, index) => (
          <tr
            key={row._id}
            className={`transition-colors duration-150 hover:bg-[#EAF3FF] ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
          >
            <td className="px-6 py-4 font-mono font-bold text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#EAF3FF] to-[#D4E9FC] ring-2 ring-white shadow-sm">
                  {row.photo ? (
                    <img src={row.photo} alt={row.student} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#0f2a4a]">{row.student}</p>
                  <p className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">{row.id}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-slate-700">{row.company}</td>
            <td className="px-6 py-4 font-medium text-slate-600">{row.role}</td>
            <td className="px-6 py-4 font-medium text-slate-600">{row.duration || "N/A"}</td>
            <td className="px-6 py-4 text-slate-500">{row.date}</td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                row.status === "Approved"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : row.status === "Pending Review"
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  row.status === "Approved" ? "bg-emerald-500" : row.status === "Pending Review" ? "bg-amber-500" : "bg-rose-500"
                }`} />
                {row.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap">
              {row.status === "Pending Review" && (
                <button
                  type="button"
                  onClick={() => openReview(row)}
                  className="rounded-full bg-[#1B4472] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153556] hover:shadow-md cursor-pointer"
                >
                  Review
                </button>
              )}
              {row.status === "Approved" && (
                <button
                  type="button"
                  onClick={() => openRecordBook(row)}
                  className="rounded-full border border-[#1B4472]/30 bg-white px-4 py-2 font-bold text-[#1B4472] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1B4472] hover:text-white hover:shadow-md cursor-pointer"
                >
                  Record Book →
                </button>
              )}
            </td>
          </tr>
        ))
    )}
  </tbody>
</table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* OVERLAY DYNAMIC MODAL LAYER */}
      {isRecordBookOpen && activeRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-6xl rounded-[28px] bg-[#EAF3FF] p-6 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] border border-white flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#1a446c] font-black">IMS Portal</p>
                <h2 className="text-xl font-black text-[#0f2a4a] mt-1">
                  Internship Weekly Record Book
                </h2>
              </div>
              <button
                type="button"
                onClick={closeOverlay}
                className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <X size={14} />
                Close View
              </button>
            </div>

            {/* RECORD BOOK INTERFACE */}
            {isRecordBookOpen && (
              <div className="flex-grow overflow-y-auto pr-1 space-y-6">

                {/* Student Profile Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#152c46] p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-2 ring-white/20">
                      {activeRequest.photo ? (
                        <img src={activeRequest.photo} alt={activeRequest.student} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xl">👤</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{activeRequest.student}</h3>
                      <p className="text-xs text-slate-300">Student ID: {activeRequest.id}</p>
                      <p className="text-xs text-slate-300">Email: {activeRequest.email}</p>
                    </div>
                  </div>
                  <div className="relative flex gap-4">
                    <div className="rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-center min-w-[110px] backdrop-blur">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Completion</p>
                      <p className="text-lg font-black text-sky-400 mt-0.5">
                        {Math.round((completedWeeksCount / 24) * 100)}% <span className="text-xs font-normal text-white">{completedWeeksCount}/24 Weeks</span>
                      </p>
                    </div>
                    <div className="rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-center min-w-[110px] backdrop-blur">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Start Date</p>
                      <p className="text-base font-black text-white mt-1.5">{activeRequest.internshipStartDate}</p>
                    </div>
                  </div>
                </div>

                {/* Split Content: Table & Milestone Tracker */}
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">

                  {/* Left Side: Logs Table */}
                  <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50/70">
                      <button
                        onClick={() => setRecordBookTab("weekly")}
                        className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-all duration-200 ${recordBookTab === "weekly" ? "border-b-2 border-[#1B4472] text-[#1B4472] bg-white" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Weekly Logs
                      </button>
                      <button
                        onClick={() => setRecordBookTab("monthly")}
                        className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-all duration-200 ${recordBookTab === "monthly" ? "border-b-2 border-[#1B4472] text-[#1B4472] bg-white" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Monthly Reports
                      </button>
                    </div>

                    <div className="max-h-[500px] overflow-auto">
                      <table className="min-w-full text-left text-xs">
                        <thead className="bg-[#1B4472] text-white uppercase text-[10px] font-bold sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-5 py-3.5">Period #</th>
                            <th className="px-5 py-3.5">Date Range</th>
                            <th className="px-5 py-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(recordBookTab === "weekly" ? fullWeeksList : fullMonthsList).map((row, idx) => (
                            <tr key={row.num} className={`transition-colors duration-150 hover:bg-[#EAF3FF] ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                              <td className="px-5 py-3.5 font-bold text-[#0f2a4a]">
                                {recordBookTab === "weekly" ? "Week" : "Month"} {row.num}
                              </td>
                              <td className="px-5 py-3.5 text-slate-500 font-medium">{row.period}</td>
                              <td className="px-5 py-3.5">
                                {row.status.includes("Late") ? (
                                  <span className="inline-flex rounded-full bg-orange-50 text-orange-700 border border-orange-100 font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide">
                                    {row.status}
                                  </span>
                                ) : row.status.includes("Submitted") ? (
                                  <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide">
                                    {row.status}
                                  </span>
                                ) : row.status === "Pending" ? (
                                  <span className="inline-flex rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide">
                                    PENDING
                                  </span>
                                ) : row.status === "Missing" ? (
                                  <span className="inline-flex rounded-full bg-red-50 text-red-700 border border-red-100 font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide">
                                    MISSING
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide">
                                    UPCOMING
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: Milestone Tracker */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#224D73] to-[#183a5a] p-5 border border-white/10 shadow-sm">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white mb-4 tracking-wide uppercase">
                      <TrendingUp size={14} />
                      Milestone Tracker
                    </h4>

                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-slate-300 mb-2.5 uppercase tracking-wider">Weekly Progress</p>
                      <div className="grid grid-cols-6 gap-2.5">
                        {fullWeeksList.map((w) => {
                          let bgClass = "bg-white/10 text-slate-300";
                          if (w.status.includes("Submitted")) bgClass = "bg-emerald-500 text-white shadow-sm";
                          else if (w.status === "Missing") bgClass = "bg-red-500 text-white shadow-sm";
                          else if (w.status === "Pending") bgClass = "bg-amber-400 text-white shadow-sm";

                          return (
                            <div
                              key={w.num}
                              title={`Week ${w.num}: ${w.status}`}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all duration-200 hover:scale-110 ${bgClass}`}
                            >
                              {w.num}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-300 mb-2.5 uppercase tracking-wider">Monthly Progress</p>
                      <div className="grid grid-cols-6 gap-2.5">
                        {fullMonthsList.map((m) => {
                          let bgClass = "bg-white/10 text-slate-300";
                          if (m.status.includes("Submitted")) bgClass = "bg-emerald-500 text-white shadow-sm";
                          else if (m.status === "Missing") bgClass = "bg-red-500 text-white shadow-sm";
                          else if (m.status === "Pending") bgClass = "bg-amber-400 text-white shadow-sm";

                          return (
                            <div
                              key={m.num}
                              title={`Month ${m.num}: ${m.status}`}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all duration-200 hover:scale-110 ${bgClass}`}
                            >
                              {m.num}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats Panel */}
                  <div className="rounded-2xl bg-[#A5C3EF]/60 p-5 border border-white/60 shadow-sm mt-4 lg:col-span-1">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-[#0f2a4a] mb-4 tracking-wide uppercase">
                      <BookOpenCheck size={14} />
                      Progress Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#134E84] p-3.5 rounded-xl shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Weekly</p>
                        <p className="text-2xl font-black text-sky-300 mt-1">{completedWeeksCount} <span className="text-sm font-semibold text-slate-300">/ 24</span></p>
                      </div>
                      <div className="bg-[#134E84] p-3.5 rounded-xl shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Monthly</p>
                        <p className="text-2xl font-black text-sky-300 mt-1">{completedMonthsCount} <span className="text-sm font-semibold text-slate-300">/ 6</span></p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
