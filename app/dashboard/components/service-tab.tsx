import {
  BrushCleaning,
  Clock,
  MapPin,
  MoreVertical,
  Phone,
  Truck,
  User,
} from "lucide-react";

const serviceHistory = [
  {
    id: 1,
    type: "รถขนย้ายของ",
    customer: "สมหญิง ทองดี",
    customerPhone: "081-234-5678",
    provider: "วิชัย รถกระบะ",
    providerPhone: "089-765-4321",
    date: "2025-01-18",
    time: "14:00",
    location: {
      start: "หอพักอินดี้",
      destination: "บ้านพักใหม่",
    },
    price: "800",
    status: "completed",
  },
  {
    id: 2,
    type: "ทำความสะอาด",
    customer: "ณัฐพล สุขสันต์",
    customerPhone: "092-111-2233",
    provider: "แม่บ้านจิ๋ว",
    providerPhone: "086-333-4444",
    date: "2025-01-19",
    time: "10:00",
    location: {
      start: "ยูนิค เพลส ห้อง 305",
      destination: "",
    },
    price: "500",
    status: "confirmed",
  },
  {
    id: 3,
    type: "รถขนย้ายของ",
    customer: "ปภาวี ใจดี",
    customerPhone: "084-555-6666",
    provider: "สมชาย รถปิกอัพ",
    providerPhone: "091-777-8888",
    date: "2025-01-20",
    time: "09:00",
    location: {
      start: "เดอะ นิช",
      destination: "คอนโดใหม่",
    },
    price: "1,200",
    status: "pending",
  },
  {
    id: 4,
    type: "ทำความสะอาด",
    customer: "กัญญา รุ่งเรือง",
    customerPhone: "083-999-0000",
    provider: "แม่บ้านนุ่น",
    providerPhone: "087-222-1111",
    date: "2025-01-17",
    time: "15:30",
    location: {
      start: "หอพักอินดี้ ห้อง 201",
      destination: "",
    },
    price: "600",
    status: "completed",
  },
  {
    id: 5,
    type: "ทำความสะอาด",
    customer: "ธนพล ชัยชนะ",
    customerPhone: "095-444-5555",
    provider: "แม่บ้านจิ๋ว",
    providerPhone: "086-333-4444",
    date: "2025-01-21",
    time: "13:00",
    location: {
      start: "ยูนิค เพลส ห้อง 102",
      destination: "",
    },
    price: "500",
    status: "cancelled",
  },
];

type Props = {
  activeTab: string;
};

type StatusConfigType = {
  bg: string;
  text: string;
  label: string;
};

type StatusConfig = Record<
  "pending" | "confirmed" | "completed" | "cancelled",
  StatusConfigType
>;

function ServiceTab({ activeTab }: Props) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "รอยืนยัน",
    },
    confirmed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "ยืนยันแล้ว",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "เสร็จสิ้น",
    },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "ยกเลิก" },
  };

  return (
    <div>
      {activeTab === "services" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                ทั้งหมด (5)
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
                <Truck size={16} />
                รถขนของ (3)
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
                <BrushCleaning size={16} />
                ทำความสะอาด (2)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {serviceHistory.map(service => {
              const statusConfig: StatusConfig = {
                pending: {
                  bg: "bg-yellow-100",
                  text: "text-yellow-800",
                  label: "รอยืนยัน",
                },
                confirmed: {
                  bg: "bg-blue-100",
                  text: "text-blue-800",
                  label: "ยืนยันแล้ว",
                },
                completed: {
                  bg: "bg-green-100",
                  text: "text-green-800",
                  label: "เสร็จสิ้น",
                },
                cancelled: {
                  bg: "bg-red-100",
                  text: "text-red-800",
                  label: "ยกเลิก",
                },
              };
              const status = statusConfig[service.status as keyof StatusConfig];

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
                          <BrushCleaning
                            className="text-purple-600"
                            size={24}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{service.type}</h3>
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
                      {status.label}
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
                          ฿{service.price}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceTab;
