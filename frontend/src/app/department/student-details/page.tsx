"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  FileText,
  Users,
  GraduationCap,
  ListFilter,
  ArrowUpDown,
  ChevronLeft,
  Link as LinkIcon,
  FolderKanban,
  Paperclip,
  Award,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DepartmentNav } from "@/components/layout/DepartmentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const specializations = [
  "Computer Science",
  "Software Engineering",
  "Information Systems",
  "Data Science",
  "Cybersecurity",
  "Computer Engineering",
];

const internshipStatusOptions = ["Selected", "Pending", "Not Selected"];
const gpaOptions = ["Higher to Lower", "Lower to Higher"];

interface StudentData {
  id: string;
  name: string;
  studentId: string;
  email: string;
  specialization: string;
  specializationConfirmed: boolean;
  gpa: number;
  totalCredits: number;
  internshipStatus: string;
  duration?: string;
  linkedin: string;
  github: string;
  projects: Array<{
    id: string;
    projectTitle: string;
    projectDescription: string;
    technologies: string[];
  }>;
  photo: string;
  cvFileName?: string;
  cvMimeType?: string;
  cvDataUrl?: string;
  certificationsFileName?: string;
  certificationsMimeType?: string;
  certificationsDataUrl?: string;
  additionalItemsFileName?: string;
  additionalItemsMimeType?: string;
  additionalItemsDataUrl?: string;
}

