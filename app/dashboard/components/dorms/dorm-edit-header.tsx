import { Building2 } from "lucide-react";
import { FormEditData } from "../../lib/types";

function DormEditPageHeader({ formData }: { formData: FormEditData }) {
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <Building2 className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">{formData?.name}</h1>
      </div>
      <p className="text-gray-600">อัปเดตข้อมูลหอพักของคุณ</p>
    </div>
  );
}

export default DormEditPageHeader;
