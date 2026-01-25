import { ChangeEvent } from "react";
import { MapPin } from "lucide-react";
import { FormEditData } from "../../lib/types";

interface AddressSectionProps {
  formData: FormEditData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function AddressSection({ formData, handleChange }: AddressSectionProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin size={18} className="mr-2 text-blue-600" />
        ที่อยู่หอพัก
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {/* บ้านเลขที่ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">บ้านเลขที่ / ซอย / ถนน</label>
          <input
            type="text"
            name="dorm_number"
            value={formData.dorm_number || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="เช่น 123/45 ซ.พหลโยธิน"
          />
        </div>

        {/* ตำบล / อำเภอ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล / แขวง</label>
            <input
              type="text"
              name="sub_district"
              value={formData.sub_district || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ / เขต</label>
            <input
              type="text"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>

        {/* จังหวัด / รหัสไปรษณีย์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
            <input
              type="text"
              name="province"
              value={formData.province || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}