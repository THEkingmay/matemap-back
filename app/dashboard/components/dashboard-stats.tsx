"use client";

import { DollarSign, Building2, Megaphone, FileCheck } from "lucide-react";

function DashboardStats() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">รายได้รวม/เดือน</p>
              <p className="text-2xl font-bold text-gray-900">฿25,500</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">หอพักทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Building2 className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">โฆษณาที่ใช้งาน</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Megaphone className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">รออนุมัติ</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <FileCheck className="text-orange-600" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
