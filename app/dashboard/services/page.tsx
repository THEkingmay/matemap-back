'use client'

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";

// --- Types ---
interface ServicesType {
  id: string;
  created_at?: string;
  name: string;
}

export default function ServicePage() {
  // --- States ---
  const [services, setServices] = useState<ServicesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Data ---
  const fetchService = async () => {
    try {
      const res = await fetch('/api/service', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setServices(data.data);
    } catch (error) {
      console.error(error);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  // --- Create Handler ---
  const handleCreateService = async (e: FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      toast.warn("กรุณากรอกชื่อบริการ");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newServiceName }),
      });

      if (!res.ok) throw new Error('Failed to create');

      toast.success("เพิ่มบริการเรียบร้อยแล้ว");
      setNewServiceName("");
      setIsModalOpen(false);
      fetchService();
    } catch (error) {
      console.error(error);
      toast.error("สร้างบริการไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">บริการทั้งหมด</h1>
            <p className="text-gray-500 mt-1">เลือกบริการที่ต้องการจัดการ</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="text-lg leading-none">+</span> เพิ่มบริการใหม่
          </button>
        </div>

        {/* Content Section: Grid Squares */}
        {isLoading ? (
          // Loading Skeletons (Grid แบบสี่เหลี่ยม)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse shadow-sm" />
             ))}
          </div>
        ) : (
          // Service Grid Cards
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link 
                key={service.id} 
                href={`/dashboard/services/${service.id}`}
                className="group relative block h-full w-full outline-none"
              >
                {/* Card Container: ใช้ aspect-square เพื่อบังคับเป็นสี่เหลี่ยมจัตุรัส */}
                <div className="aspect-square h-full w-full bg-white p-6 rounded-2xl border-2 border-transparent hover:border-blue-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(37,99,235,0.2)] transition-all duration-300 ease-out flex flex-col items-center justify-center text-center group-hover:-translate-y-1">
                  
                  {/* Icon Placeholder (ใช้อักษรตัวแรก) */}
                  <div className="mb-5 p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <span className="text-3xl font-black">{service.name.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  {/* Service Name */}
                  <h3 className="text-lg font-bold text-gray-700 group-hover:text-blue-700 transition-colors line-clamp-2 px-2">
                    {service.name}
                  </h3>

                  {/* Arrow Icon at bottom right (Fade in on hover) */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>

                </div>
              </Link>
            ))}

            {/* Empty State (กรณีไม่มีข้อมูล) */}
            {services.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">ยังไม่มีบริการในระบบ</p>
                <p className="text-gray-400 mt-2">กดปุ่มเพิ่มบริการด้านบนเพื่อเริ่มต้น</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL (เหมือนเดิม แต่ปรับ UI เล็กน้อย) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop with blur */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">เพิ่มบริการใหม่</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateService} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ชื่อบริการที่ต้องการแสดง
                </label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="ตัวอย่าง: ซักอบรีดด่วน, ทำความสะอาดคอนโด"
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newServiceName.trim()}
                  className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกบริการ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}