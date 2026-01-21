"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  User,
  MessageCircle,
  Share2,
  AlertCircle,
} from "lucide-react";
import { FormEditData } from "../../lib/types/index";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updateDormByID } from "../../lib/db/dorms/queries";

interface FormErrors {
  [key: string]: string;
}

function DormEditPage({ dorm }: { dorm: FormEditData }) {
  const normalizeDorm = (dorm: FormEditData): FormEditData => ({
    ...dorm,
    owner_name: dorm.owner_name ?? "",
    owner_tel: dorm.owner_tel ?? "",
    id_line: dorm.id_line ?? "",
    social_media_link: dorm.social_media_link ?? "",
    detail: dorm.detail ?? "",
  });

  const [formData, setFormEditData] = useState<FormEditData>(
    normalizeDorm(dorm),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!dorm) return;

    setFormEditData(normalizeDorm(dorm));
  }, [dorm]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormEditData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData?.name.trim()) newErrors.name = "กรุณากรอกชื่อหอพัก";
    if (!formData?.dorm_number.trim())
      newErrors.dorm_number = "กรุณากรอกเลขที่";
    if (!formData?.sub_district.trim())
      newErrors.sub_district = "กรุณากรอกตำบล/แขวง";
    if (!formData?.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
    if (!formData?.city.trim()) newErrors.city = "กรุณากรอกเมือง";
    if (!formData?.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!formData?.postal_code.trim() || formData?.postal_code.length !== 5) {
      newErrors.postal_code = "กรุณากรอกรหัสไปรษณีย์ 5 หลัก";
    }
    if (!formData?.detail.trim() || formData?.detail.length < 10) {
      newErrors.detail = "กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร";
    }
    if (!formData?.owner_name.trim())
      newErrors.owner_name = "กรุณากรอกชื่อเจ้าของหอพัก";
    if (!formData?.owner_tel.match(/^0\d{9}$/)) {
      newErrors.owner_tel = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (0xxxxxxxxx)";
    }
    if (
      formData?.social_media_link &&
      !formData?.social_media_link.match(/^https?:\/\/.+/)
    ) {
      newErrors.social_media_link = "กรุณากรอก URL ให้ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    if (!dorm.id) return;

    try {
      setIsSubmitting(true);
      await updateDormByID(dorm.id, formData);
      toast.success("บันทึกข้อมูลสำเร็จ!");
    } catch (err) {
      toast.error("บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">
                {formData?.name}
              </h1>
            </div>
            <p className="text-gray-600">อัปเดตข้อมูลหอพักของคุณ</p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-8">
            {/* ข้อมูลพื้นฐาน */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <Building2 className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">
                  ข้อมูลพื้นฐาน
                </h3>
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

            {/* ที่อยู่ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <MapPin className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">ที่อยู่</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขที่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dorm_number"
                    value={formData?.dorm_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dorm_number ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123"
                  />
                  {errors.addressNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.addressNumber}
                    </p>
                  )}
                </div>

                <div>
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.street}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ตำบล/แขวง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sub_district"
                    value={formData?.sub_district}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.sub_district ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="หัวหมาก"
                  />
                  {errors.sub_district && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.sub_district}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อำเภอ/เขต <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData?.district}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="บางกะปิ"
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เมือง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData?.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="กรุงเทพมหานคร"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จังหวัด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData?.province}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.province ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="กรุงเทพมหานคร"
                  />
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.province}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสไปรษณีย์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData?.postal_code}
                    onChange={handleChange}
                    maxLength={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10240"
                  />
                  {errors.postal_code && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.postal_code}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ข้อมูลติดต่อ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <Phone className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">
                  ข้อมูลติดต่อ
                </h3>
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
                  Line ID{" "}
                  <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
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
                      errors.social_media_link
                        ? "border-red-500"
                        : "border-gray-300"
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

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 hover:cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 hover:cursor-pointer"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DormEditPage;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
