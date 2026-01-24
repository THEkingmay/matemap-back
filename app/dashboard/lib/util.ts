import { FormEditData, FormErrors } from "./types";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("th-Th", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function normalizeDorm(dorm: FormEditData): FormEditData {
  return {
    ...dorm,
    owner_name: dorm.owner_name ?? "",
    owner_tel: dorm.owner_tel ?? "",
    id_line: dorm.id_line ?? "",
    social_media_link: dorm.social_media_link ?? "",
    detail: dorm.detail ?? "",
  };
}

export function validateFormSubFunction({
  formData
}: {formData : FormEditData}): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData) return newErrors;

  if (!formData?.name?.trim()) newErrors.name = "กรุณากรอกชื่อหอพัก";
  if (!formData?.dorm_number?.trim())
    newErrors.dorm_number = "กรุณากรอกเลขที่";
  if (!formData?.sub_district?.trim())
    newErrors.sub_district = "กรุณากรอกตำบล/แขวง";
  if (!formData?.district?.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
  if (!formData?.city?.trim()) newErrors.city = "กรุณากรอกเมือง";
  if (!formData?.province?.trim()) newErrors.province = "กรุณากรอกจังหวัด";
  if (!formData?.postal_code?.trim() || formData?.postal_code?.length !== 5) {
    newErrors.postal_code = "กรุณากรอกรหัสไปรษณีย์ 5 หลัก";
  }
  if (!formData?.detail?.trim() || formData?.detail?.length < 10) {
    newErrors.detail = "กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร";
  }
  if (!formData?.owner_name?.trim())
    newErrors.owner_name = "กรุณากรอกชื่อเจ้าของหอพัก";
  if (!formData?.owner_tel?.match(/^0\d{9}$/)) {
    newErrors.owner_tel = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (0xxxxxxxxx)";
  }
  if (
    formData?.social_media_link &&
    !formData?.social_media_link?.match(/^https?:\/\/.+/)
  ) {
    newErrors.social_media_link = "กรุณากรอก URL ให้ถูกต้อง";
  }

  return newErrors;
}
