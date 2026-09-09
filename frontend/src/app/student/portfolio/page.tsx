"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Edit3, FileText, Plus, Trash2, X } from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface ProjectItem {
  id?: string;
  _id?: string;
  projectTitle: string;
  projectDescription: string;
  technologies: string[];
}

const STORAGE_PREFIX = "ims.portfolio";

const TECHNOLOGIES = [
  "HTML",
  "HTML5",
  "React",
  "React.js",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring",
  "C#",
  "ASP.NET",
  "Git",
  "Docker",
  "Kubernetes",
  "Figma",
  "Tailwind CSS",
  "Bootstrap",
  "GraphQL",
  "REST API",
  "AWS",
  "Linux",
];

function getPortfolioStorageKey(userEmail: string) {
  return `${STORAGE_PREFIX}.${userEmail}`;
}

export default function PortfolioPage() {
  const { user, ready, profile, setProfile } = useAuth();
  useAuthGuard("student", "/student/login");

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [techQuery, setTechQuery] = useState("");

  const [cvFileName, setCvFileName] = useState("");
  const [cvMimeType, setCvMimeType] = useState("");
  const [cvDataUrl, setCvDataUrl] = useState("");

  const [certificationsFileName, setCertificationsFileName] = useState("");
  const [certificationsMimeType, setCertificationsMimeType] = useState("");
  const [certificationsDataUrl, setCertificationsDataUrl] = useState("");

  const [additionalItemsFileName, setAdditionalItemsFileName] = useState("");
  const [additionalItemsMimeType, setAdditionalItemsMimeType] = useState("");
  const [additionalItemsDataUrl, setAdditionalItemsDataUrl] = useState("");

  const [savedPortfolio, setSavedPortfolio] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeDocument, setActiveDocument] = useState<"cv" | "certifications" | "additional">("cv");

  useEffect(() => {
    if (!ready || !user || user.role !== "student" || !profile) return;

    if (profile.cvDataUrl) {
      setSavedPortfolio(profile);
      setCvFileName(profile.cvFileName || "");
      setCvMimeType(profile.cvMimeType || "");
      setCvDataUrl(profile.cvDataUrl || "");
      setCertificationsFileName(profile.certificationsFileName || "");
      setCertificationsMimeType(profile.certificationsMimeType || "");
      setCertificationsDataUrl(profile.certificationsDataUrl || "");
      setAdditionalItemsFileName(profile.additionalItemsFileName || "");
      setAdditionalItemsMimeType(profile.additionalItemsMimeType || "");
      setAdditionalItemsDataUrl(profile.additionalItemsDataUrl || "");
      setProjects(profile.projects || []);
    } else {
      setSavedPortfolio(null);
      setProjects([]);
      setCvFileName("");
      setCvMimeType("");
      setCvDataUrl("");
      setCertificationsFileName("");
      setCertificationsMimeType("");
      setCertificationsDataUrl("");
      setAdditionalItemsFileName("");
      setAdditionalItemsMimeType("");
      setAdditionalItemsDataUrl("");
    }
  }, [ready, user, profile]);

  const filteredTechnologies = useMemo(() => {
    const normalized = techQuery.trim().toLowerCase();
    if (!normalized) return [];
    return TECHNOLOGIES.filter(
      (tech) =>
        tech.toLowerCase().includes(normalized) && !selectedTech.includes(tech),
    );
  }, [techQuery, selectedTech]);

  const handleFileChange = async (file: File | null, category: "cv" | "cert" | "add") => {
    if (!file) return;

    if (category === "cv") {
      if (file.type !== "application/pdf") {
        setValidationError("CV must be a PDF file.");
        return;
      }
    } else {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) {
        setValidationError("Please choose a PDF, JPG, or PNG file.");
        return;
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("The file must be 5MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        if (category === "cv") {
          setCvDataUrl(result);
          setCvFileName(file.name);
          setCvMimeType(file.type);
        } else if (category === "cert") {
          setCertificationsDataUrl(result);
          setCertificationsFileName(file.name);
          setCertificationsMimeType(file.type);
        } else if (category === "add") {
          setAdditionalItemsDataUrl(result);
          setAdditionalItemsFileName(file.name);
          setAdditionalItemsMimeType(file.type);
        }
        setValidationError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMoreProjects = () => {
    if (!projectTitle.trim() || !projectDescription.trim()) {
      setValidationError("Please complete the current project title and description first.");
      return;
    }
    if (selectedTech.length === 0) {
      setValidationError("Please add at least one technology for the current project.");
      return;
    }

    const newProject: ProjectItem = {
      id: Date.now().toString(),
      projectTitle: projectTitle.trim(),
      projectDescription: projectDescription.trim(),
      technologies: selectedTech,
    };

    setProjects((prev) => [...prev, newProject]);
    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setTechQuery("");
    setValidationError("");

    setToastMessage("Project added to list! You can add more or click save below.");
    window.setTimeout(() => setToastMessage(""), 3000);
  };

  const removeProjectFromList = (id: string) => {
    setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  const submitPortfolio = () => {
    let finalProjects = [...projects];
    if (projectTitle.trim() || projectDescription.trim() || selectedTech.length > 0) {
      if (!projectTitle.trim() || !projectDescription.trim() || selectedTech.length === 0) {
        setValidationError("Please either complete or clear the ongoing project details before saving.");
        return;
      } else {
        finalProjects.push({
          id: Date.now().toString(),
          projectTitle: projectTitle.trim(),
          projectDescription: projectDescription.trim(),
          technologies: selectedTech,
        });
      }
    }

    if (!cvDataUrl) {
      setValidationError("Please upload your CV/Resume first.");
      return;
    }

    if (finalProjects.length === 0) {
      setValidationError("Please add at least one project before saving.");
      return;
    }

    if (!user || user.role !== "student" || !profile) return;

    const updatedProfile = {
      ...profile,
      projects: finalProjects,
      cvFileName,
      cvMimeType,
      cvDataUrl,
      certificationsFileName,
      certificationsMimeType,
      certificationsDataUrl,
      additionalItemsFileName,
      additionalItemsMimeType,
      additionalItemsDataUrl,
    };

    setProfile(updatedProfile);
    setSavedPortfolio(updatedProfile);
    setProjects(finalProjects);
    setIsEditing(false);
    setValidationError("");

    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);

    setToastMessage("Portfolio saved successfully.");
    window.setTimeout(() => setToastMessage(""), 3000);
  };

  const startEditing = () => {
    if (savedPortfolio) {
      setIsEditing(true);
      setProjects(savedPortfolio.projects || []);
      setProjectTitle("");
      setProjectDescription("");
      setSelectedTech([]);
    }
  };

  const resetPortfolio = () => {
    if (!user || user.role !== "student" || !profile) return;

    const updatedProfile = {
      ...profile,
      projects: [],
      cvFileName: "",
      cvMimeType: "",
      cvDataUrl: "",
      certificationsFileName: "",
      certificationsMimeType: "",
      certificationsDataUrl: "",
      additionalItemsFileName: "",
      additionalItemsMimeType: "",
      additionalItemsDataUrl: "",
    };

    setProfile(updatedProfile);
    setSavedPortfolio(null);
    setProjects([]);
    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setTechQuery("");
    setCvFileName("");
    setCvMimeType("");
    setCvDataUrl("");
    setCertificationsFileName("");
    setCertificationsMimeType("");
    setCertificationsDataUrl("");
    setAdditionalItemsFileName("");
    setAdditionalItemsMimeType("");
    setAdditionalItemsDataUrl("");
    setIsEditing(false);
    setValidationError("");
    setToastMessage("");
  };

  const downloadCv = () => {
    if (!cvDataUrl || !cvFileName) return;
    const link = document.createElement("a");
    link.href = cvDataUrl;
    link.download = cvFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCertifications = () => {
    if (!certificationsDataUrl || !certificationsFileName) return;
    const link = document.createElement("a");
    link.href = certificationsDataUrl;
    link.download = certificationsFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAdditionalItems = () => {
    if (!additionalItemsDataUrl || !additionalItemsFileName) return;
    const link = document.createElement("a");
    link.href = additionalItemsDataUrl;
    link.download = additionalItemsFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addTechnology = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    if (selectedTech.includes(normalized)) return;
    setSelectedTech((current) => [...current, normalized]);
    setTechQuery("");
  };

  const removeTechnology = (tech: string) => {
    setSelectedTech((current) => current.filter((item) => item !== tech));
  };

  const handleTechKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology(techQuery);
    }
  };

  if (!ready || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#9bc6d9] text-[#0B2545]">
        Loading…
      </main>
    );
  }

  if (user.role !== "student") {
    return null;
  }

  return (
    <>
      <StudentNav />
      <main className="flex-1 min-h-screen pb-16 relative overflow-hidden bg-gradient-to-br from-[#9bc6d9] via-[#A7CDE0] to-[#8FBBD1]">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-[#1B4472]/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#486FAE]/15 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-8">
              <h1 className="mt-1 text-3xl font-extrabold text-[#0B2545]">  Portfolio</h1>
              <p className="mt-1 text-sm text-[#3E6088]">Build your student portfolio, upload a resume, and present your core technology stack in a single consistent interface.</p>
            </div>
          </div>

          {toastMessage ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
              {toastMessage}
            </div>
          ) : null}

          {savedPortfolio && !isEditing ? (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#1B4472]/15 bg-white/60 backdrop-blur-sm p-8 shadow-xl shadow-[#1B4472]/10 ring-1 ring-[#9bc6d9]/40">

                {/* Action buttons row — ABOVE the navy header bar */}
                <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#1B4472] shadow-sm ring-1 ring-[#C9DBEE] transition-all duration-300 hover:bg-[#EEF5FC] hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this portfolio and start again?")) {
                        resetPortfolio();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-rose-600 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>

                {/* Navy header bar — just the label, name, and saved badge */}
                <div className="flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-[#0B2545] to-[#1B4472] p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9EC3EA]">
                        Student Portfolio
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        {profile?.name || "Student"}
                      </h2>
                    </div>
                    <span className="w-fit rounded-full bg-emerald-400/20 px-4 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-300/40">
                      Saved on {new Date(savedPortfolio.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                  <div className="space-y-4">
                    {savedPortfolio.projects?.map((proj: ProjectItem, index: number) => (
                      <div
                        key={proj._id || proj.id || index}
                        className="rounded-3xl border border-[#DCE8F5] bg-white/70 p-5 shadow-sm"
                      >
                        <p className="inline-block rounded-full bg-[#1B4472] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                          Project #{index + 1}
                        </p>
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">Project title</p>
                          <p className="mt-1 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-[#0B2545] shadow-sm ring-1 ring-[#E3ECF6]">
                            {proj.projectTitle}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">Project description</p>
                          <p className="mt-1 whitespace-pre-line rounded-2xl bg-white px-4 py-4 text-sm leading-relaxed text-[#35597F] shadow-sm ring-1 ring-[#E3ECF6]">
                            {proj.projectDescription}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">Project tech stack</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {proj.technologies.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#E7F2FF] px-2.5 py-1 text-xs font-semibold text-[#1B4472] ring-1 ring-[#C9DBEE]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-[#E3ECF6] flex flex-col h-[700px] xl:h-auto xl:min-h-[700px]">
                    <div className="flex-1 bg-white rounded-2xl overflow-hidden ring-1 ring-[#E3ECF6] relative">
                      {activeDocument === "cv" && cvDataUrl && (
                        <iframe src={cvDataUrl} className="w-full h-full border-0 absolute inset-0" title="CV" />
                      )}
                      {activeDocument === "certifications" && certificationsDataUrl && (
                        <iframe src={certificationsDataUrl} className="w-full h-full border-0 absolute inset-0" title="Certifications" />
                      )}
                      {activeDocument === "additional" && additionalItemsDataUrl && (
                        <iframe src={additionalItemsDataUrl} className="w-full h-full border-0 absolute inset-0" title="Additional Items" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-[#E3ECF6]">
                      <button
                        type="button"
                        onClick={() => setActiveDocument("cv")}
                        className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${activeDocument === "cv" ? "bg-[#1B4472] text-white" : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"}`}
                      >
                        View CV
                      </button>
                      {certificationsDataUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveDocument("certifications")}
                          className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${activeDocument === "certifications" ? "bg-[#1B4472] text-white" : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"}`}
                        >
                          View Certifications
                        </button>
                      )}
                      {additionalItemsDataUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveDocument("additional")}
                          className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${activeDocument === "additional" ? "bg-[#1B4472] text-white" : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"}`}
                        >
                          View Additional Items
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Balanced two-column Step 1 (left) / Step 2 (right) layout, equal height on lg+ */
            <div className="grid gap-6 lg:grid-cols-2 items-stretch">

              {/* LEFT CONTAINER: FILE UPLOADS (STEP 1) */}
              <section className="relative overflow-hidden rounded-[28px] border border-[#1B4472]/15 bg-white/60 backdrop-blur-sm p-8 shadow-xl shadow-[#1B4472]/10 ring-1 ring-[#9bc6d9]/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between h-full">
                <div className="flex flex-col flex-1 space-y-6 overflow-y-auto max-h-[800px] pr-2">
                  <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1B4472]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1B4472]">
                    Step 1
                  </p>

                  {/* CV Upload */}
                  <div>
                    <h2 className="text-lg font-bold text-[#0B2545] flex items-center gap-2 mb-3">
                       <FileText className="h-4 w-4 text-[#1B4472]/70" /> Resume / CV
                    </h2>
                    <label className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md cursor-pointer">
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-semibold text-[#1B4472]">
                          {cvFileName ? "Resume ready to upload" : "Drag & Drop files here"}
                        </p>
                        <p className="text-xs text-[#6F8FB2]">PDF only (Max 5MB)</p>
                        {cvFileName ? (
                          <div className="mt-2 flex flex-col items-center gap-1 text-xs text-[#35597F] sm:flex-row sm:justify-center">
                            <span className="rounded-full bg-[#FFFFFF] px-2 py-1 font-medium shadow-sm truncate max-w-[150px]">{cvFileName}</span>
                            <span className="text-[#35597F] underline">Replace</span>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-4 py-1.5 text-xs font-bold text-white shadow transition-all duration-300 group-hover:from-[#16365C] group-hover:to-[#254A78] group-hover:shadow-md">Browse</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, "cv")} />
                    </label>
                  </div>

                  {/* Certifications Upload */}
                  <div>
                    <h2 className="text-lg font-bold text-[#0B2545] flex items-center gap-2 mb-3">
                       <FileText className="h-4 w-4 text-[#1B4472]/70" /> Certifications
                    </h2>
                    <label className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md cursor-pointer">
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-semibold text-[#1B4472]">
                          {certificationsFileName ? "Certifications ready" : "Drag & Drop files here"}
                        </p>
                        <p className="text-xs text-[#6F8FB2]">PDF, JPG, or PNG (Max 5MB)</p>
                        {certificationsFileName ? (
                          <div className="mt-2 flex flex-col items-center gap-1 text-xs text-[#35597F] sm:flex-row sm:justify-center">
                            <span className="rounded-full bg-[#FFFFFF] px-2 py-1 font-medium shadow-sm truncate max-w-[150px]">{certificationsFileName}</span>
                            <span className="text-[#35597F] underline">Replace</span>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-4 py-1.5 text-xs font-bold text-white shadow transition-all duration-300 group-hover:from-[#16365C] group-hover:to-[#254A78] group-hover:shadow-md">Browse</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, "cert")} />
                    </label>
                  </div>

                  {/* Additional Items Upload */}
                  <div>
                    <h2 className="text-lg font-bold text-[#0B2545] flex items-center gap-2 mb-3">
                       <FileText className="h-4 w-4 text-[#1B4472]/70" /> Additional Portfolio Items
                    </h2>
                    <label className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md cursor-pointer">
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-semibold text-[#1B4472]">
                          {additionalItemsFileName ? "Items ready" : "Drag & Drop files here"}
                        </p>
                        <p className="text-xs text-[#6F8FB2]">PDF, JPG, or PNG (Max 5MB)</p>
                        {additionalItemsFileName ? (
                          <div className="mt-2 flex flex-col items-center gap-1 text-xs text-[#35597F] sm:flex-row sm:justify-center">
                            <span className="rounded-full bg-[#FFFFFF] px-2 py-1 font-medium shadow-sm truncate max-w-[150px]">{additionalItemsFileName}</span>
                            <span className="text-[#35597F] underline">Replace</span>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-4 py-1.5 text-xs font-bold text-white shadow transition-all duration-300 group-hover:from-[#16365C] group-hover:to-[#254A78] group-hover:shadow-md">Browse</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, "add")} />
                    </label>
                  </div>

                </div>

                <p className="text-xs text-[#3E6088] mt-4 pt-2 border-t border-[#1B4472]/10">
                  * Upload your distinct portfolio files before saving.
                </p>
              </section>

              {/* RIGHT CONTAINER: PROJECT DETAILS & TECH SELECTION (STEP 2) */}
              <section className="relative overflow-hidden rounded-[28px] border border-[#1B4472]/15 bg-white/60 backdrop-blur-sm p-8 shadow-xl shadow-[#1B4472]/10 ring-1 ring-[#9bc6d9]/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1B4472]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1B4472]">
                        Step 2
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-[#0B2545]">
                        Project & Technology Selection
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMoreProjects}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4472] hover:underline bg-[#D4E9FC] px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-[#C3DDF5] hover:shadow-sm hover:-translate-y-0.5"
                    >
                      <Plus className="h-3 w-3" /> Add More Projects
                    </button>
                  </div>

                  {projects.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-[#C5D8EE] bg-[#EEF5FC] p-4 space-y-2">
                      <p className="text-xs font-bold text-[#35597F] uppercase tracking-wide">Projects Queue list:</p>
                      <div className="flex flex-wrap gap-2">
                        {projects.map((p, idx) => (
                          <div key={p._id || p.id || idx} className="flex items-center gap-2 rounded-full border border-[#C5D8EE] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#1B4472] shadow-sm transition-all duration-300 hover:shadow-md">
                            <span className="font-semibold">#{idx+1} {p.projectTitle}</span>
                            <button
                              type="button"
                              onClick={() => removeProjectFromList(p._id || p.id || "")}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-4 border-b border-[#1B4472]/10 pb-6">
                    <label className="block">
                      <span className="text-sm font-semibold text-[#3E6088]">Project title</span>
                      <input
                        value={projectTitle}
                        onChange={(event) => setProjectTitle(event.target.value)}
                        placeholder="Enter your capstone or system project name"
                        className="mt-2 w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-[#3E6088]">Project description</span>
                      <textarea
                        value={projectDescription}
                        onChange={(event) => setProjectDescription(event.target.value)}
                        placeholder="Describe your project features, architecture, and outcomes"
                        rows={3}
                        className="mt-2 w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />
                    </label>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-[#3E6088]">
                        Search or add a technology used in this project
                      </label>
                      <span className="rounded-full bg-[#EEF5FC] px-2.5 py-0.5 text-xs font-semibold text-[#1B4472]">
                        {selectedTech.length} selected
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        value={techQuery}
                        onChange={(event) => setTechQuery(event.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="Type to search, then press Enter to add custom tags"
                        className="w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />

                      {techQuery.trim() !== "" && filteredTechnologies.length > 0 ? (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-3xl border border-[#C5D8EE] bg-[#FFFFFF] p-2 shadow-xl">
                          {filteredTechnologies.slice(0, 6).map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => addTechnology(tech)}
                              className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#1B4472] transition-all duration-200 hover:bg-[#EEF5FC]"
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#3E6088]">Selected Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTech.length === 0 ? (
                          <span className="text-xs text-[#6F8FB2] italic">
                            No technologies selected yet.
                          </span>
                        ) : (
                          selectedTech.map((tech) => (
                            <span
                              key={tech}
                              className="flex items-center gap-1.5 rounded-full border border-[#AFCDED] bg-[#E7F2FF] px-2.5 py-1 text-xs font-medium text-[#1B4472]"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTechnology(tech)}
                                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FFFFFF] text-[#1B4472] transition-all duration-300 hover:bg-[#DCEBFA]"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {validationError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {validationError}
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleAddMoreProjects}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C5D8EE] bg-[#FFFFFF] px-5 py-3 text-sm font-semibold text-[#1B4472] transition hover:bg-[#EEF5FC] hover:border-[#75AAEF] hover:shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project to List
                    </button>
                    <button
                      type="button"
                      onClick={submitPortfolio}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-6 py-3 text-white font-semibold shadow-md transition-all duration-300 hover:from-[#16365C] hover:to-[#254A78] hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                      Save and compile portfolio
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
