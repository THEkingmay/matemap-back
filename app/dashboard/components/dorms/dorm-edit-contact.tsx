import { Phone, User, AlertCircle, MessageCircle, Share2 } from "lucide-react";
import { FormEditData, FormErrors } from "../../lib/types";

type Props = {
  formData: FormEditData;
  errors: FormErrors;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

function DormEditFormContact({ formData, errors, handleChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
        <Phone className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลติดต่อ</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อเจ้าของหอพัก <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="owner_name"
            value={formData?.owner_name}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.owner_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="คุณสมชาย ใจดี"
          />
        </div>
        {errors.owner_name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.owner_name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="tel"
            name="owner_tel"
            value={formData?.owner_tel}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.owner_tel ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0812345678"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          กรุณากรอกเบอร์โทรศัพท์ 10 หลัก เริ่มต้นด้วย 0
        </p>
        {errors.owner_tel && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.owner_tel}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Line ID <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
        </label>
        <div className="relative">
          <MessageCircle
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="id_line"
            value={formData?.id_line}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="@dormname"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Social Media Link{" "}
          <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
        </label>
        <div className="relative">
          <Share2
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="url"
            name="social_media_link"
            value={formData?.social_media_link}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.social_media_link ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://facebook.com/dormpage"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          ลิงก์ Facebook, Instagram หรือ Social Media อื่นๆ
        </p>
        {errors.social_media_link && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.social_media_link}
          </p>
        )}
      </div>
    </div>
  );
}

export default DormEditFormContact;
