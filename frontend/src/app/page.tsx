
import {
  GraduationCap,
  Building2,
  TrendingUp,
  BookOpen,
  FileText,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LandingNav } from "@/components/layout/LandingNav";
import { Footer } from "@/components/layout/Footer";
import { LinkButton } from "@/components/ui/Button";

const features = [
  {
    icon: ShieldCheck,
    title: "Department Verification & Approval",
    body: "Verify student registrations, approve accounts, and manage internship-related approvals through a secure department portal.",
    bgColor: "bg-[#1B3F68]/90 hover:bg-[#16385F]",
  },
  {
    icon: TrendingUp,
    title: "Academic Performance",
    body: "Monitor your academic performance by viewing your GPA, semester results, and overall academic progress in one place.",
    bgColor: "bg-[#1B3F68]/90 hover:bg-[#16385F]",
  },
  {
    icon: BookOpen,
    title: "Digital Record Book",
    body: "Track internship progress with real-time digital logs and organized activity records.",
    bgColor: "bg-[#1B3F68]/90 hover:bg-[#16385F]",
  },
  {
    icon: FileText,
    title: "Efficient Reporting",
    body: "Generate insightful evaluation reports to track student performance and internship progress efficiently.",
    bgColor: "bg-[#1B3F68]/90 hover:bg-[#16385F]",
  },
];

export default function Home() {
  return (
    <>
      <LandingNav />

      {/* Hero */}
      <section
        id="overview"
        className="text-white relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,21,40,0.25), rgba(11,21,40,0.82)), url('/intern.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
       <div className="mx-auto max-w-6xl px-6 py-28 text-center relative z-10">
          {/* Top Badge with Department Name */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-blue-950/60 border border-sky-500/30 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300 mb-8 backdrop-blur-md shadow-lg">
            <ShieldCheck className="h-4 w-4 text-sky-400" />
            Department of Computer Science • University of Ruhuna
          </div>

          <h1 className="text-4xl font-black tracking-normal text-[#EDF4FC] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] leading-[1.18] sm:text-5xl md:text-6xl max-w-4xl mx-auto">
            Internship Management System
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base text-slate-200 sm:text-lg sm:leading-relaxed font-semibold tracking-wide">
            A centralized platform for managing internship activities, academic performance, digital record books, and departmental workflows
          </p>

          <div className="mx-auto mt-16 grid max-w-3xl gap-8 md:grid-cols-2">
            <PortalCard
              icon={<GraduationCap className="h-8 w-8 text-sky-100" />}
              title="Student Portal"
              body="Access your academic profile, log daily internship progress, and track performance seamlessly."
              cta="Get Started"
              href="/student/auth"
              iconBgColor="bg-sky-500/30 border border-sky-200/40"
              cardBg="bg-[#3b5982]/60 backdrop-blur-xl border border-sky-100/30 hover:border-sky-300/80 hover:bg-[#436593]/75"
              buttonVariant="primary"
              buttonClassName="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 font-semibold py-3 transition-all shadow-lg shadow-blue-950/50 tracking-wide"
            />

            <PortalCard
              icon={<Building2 className="h-8 w-8 text-white" />}
              title="Department Portal"
              body="Manage student placements, verify registrations, track GPAs, and oversee program evaluations."
              cta="Login"
              href="/department/auth"
              iconBgColor="bg-slate-400/30 border border-slate-200/30"
              cardBg="bg-[#406392]/60 backdrop-blur-xl border border-sky-100/25 hover:border-sky-300/80 hover:bg-[#4a70a3]/75"
              buttonVariant="dark"
              buttonClassName="bg-[#0D1B2A] text-white hover:bg-[#14283E] font-semibold py-3 transition-all border border-sky-300/30 shadow-md tracking-wide"
            />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#A7BFDB] border-y border-[#8AA3C2] shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-sm text-[#0B1A33] font-semibold tracking-wide">
          <span className="font-extrabold text-xs uppercase tracking-widest text-[#1B4472]">OFFICIAL PORTAL</span>

          <span className="flex items-center gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-[#1B4472]" />
            Department of Computer Science
          </span>

          <span className="hidden text-[#1B4472]/30 sm:inline">|</span>

          <span className="flex items-center gap-2.5">
            University of Ruhuna
          </span>

          <span className="hidden text-[#1B4472]/30 sm:inline">|</span>

          <span className="flex items-center gap-2.5">
            <Lock className="h-4.5 w-4.5 text-[#1B4472]" />
            Secure & Encrypted Portal
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#415F88] border-b border-[#18283B]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-extrabold text-white tracking-normal sm:text-4xl">
            Centralized Internship Process
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-[#D2E0F3] text-sm sm:text-base font-light leading-relaxed tracking-wide">
            Connecting students and departments through an integrated platform for efficient academic and internship management
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body, bgColor }) => (
              <div
                key={title}
                className={`group rounded-2xl border border-white/10 ${bgColor} p-7 shadow-xl transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:border-sky-300/40 flex flex-col justify-between`}
              >
                <div>
                  <div className="p-3 rounded-xl bg-sky-400/15 border border-sky-300/30 w-fit shadow-inner">
                    <Icon className="h-6 w-6 text-sky-300 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 font-bold text-white text-base tracking-snug leading-snug">
                    {title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#CBDCEF] font-normal tracking-wide">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gateway */}
      <section className="bg-[#2B466A] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-950/60 border border-sky-800/50 px-3 py-1 rounded-md">
              Streamlined Workflow
            </span>
            
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight tracking-normal">
              Your gateway to professional excellence
            </h2>

            <p className="leading-relaxed text-slate-300 text-sm sm:text-base font-light tracking-wide">
              Empowering the Department of Computer Science to manage internship programs efficiently through a centralized platform. The system simplifies student verification, account management, academic performance tracking, internship approvals, and digital record book management.
            </p>

            <div className="pt-2">
              <LinkButton 
                href="/student/auth" 
                className="bg-[#1B4472] text-white hover:bg-[#16385F] font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all inline-flex items-center gap-2.5 border border-sky-300 hover:border-sky-300 tracking-wide"
              >
                Get Started
              </LinkButton>
            </div>
          </div>

          {/* Smooth Zoom Image Container */}
          <div className="group flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
            <img
              src="/login.jpeg"
              alt="Analytics"
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function PortalCard({
  icon,
  title,
  body,
  cta,
  href,
  iconBgColor,
  cardBg,
  buttonVariant,
  buttonClassName,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href: string;
  iconBgColor: string;
  cardBg: string;
  buttonVariant: "primary" | "dark";
  buttonClassName?: string;
}) {
  return (
    <div className={`group flex flex-col rounded-2xl ${cardBg} p-9 text-left transition-all duration-300 ease-out hover:-translate-y-2 shadow-2xl hover:shadow-sky-500/10`}>
      <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${iconBgColor} shadow-inner transition-transform duration-300 group-hover:scale-105`}>
        {icon}
      </div>

      <h3 className="text-center text-2xl font-bold text-white tracking-wide">
        {title}
      </h3>

      <p className="mt-4 text-center text-sm leading-relaxed text-slate-200/90 font-light tracking-wide flex-1">
        {body}
      </p>

      <LinkButton
        href={href}
        variant={buttonVariant}
        className={`mt-8 w-full rounded-xl ${buttonClassName ?? ""}`}
      >
        {cta}
      </LinkButton>
    </div>
  );
}


