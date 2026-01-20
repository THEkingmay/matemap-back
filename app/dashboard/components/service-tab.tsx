import {
  BrushCleaning,
  Clock,
  MapPin,
  MoreVertical,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import AllServiceHistoryTab from "./all-service-history-tab";
import { useState } from "react";
import MovingServiceTab from "./moving-service-tab";
import CleaningServiceTab from "./cleaning-service-tab";
import { Button } from "@/components/ui/button";

// Api for allServiceHistory data
const allServiceHistory = [
  {
    id: "1",
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
    price: 800,
    status: "เสร็จสิ้น",
  },
  {
    id: "2",
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
    price: 500,
    status: "ยืนยันแล้ว",
  },
  {
    id: "3",
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
    price: 1200,
    status: "รอยืนยัน",
  },
  {
    id: "4",
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
    price: 600,
    status: "เสร็จสิ้น",
  },
  {
    id: "5",
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
    price: 500,
    status: "ยกเลิก",
  },
];

// Api for movingHistory data
const movingHistory = [
  {
    id: "1",
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
    price: 800,
    status: "เสร็จสิ้น",
  },
  {
    id: "3",
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
    price: 1200,
    status: "รอยืนยัน",
  },
];

// Api for cleaningHistory data
const cleaningHistory = [
  {
    id: "2",
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
    price: 500,
    status: "ยืนยันแล้ว",
  },

  {
    id: "4",
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
    price: 600,
    status: "เสร็จสิ้น",
  },
  {
    id: "5",
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
    price: 500,
    status: "ยกเลิก",
  },
];

type Props = {
  activeTab: string;
};

function ServiceTab({ activeTab }: Props) {
  const [activeSubTab, setActiveSubTab] = useState("all");

  return (
    <div>
      {activeTab === "services" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveSubTab("all")}
                className={`px-4 py-2 hover:cursor-pointer ${
                  activeSubTab === "all"
                    ? "bg-blue-600 text-white rounded-lg text-sm"
                    : "bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
                }`}
              >
                ทั้งหมด ({allServiceHistory.length})
              </Button>
              <Button
                onClick={() => setActiveSubTab("moving")}
                className={`px-4 py-2 hover:cursor-pointer ${
                  activeSubTab === "moving"
                    ? "bg-blue-600 text-white rounded-lg text-sm"
                    : "bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
                }`}
              >
                <Truck size={16} />
                รถขนของ ({movingHistory.length})
              </Button>
              <Button
                onClick={() => setActiveSubTab("cleaning")}
                className={`px-4 py-2 hover:cursor-pointer ${
                  activeSubTab === "cleaning"
                    ? "bg-blue-600 text-white rounded-lg text-sm"
                    : "bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
                }`}
              >
                <BrushCleaning size={16} />
                ทำความสะอาด ({cleaningHistory.length})
              </Button>
            </div>
          </div>

          <AllServiceHistoryTab
            allServiceHistory={allServiceHistory}
            activeSubTab={activeSubTab}
          />

          <MovingServiceTab
            movingHistory={movingHistory}
            activeSubTab={activeSubTab}
          />

          <CleaningServiceTab
            cleaningHistory={cleaningHistory}
            activeSubTab={activeSubTab}
          />
        </div>
      )}
    </div>
  );
}

export default ServiceTab;
