import { MapPin, Calendar, Clock, Phone, User, DollarSign } from "lucide-react";
import { AllServiceHistory } from "../../lib/types";

interface ServiceCardProps {
  service: AllServiceHistory;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "เสร็จสิ้น":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
      case "กำลังดำเนินการ":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled":
      case "กำหนดการแล้ว":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "ยกเลิก":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {service.type}
            </h3>
            <p className="text-sm text-gray-500">รหัส: {service.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(service.status)}`}
          >
            {service.status}
          </span>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  จุดเริ่มต้น
                </p>
                <p className="text-gray-900">{service.location.start}</p>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-gray-300 ml-2.5 h-4"></div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  จุดหมาย
                </p>
                <p className="text-gray-900">{service.location.destination}</p>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">วันที่</p>
                <p className="font-semibold text-gray-900">{service.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">เวลา</p>
                <p className="font-semibold text-gray-900">{service.time}</p>
              </div>
            </div>
          </div>

          {/* Customer & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  ลูกค้า
                </p>
              </div>
              <p className="font-semibold text-gray-900">{service.customer}</p>
              <div className="flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <p className="text-sm text-gray-600">{service.customerPhone}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  ผู้ให้บริการ
                </p>
              </div>
              <p className="font-semibold text-gray-900">{service.provider}</p>
              <div className="flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <p className="text-sm text-gray-600">{service.providerPhone}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">ราคารวม</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ฿{service.price.toLocaleString("th-TH")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
