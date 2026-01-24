"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { login } from "../dashboard/action"; // *อย่าลืมแก้ function นี้ให้รับ email, password
import { MapPin, Users, Lock, ArrowRight, Leaf, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
export default function AuthPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);
    try {
      // ส่งทั้ง email และ password ไปที่ Server Action
      const result = await login(email, password);

      if (!result.success) throw new Error("เข้าสู่ระบบไม่ได้");

      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Dev bypass
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      router.replace("/dashboard");
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex font-sans text-slate-900">
      {/* Left Side: Mate Map Promo (KU Green Theme) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#005F56] overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#A2D2A6] blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="w-6 h-6 text-[#A2D2A6]" />
            </div>
            <span className="text-xl font-bold tracking-wider">MATE MAP</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            หาเมทที่ใช่ <br />
            <span className="text-[#A2D2A6]">ในสไตล์เด็กเกษตร</span>
          </h1>
          <p className="text-lg text-slate-200 max-w-md font-light">
            Admin Portal สำหรับจัดการข้อมูลผู้ใช้งานและระบบจับคู่รูมเมท
          </p>

          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
              <Users className="w-4 h-4 text-[#A2D2A6]" />
              <span className="text-sm">Management System</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-300/60">
          © 2024 Mate Map Kasetsart. All rights reserved.
        </div>
      </div>

      {/* Right Side: Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#005F56]/10 mb-2">
              <Lock className="w-6 h-6 text-[#005F56]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 text-sm">
              เข้าสู่ระบบเพื่อจัดการแอป Mate Map
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
                htmlFor="email"
              >
                <Mail className="w-4 h-4 text-slate-400" /> Email Address
              </label>
              <input
                id="email"
                className="flex h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F56] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                type={process.env.NODE_ENV === "development" ? "text" : "email"}
                placeholder="admin@ku.th"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
                htmlFor="password"
              >
                <Lock className="w-4 h-4 text-slate-400" /> Password
              </label>
              <input
                id="password"
                className="flex h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F56] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#005F56] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#004d46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F56] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-400 mt-6">
            Authorized Personnel Only
          </div>
        </div>
      </div>
    </div>
  );
}
