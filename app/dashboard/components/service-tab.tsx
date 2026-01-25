"use client";

import { Search, Plus, MoreVertical, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getServiceDetailDashboard } from "../dorms/action";
import { toast } from "react-toastify";
import { formatDate } from "../lib/util";

export interface ServiceDashboardType {
  user_id: string; // ไอดีของผู้ให้บริการ
  name: string; // ชื่อผู้ให้บริการ
  expired_date: string;
  isActive: boolean;
}

type Props = {
  activeTab: string;
};

// เปลี่ยนชื่อ Component เป็น ServiceTab เพื่อให้สื่อความหมายชัดเจนขึ้น (ถ้าไฟล์ชื่อ DormTab อาจจะแก้แค่ชื่อฟังก์ชันภายในก็ได้ค่ะ)
function ServiceTab({ activeTab }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // แก้ชื่อตัวแปร serviceAccout -> serviceAccounts (เติม s และแก้ typo)
  const [serviceAccounts, setServiceAccounts] = useState<ServiceDashboardType[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getServiceDetailDashboard();
      if (!data.success) throw new Error(data.message);

      if (data.data) {
        // เพิ่ม: บันทึกข้อมูลลง State
        
        setServiceAccounts(data.data);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "services") {
      fetchData();
    }
  }, [activeTab]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  
  // เปลี่ยนชื่อตัวแปร filteredDormAccounts -> filteredServiceAccounts
  const filteredServiceAccounts = serviceAccounts.filter((service) =>
    service.name.toLowerCase().includes(normalizedSearch)
  );

  return (
    <div>
      {activeTab === "services" && (
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="ค้นหาผู้ให้บริการ..." // แก้ข้อความ
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/create-member-service")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              เพิ่มบัญชีผู้ให้บริการ {/* แก้ข้อความ */}
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ไอดีผู้ใช้
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ชื่อผู้ให้บริการ {/* แก้คำผิด บริากร -> บริการ */}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    วันหมดอายุ
                  </th>
                </tr>
              </thead>
              
              {/* เพิ่มส่วน Body ของตาราง */}
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        กำลังโหลดข้อมูล...
                      </div>
                    </td>
                  </tr>
                ) : filteredServiceAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      ไม่พบข้อมูลผู้ให้บริการ
                    </td>
                  </tr>
                ) : (
                  filteredServiceAccounts.map((service) => (
                    <tr key={service.user_id} className="hover:bg-gray-50">
                      <td
                        className="px-4 py-3 font-mono text-sm text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/users/service-workers/${service.user_id}`)
                        }
                      >
                        {service.user_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {service.name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.isActive ? "ใช้งานอยู่" : "ระงับการใช้งาน"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(new Date(service.expired_date))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceTab;