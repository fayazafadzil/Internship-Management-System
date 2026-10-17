"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, FileText, Plus, Trash2, X } from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { PortfolioFile } from "@/lib/types";

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
  "CSS",
  "CSS3",
  "Sass",
  "Less",
  "React",
  "React.js",
  "React Native",
  "Next.js",
  "Nuxt.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "SvelteKit",
  "SolidJS",
  "Astro",
  "JavaScript",
  "TypeScript",
  "CoffeeScript",
  "WebAssembly",
  "PHP",
  "Ruby",
  "Rust",
  "Go",
  "C",
  "C++",
  "C#",
  "Dart",
  "Kotlin",
  "Swift",
  "Objective-C",
  "R",
  "MATLAB",
  "Scala",
  "Perl",
  "Lua",
  "Haskell",
  "Elixir",
  "Erlang",
  "Julia",
  "Solidity",
  "Node.js",
  "Deno",
  "Bun",
  "Express",
  "NestJS",
  "Fastify",
  "Spring Boot",
  "Spring",
  "ASP.NET",
  ".NET",
  "Laravel",
  "Symfony",
  "Django",
  "Flask",
  "FastAPI",
  "Ruby on Rails",
  "Phoenix",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "Chakra UI",
  "Ant Design",
  "Radix UI",
  "Shadcn/ui",
  "Storybook",
  "jQuery",
  "Redux",
  "Redux Toolkit",
  "Zustand",
  "MobX",
  "GraphQL",
  "Apollo",
  "tRPC",
  "REST API",
  "WebSockets",
  "Vite",
  "Webpack",
  "Rollup",
  "ESLint",
  "Prettier",
  "MongoDB",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "Supabase",
  "MariaDB",
  "SQLite",
  "Oracle Database",
  "Microsoft SQL Server",
  "Neo4j",
  "Elasticsearch",
  "CouchDB",
  "Prisma",
  "Sequelize",
  "Mongoose",
  "Hibernate",
  "Amazon EC2",
  "Amazon S3",
  "Amazon RDS",
  "AWS Lambda",
  "Microsoft Azure",
  "Azure Functions",
  "Google Cloud",
  "Google Cloud Run",
  "DigitalOcean",
  "Vercel",
  "Netlify",
  "Heroku",
  "Docker Compose",
  "Helm",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI/CD",
  "CircleCI",
  "Prometheus",
  "Grafana",
  "Nginx",
  "Apache",
  "PostgreSQL",
  "MySQL",
  "Git",
  "Kubernetes",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Jest",
  "Mocha",
  "Chai",
  "Cypress",
  "Playwright",
  "Selenium",
  "Vitest",
  "Pytest",
  "JUnit",
  "TestNG",
  "Postman",
  "Figma",
  "AWS",
  "Linux",
  "Adobe XD",
  "Sketch",
  "FigJam",
  "Framer",
  "Flutter",
  "Ionic",
  "Xamarin",
  "Android SDK",
  "iOS SDK",
  "SwiftUI",
  "Jetpack Compose",
  "Python",
  "NumPy",
  "Pandas",
  "SciPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "scikit-learn",
  "OpenCV",
  "Hugging Face",
  "LangChain",
  "OpenAI API",
  "Apache Spark",
  "Apache Kafka",
  "Databricks",
  "Snowflake",
  "Power BI",
  "Tableau",
  "RStudio",
  "Java",
];

function getPortfolioStorageKey(userEmail: string) {
  return `${STORAGE_PREFIX}.${userEmail}`;
}

function getProjectId(project: ProjectItem, index: number) {
  return String(project._id || project.id || `project-${index}`);
}

