"use client";

import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { mockServices } from "../../lib/mock/mockServices";
import { ServiceCard } from "./service-card";

export function ServiceDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = mockServices.filter(service => {
    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      service.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = [
    "all",
    ...Array.from(new Set(mockServices.map(s => s.status))),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ประวัติบริการรับจ้าง
        </h1>
        <p className="text-gray-600">ดูและจัดการข้อมูลการให้บริการทั้งหมด</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วย ID, ชื่อลูกค้า, หรือประเภทบริการ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-37.5"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "ทุกสถานะ" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>บริการทั้งหมด: {mockServices.length}</span>
          <span>แสดง: {filteredServices.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">ไม่พบข้อมูลบริการ</p>
          <p className="text-gray-400 text-sm mt-2">
            ลองปรับเปลี่ยนการค้นหาหรือตัวกรอง
          </p>
        </div>
      )}
    </div>
  );
}
