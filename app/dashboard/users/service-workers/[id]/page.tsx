'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, MapPin, Clock, Briefcase, Mail, Phone, User as UserIcon, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"; // แนะนำให้ลง lucide-react สำหรับ icon สไตล์ minimal

import { Worker } from "@/app/dashboard/services/[id]/page";
import { ParamValue } from "next/dist/server/request/params";
import { getWorkerDetail } from "./action";
import SubscriptionComponent from "@/app/dashboard/components/subscription/subscription";

export interface Job {
  id: string;
  name: string;
}

export interface JobHistory {
  id: number;
  created_at: Date;
  customer_id: string;
  provider_id: string;
  service_type_id: string;
  start_location?: string;
  destination_location: string;
  detail?: string;
  status: 'accepted' | 'rejected' | 'pending' | 'done' | 'progressing';
  start_date: string;
  end_date: string;
}

export interface WorkerDetailType {
  detail: Worker;
  job: Job[];
  job_history: JobHistory[];
  email: string
}


const StatusBadge = ({ status }: { status: JobHistory['status'] }) => {
  const styles = {
    accepted: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    done: "bg-green-50 text-green-700 border-green-200",
    progressing: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const labels = {
    accepted: "ตอบรับแล้ว",
    rejected: "ปฏิเสธ",
    pending: "รอการตอบรับ",
    done: "เสร็จสิ้น",
    progressing: "กำลังดำเนินการ",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
};

export default function ServiceWorkerDetail() {
  const { id } = useParams();
  const [data, setData] = useState<WorkerDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== 'string') return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getWorkerDetail(id);
        
        if (!result.success) {
          throw new Error(result.message);
        }

        // แปลง created_at จาก string เป็น Date object ถ้าจำเป็น (ขึ้นอยู่กับ response จริง)
        // ตรงนี้สมมติว่า data structure ตรงเป๊ะ
        setData(result.data || null);
      } catch (err: any) {
        toast.error(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // อย่าลืมเรียกฟังก์ชัน
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-500">
        <AlertCircle className="mb-2 h-10 w-10" />
        <p>ไม่พบข้อมูลผู้ให้บริการ</p>
      </div>
    );
  }

  const { detail: worker, job: services, job_history: history, email: userEmail } = data;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-slate-800">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Section: Worker Profile */}
        <div className="grid gap-6 md:grid-cols-[400px_1fr]">
          {/* Profile Card */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-50 bg-gray-200 shadow-inner">
               {worker.image_url? (
                  <img src={worker.image_url} alt={worker.name} className="h-full w-full object-cover" />
               ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                    <UserIcon size={48} />
                  </div>
               )}

            </div>
            <h1 className="text-xl font-semibold text-slate-900">{worker.name}</h1>
            <p className="text-sm text-slate-500 mb-4">Service Provider</p>
            
            <div className="w-full space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{userEmail}</span>
              </div>
              {worker.tel && (
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                  <Phone size={16} className="text-slate-400" />
                  <span>{worker.tel}</span>
                </div>
              )}
            </div>
            <div> 
              <SubscriptionComponent id={id as string} />
            </div>
          </div>

          {/* Right Column: Stats & Services & History */}
          <div className="space-y-6">
            
            {/* Services Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-slate-400" />
                <h2 className="text-lg font-medium text-slate-900">งานที่ให้บริการ</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {services.length > 0 ? (
                  services.map((service) => (
                    <span 
                      key={service.id} 
                      className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                      {service.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">ยังไม่มีข้อมูลบริการ</p>
                )}
              </div>
            </div>

            {/* History Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 min-h-[400px]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-slate-400" />
                  <h2 className="text-lg font-medium text-slate-900">ประวัติการทำงาน</h2>
                </div>
                <span className="text-xs text-slate-400">ทั้งหมด {history.length} รายการ</span>
              </div>

              <div className="space-y-4">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-indigo-100 hover:shadow-md md:flex-row md:items-center md:justify-between"
                    >
                      {/* Job Info */}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                           <span>งาน #{item.id}</span>
                           <span className="text-slate-300">|</span>
                           <span className="text-slate-500 font-normal">{item.destination_location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(item.start_date).toLocaleDateString('th-TH')}
                          </div>
                          {item.detail && (
                             <span className="max-w-[200px] truncate text-slate-400">"{item.detail}"</span>
                          )}
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center justify-between gap-4 md:justify-end">
                         <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-slate-400">
                    <p className="text-sm">ไม่มีประวัติการทำงาน</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}