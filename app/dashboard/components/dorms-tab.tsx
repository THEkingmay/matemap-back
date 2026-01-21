"use client";

import { Search, Plus, MoreVertical, Loader2 } from "lucide-react"; // เพิ่ม Loader2 สำหรับ state loading
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // เพิ่ม useEffect
import { getDormDetailDashboard } from "../dorms/action";
import { toast } from "react-toastify";
import { formatDate } from "../lib/util";

// Interface คงเดิมตามที่คุณเมกำหนด
export interface DormDeailDashboardType {
  dorm_id: string; // ไอดีของหอ
  name: string; // ชื่อหอพัก
  user_id: string; // ไอดีเจ้าของหอ
  expire_date: string;
  owner_name: string;
  isActive: boolean;
}

type Props = {
  activeTab: string;
};

function DormTab({ activeTab }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. แก้ไขการประกาศ State ให้สมบูรณ์
  const [loading, setLoading] = useState(false);
  const [dormAccounts, setDormAccounts] = useState<DormDeailDashboardType[]>(
    [],
  );

  const fetchData = async () => {
    try {
      setLoading(true); // 2. แก้คำผิด setLoadind -> setLoading
      const data = await getDormDetailDashboard();

      if (!data.success) throw new Error(data.message);

      // ใช้ data.data หรือ array ว่างเพื่อป้องกัน null
      if (data.data) {
        setDormAccounts(data.data);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 3. เพิ่ม useEffect เพื่อดึงข้อมูลเมื่อ Tab นี้ถูกเลือก (active)
  useEffect(() => {
    if (activeTab === "dorms") {
      fetchData();
    }
  }, [activeTab]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredDormAccounts = dormAccounts.filter(dorm =>
    dorm.name.toLowerCase().includes(normalizedSearch),
  );

  return (
    <div>
      {activeTab === "dorms" && (
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
                  placeholder="ค้นหาหอพัก..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/dorms/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              เพิ่มบัญชีหอพัก
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ไอดีหอพัก
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ชื่อหอพัก
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ไอดีผู้ใช้
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ชื่อนิติ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    วันหมดอายุ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />{" "}
                        กำลังโหลดข้อมูล...
                      </div>
                    </td>
                  </tr>
                ) : filteredDormAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      ไม่พบหอพักที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredDormAccounts.map(dorm => (
                    // 4. แก้ key จาก dorm.id เป็น dorm.dorm_id ตาม Interface
                    <tr
                      key={dorm.dorm_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-4 py-3 font-mono text-sm text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/dorms/${dorm.dorm_id}`)
                        }
                      >
                        {dorm.dorm_id}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {dorm.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dorm.user_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dorm.owner_name || "ไม่มีชื่อนิติ"}
                      </td>
                      {/* เพิ่ม Column แสดงสถานะ isActive ให้ชัดเจนขึ้น */}
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            dorm.isActive // เช็คตามค่าจริงที่ Database ส่งมา
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {dorm.isActive ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(new Date(dorm.expire_date))}
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

export default DormTab;
