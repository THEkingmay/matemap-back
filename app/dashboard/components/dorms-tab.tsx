"use client";

import { Search, Plus, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const dormAccounts = [
  {
    id: 1,
    name: "หอพักอินดี้",
    plan: "Premium",
    price: "2,500",
    status: "active",
    nextBilling: "2025-02-01",
  },
  {
    id: 2,
    name: "ยูนิค เพลส",
    plan: "Standard",
    price: "1,500",
    status: "active",
    nextBilling: "2025-02-05",
  },
  {
    id: 3,
    name: "เดอะ นิช",
    plan: "Premium",
    price: "2,500",
    status: "pending",
    nextBilling: "2025-01-25",
  },
];

type Props = {
  activeTab: string;
};

function DormTab({ activeTab }: Props) {
  const router = useRouter();

  return (
    <div>
      {activeTab === "dorms" && (
        <div>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/dorms/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              เพิ่มบัญชีหอพัก
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ชื่อหอพัก
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    แพ็กเกจ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ราคา/เดือน
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    วันต่ออายุ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dormAccounts.map(dorm => (
                  <tr key={dorm.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{dorm.name}</td>
                    <td className="px-4 py-3">{dorm.plan}</td>
                    <td className="px-4 py-3">฿{dorm.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${dorm.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {dorm.status === "active" ? "ใช้งาน" : "รอชำระ"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {dorm.nextBilling}
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DormTab;
