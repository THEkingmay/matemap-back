"use client";

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { FormEditData, FormErrors } from "../../lib/types/index";
import { normalizeDorm } from "../../lib/util";
import DormEditFooter from "./dorm-edit-footer";
import DormEditFormContent from "./dorm-form-edit-content";
import DormEditFormAddress from "./dorm-edit-address";
import DormEditFormContact from "./dorm-edit-contact";
import DormEditPageHeader from "./dorm-edit-header";

function DormEditPage({ dorm }: { dorm: FormEditData }) {
  const [formData, setFormEditData] = useState<FormEditData>(
    normalizeDorm(dorm),
  );
  const [errors, setErrors] = useState<FormErrors>({});

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <DormEditPageHeader formData={formData} />

          <div className="p-6 space-y-8">
            <DormEditFormContent
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />

            <DormEditFormAddress
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />

            <DormEditFormContact
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />

            <DormEditFooter
              dorm={dorm}
              formData={formData}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DormEditPage;