export default function DepartmentStudentDetailsPage() {
  const { user, ready } = useAuth();
  useAuthGuard("department", "/department/auth");

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGpaOrder, setSelectedGpaOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStudent, setActiveStudent] = useState<StudentData | null>(null);
  const [detailMode, setDetailMode] = useState<"cv" | "certifications" | "additional" | "profile" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const token = sessionStorage.getItem("ims.department.token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch {
      setError("Failed to load students registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user?.role === "department") {
      fetchStudents();
    }
  }, [ready, user]);

  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (student) =>
          student.name?.toLowerCase().includes(q) ||
          student.studentId?.toLowerCase().includes(q) ||
          student.email?.toLowerCase().includes(q)
      );
    }

    if (selectedSpecialization) {
      list = list.filter((student) => student.specialization === selectedSpecialization);
    }

    if (selectedStatus) {
      list = list.filter((student) => student.internshipStatus === selectedStatus);
    }

    if (selectedGpaOrder) {
      list.sort((a, b) =>
        selectedGpaOrder === "Higher to Lower" ? b.gpa - a.gpa : a.gpa - b.gpa,
      );
    }

    return list;
  }, [students, selectedSpecialization, selectedStatus, selectedGpaOrder, searchQuery]);

  const handleDownloadStudents = () => {
    const headers = ["Name", "Student ID", "Email", "GPA", "Specialization", "Internship Status"];
    let csv = headers.join(",") + "\n";
    filteredStudents.forEach((student) => {
      csv += `"${student.name}","${student.id}","${student.email}","${student.gpa.toFixed(2)}","${student.specialization || ''}","${student.internshipStatus || ''}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_details.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openDetail = async (student: StudentData, mode: "cv" | "certifications" | "additional" | "profile") => {
    try {
      const token = sessionStorage.getItem("ims.department.token");
      // Fetch full details of student (including CV, projects, etc.)
      const res = await fetch(`http://localhost:5000/api/students/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Construct the full object
        const fullStudent: StudentData = {
          ...student,
          projects: data.profile?.projects || [],
          cvFileName: data.profile?.cvFileName || "",
          cvMimeType: data.profile?.cvMimeType || "",
          cvDataUrl: data.profile?.cvDataUrl || "",
          certificationsFileName: data.profile?.certificationsFileName || "",
          certificationsMimeType: data.profile?.certificationsMimeType || "",
          certificationsDataUrl: data.profile?.certificationsDataUrl || "",
          additionalItemsFileName: data.profile?.additionalItemsFileName || "",
          additionalItemsMimeType: data.profile?.additionalItemsMimeType || "",
          additionalItemsDataUrl: data.profile?.additionalItemsDataUrl || "",
          linkedin: data.profile?.linkedin || "",
          github: data.profile?.github || "",
          photo: data.profile?.photo || "",
        };
        setActiveStudent(fullStudent);
        setDetailMode(mode);
      } else {
        setActiveStudent(student);
        setDetailMode(mode);
      }
    } catch {
      setActiveStudent(student);
      setDetailMode(mode);
    }
  };

  const closeDetail = () => {
    setActiveStudent(null);
    setDetailMode(null);
  };

  const handleDownloadCvFile = () => {
    if (!activeStudent || !activeStudent.cvDataUrl) return;
    const link = document.createElement("a");
    link.href = activeStudent.cvDataUrl;
    link.download = activeStudent.cvFileName || "student_cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCertifications = () => {
    if (!activeStudent || !activeStudent.certificationsDataUrl) return;
    const link = document.createElement("a");
    link.href = activeStudent.certificationsDataUrl;
    link.download = activeStudent.certificationsFileName || "certifications.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAdditional = () => {
    if (!activeStudent || !activeStudent.additionalItemsDataUrl) return;
    const link = document.createElement("a");
    link.href = activeStudent.additionalItemsDataUrl;
    link.download = activeStudent.additionalItemsFileName || "additional_items.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectArrow = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`;

  if (!ready || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EAF3FF] via-[#F3F7FC] to-[#DCEBFF] text-[#0b1b33]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1B4472]/20 border-t-[#1B4472]" />
          <span className="text-sm font-medium tracking-wide text-[#1B4472]/70">Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#294B72] via-[#24405f] to-[#1c344f] flex flex-col font-sans antialiased">
      <DepartmentNav />

      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-8 flex-grow">

        {/* BACK ACTION CONTROLLER STRIP */}
        {detailMode && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={closeDetail}
              className="flex items-center gap-1.5 rounded-xl bg-white/95 text-[#0f2a4a] px-5 py-2.5 text-xs font-bold shadow-md backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg cursor-pointer"
            >
              <ChevronLeft size={14} />
              Back to Student List
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {/* CONDITION 1: DEFAULT STATE -> SHOW MAIN TABLE */}
        {!detailMode && (
          <div className="rounded-[32px] border border-white/50 bg-[#D4E9FC]/95 p-6 sm:p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#1B4472]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#0f2a4a]">
                  Student Details
                </p>
                <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f2a4a]">Student Details</h1>
                <p className="mt-3 max-w-3xl text-sm text-slate-500 leading-relaxed">
                  Manage and monitor student internship progress across departments. Academic Excellence Portal.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e344e] to-[#14283e] px-7 py-5 text-white shadow-[0_8px_28px_-8px_rgba(15,42,74,0.6)] text-right min-w-[260px]">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-center justify-end gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-bold">Total Registered Students</p>
                    <p className="mt-2 text-4xl font-black">{filteredStudents.length}</p>
                  </div>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
                    <Users size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Hub */}
            <div className="mt-8 rounded-3xl border border-white/60 bg-white/60 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                <div className="grid gap-4 sm:grid-cols-3 flex-1">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <GraduationCap size={12} /> Specialization
                    </span>
                    <select
                      value={selectedSpecialization}
                      onChange={(event) => setSelectedSpecialization(event.target.value)}
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition appearance-none pr-10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      style={{ backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <ListFilter size={12} /> Internship Status
                    </span>
                    <select
                      value={selectedStatus}
                      onChange={(event) => setSelectedStatus(event.target.value)}
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition appearance-none pr-10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      style={{ backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    >
                      <option value="">All Internship Status</option>
                      {internshipStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <ArrowUpDown size={12} /> Sort by GPA
                    </span>
                    <select
                      value={selectedGpaOrder}
                      onChange={(event) => setSelectedGpaOrder(event.target.value)}
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition appearance-none pr-10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      style={{ backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    >
                      <option value="">All GPA</option>
                      <option value="Higher to Lower">Highest to Lowest</option>
                      <option value="Lower to Higher">Lowest to Highest</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:items-end">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <Search size={12} /> Search
                    </span>
                    <div className="relative w-full sm:w-[220px]">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Search size={15} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Name, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs font-medium text-slate-700 shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      />
                    </div>
                  </label>

                  <button
                    onClick={handleDownloadStudents}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#1B4472] px-5 py-3 text-xs font-bold text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153556] hover:shadow-[0_8px_20px_-4px_rgba(27,68,114,0.5)] whitespace-nowrap"
                  >
                    <Download size={15} />
                    Download CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="mt-8 max-h-[600px] overflow-auto rounded-3xl border border-white/60 bg-white shadow-sm">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#1B4472] to-[#20507F] text-white font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4">GPA</th>
                    <th className="px-6 py-4">Specialization</th>
                    <th className="px-6 py-4">Internship Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Users size={26} className="text-slate-300" />
                          <p className="text-xs font-medium italic">No students registered in this criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`transition-colors duration-150 hover:bg-[#EAF3FF] ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        <td className="px-6 py-4 font-bold text-slate-400">{(index + 1).toString().padStart(2, "0")}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#EAF3FF] to-[#D4E9FC] ring-2 ring-white shadow-sm">
                              {student.photo ? (
                                <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-lg">👤</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#0f2a4a] text-sm">{student.name}</p>
                              <p className="text-slate-400 mt-0.5 font-mono text-[11px]">ID: {student.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-[#0f2a4a] text-sm">{student.gpa.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-700 border border-sky-100">
                            {student.specialization || "Unconfirmed"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-extrabold uppercase tracking-wide text-[10px] ${
                            student.internshipStatus === "Selected"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : student.internshipStatus === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              student.internshipStatus === "Selected"
                              ? "bg-emerald-500"
                              : student.internshipStatus === "Pending"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                            }`} />
                            {student.internshipStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openDetail(student, "cv")}
                              className="rounded-full border border-[#1B4472]/30 bg-white px-4 py-2 font-bold text-[#1B4472] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1B4472] hover:text-white hover:shadow-md cursor-pointer whitespace-nowrap"
                            >
                              View CV
                            </button>
                            <button
                              type="button"
                              onClick={() => openDetail(student, "profile")}
                              className="rounded-full bg-[#1B4472] px-4 py-2 font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153556] hover:shadow-md cursor-pointer whitespace-nowrap"
                            >
                              View Profile →
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONDITION 2: VIEW DOCUMENT MODE -> SPLIT SCREEN LAYOUT */}
        {(detailMode === "cv" || detailMode === "certifications" || detailMode === "additional") && activeStudent && (
          <div className="grid gap-6 md:grid-cols-[320px_1fr] items-start animate-fadeIn">
            {/* Left Hand Sidebar */}
            <div className="rounded-3xl bg-gradient-to-b from-[#1e3d5f] to-[#152c46] p-7 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-white/10 shadow-inner bg-slate-100 flex items-center justify-center">
                {activeStudent.photo ? (
                  <img
                    src={activeStudent.photo}
                    alt={activeStudent.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <h2 className="mt-4 text-base font-bold text-white">{activeStudent.name}</h2>
              <p className="text-xs text-slate-400 font-mono">ID: {activeStudent.studentId}</p>

              <div className="w-full border-t border-white/10 my-5"></div>

              <div className="w-full text-left space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GPA</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-sky-400">{activeStudent.gpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full text-left space-y-2 mt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Links</p>
                {activeStudent.linkedin ? (
                  <a href={activeStudent.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-300 hover:text-sky-400 transition">
                    <LinkIcon size={13} /> <span className="underline underline-offset-2">LinkedIn Profile</span>
                  </a>
                ) : (
                  <p className="text-xs text-slate-500 italic">No LinkedIn link</p>
                )}
                {activeStudent.github ? (
                  <a href={activeStudent.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-300 hover:text-sky-400 transition">
                    <LinkIcon size={13} /> <span className="underline underline-offset-2">GitHub Profile</span>
                  </a>
                ) : (
                  <p className="text-xs text-slate-500 italic">No GitHub link</p>
                )}
              </div>

              <div className="w-full text-left space-y-1 mt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</p>
                <p className="text-xs font-bold text-sky-400">{activeStudent.specialization || "Unconfirmed"}</p>
              </div>

              <div className="w-full border-t border-white/10 my-5"></div>

              <div className="w-full flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openDetail(activeStudent, "profile")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 hover:bg-white/20 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Back to Profile
                </button>
              </div>
            </div>

            {/* Right Hand PDF Mock Frame Box */}
            <div className="rounded-3xl border border-white/60 bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[700px]">
              {/* Document Header Controls Toolbar */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="font-bold flex items-center gap-2 text-[#1B4472]">
                  <FileText size={16} />
                  <span className="uppercase tracking-wider">Document Viewer</span>
                </div>
                <div className="flex items-center gap-4">
                  {detailMode === "cv" && (
                    <button
                      type="button"
                      onClick={handleDownloadCvFile}
                      className="flex items-center gap-1.5 rounded-full bg-[#1B4472]/10 px-3.5 py-1.5 font-bold text-xs text-[#1B4472] transition-all duration-200 hover:bg-[#1B4472] hover:text-white cursor-pointer"
                    >
                      <Download size={14} />
                      Download CV
                    </button>
                  )}
                  {detailMode === "certifications" && (
                    <button
                      type="button"
                      onClick={handleDownloadCertifications}
                      className="flex items-center gap-1.5 rounded-full bg-[#1B4472]/10 px-3.5 py-1.5 font-bold text-xs text-[#1B4472] transition-all duration-200 hover:bg-[#1B4472] hover:text-white cursor-pointer"
                    >
                      <Download size={14} />
                      Download Certifications
                    </button>
                  )}
                  {detailMode === "additional" && (
                    <button
                      type="button"
                      onClick={handleDownloadAdditional}
                      className="flex items-center gap-1.5 rounded-full bg-[#1B4472]/10 px-3.5 py-1.5 font-bold text-xs text-[#1B4472] transition-all duration-200 hover:bg-[#1B4472] hover:text-white cursor-pointer"
                    >
                      <Download size={14} />
                      Download Additional Items
                    </button>
                  )}
                </div>
              </div>

              {/* Document Switcher Tabs */}
              <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => openDetail(activeStudent, "cv")}
                  disabled={!activeStudent.cvDataUrl}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${detailMode === "cv" ? "bg-[#1B4472] text-white shadow-sm" : activeStudent.cvDataUrl ? "text-slate-600 bg-white border border-slate-200 hover:border-[#1B4472]/40" : "text-slate-300 bg-white border border-slate-100 cursor-not-allowed"}`}
                >
                  CV / Resume
                </button>
                <button
                  type="button"
                  onClick={() => openDetail(activeStudent, "certifications")}
                  disabled={!activeStudent.certificationsDataUrl}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${detailMode === "certifications" ? "bg-[#1B4472] text-white shadow-sm" : activeStudent.certificationsDataUrl ? "text-slate-600 bg-white border border-slate-200 hover:border-[#1B4472]/40" : "text-slate-300 bg-white border border-slate-100 cursor-not-allowed"}`}
                >
                  Certifications
                </button>
                <button
                  type="button"
                  onClick={() => openDetail(activeStudent, "additional")}
                  disabled={!activeStudent.additionalItemsDataUrl}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${detailMode === "additional" ? "bg-[#1B4472] text-white shadow-sm" : activeStudent.additionalItemsDataUrl ? "text-slate-600 bg-white border border-slate-200 hover:border-[#1B4472]/40" : "text-slate-300 bg-white border border-slate-100 cursor-not-allowed"}`}
                >
                  Additional Items
                </button>
              </div>

              {/* Internal Sheet */}
              <div className="flex-1 relative bg-slate-50">
                {detailMode === "cv" ? (
                  activeStudent.cvDataUrl ? (
                    <iframe src={activeStudent.cvDataUrl} className="absolute inset-0 w-full h-full border-0" title={`${activeStudent.name} CV`} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 p-10 text-center">
                      <FileText size={28} className="text-slate-300" />
                      <p className="italic text-sm">This student has not yet uploaded a CV resume file.</p>
                    </div>
                  )
                ) : detailMode === "certifications" ? (
                  activeStudent.certificationsDataUrl ? (
                    <iframe src={activeStudent.certificationsDataUrl} className="absolute inset-0 w-full h-full border-0" title={`${activeStudent.name} Certifications`} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 p-10 text-center">
                      <Award size={28} className="text-slate-300" />
                      <p className="italic text-sm">This student has not yet uploaded certifications.</p>
                    </div>
                  )
                ) : detailMode === "additional" ? (
                  activeStudent.additionalItemsDataUrl ? (
                    <iframe src={activeStudent.additionalItemsDataUrl} className="absolute inset-0 w-full h-full border-0" title={`${activeStudent.name} Additional Items`} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 p-10 text-center">
                      <Paperclip size={28} className="text-slate-300" />
                      <p className="italic text-sm">This student has not yet uploaded additional items.</p>
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* CONDITION 3: VIEW PROFILE MODE */}
        {detailMode === "profile" && activeStudent && (
          <div className="space-y-6 animate-fadeIn">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3d5f] to-[#152c46] p-7 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
              <div className="relative flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-inner bg-slate-300 flex items-center justify-center text-3xl">
                  {activeStudent.photo ? (
                    <img src={activeStudent.photo} alt={activeStudent.name} className="h-full w-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-wide">{activeStudent.name}</h2>
                  <p className="text-xs text-slate-300">{activeStudent.email}</p>
                  <p className="text-xs text-slate-300 font-mono">ID: {activeStudent.studentId}</p>
                  <span className="inline-flex mt-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-sky-300">
                    {activeStudent.specialization || "Unconfirmed"}
                  </span>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="rounded-2xl px-5 py-3.5 bg-white/5 border border-white/10 text-center min-w-[130px] backdrop-blur">
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Current GPA</p>
                  <p className="text-lg font-black text-white mt-1">{activeStudent.gpa.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-white/5 border border-white/10 text-center min-w-[130px] backdrop-blur">
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Internship</p>
                  <p className="text-xs font-black tracking-wider text-emerald-400 mt-2 uppercase">
                    {activeStudent.internshipStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#E5F0FF] p-6 sm:p-8 border border-white/60 shadow-sm space-y-8 min-h-[300px]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#1e3d5f] font-bold text-xs uppercase tracking-wider">
                  <BookOpen size={15} /> Academic Overview
                </div>
                <div className="pl-1 sm:pl-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 max-w-xs">
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Credits Earned</p>
                  <p className="text-lg font-black text-slate-800 pt-1">{activeStudent.totalCredits} <span className="text-xs font-bold text-slate-400">Credits Completed</span></p>
                </div>
              </div>

              {activeStudent.projects && activeStudent.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#1e3d5f] font-bold text-xs uppercase tracking-wider">
                    <FolderKanban size={15} /> Projects Portfolio
                  </div>
                  <div className="pl-1 sm:pl-6 grid gap-4 md:grid-cols-2">
                    {activeStudent.projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1B4472]/10 text-[10px] font-black text-[#1B4472]">{idx + 1}</span>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{proj.projectTitle}</h4>
                        </div>
                        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">{proj.projectDescription}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {proj.technologies?.map((tech) => (
                            <span key={tech} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[9px] font-bold text-sky-700 border border-sky-100">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e3d5f] font-bold text-xs uppercase tracking-wider">
                  <Paperclip size={15} /> Attached Documents
                </div>
                <div className="pl-1 sm:pl-6 grid gap-4 sm:grid-cols-3">
                  {activeStudent.cvDataUrl && (
                    <button
                      type="button"
                      onClick={() => openDetail(activeStudent, "cv")}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-[#1e3d5f]"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-600">
                        <FileText size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider mt-1">CV / Resume</span>
                    </button>
                  )}
                  {activeStudent.certificationsDataUrl && (
                    <button
                      type="button"
                      onClick={() => openDetail(activeStudent, "certifications")}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-[#1e3d5f]"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
                        <Award size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider mt-1">Certifications</span>
                    </button>
                  )}
                  {activeStudent.additionalItemsDataUrl && (
                    <button
                      type="button"
                      onClick={() => openDetail(activeStudent, "additional")}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-[#1e3d5f]"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
                        <Paperclip size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider mt-1">Additional Items</span>
                    </button>
                  )}
                  {!activeStudent.cvDataUrl && !activeStudent.certificationsDataUrl && !activeStudent.additionalItemsDataUrl && (
                    <p className="text-xs text-slate-400 italic">No documents attached.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e3d5f] font-bold text-xs uppercase tracking-wider">
                  <Award size={15} /> Online Presence
                </div>
                <div className="pl-1 sm:pl-6 flex flex-col sm:flex-row gap-2.5">
                  {activeStudent.linkedin ? (
                    <a
                      href={activeStudent.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#1e3d5f] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                    >
                      <LinkIcon size={14} className="text-sky-600" /> LinkedIn Profile
                    </a>
                  ) : null}
                  {activeStudent.github ? (
                    <a
                      href={activeStudent.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#1e3d5f] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                    >
                      <LinkIcon size={14} className="text-slate-700" /> GitHub Profile
                    </a>
                  ) : null}
                  {!activeStudent.linkedin && !activeStudent.github ? (
                    <p className="text-xs text-slate-400 italic">No social links added yet.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

