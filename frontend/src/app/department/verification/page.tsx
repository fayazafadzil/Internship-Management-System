"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Download, Trash2, Check, X, Inbox } from "lucide-react";
import { DepartmentNav } from "@/components/layout/DepartmentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface AccountRequestData {
  _id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  photo?: string;
  status: "pending" | "approved" | "rejected";
  tempPassword?: string;
  notes?: string;
  createdAt: string;
}

export default function DepartmentVerificationPage() {
  const { user, ready } = useAuth();
  useAuthGuard("department", "/department/auth");

  const [requests, setRequests] = useState<AccountRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem("ims.department.token");
      if (!token) return;
      const query = activeFilter === "all" ? "" : `?status=${activeFilter}`;
      const res = await fetch(`http://localhost:5000/api/account-requests${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch {
      setError("Failed to fetch registration requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user?.role === "department") {
      setLoading(true);
      fetchRequests();
    }
  }, [ready, user, activeFilter]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    let notes = "";
    if (status === "rejected") {
      const input = prompt("Please enter a reason for rejection:");
      if (input === null) return;
      notes = input.trim();
    }

    try {
      const token = sessionStorage.getItem("ims.department.token");
      const res = await fetch(`http://localhost:5000/api/account-requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update request.");
        return;
      }

      if (status === "approved" && data.request?.tempPassword) {
        alert(`Account approved successfully!\n\nUniversity Email: ${data.request.email}\nTemporary Password: ${data.request.tempPassword}\n\nThis information is also logged in the backend terminal logs.`);
      } else {
        alert("Registration request processed successfully.");
      }

      fetchRequests();
    } catch {
      alert("Unable to process request.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this registration request and any associated account data? This cannot be undone.")) return;
    try {
      const token = sessionStorage.getItem("ims.department.token");
      const res = await fetch(`http://localhost:5000/api/account-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete request.");
        return;
      }
      fetchRequests();
    } catch {
      alert("Unable to delete request.");
    }
  };

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return requests.filter((r) => {
      const searchMatch = (r.firstName + " " + r.lastName).toLowerCase().includes(q) ||
                          r.studentId.toLowerCase().includes(q) ||
                          r.email.toLowerCase().includes(q);
      if (!searchMatch) return false;
      if (activeFilter === "all") return true;
      return r.status === activeFilter;
    });
  }, [requests, searchQuery, activeFilter]);

  const handleDownload = () => {
    const headers = ["No", "Name", "Student ID", "University Email", "Request Date", "Status"];
    let csv = headers.join(",") + "\n";
    filteredRequests.forEach((row, idx) => {
      const rowNo = String(idx + 1).padStart(2, "0");
      csv += `"${rowNo}","${row.firstName} ${row.lastName || ''}","${row.studentId}","${row.email}","${new Date(row.createdAt).toLocaleDateString()}","${row.status}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registration_verifications.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!ready || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A2C4E] via-[#153A63] to-[#0F172A] text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1B4472]/20 border-t-[#1B4472]" />
          <span className="text-sm font-medium tracking-wide text-[#1B4472]/70">Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2C4E] via-[#153A63] to-[#0F172A]">
      <DepartmentNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero / Header */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-[#D4E9FC]/95 p-10 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#1B4472]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[#2563EB]/10 blur-3xl" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#1B4472]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#1B4472]">
              Verification
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f2a4a]">
              Registration Management
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              Review and manage student internship registration requests. Ensure all institutional prerequisites are met before verifying documentation.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 px-5 py-3.5 text-sm font-medium text-[#B91C1C]">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)]">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-white/80 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex flex-nowrap items-center gap-1 rounded-2xl bg-[#EAF3FF] p-1.5 shadow-inner overflow-x-auto">
              {(["all", "pending", "approved", "rejected"] as const).map((status) => {
                const isActive = activeFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold capitalize transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-[#1B4472] text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.5)] scale-[1.02]"
                        : "text-slate-500 hover:bg-white hover:text-[#1B4472] hover:shadow-sm"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <div className="relative w-full sm:w-72">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10"
                />
              </div>
              <button
                onClick={handleDownload}
                className="group flex shrink-0 items-center gap-2 rounded-2xl bg-[#1B4472] px-5 py-3 text-xs font-bold text-white shadow-[0_4px_14px_-2px_rgba(27,68,114,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153556] hover:shadow-[0_8px_20px_-4px_rgba(27,68,114,0.5)] active:translate-y-0 whitespace-nowrap"
              >
                <Download size={14} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                Download CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[620px] overflow-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-[#1B4472] to-[#20507F] text-white">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">University Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Request Date</th>
                  {activeFilter === "all" && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>}
                  {activeFilter === "approved" && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Temp Password</th>}
                  {activeFilter === "rejected" && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Rejection Notes</th>}
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50">
                          <Inbox size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium italic text-slate-400">No requests found in this section.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((row, idx) => (
                    <tr
                      key={row._id}
                      className={`group border-b border-slate-100 transition-colors duration-150 last:border-b-0 hover:bg-[#EAF3FF]/70 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#EAF3FF] to-[#D4E9FC] ring-2 ring-white shadow-sm">
                            {row.photo ? (
                              <img src={row.photo} alt={row.firstName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-lg">👤</span>
                            )}
                          </div>
                          <span className="font-semibold text-[#0F172A]">{`${row.firstName} ${row.lastName || ""}`.trim()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">{row.studentId}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#2563EB]">{row.email}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>

                      {activeFilter === "all" && (
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                            row.status === 'approved' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                            row.status === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                            'bg-[#F59E0B]/10 text-[#B45309]'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              row.status === 'approved' ? 'bg-[#16A34A]' :
                              row.status === 'rejected' ? 'bg-[#EF4444]' :
                              'bg-[#F59E0B]'
                            }`} />
                            {row.status}
                          </span>
                        </td>
                      )}

                      {activeFilter === "approved" && (
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-[#16A34A]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#16A34A]">
                            {row.tempPassword || "—"}
                          </span>
                        </td>
                      )}
                      {activeFilter === "rejected" && (
                        <td className="px-6 py-4 text-[#EF4444]">{row.notes || "—"}</td>
                      )}

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {row.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(row._id, "approved")}
                                className="flex items-center gap-1.5 rounded-full bg-[#16A34A]/10 px-4 py-2 text-xs font-bold text-[#16A34A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16A34A] hover:text-white hover:shadow-[0_6px_16px_-4px_rgba(22,163,74,0.5)]"
                              >
                                <Check size={13} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleAction(row._id, "rejected")}
                                className="flex items-center gap-1.5 rounded-full bg-[#EF4444]/10 px-4 py-2 text-xs font-bold text-[#EF4444] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EF4444] hover:text-white hover:shadow-[0_6px_16px_-4px_rgba(239,68,68,0.5)]"
                              >
                                <X size={13} />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(row._id)}
                            title="Delete request"
                            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#EF4444]/30 hover:bg-[#EF4444]/10 hover:text-[#EF4444] hover:shadow-sm"
                          >
                            <Trash2 size={15} />
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
      </main>
      <Footer />
    </div>
  );
}
