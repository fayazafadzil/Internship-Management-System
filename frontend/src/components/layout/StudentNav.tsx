"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

interface StudentNotification {
  _id: string;
  message: string;
  readAt: string | null;
  navigationPath: string;
}

const links = [
  { label: "Overview", href: "/student/dashboard" },
  { label: "Academic Performance", href: "/student/academic-performance" },
  { label: "Portfolio", href: "/student/portfolio" },
  { label: "Internship Status", href: "/student/internship-status" },
  { label: "Record Book", href: "/student/record-book" },
];

export function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout, profile } = useAuth();

  const [hasRejection, setHasRejection] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (ready && user?.role === "student") {
      fetch("http://localhost:5000/api/internships/me", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ims.student.token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          const app = data.application;
          if (
            app &&
            app.state === "selected" &&
            app.submittedAt &&
            !app.approved &&
            app.rejectionReason
          ) {
            setHasRejection(true);
          }
        })
        .catch(() => {});

      fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ims.student.token")}`,
        },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setNotifications(data.notifications || []);
        })
        .catch(() => {});
    }
  }, [ready, user]);

  const handleNotificationClick = async (notification: StudentNotification) => {
    if (!notification.readAt) {
      await fetch(`http://localhost:5000/api/notifications/${notification._id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ims.student.token")}`,
        },
      }).catch(() => {});
    }
    setNotifications((current) =>
      current.map((item) =>
        item._id === notification._id ? { ...item, readAt: new Date().toISOString() } : item,
      ),
    );
    setNotificationsOpen(false);
    router.push(notification.navigationPath || "/student/internship-status");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#132540]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        
        {/* IMS Logo Section */}
        <Link
          href="/student/dashboard"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <img
            src="/ruhuna.png"
            alt="IMS Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-2xl font-black tracking-wider text-white">
            IMS
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg ${
                    active
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                  {/* Active Indicator Underline Bar */}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-8 bg-sky-400 rounded-full shadow-sm" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 transition-all hover:bg-white/15 hover:text-white"
              title="Notifications"
            >
            <Bell className="h-5 w-5" />
            {(hasRejection || notifications.some((notification) => !notification.readAt)) && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-[#132540]"></span>
              </span>
            )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-white p-3 text-[#132540] shadow-xl ring-1 ring-black/10">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${notification.readAt ? "text-slate-600" : "font-semibold text-[#132540]"}`}
                    >
                      {notification.message}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-500">No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-rose-500/20 hover:text-rose-200 hover:ring-1 hover:ring-rose-500/30 active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>

          {/* Profile Avatar -  */}
          <Link
            href="/student/profile/edit"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-white/10 to-white/20 ring-2 ring-white/20 transition-all hover:ring-white/50 active:scale-95 shadow-inner"
            title="Edit Profile"
          >
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-5 w-5 text-white/80" />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

