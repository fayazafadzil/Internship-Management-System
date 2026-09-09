"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { LandingNav } from "@/components/layout/LandingNav";
import { Footer } from "@/components/layout/Footer";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DepartmentAuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Please enter a valid university email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to log in.");
        setLoading(false);
        return;
      }
      if (data.user.role !== "department" && data.user.role !== "admin") {
        setError("Unauthorized access. This portal is for department staff only.");
        setLoading(false);
        return;
      }

      await login(
        {
          role: "department",
          email: data.user.email,
        },
        data.token
      );
      router.push("/department/dashboard");
    } catch {
      setError("Unable to connect to the backend server.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-between" style={{ backgroundColor: "#AEC0D4" }}>
      
      {/* Landing Navigation එක මෙතනින් එකතු කළා */}
      <LandingNav />

      <div className="w-full px-6 pt-6 pb-12 my-auto">
        
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-[#32467C]/20 ring-1 ring-navy-deep/10 bg-white">
          
          {/* Header එකට #32467C වර්ණය සහිත Gradient එකක් ලබා දී ඇත */}
          <div className="bg-gradient-to-br from-[#32467C] to-[#253560] px-8 py-6 text-center text-white">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Department Portal</h1>
            <p className="mt-1 text-xs text-blue-100/80">
              Use your university email and the default password provided by the system administrator.
            </p>
          </div>

          <div className="bg-white px-8 py-6">
            <h2 className="text-lg font-semibold text-navy-deep">Department Login</h2>
            <p className="text-xs text-slate-500 mb-4">
              Login only. Department accounts are created and managed by the administrator.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="University Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="department@dcs.ruh.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {error && <p className="text-xs text-red-600">{error}</p>}

              {/* Button එකට #32467C වර්ණය ලබා දී ඇත */}
              <Button type="submit" className="w-full py-2.5 mt-2 bg-[#32467C] hover:bg-[#253560] transition-all shadow-lg shadow-[#32467C]/30" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
