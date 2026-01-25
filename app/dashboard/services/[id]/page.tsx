'use client'

import { useParams, useRouter } from "next/navigation"; // เพิ่ม useRouter
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteService, updateServiceName } from "../action";

export type Worker = {
  id: string;
  created_at: string;
  name: string;
  tel: string;
  image_url?: string;
  image_public_url?: string;
  email?: string
}

interface ServiceWithWorker {
  service_name: string;
  users: Worker[];
}

export default function ServiceDetail() {
  const { id } = useParams();
  const router = useRouter(); // ใช้สำหรับ redirect หลังลบเสร็จ

  const [service, setService] = useState<ServiceWithWorker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Modal & Action States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchServiceDetail = async () => {
    try {
      const res = await fetch(`/api/service/${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setService(data);
      setEditingName(data.service_name); // ตั้งค่าเริ่มต้นให้ input แก้ไข
    } catch (err) {
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchServiceDetail();
    }
  }, [id]);



  const handleUpdateName = async () => {
    if (!service || !editingName.trim()) return;
    setIsSubmitting(true);
    try {
      
      const data = await updateServiceName(id as string, editingName)

      if(! data.success){
        throw new Error(data.error)
      }

      toast.success("แก้ไขชื่อบริการสำเร็จ")
      setService({ ...service, service_name: editingName });
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error((err as Error).message)
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันลบงานบริการ
  const handleDeleteService = async () => {
    setIsSubmitting(true);
    try {
      const data = await deleteService(id as string)
      if(!data.success){
        throw new Error(data.error)
      }

      toast.success("ลบบริการสำเร็จ")
      router.push('/dashboard/services'); 
    } catch (err) {
      toast.error((err as Error).message)
      console.error(err);
      setIsSubmitting(false); // ปลดล็อกเฉพาะถ้า error
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลงานบริการ</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {service.service_name}
            </h1>
            <p className="text-gray-500 text-sm">จัดการข้อมูลงานบริการและพนักงานในสังกัด</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
            >
              {/* Edit Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              แก้ไขชื่อ
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
            >
              {/* Trash Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              ลบงาน
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {service.users.map((worker) => (
            <Link
              key={worker.id}
              href={`/dashboard/users/service-workers/${worker.id}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 relative rounded-full overflow-hidden border-4 border-gray-50 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={worker.image_public_url || worker.image_url || '/placeholder-user.png'}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                  {worker.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {worker.tel}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {service.users.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mt-6">
            <p className="text-gray-400 text-lg">ยังไม่มีผู้ปฏิบัติงานในรายการนี้</p>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Edit Name Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">แก้ไขชื่อบริการ</h3>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="ชื่อบริการ..."
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdateName}
                disabled={isSubmitting || !editingName.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border-t-4 border-red-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">ยืนยันการลบ?</h3>
              <p className="text-gray-500 mb-6">
                คุณแน่ใจหรือไม่ที่จะลบงาน "<strong>{service.service_name}</strong>"? 
                <br /><span className="text-xs text-red-400">การกระทำนี้ไม่สามารถกู้คืนได้</span>
              </p>
              
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDeleteService}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'กำลังลบ...' : 'ลบข้อมูล'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}