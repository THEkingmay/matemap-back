"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateFormSubFunction } from "../../lib/util";
import { FormEditData, FormErrors } from "../../lib/types";
import { updateDormByID } from "../../lib/db/dorms/queries";
import { toast } from "react-toastify";

function DormEditFooter({
  dorm,
  formData,
  errors,
  setErrors,
}: {
  dorm: FormEditData;
  formData: FormEditData;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors = validateFormSubFunction({ formData });

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
  );
}

export default DormEditFooter;
function validateForm() {
  throw new Error("Function not implemented.");
}
