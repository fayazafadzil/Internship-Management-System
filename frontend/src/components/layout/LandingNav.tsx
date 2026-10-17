
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// මෙතන ඔයාට ඕන මෙනු ටික දාගන්න
const links = [
  { label: "Overview", href: "/#overview" },
  { label: "Features", href: "/#features" },
  { label: "Contact", href: "/#contact" },
];

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0B1528]/85 backdrop-blur-md border-b border-white/10 text-white shadow-lg transition-all">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        
        {/* IMS Logo Section - පිරිසිදුව තියෙනවා */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src="/ruhuna.png"
            alt="IMS Logo"
            className="h-10 w-auto object-contain drop-shadow"
          />
          <span className="text-xl font-extrabold tracking-wider text-white leading-tight">
            IMS
          </span>
        </Link>

        {/* Desktop Navigation Links - මෙතන දැන් Buttons නැහැ, මෙනු විතරයි */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label}>
                <Link 
                  href={l.href} 
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    active 
                      ? "text-white bg-white/10" 
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0B1528] px-6 py-4 md:hidden flex flex-col gap-2">
          {links.map((l) => (
            <Link 
              key={l.label}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-200 hover:text-white py-2"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
