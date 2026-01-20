"use client";

import { Button } from "@/components/ui/button";
import { Search, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dormAccounts = [
  {
    id: "1",
    name: "หอพักสุขสบาย",
    start_date: "2025-01-01",
    expire_date: "2025-02-01",
  },
  {
    id: "2",
    name: "หอพักร่มเย็น",
    start_date: "2025-01-05",
    expire_date: "2025-02-05",
  },
];

type Props = {
  activeTab: string;
};

function DormTab({ activeTab }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredDormAccounts = dormAccounts.filter(dorm =>
    dorm.name.toLowerCase().includes(normalizedSearch),
  );

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
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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
                    วันเริ่มสมัคร
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    วันต่ออายุ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDormAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      ไม่พบหอพักที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredDormAccounts.map(dorm => (
                    <tr key={dorm.id} className="hover:bg-gray-50">
                      <td
                        className="px-4 py-3 hover:underline hover:cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/dorms/${dorm.id}`)
                        }
                      >
                        {dorm.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dorm.start_date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dorm.expire_date}
                      </td>
                      <td className="px-4 py-3"></td>
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
