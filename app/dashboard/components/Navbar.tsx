"use client";

import { useState } from "react"; // 1. เพิ่ม useState
import Link from "next/link";
import {
  LogOut,
  Home,
  Menu,
  X,
  Building2,
  FileCheck,
  HeartHandshake,
} from "lucide-react"; // 2. เพิ่ม icon Menu และ X
import { logout } from "../action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "หน้าแรก",
    href: "/dashboard",
    icon: <Home className="w-4 h-4" />,
  },
  {
    name: "บัญชีหอพัก",
    href: "/dashboard/dorms",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    name: "อนุมัติโพสต์",
    href: "/dashboard/posts",
    icon: <FileCheck className="w-4 h-4" />,
  },
  {
    name: "บริการรับจ้าง",
    href: "/dashboard/services",
    icon: <HeartHandshake className="w-4 h-4" />,
  },
  // ตัวอย่าง:
  // { name: "ตั้งค่า", href: "/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardNavbar() {
  const router = useRouter();
  // 3. สร้าง State สำหรับเปิด/ปิดเมนูบนมือถือ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    // ใช้ toast.promise รับค่า Promise จาก Server Action
    try {
      toast.promise(logout(), {
        pending: "กำลังออกจากระบบ",
        success: "ออกจากระบบเรียบร้อย",
        error: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
      router.push("/auth");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 1. Logo Section */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group z-50"
          >
            {/* ใส่ Image ตรงนี้ถ้ามีโลโก้ */}
            <span className="font-bold text-xl tracking-tight text-emerald-950 group-hover:text-emerald-700 transition-colors">
              MateMap
            </span>
          </Link>

          {/* 2. Desktop Menu (แสดงเฉพาะจอ md ขึ้นไป) */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </div>

          {/* 3. Mobile Menu Button (แสดงเฉพาะจอเล็กกว่า md) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" /> // ไอคอนปิด
              ) : (
                <Menu className="w-6 h-6" /> // ไอคอนแฮมเบอร์เกอร์
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Dropdown (แสดงเมื่อ State เป็น True) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile Links */}
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อกดลิ้งค์
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2 pt-2"></div>

            {/* Mobile Logout */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
