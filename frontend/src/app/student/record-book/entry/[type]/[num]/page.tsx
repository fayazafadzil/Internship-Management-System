"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Info, UploadCloud, FileText, CheckCircle, ArrowLeft, Send, Clock } from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function RecordBookEntryPage({ params: paramsPromise }: { params: Promise<{ type: string; num: string }> }) {
  const { user, ready } = useAuth();
  useAuthGuard("student", "/student/login");
  const router = useRouter();

  const params = use(paramsPromise);
  const isWeekly = params.type === "weekly";
  const num = parseInt(params.num, 10);

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [periodDetails, setPeriodDetails] = useState<{ start: Date; end: Date } | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!ready || user?.role !== "student") return;

    const loadData = async () => {
      try {
        const token = sessionStorage.getItem("ims.student.token");
        if (!token) return;

        const internRes = await fetch("http://localhost:5000/api/internships/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const internData = await internRes.json();
        const startDateStr = internData.application?.internshipStartDate;
        
        if (!startDateStr) {
          router.push("/student/record-book");
          return;
        }

        const baseDate = new Date(startDateStr);
        const start = new Date(baseDate);
        const end = new Date(baseDate);

        if (isWeekly) {
          start.setDate(baseDate.getDate() + (num - 1) * 7);
          end.setDate(start.getDate() + 6);
        } else {
          start.setDate(baseDate.getDate() + (num - 1) * 28);
          end.setDate(start.getDate() + 27);
        }
        setPeriodDetails({ start, end });

        const endpoint = isWeekly ? "weekly-records" : "monthly-records";
        const res = await fetch(`http://localhost:5000/api/${endpoint}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const match = data.records.find((r: any) => 
            isWeekly ? r.weekNumber === num : r.monthNumber === num
          );
          if (match) setRecord(match);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ready, user, isWeekly, num, router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        showToast("Please select a valid PDF file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        showToast("Please drop a valid PDF file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast("Please select a file to submit.");
      return;
    }
    
    setIsUploading(true);
    const token = sessionStorage.getItem("ims.student.token");
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    if (isWeekly) {
      formData.append("weekNumber", num.toString());
      formData.append("weekStart", periodDetails!.start.toISOString().split("T")[0]);
      formData.append("weekEnd", periodDetails!.end.toISOString().split("T")[0]);
    } else {
      formData.append("monthNumber", num.toString());
      formData.append("monthStart", periodDetails!.start.toISOString().split("T")[0]);
      formData.append("monthEnd", periodDetails!.end.toISOString().split("T")[0]);
    }

    const endpoint = isWeekly ? "weekly-records" : "monthly-records";
    
    try {
      let res;
      if (record && record._id) {
        res = await fetch(`http://localhost:5000/api/${endpoint}/${record._id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch(`http://localhost:5000/api/${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (res.ok) {
        showToast("Log submitted successfully!");
        const data = await res.json();
        setRecord(data.record);
        setSelectedFile(null);
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Failed to submit log.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!ready || loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#7aaec4] via-[#9bc6d9] to-[#689bb3] flex items-center justify-center font-black text-[#1e3a5f] text-base tracking-wider">Loading...</div>;
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const startMonthName = periodDetails && !isNaN(periodDetails.start.getMonth()) 
    ? monthNames[periodDetails.start.getMonth()] || "" 
    : "";

  let deadlineDate: Date | null = null;
  let countdownText = "";
  let isPastDeadline = false;

  if (periodDetails) {
    deadlineDate = new Date(periodDetails.end);
    deadlineDate.setHours(23, 59, 59, 999);

    const diffMs = deadlineDate.getTime() - now.getTime();

    if (diffMs < 0) {
      isPastDeadline = true;
      countdownText = "Deadline passed";
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      countdownText = `${days} day${days !== 1 ? "s" : ""} left`;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#7aaec4] via-[#9bc6d9] to-[#689bb3] font-sans selection:bg-[#3F5D82] selection:text-white">
      <StudentNav />
      
      {toastMessage && (
        <div className="fixed top-22 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#1e3a5f]/95 backdrop-blur-md px-6 py-3 text-xs font-bold text-white shadow-xl border border-white/20">
          {toastMessage}
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-lg">
          <div>
            <button onClick={() => router.push("/student/record-book")} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1e3a5f] hover:text-[#3F5D82] mb-2 transition-all group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Record Book
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-[#1e3a5f] tracking-tight">
              {isWeekly ? "Weekly" : "Monthly"} Internship Log <span className="text-[#3F5D82] font-semibold text-lg">/ {isWeekly ? "Week" : "Month"} {num.toString().padStart(2, '0')}</span>
            </h1>
            <p className="mt-1.5 text-xs md:text-sm font-semibold text-[#3b6287]">
              Record your progress, challenges, and reflections for the academic {isWeekly ? "week" : "month"}.
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Context, Template & Tips Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Toggle Card */}
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-1.5 shadow-md border border-white/70 flex">
              <button
                onClick={() => !isWeekly && router.push(`/student/record-book/entry/weekly/${num}`)}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isWeekly ? 'bg-[#3F5D82] text-white shadow-md' : 'text-[#3b6287] hover:bg-white/60'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => isWeekly && router.push(`/student/record-book/entry/monthly/${num}`)}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!isWeekly ? 'bg-[#3F5D82] text-white shadow-md' : 'text-[#3b6287] hover:bg-white/60'}`}
              >
                Monthly
              </button>
            </div>

            {/* Log Context Card */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-white/70">
              <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-[#a4c8d9]/40">
                <div className="w-9 h-9 rounded-xl bg-[#3F5D82] flex items-center justify-center text-white shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-[#1e3a5f] text-sm">Log Context</h3>
                  <p className="text-[11px] font-bold text-[#567a96]">Timeline & schedule details</p>
                </div>
              </div>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#567a96] mb-1 block">{isWeekly ? "WEEK" : "MONTH"}</label>
                  <div className="bg-white/80 border border-white rounded-2xl px-3.5 py-2.5 font-bold text-[#1e3a5f] shadow-sm">
                    {startMonthName ? startMonthName.toUpperCase() : "MONTH"} ({isWeekly ? "Week" : "Month"} {num})
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#567a96] mb-1 block">REPORTING PERIOD</label>
                  <div className="bg-white/80 border border-white rounded-2xl px-3.5 py-2.5 font-bold text-[#1e3a5f] flex items-center gap-2 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#567a96]" />
                    {periodDetails?.start.toLocaleDateString()} — {periodDetails?.end.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#567a96] mb-1 flex justify-between items-center">
                    <span>DEADLINE</span>
                    {countdownText && (
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm ${isPastDeadline ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {countdownText}
                      </span>
                    )}
                  </label>
                  <div className={`border rounded-2xl px-3.5 py-2.5 font-bold flex items-center gap-2 shadow-sm ${isPastDeadline ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white/80 border-white text-[#1e3a5f]'}`}>
                    <Clock className={`w-3.5 h-3.5 ${isPastDeadline ? 'text-red-500' : 'text-[#567a96]'}`} />
                    {deadlineDate?.toLocaleDateString()} (11:59 PM)
                  </div>
                </div>
              </div>
            </div>

            {/* Template Download Card */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-white/70">
              <h3 className="font-black text-[#1e3a5f] text-xs mb-3 uppercase tracking-wider">
                {isWeekly ? "Weekly" : "Monthly"} Document Template
              </h3>
              <a
                href={`http://localhost:5000/templates/${isWeekly ? 'Weekly_Log_Template.docx' : 'Monthly_Progress_Report.docx'}`}
                download
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-[#3F5D82] hover:bg-[#152b47] text-white text-xs font-black shadow-md transition-all"
              >
                <FileText className="w-4 h-4" /> Download Official .docx Template
              </a>
              <p className="mt-3 text-[11px] font-semibold text-[#567a96] text-center leading-relaxed">
                Download the template, fill it out, sign, export as PDF, and upload on the right.
              </p>
            </div>

            {/* Pro-Tip Card */}
            <div className="bg-[#1e3a5f] rounded-3xl p-6 shadow-xl text-white border border-white/10">
              <div className="flex items-center gap-2.5 mb-2">
                <Info className="w-4 h-4 text-sky-300" />
                <h3 className="font-black text-xs tracking-wide">Pro-Tip</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Focus on quantifiable achievements. E.g., "Resolved 5 critical security vulnerabilities" instead of "Worked on bugs."
              </p>
            </div>

          </div>

          {/* Right Column: Upload Box + Submit Button */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {record ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 md:p-12 flex flex-col items-center justify-center border border-white shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 border border-emerald-100 shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-[#1e3a5f] mb-2">Log Successfully Submitted</h2>
                <p className="text-slate-600 font-semibold mb-7 max-w-md text-xs md:text-sm leading-relaxed">
                  Your log has been securely saved to the database. You can review your submission or replace the file below anytime.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md">
                  <a 
                    href={`http://localhost:5000/uploads/${record.filePath.split(/[\\/]/).pop()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 bg-white text-[#1e3a5f] font-bold py-3.5 px-5 rounded-2xl hover:bg-slate-50 transition shadow-sm border border-slate-100 text-xs"
                  >
                    <FileText className="w-4 h-4 text-[#3F5D82]" /> View PDF
                  </a>
                  
                  <div className="relative flex-1">
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full flex items-center justify-center gap-2.5 border border-dashed border-[#1e3a5f]/30 text-[#1e3a5f] font-bold py-3.5 px-5 rounded-2xl bg-white/50 hover:bg-white transition shadow-sm text-xs">
                      <UploadCloud className="w-4 h-4 text-[#3F5D82]" /> Replace File
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-5 w-full max-w-md text-xs font-bold text-teal-700 bg-teal-50/90 border border-teal-200 py-3 px-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <span className="truncate pr-2">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-red-500 hover:text-red-700 p-1 font-black">✕</button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 md:p-14 flex flex-col items-center justify-center border-2 border-dashed border-[#1e3a5f]/25 hover:border-[#3F5D82] shadow-xl text-center transition-all relative group overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                <div className="w-24 h-24 bg-white/90 rounded-3xl flex items-center justify-center text-[#1e3a5f] mb-5 shadow-lg group-hover:scale-105 transition-all border border-white">
                  <UploadCloud className="w-12 h-12 text-[#3F5D82]" />
                </div>
                
                {selectedFile ? (
                  <div className="z-20 relative flex flex-col items-center">
                    <h2 className="text-xl font-black text-[#1e3a5f] mb-2">File Ready to Upload</h2>
                    <p className="text-[#3b6287] font-bold mb-5 truncate max-w-md bg-white border border-slate-200 py-3 px-5 rounded-2xl shadow-sm text-xs">{selectedFile.name}</p>
                    <div className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 py-2 px-5 rounded-xl shadow-sm">
                      Click the "Submit Log" button below
                    </div>
                  </div>
                ) : (
                  <div className="z-10 relative">
                    <h2 className="text-2xl font-black text-[#1e3a5f] mb-2">Upload your PDF Log</h2>
                    <p className="text-slate-600 font-bold mb-1 text-sm">Drag and drop your signed PDF file here</p>
                    <p className="text-slate-400 text-xs font-semibold mb-6">or click anywhere on this card to browse files</p>
                    <div className="inline-flex items-center gap-2.5 bg-white text-[#1e3a5f] font-black py-3.5 px-6 rounded-2xl shadow-md border border-slate-100 text-xs pointer-events-none">
                      <UploadCloud className="w-4 h-4 text-[#3F5D82]" /> Browse PDF File
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Log Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-[#3F5D82] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#3F5D82]/25 hover:bg-[#152b47] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {isUploading ? "Submitting Log..." : "Submit Log"}
              </button>
            </div>

          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
