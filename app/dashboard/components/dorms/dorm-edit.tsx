"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, AlertCircle } from "lucide-react";
import { FormEditData } from "../../lib/types";

import AddressSection from "./dorm-edit-address";
import ImageUploader from "./dorm-edit-header";

interface FormErrors {
  [key: string]: string;
}

function DormEditPage({ dorm }: { dorm: FormEditData }) {
  // ... (State และ Logic เดิมคงไว้เหมือนเดิม) ...
  const [formData, setFormEditData] = useState<FormEditData>({ ...dorm });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(dorm?.image_url || null);

  useEffect(() => {
    if (dorm) {
      setFormEditData({ ...dorm });
      setPreviewImage(dorm.image_url || null);
    }
  }, [dorm]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
  }
  const setImageToInitial = () => {
    setSelectedImage(null);
    setPreviewImage(dorm?.image_url || null);
  }

  const validateForm = (): boolean => {
    // ... logic เดิม ...
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!formData.name.trim()) { newErrors.name = "กรุณาระบุชื่อหอพัก"; isValid = false; }
    if (!formData.owner_name.trim()) { newErrors.owner_name = "กรุณาระบุชื่อนิติ/เจ้าของ"; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    // ... logic save เดิม ...
    if (!validateForm()) { toast.error("กรุณากรอกข้อมูลสำคัญ"); return; }
    setLoading(true);
    try {
        // อับโหลดข้อมูลปกติ 
        const res =await fetch(`/api/dorms/${dorm.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) { throw new Error("Failed to update dorm data"); }

        // อัปโหลดรูปภาพถ้ามีการเปลี่ยนแปลง
        if (selectedImage) {
            const formDataImage = new FormData();
            formDataImage.append("file", selectedImage);
            const uploadRes = await fetch(`/api/cloudinary/upload/dorm-profile?dormId=${dorm.id}`, {
                method: "POST",
                body: formDataImage,
            });
            if (!uploadRes.ok) { throw new Error(`Failed to upload image `); }
        }

        toast.success("บันทึกข้อมูลหอพักเรียบร้อยแล้ว");

    } catch (e) { 
      console.error((e as Error).message);
      toast.error("Error"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">แก้ไขข้อมูลหอพัก</h1>
          <p className="text-blue-100 mt-1">จัดการข้อมูลและรายละเอียดที่พักของคุณ</p>
        </div>

        <div className="p-8 flex flex-col ">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Image Uploader Component */}
          <div className="lg:col-span-1">
             <ImageUploader 
                previewImage={previewImage} 
                handleImageChange={handleImageChange} 
                removeImage={removeImage}
                dormId={dorm.id}
                setImageToInitial={setImageToInitial}
             />
          </div>
           <div className="bg-gray-50 p-6 col-span-2 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle size={18} className="mr-2 text-blue-600" />
                ข้อมูลจำเป็น
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหอพัก <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อนิติ/เจ้าของ <span className="text-red-500">*</span></label>
                    <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
                    />
                     {errors.owner_name && <p className="text-red-500 text-xs mt-1">{errors.owner_name}</p>}
                </div>
              </div>
            </div>
          </div>
          {/* Right: Form Fields */}
          <div className="lg:col-span-2 space-y-6">


            {/* Section 2: Address Component (ที่แยกออกมา) */}
            <AddressSection formData={formData} handleChange={handleChange} />

            {/* Section 3: Contact (รวมไว้ในหน้าหลักก่อน หรือจะแยกเพิ่มก็ได้) */}
            <div className="space-y-4 pt-2">
                 <div className="flex flex-col space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100   ">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertCircle size={18} className="mr-2 text-blue-600" />
                      ช่องทางการติดต่อ
                      </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                        <input type="text" name="owner_tel" value={formData.owner_tel || ""} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                    {/* social media link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ลิ้งโซเชียลมีเดีย</label>
                        <input type="text" name="social_media_link" value={formData.social_media_link || ""} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Line ID</label>
                        <input type="text" name="id_line" value={formData.id_line || ""} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                 </div>
                  <div className="flex flex-col space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100   ">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertCircle size={18} className="mr-2 text-blue-600" />
                      รายละเอียดของหอพัก
                      </h3>
  
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                        <textarea name="detail" value={formData.detail || ""} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                 </div>
                 <div className="pt-6 flex justify-end space-x-3">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center">
                        <Save size={18} className="mr-2" /> {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
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