export default function PortfolioPage() {
  const { user, ready, profile, setProfile } = useAuth();
  useAuthGuard("student", "/student/login");

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [techQuery, setTechQuery] = useState("");

  /*
  =========================================================
    CV
  =========================================================
  */

  const [cvFileName, setCvFileName] = useState("");
  const [cvMimeType, setCvMimeType] = useState("");
  const [cvDataUrl, setCvDataUrl] = useState("");

  /*
  =========================================================
    CERTIFICATION
    ONE FILE ONLY
  =========================================================
  */

  const [certificationsFileName, setCertificationsFileName] =
    useState("");
  const [certificationsMimeType, setCertificationsMimeType] =
    useState("");
  const [certificationsDataUrl, setCertificationsDataUrl] =
    useState("");

  /*
  =========================================================
    ADDITIONAL PORTFOLIO ITEM
    ONE FILE ONLY
  =========================================================
  */

  const [additionalItemsFileName, setAdditionalItemsFileName] =
    useState("");
  const [additionalItemsMimeType, setAdditionalItemsMimeType] =
    useState("");
  const [additionalItemsDataUrl, setAdditionalItemsDataUrl] =
    useState("");

  /*
   * Kept as an array internally for compatibility with the
   * existing PortfolioFile type and old saved data.
   * Only ONE item is allowed.
   */

  const [additionalPortfolioItems, setAdditionalPortfolioItems] =
    useState<PortfolioFile[]>([]);

  const [savedPortfolio, setSavedPortfolio] = useState<any | null>(
    null,
  );

  const [toastMessage, setToastMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<
    string | null
  >(null);

  const [activeDocument, setActiveDocument] = useState<
    "cv" | "certification" | "additional"
  >("cv");

  /*
  =========================================================
    LOAD SAVED PORTFOLIO
  =========================================================
  */

  useEffect(() => {
    if (!ready || !user || user.role !== "student" || !profile) {
      return;
    }

    if (profile.cvDataUrl) {
      /*
       * CERTIFICATION
       *
       * New structure:
       * certificationsFileName
       * certificationsMimeType
       * certificationsDataUrl
       *
       * Old array data is intentionally ignored because
       * certification is now ONE file only.
       */

      const savedAdditionalItems: PortfolioFile[] =
        Array.isArray(profile.additionalPortfolioItems) &&
        profile.additionalPortfolioItems.length > 0
          ? [profile.additionalPortfolioItems[0]]
          : profile.additionalItemsDataUrl
            ? [
                {
                  id: "legacy-additional-item",
                  name:
                    profile.additionalItemsFileName ||
                    "Portfolio item",
                  mimeType:
                    profile.additionalItemsMimeType || "",
                  url: profile.additionalItemsDataUrl,
                },
              ]
            : [];

      const savedProfile = {
        ...profile,
        certifications: [],
        additionalPortfolioItems: savedAdditionalItems,
      };

      setSavedPortfolio(savedProfile);

      /* CV */

      setCvFileName(profile.cvFileName || "");
      setCvMimeType(profile.cvMimeType || "");
      setCvDataUrl(profile.cvDataUrl || "");

      /* ONE CERTIFICATION */

      setCertificationsFileName(
        profile.certificationsFileName || "",
      );

      setCertificationsMimeType(
        profile.certificationsMimeType || "",
      );

      setCertificationsDataUrl(
        profile.certificationsDataUrl || "",
      );

      /* ONE ADDITIONAL ITEM */

      if (savedAdditionalItems.length > 0) {
        const item = savedAdditionalItems[0];

        setAdditionalItemsFileName(item.name || "");
        setAdditionalItemsMimeType(item.mimeType || "");
        setAdditionalItemsDataUrl(item.url || "");
      } else {
        setAdditionalItemsFileName("");
        setAdditionalItemsMimeType("");
        setAdditionalItemsDataUrl("");
      }

      setAdditionalPortfolioItems(savedAdditionalItems);
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

      setAdditionalPortfolioItems([]);
    }
  }, [ready, user, profile]);

  /*
  =========================================================
    TECHNOLOGY SEARCH
  =========================================================
  */

  const filteredTechnologies = useMemo(() => {
    const normalized = techQuery.trim().toLowerCase();

    if (!normalized) return [];

    return TECHNOLOGIES.filter(
      (tech) =>
        tech.toLowerCase().includes(normalized) &&
        !selectedTech.some(
          (selected) =>
            selected.toLowerCase() === tech.toLowerCase(),
        ),
    );
  }, [techQuery, selectedTech]);

  /*
  =========================================================
    FILE HANDLER
    CV + ADDITIONAL ITEM
  =========================================================
  */

  const handleFileChange = async (
    file: File | null,
    category: "cv" | "add",
  ) => {
    if (!file) return;

    if (category === "cv") {
      if (file.type !== "application/pdf") {
        setValidationError("CV must be a PDF file.");
        return;
      }
    } else {
      const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowed.includes(file.type)) {
        setValidationError(
          "Please choose a PDF, JPG, or PNG file.",
        );
        return;
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError(
        "The file must be 5MB or smaller.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") return;

      /*
      =====================================================
        CV
      =====================================================
      */

      if (category === "cv") {
        setCvDataUrl(result);
        setCvFileName(file.name);
        setCvMimeType(file.type);
        setValidationError("");

        setToastMessage(
          "CV uploaded successfully.",
        );

        window.setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }

      /*
      =====================================================
        ADDITIONAL ITEM
        ONE FILE ONLY
      =====================================================
      */

      if (category === "add") {
        const newItem: PortfolioFile = {
          id: "additional-portfolio-item",
          name: file.name,
          mimeType: file.type,
          url: result,
        };

        /*
         * Replace the existing item instead of adding
         * another item.
         */

        setAdditionalPortfolioItems([newItem]);
        setAdditionalItemsFileName(file.name);
        setAdditionalItemsMimeType(file.type);
        setAdditionalItemsDataUrl(result);
        setValidationError("");

        setToastMessage(
          "Additional portfolio item uploaded successfully.",
        );

        window.setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }
    };

    reader.readAsDataURL(file);
  };

  /*
  =========================================================
    CERTIFICATION HANDLER
    ONE FILE ONLY
  =========================================================
  */

  const handleCertificationChange = (
    file: File | null,
  ) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setValidationError(
        "Certification must be a PDF, JPG, or PNG file.",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError(
        "The certification file must be 5MB or smaller.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      /*
       * ONE certification only.
       * Selecting a new file replaces the previous one.
       */

      setCertificationsFileName(file.name);
      setCertificationsMimeType(file.type);
      setCertificationsDataUrl(reader.result);
      setValidationError("");

      setToastMessage(
        "Certification uploaded successfully.",
      );

      window.setTimeout(() => {
        setToastMessage("");
      }, 3000);
    };

    reader.readAsDataURL(file);
  };

  /*
  =========================================================
    PROJECTS
  =========================================================
  */

  const handleAddMoreProjects = () => {
    if (
      !projectTitle.trim() ||
      !projectDescription.trim()
    ) {
      setValidationError(
        "Please complete the current project title and description first.",
      );
      return;
    }

    if (selectedTech.length === 0) {
      setValidationError(
        "Please add at least one technology for the current project.",
      );
      return;
    }

    const projectDetails = {
      projectTitle: projectTitle.trim(),
      projectDescription: projectDescription.trim(),
      technologies: selectedTech,
    };

    if (editingProjectId) {
      setProjects((prev) =>
        prev.map((project, index) =>
          getProjectId(project, index) === editingProjectId
            ? {
                ...project,
                ...projectDetails,
              }
            : project,
        ),
      );

      setEditingProjectId(null);

      setToastMessage(
        "Project changes added to the portfolio.",
      );
    } else {
      setProjects((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...projectDetails,
        },
      ]);

      setToastMessage(
        "Project added to list! You can add more or click save below.",
      );
    }

    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setTechQuery("");
    setValidationError("");

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const removeProjectFromList = (id: string) => {
    setProjects((prev) =>
      prev.filter(
        (project) =>
          (project._id || project.id) !== id,
      ),
    );
  };

  /*
  =========================================================
    SAVE PORTFOLIO
  =========================================================
  */

  const submitPortfolio = () => {
    let finalProjects = [...projects];

    if (
      projectTitle.trim() ||
      projectDescription.trim() ||
      selectedTech.length > 0
    ) {
      if (
        !projectTitle.trim() ||
        !projectDescription.trim() ||
        selectedTech.length === 0
      ) {
        setValidationError(
          "Please either complete or clear the ongoing project details before saving.",
        );
        return;
      }

      const projectDetails = {
        projectTitle: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        technologies: selectedTech,
      };

      if (editingProjectId) {
        const matchingProjectIndex =
          finalProjects.findIndex(
            (project, index) =>
              getProjectId(project, index) ===
              editingProjectId,
          );

        if (matchingProjectIndex === -1) {
          setValidationError(
            "The project being edited could not be found. Please reload and try again.",
          );
          return;
        }

        finalProjects = finalProjects.map(
          (project, index) =>
            index === matchingProjectIndex
              ? {
                  ...project,
                  ...projectDetails,
                }
              : project,
        );
      } else {
        finalProjects.push({
          id: Date.now().toString(),
          ...projectDetails,
        });
      }
    }

    if (!cvDataUrl) {
      setValidationError(
        "Please upload your CV/Resume first.",
      );
      return;
    }

    if (finalProjects.length === 0) {
      setValidationError(
        "Please add at least one project before saving.",
      );
      return;
    }

    if (
      !user ||
      user.role !== "student" ||
      !profile
    ) {
      return;
    }

    /*
     * ONE CERTIFICATION
     *
     * certifications array is intentionally empty.
     * The actual certification is stored in:
     *
     * certificationsFileName
     * certificationsMimeType
     * certificationsDataUrl
     */

    /*
     * ONE ADDITIONAL ITEM
     */

    const singleAdditionalItem =
      additionalPortfolioItems.length > 0
        ? [additionalPortfolioItems[0]]
        : [];

    const updatedProfile = {
      ...profile,

      projects: finalProjects,

      /* CV */

      cvFileName,
      cvMimeType,
      cvDataUrl,

      /* ONE CERTIFICATION */

      certifications: [],
      certificationsFileName,
      certificationsMimeType,
      certificationsDataUrl,

      /* ONE ADDITIONAL ITEM */

      additionalPortfolioItems:
        singleAdditionalItem,

      additionalItemsFileName:
        additionalItemsFileName ||
        singleAdditionalItem[0]?.name ||
        "",

      additionalItemsMimeType:
        additionalItemsMimeType ||
        singleAdditionalItem[0]?.mimeType ||
        "",

      additionalItemsDataUrl:
        additionalItemsDataUrl ||
        singleAdditionalItem[0]?.url ||
        "",
    };

    setProfile(updatedProfile);
    setSavedPortfolio(updatedProfile);
    setProjects(finalProjects);
    setAdditionalPortfolioItems(
      singleAdditionalItem,
    );

    setIsEditing(false);
    setEditingProjectId(null);
    setActiveDocument("cv");
    setValidationError("");

    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setTechQuery("");

    setToastMessage(
      "Portfolio saved successfully.",
    );

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  /*
  =========================================================
    EDIT PORTFOLIO
  =========================================================
  */

  const startEditing = () => {
    if (!savedPortfolio) return;

    setIsEditing(true);
    setProjects(savedPortfolio.projects || []);

    /*
     * ONE CERTIFICATION
     */

    setCertificationsFileName(
      savedPortfolio.certificationsFileName || "",
    );

    setCertificationsMimeType(
      savedPortfolio.certificationsMimeType || "",
    );

    setCertificationsDataUrl(
      savedPortfolio.certificationsDataUrl || "",
    );

    /*
     * ONE ADDITIONAL ITEM
     */

    const savedAdditionalItems =
      Array.isArray(
        savedPortfolio.additionalPortfolioItems,
      ) &&
      savedPortfolio.additionalPortfolioItems.length > 0
        ? [savedPortfolio.additionalPortfolioItems[0]]
        : [];

    setAdditionalPortfolioItems(
      savedAdditionalItems,
    );

    if (savedAdditionalItems.length > 0) {
      const item = savedAdditionalItems[0];

      setAdditionalItemsFileName(
        item.name || "",
      );

      setAdditionalItemsMimeType(
        item.mimeType || "",
      );

      setAdditionalItemsDataUrl(
        item.url || "",
      );
    } else {
      setAdditionalItemsFileName("");
      setAdditionalItemsMimeType("");
      setAdditionalItemsDataUrl("");
    }

    setEditingProjectId(null);

    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setTechQuery("");
    setValidationError("");
  };

  const startProjectEditing = (
    project: ProjectItem,
    index: number,
  ) => {
    const projectId = getProjectId(
      project,
      index,
    );

    setIsEditing(true);
    setEditingProjectId(projectId);

    setProjects(
      savedPortfolio?.projects || [],
    );

    /*
     * ONE CERTIFICATION
     */

    setCertificationsFileName(
      savedPortfolio?.certificationsFileName ||
        "",
    );

    setCertificationsMimeType(
      savedPortfolio?.certificationsMimeType ||
        "",
    );

    setCertificationsDataUrl(
      savedPortfolio?.certificationsDataUrl ||
        "",
    );

    /*
     * ONE ADDITIONAL ITEM
     */

    const savedAdditionalItems =
      Array.isArray(
        savedPortfolio?.additionalPortfolioItems,
      ) &&
      savedPortfolio.additionalPortfolioItems
        .length > 0
        ? [
            savedPortfolio
              .additionalPortfolioItems[0],
          ]
        : [];

    setAdditionalPortfolioItems(
      savedAdditionalItems,
    );

    if (savedAdditionalItems.length > 0) {
      const item = savedAdditionalItems[0];

      setAdditionalItemsFileName(
        item.name || "",
      );

      setAdditionalItemsMimeType(
        item.mimeType || "",
      );

      setAdditionalItemsDataUrl(
        item.url || "",
      );
    }

    setProjectTitle(
      project.projectTitle || "",
    );

    setProjectDescription(
      project.projectDescription || "",
    );

    setSelectedTech(
      project.technologies || [],
    );

    setTechQuery("");
    setValidationError("");
  };

  /*
  =========================================================
    RESET PORTFOLIO
  =========================================================
  */

  const resetPortfolio = () => {
    if (
      !user ||
      user.role !== "student" ||
      !profile
    ) {
      return;
    }

    const updatedProfile = {
      ...profile,

      projects: [],

      cvFileName: "",
      cvMimeType: "",
      cvDataUrl: "",

      certifications: [],
      certificationsFileName: "",
      certificationsMimeType: "",
      certificationsDataUrl: "",

      additionalItemsFileName: "",
      additionalItemsMimeType: "",
      additionalItemsDataUrl: "",

      additionalPortfolioItems: [],
    };

    setProfile(updatedProfile);
    setSavedPortfolio(null);
    setProjects([]);

    setProjectTitle("");
    setProjectDescription("");
    setSelectedTech([]);
    setEditingProjectId(null);
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

    setAdditionalPortfolioItems([]);

    setIsEditing(false);
    setValidationError("");
    setToastMessage("");
  };

  /*
  =========================================================
    DELETE CERTIFICATION
  =========================================================
  */

  const deleteCertification = () => {
    setCertificationsFileName("");
    setCertificationsMimeType("");
    setCertificationsDataUrl("");

    setToastMessage(
      "Certification removed.",
    );

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  /*
  =========================================================
    DELETE ADDITIONAL ITEM
  =========================================================
  */

  const removeAdditionalPortfolioItem = () => {
    setAdditionalPortfolioItems([]);
    setAdditionalItemsFileName("");
    setAdditionalItemsMimeType("");
    setAdditionalItemsDataUrl("");

    setToastMessage(
      "Additional portfolio item removed.",
    );

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  /*
  =========================================================
    TECHNOLOGIES
  =========================================================
  */

  const addTechnology = (value: string) => {
    const normalized = value.trim();

    if (!normalized) return;

    if (
      selectedTech.some(
        (tech) =>
          tech.toLowerCase() ===
          normalized.toLowerCase(),
      )
    ) {
      return;
    }

    setSelectedTech((current) => [
      ...current,
      normalized,
    ]);

    setTechQuery("");
  };

  const removeTechnology = (tech: string) => {
    setSelectedTech((current) =>
      current.filter(
        (item) => item !== tech,
      ),
    );
  };

  const handleTechKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology(techQuery);
    }
  };

  /*
  =========================================================
    LOADING
  =========================================================
  */

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

          {/* PAGE HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-8">
              <h1 className="mt-1 text-3xl font-extrabold text-[#0B2545]">
                Portfolio
              </h1>

              <p className="mt-1 text-sm text-[#3E6088]">
                Build your student portfolio,
                upload a resume, and present your
                core technology stack in a single
                consistent interface.
              </p>
            </div>
          </div>

          {/* TOAST */}

          {toastMessage ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
              {toastMessage}
            </div>
          ) : null}

          {/* =====================================================
              SAVED PORTFOLIO VIEW
          ===================================================== */}

          {savedPortfolio && !isEditing ? (
            <div className="space-y-6">

              <div className="rounded-[28px] border border-[#1B4472]/15 bg-white/60 backdrop-blur-sm p-8 shadow-xl shadow-[#1B4472]/10 ring-1 ring-[#9bc6d9]/40">

                {/* ACTION BUTTONS */}

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
                      if (
                        window.confirm(
                          "Delete this portfolio and start again?",
                        )
                      ) {
                        resetPortfolio();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-rose-600 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>

                </div>

                {/* HEADER */}

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
                      Saved on{" "}
                      {savedPortfolio.savedAt
                        ? new Date(
                            savedPortfolio.savedAt,
                          ).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </span>

                  </div>

                </div>

                {/* PROJECTS + DOCUMENT VIEWER */}

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">

                  {/* PROJECTS */}

                  <div className="space-y-4">

                    {savedPortfolio.projects?.map(
                      (
                        proj: ProjectItem,
                        index: number,
                      ) => (

                        <div
                          key={
                            proj._id ||
                            proj.id ||
                            index
                          }
                          className="rounded-3xl border border-[#DCE8F5] bg-white/70 p-5 shadow-sm"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <p className="inline-block rounded-full bg-[#1B4472] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                              Project #{index + 1}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                startProjectEditing(
                                  proj,
                                  index,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1B4472] shadow-sm ring-1 ring-[#C9DBEE] transition-all duration-300 hover:bg-[#EEF5FC] hover:shadow-md"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>

                          </div>

                          <div className="mt-3">

                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">
                              Project title
                            </p>

                            <p className="mt-1 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-[#0B2545] shadow-sm ring-1 ring-[#E3ECF6]">
                              {proj.projectTitle}
                            </p>

                          </div>

                          <div className="mt-3">

                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">
                              Project description
                            </p>

                            <p className="mt-1 whitespace-pre-line rounded-2xl bg-white px-4 py-4 text-sm leading-relaxed text-[#35597F] shadow-sm ring-1 ring-[#E3ECF6]">
                              {proj.projectDescription}
                            </p>

                          </div>

                          <div className="mt-3">

                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5B7CA3]">
                              Project tech stack
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1.5">

                              {proj.technologies.map(
                                (technology) => (
                                  <span
                                    key={technology}
                                    className="rounded-full bg-[#E7F2FF] px-2.5 py-1 text-xs font-semibold text-[#1B4472] ring-1 ring-[#C9DBEE]"
                                  >
                                    {technology}
                                  </span>
                                ),
                              )}

                            </div>

                          </div>

                        </div>
                      ),
                    )}

                  </div>

                  {/* DOCUMENT VIEWER */}

                  <div className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-[#E3ECF6] flex flex-col h-[700px] xl:h-auto xl:min-h-[700px]">

                    <div className="flex-1 bg-white rounded-2xl overflow-hidden ring-1 ring-[#E3ECF6] relative">

                      {/* CV */}

                      {activeDocument === "cv" &&
                        cvDataUrl && (
                          <iframe
                            src={cvDataUrl}
                            className="w-full h-full border-0 absolute inset-0"
                            title="CV"
                          />
                        )}

                      {/* CERTIFICATION */}

                      {activeDocument === "certification" &&
                        certificationsDataUrl && (
                          <iframe
                            src={certificationsDataUrl}
                            className="w-full h-full border-0 absolute inset-0"
                            title="Certification"
                          />
                        )}

                      {/* ADDITIONAL ITEM */}

                      {activeDocument === "additional" &&
                        additionalItemsDataUrl && (
                          <iframe
                            src={additionalItemsDataUrl}
                            className="w-full h-full border-0 absolute inset-0"
                            title="Additional Portfolio Item"
                          />
                        )}

                    </div>

                    {/* VIEW BUTTONS */}

                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-[#E3ECF6]">

                      {/* VIEW CV */}

                      <button
                        type="button"
                        onClick={() =>
                          setActiveDocument("cv")
                        }
                        className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${
                          activeDocument === "cv"
                            ? "bg-[#1B4472] text-white"
                            : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"
                        }`}
                      >
                        View CV
                      </button>

                      {/* VIEW CERTIFICATION */}

                      {certificationsDataUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDocument(
                              "certification",
                            )
                          }
                          className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${
                            activeDocument ===
                            "certification"
                              ? "bg-[#1B4472] text-white"
                              : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"
                          }`}
                        >
                          View Certification
                        </button>
                      )}

                      {/* VIEW ADDITIONAL ITEM */}

                      {additionalItemsDataUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDocument(
                              "additional",
                            )
                          }
                          className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md ${
                            activeDocument ===
                            "additional"
                              ? "bg-[#1B4472] text-white"
                              : "bg-white text-[#1B4472] ring-1 ring-[#C9DBEE] hover:bg-[#EEF5FC]"
                          }`}
                        >
                          View Additional Item
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            /*
            =====================================================
              EDIT / CREATE PORTFOLIO
            =====================================================
            */

            <div className="grid gap-6 lg:grid-cols-2 items-stretch">

              {/* =================================================
                  LEFT - FILE UPLOADS
              ================================================= */}

              <section className="relative overflow-hidden rounded-[28px] border border-[#1B4472]/15 bg-white/60 backdrop-blur-sm p-8 shadow-xl shadow-[#1B4472]/10 ring-1 ring-[#9bc6d9]/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between h-full">

                <div className="flex flex-col flex-1 space-y-6 overflow-y-auto max-h-[800px] pr-2">

                  <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1B4472]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1B4472]">
                    Step 1
                  </p>

                  {/* =================================================
                      CV UPLOAD
                  ================================================= */}

                  <div>

                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#0B2545]">
                      <FileText className="h-4 w-4 text-[#1B4472]/70" />
                      Resume / CV
                    </h2>

                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md">

                      <p className="text-sm font-semibold text-[#1B4472]">
                        {cvFileName
                          ? "Resume selected"
                          : "Choose your CV"}
                      </p>

                      <p className="mt-1 text-xs text-[#6F8FB2]">
                        PDF only (Max 5MB)
                      </p>

                      {cvFileName ? (
                        <div className="mt-3 flex items-center gap-2">

                          <span className="max-w-[220px] truncate rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#35597F] shadow-sm">
                            {cvFileName}
                          </span>

                          <span className="text-xs font-semibold text-[#1B4472]">
                            Replace
                          </span>

                        </div>
                      ) : (
                        <div className="mt-3">

                          <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-5 py-2 text-xs font-bold text-white shadow transition-all duration-300 group-hover:shadow-md">
                            Browse
                          </span>

                        </div>
                      )}

                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="sr-only"
                        onChange={(event) => {
                          handleFileChange(
                            event.target.files?.[0] ??
                              null,
                            "cv",
                          );

                          event.currentTarget.value =
                            "";
                        }}
                      />

                    </label>

                  </div>

                  {/* =================================================
                      CERTIFICATION UPLOAD
                  ================================================= */}

                  <div>

                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#0B2545]">
                      <FileText className="h-4 w-4 text-[#1B4472]/70" />
                      Certification
                    </h2>

                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md">

                      <p className="text-sm font-semibold text-[#1B4472]">
                        {certificationsFileName
                          ? "Certification selected"
                          : "Choose your certification"}
                      </p>

                      <p className="mt-1 text-xs text-[#6F8FB2]">
                        PDF, JPG, or PNG (Max 5MB)
                      </p>

                      {certificationsFileName ? (
                        <div className="mt-3 flex items-center gap-2">

                          <span className="max-w-[220px] truncate rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#35597F] shadow-sm">
                            {certificationsFileName}
                          </span>

                          <span className="text-xs font-semibold text-[#1B4472]">
                            Replace
                          </span>

                        </div>
                      ) : (
                        <div className="mt-3">

                          <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-5 py-2 text-xs font-bold text-white shadow transition-all duration-300 group-hover:shadow-md">
                            Browse
                          </span>

                        </div>
                      )}

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        className="sr-only"
                        onChange={(event) => {
                          handleCertificationChange(
                            event.target.files?.[0] ??
                              null,
                          );

                          event.currentTarget.value =
                            "";
                        }}
                      />

                    </label>

                  </div>

                  {/* =================================================
                      ADDITIONAL PORTFOLIO ITEM UPLOAD
                  ================================================= */}

                  <div>

                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#0B2545]">
                      <FileText className="h-4 w-4 text-[#1B4472]/70" />
                      Additional Portfolio Item
                    </h2>

                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#AFCDED] bg-[linear-gradient(135deg,#F8FBFE,#EEF5FC)] px-4 py-6 text-center transition-all duration-300 hover:border-[#75AAEF] hover:shadow-md">

                      <p className="text-sm font-semibold text-[#1B4472]">
                        {additionalItemsFileName
                          ? "Additional item selected"
                          : "Choose an additional item"}
                      </p>

                      <p className="mt-1 text-xs text-[#6F8FB2]">
                        PDF, JPG, or PNG (Max 5MB)
                      </p>

                      {additionalItemsFileName ? (
                        <div className="mt-3 flex items-center gap-2">

                          <span className="max-w-[220px] truncate rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#35597F] shadow-sm">
                            {additionalItemsFileName}
                          </span>

                          <span className="text-xs font-semibold text-[#1B4472]">
                            Replace
                          </span>

                        </div>
                      ) : (
                        <div className="mt-3">

                          <span className="inline-block rounded-lg bg-gradient-to-r from-[#1B4472] to-[#2F5F98] px-5 py-2 text-xs font-bold text-white shadow transition-all duration-300 group-hover:shadow-md">
                            Browse
                          </span>

                        </div>
                      )}

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        className="sr-only"
                        onChange={(event) => {
                          handleFileChange(
                            event.target.files?.[0] ??
                              null,
                            "add",
                          );

                          event.currentTarget.value =
                            "";
                        }}
                      />

                    </label>

                  </div>

                </div>

                <p className="mt-4 border-t border-[#1B4472]/10 pt-2 text-xs text-[#3E6088]">
                  * Upload your portfolio files before saving.
                </p>

              </section>

              {/* =================================================
                  RIGHT - PROJECTS
              ================================================= */}

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
                      onClick={
                        handleAddMoreProjects
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4472] hover:underline bg-[#D4E9FC] px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-[#C3DDF5] hover:shadow-sm hover:-translate-y-0.5"
                    >
                      <Plus className="h-3 w-3" />
                      Add More Projects
                    </button>

                  </div>

                  {/* PROJECT QUEUE */}

                  {projects.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-[#C5D8EE] bg-[#EEF5FC] p-4 space-y-2">

                      <p className="text-xs font-bold text-[#35597F] uppercase tracking-wide">
                        Projects Queue list:
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {projects.map(
                          (project, index) => (

                            <div
                              key={
                                project._id ||
                                project.id ||
                                index
                              }
                              className="flex items-center gap-2 rounded-full border border-[#C5D8EE] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#1B4472] shadow-sm transition-all duration-300 hover:shadow-md"
                            >

                              <span className="font-semibold">
                                #{index + 1}{" "}
                                {project.projectTitle}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeProjectFromList(
                                    project._id ||
                                      project.id ||
                                      "",
                                  )
                                }
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                ×
                              </button>

                            </div>

                          ),
                        )}

                      </div>

                    </div>
                  )}

                  {/* PROJECT DETAILS */}

                  <div className="mt-4 space-y-4 border-b border-[#1B4472]/10 pb-6">

                    <label className="block">

                      <span className="text-sm font-semibold text-[#3E6088]">
                        Project title
                      </span>

                      <input
                        value={projectTitle}
                        onChange={(event) =>
                          setProjectTitle(
                            event.target.value,
                          )
                        }
                        placeholder="Enter your capstone or system project name"
                        className="mt-2 w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />

                    </label>

                    <label className="block">

                      <span className="text-sm font-semibold text-[#3E6088]">
                        Project description
                      </span>

                      <textarea
                        value={projectDescription}
                        onChange={(event) =>
                          setProjectDescription(
                            event.target.value,
                          )
                        }
                        placeholder="Describe your project features, architecture, and outcomes"
                        rows={3}
                        className="mt-2 w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />

                    </label>

                  </div>

                  {/* TECHNOLOGY */}

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
                        onChange={(event) =>
                          setTechQuery(
                            event.target.value,
                          )
                        }
                        onKeyDown={
                          handleTechKeyDown
                        }
                        placeholder="Type to search, then press Enter to add custom tags"
                        className="w-full rounded-3xl border border-[#C9DBEE] bg-[#FFFFFF] px-4 py-3 text-sm text-[#35597F] placeholder:text-[#94AFCB] outline-none transition-all duration-300 focus:border-[#75AAEF] focus:ring-2 focus:ring-[#75AAEF]/20"
                      />

                      {techQuery.trim() !== "" &&
                      filteredTechnologies.length >
                        0 ? (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-3xl border border-[#C5D8EE] bg-[#FFFFFF] p-2 shadow-xl">

                          {filteredTechnologies.map(
                            (technology) => (
                              <button
                                key={technology}
                                type="button"
                                onClick={() =>
                                  addTechnology(
                                    technology,
                                  )
                                }
                                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#1B4472] transition-all duration-200 hover:bg-[#EEF5FC]"
                              >
                                {technology}
                              </button>
                            ),
                          )}

                        </div>
                      ) : null}

                    </div>

                    <div className="space-y-2">

                      <p className="text-xs font-semibold text-[#3E6088]">
                        Selected Stack:
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {selectedTech.length === 0 ? (
                          <span className="text-xs text-[#6F8FB2] italic">
                            No technologies selected yet.
                          </span>
                        ) : (
                          selectedTech.map(
                            (technology) => (

                              <span
                                key={technology}
                                className="flex items-center gap-1.5 rounded-full border border-[#AFCDED] bg-[#E7F2FF] px-2.5 py-1 text-xs font-medium text-[#1B4472]"
                              >

                                {technology}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTechnology(
                                      technology,
                                    )
                                  }
                                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FFFFFF] text-[#1B4472] transition-all duration-300 hover:bg-[#DCEBFA]"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>

                              </span>

                            ),
                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>

                {/* BOTTOM BUTTONS */}

                <div className="space-y-4 pt-4">

                  {validationError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {validationError}
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-2 justify-end">

                    <button
                      type="button"
                      onClick={
                        handleAddMoreProjects
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C5D8EE] bg-[#FFFFFF] px-5 py-3 text-sm font-semibold text-[#1B4472] transition hover:bg-[#EEF5FC] hover:border-[#75AAEF] hover:shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project to List
                    </button>

                    <button
                      type="button"
                      onClick={
                        submitPortfolio
                      }
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