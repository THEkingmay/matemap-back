import {
  Truck,
  BrushCleaning,
  Clock,
  User,
  Phone,
  MapPin,
  MoreVertical,
} from "lucide-react";
import {
  AllServiceHistory,
  ServiceStatus,
  StatusConfigItem,
} from "../lib/types";
import Link from "next/link";

type ServiceHistoryProps = {
  allServiceHistory: AllServiceHistory[];
  activeSubTab: string;
};

function AllServiceHistoryTab({
  allServiceHistory,
  activeSubTab,
}: ServiceHistoryProps) {
  return (
    <div className="space-y-4">
      {activeSubTab === "all" &&
        allServiceHistory.map(service => {
          const statusConfig: Record<ServiceStatus, StatusConfigItem> = {
            รอยืนยัน: {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
            },
            ยืนยันแล้ว: {
              bg: "bg-blue-100",
              text: "text-blue-800",
            },
            เสร็จสิ้น: {
              bg: "bg-green-100",
              text: "text-green-800",
            },
            ยกเลิก: {
              bg: "bg-red-100",
              text: "text-red-800",
            },
          };
          const status = statusConfig[service.status as ServiceStatus];

          return (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${service.type === "รถขนย้ายของ" ? "bg-orange-100" : "bg-purple-100"}`}
                  >
                    {service.type === "รถขนย้ายของ" ? (
                      <Truck
                        className={
                          service.type === "รถขนย้ายของ"
                            ? "text-orange-600"
                            : "text-purple-600"
                        }
                        size={24}
                      />
                    ) : (
                      <BrushCleaning className="text-purple-600" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-row">
                      <Link href={`/dashboard/services/${service.id}`}>
                        <h3 className="font-bold text-lg hover:cursor-pointer hover:underline">
                          {service.type}
                        </h3>
                      </Link>
                      <p className="ml-2 mt-0.5">(ref: {service.id})</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {service.date} เวลา {service.time} น.
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                >
                  {service.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-blue-600" />
                    <span className="font-medium text-sm text-blue-900">
                      ผู้จองบริการ
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {service.customer}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Phone size={14} className="text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {service.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-green-600" />
                    <span className="font-medium text-sm text-green-900">
                      ผู้ให้บริการ
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {service.provider}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Phone size={14} className="text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {service.providerPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-3 bg-gray-50 rounded-lg p-3">
                <MapPin size={16} className="text-gray-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  {service.location.start}{" "}
                  {service.location?.destination !== ""
                    ? ` -> ${service.location.destination}`
                    : ""}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ราคาบริการ</p>
                    <p className="font-bold text-lg text-gray-900">
                      ฿{service.price.toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default AllServiceHistoryTab;
