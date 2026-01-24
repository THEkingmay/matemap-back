import { Building2, FileCheck, HeartHandshake, User } from "lucide-react";
import { useState } from "react";
import DormTab from "./dorms-tab";
import PostTab from "./posts-tab";
import ServiceTab from "./service-tab";

function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("dorms");

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("dorms")}
          className={`px-6 py-3 font-medium ${activeTab === "dorms" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          <div className="flex items-center gap-2">
            <Building2 size={20} />
            บัญชีหอพัก
          </div>
        </button>
        <button
          onClick={() => setActiveTab("approval")}
          className={`px-6 py-3 font-medium ${activeTab === "approval" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          <div className="flex items-center gap-2">
            <FileCheck size={20} />
            อนุมัติโพสต์
          </div>
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-6 py-3 font-medium ${activeTab === "services" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          <div className="flex items-center gap-2">
            <HeartHandshake size={20} />
            บริการรับจ้าง
          </div>
        </button>
      </div>

      <div className="p-6">
        <DormTab activeTab={activeTab} />

        <PostTab activeTab={activeTab} />

        <ServiceTab activeTab={activeTab} />
      </div>
    </div>
  );
}

export default DashboardTabs;
