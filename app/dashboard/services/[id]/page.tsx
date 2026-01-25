'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link"; // 1. นำเข้า Link สำหรับการเปลี่ยนหน้า

export type Worker = {
  id: string;
  created_at: string;
  name: string;
  tel: string;
  image_url: string;
  image_public_url: string;
}

// แก้ไขชื่อ Interface จาก Serviec เป็น Service
interface ServiceWithWorker {
  service_name: string;
  users: Worker[];
}

export default function ServiceDetail() { 
  // params ไม่จำเป็นต้องรับผ่าน props ใน client component ถ้าใช้ useParams แล้ว
  const { id } = useParams();

  // 2. เปลี่ยน State เป็น Object เดียว เพราะเราดึงข้อมูลตาม ID (1 Service)
  const [service, setService] = useState<ServiceWithWorker | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServiceDetail = async () => {
    try {
      const res = await fetch(`/api/service/${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      setService(data); 
    } catch (err) {
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. เรียกใช้ fetch ใน useEffect และใส่ dependency [id]
  useEffect(() => {
    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!service) return <div className="p-4">ไม่พบข้อมูลงานบริการ</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        งาน: {service.service_name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* 4. Loop แสดงรายการ Users (Workers) */}
        {service.users.map((worker) => (
          <Link 
            key={worker.id}
            href={`/dashboard/users/service-workers/${worker.id}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center space-x-4">
              {/* แสดงรูปภาพ */}
              <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img 
                  src={worker.image_public_url || worker.image_url || '/placeholder-user.png'} 
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* ข้อมูลคนงาน */}
              <div>
                <p className="font-semibold text-lg text-gray-800">{worker.name}</p>
                <p className="text-sm text-gray-500">โทร: {worker.tel}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {service.users.length === 0 && (
        <p className="text-gray-500">ยังไม่มีผู้ปฏิบัติงานในรายการนี้</p>
      )}
    </div>
  )
}