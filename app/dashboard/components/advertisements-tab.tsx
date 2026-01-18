"use client";

import { Search, Plus, TrendingUp, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const advertisements = [
  {
    id: 1,
    business: "ร้านกาแฟเจ้าประจำ",
    type: "Banner",
    price: "3,000",
    status: "active",
    views: "12,450",
  },
  {
    id: 2,
    business: "7-Eleven สาขา 2",
    type: "Sidebar",
    price: "2,000",
    status: "active",
    views: "8,230",
  },
  {
    id: 3,
    business: "ร้านซักรีด Clean&Fresh",
    type: "Pop-up",
    price: "1,500",
    status: "paused",
    views: "5,120",
  },
];

type Props = {
  activeTab: string;
};

function AdvertisementsTab({ activeTab }: Props) {
  const router = useRouter();

  return (
    <div>
      {activeTab === "ads" && (
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
                  placeholder="ค้นหาโฆษณา..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/advertisements/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              เพิ่มโฆษณา
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ธุรกิจ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ประเภท
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ราคา/เดือน
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ยอดวิว
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {advertisements.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{ad.business}</td>
                    <td className="px-4 py-3">{ad.type}</td>
                    <td className="px-4 py-3">฿{ad.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${ad.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {ad.status === "active" ? "เผยแพร่" : "หยุดชั่วคราว"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                      <TrendingUp size={16} className="text-green-600" />
                      {ad.views}
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

export default AdvertisementsTab;
