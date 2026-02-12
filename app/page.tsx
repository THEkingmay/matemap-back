'use client'

import Link from "next/link"
import { Download, ShieldCheck, MapPin, Users, Heart, Home } from "lucide-react"
import { Button } from "@/components/ui/button" // ตรวจสอบ path ของ shadcn button ให้ถูกต้อง

export default function LandingPage() {


  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-emerald-100">
      
      {/* --- Navbar --- */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-950">MateMap</span>
        </div>

        <Link href="/auth">
          <Button variant="ghost" className="text-gray-500 hover:text-emerald-700 hover:bg-emerald-50">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </Link>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-10 mt-10 md:mt-0">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-600">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
          Community Roommate Finder
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900">
            หาเมทที่ <span className="text-emerald-600">ใช่</span> <br />
            ในสไตล์ที่คุณ <span className="underline decoration-wavy decoration-emerald-400 decoration-2 underline-offset-4">ชอบ</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            แพลตฟอร์มหา Roommate รูปแบบใหม่ ใช้งานง่ายเหมือนแอพหาคู่ 
            แค่ <b>ปัดขวา</b> คนที่ถูกใจ แล้วย้ายเข้าอยู่ด้วยกันได้เลย
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
        
        <a href="https://expo.dev/accounts/matheedev/projects/matemap-front/builds/26e6f309-77b4-44ae-8fab-8cbaafb082f8">

          <Button 
            size="lg" 
            className="h-14 px-8 text-lg rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            <Download className="mr-2 h-6 w-6" />
            ดาวน์โหลดสำหรับ Android
          </Button>
        </a>
        </div>

        {/* Feature Highlights (Mini Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-10 text-left">
          <FeatureCard 
            icon={<Heart className="text-rose-500" />}
            title="Matching System"
            desc="ระบบจับคู่ตามไลฟ์สไตล์ เวลาตื่น-นอน และนิสัยส่วนตัว"
          />
          <FeatureCard 
            icon={<Users className="text-blue-500" />}
            title="Verified Users"
            desc="ยืนยันตัวตนก่อนใช้งาน ปลอดภัย หายห่วง"
          />
          <FeatureCard 
            icon={<Home className="text-orange-500" />}
            title="Room First"
            desc="มีห้องแล้วแต่ขาดคนหาร? โพสต์หาคนมาอยู่ด้วยได้เลย"
          />
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} MateMap Project. All rights reserved.
      </footer>
    </div>
  )
}

// Component ย่อยสำหรับ Card Feature เพื่อความสะอาดของโค้ด
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
      <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
