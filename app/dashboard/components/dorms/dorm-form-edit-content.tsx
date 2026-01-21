import { Building2, AlertCircle } from "lucide-react";
import { FormEditData, FormErrors } from "../../lib/types";

type Props = {
  formData: FormEditData;
  errors: FormErrors;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

function DormEditFormContent({ formData, errors, handleChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
        <Building2 className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลพื้นฐาน</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อหอพัก <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData?.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="หอพักอินดี้"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รายละเอียดหอพัก <span className="text-red-500">*</span>
        </label>
        <textarea
          name="detail"
          value={formData?.detail}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.detail ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="รายละเอียดเกี่ยวกับหอพัก สิ่งอำนวยความสะดวก ฯลฯ"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData?.detail.length} / 10 ตัวอักษรขึ้นไป
        </p>
        {errors.detail && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.detail}
          </p>
        )}
      </div>
    </div>
  );
}

export default DormEditFormContent;
