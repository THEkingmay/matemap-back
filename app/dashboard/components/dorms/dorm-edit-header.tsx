import { ChangeEvent } from "react";
import { Camera, Trash , MoveLeft } from "lucide-react";
import { toast } from "react-toastify";

interface ImageUploaderProps {
  previewImage: string | null;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  dormId: string;
  setImageToInitial?: () => void;
}

export default function ImageUploader({ 
  previewImage, 
  removeImage ,
  handleImageChange, 
  dormId ,
  setImageToInitial
}: ImageUploaderProps) {

  const handleRemoveImage = async () => {
    try{
      toast.promise(
        fetch(`/api/cloudinary/delete/dorm-profile?dormId=${dormId}`, {
          method: "DELETE",
        }), 
        {
          pending: "กำลังลบรูปภาพ...",
          success: "ลบรูปภาพสำเร็จ",
          error: "ลบรูปภาพไม่สำเร็จ",
        }
      );
      // อัปเดตสถานะใน UI
      removeImage();
    }catch(err){
      toast.error("ลบรูปภาพไม่สำเร็จ");
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md bg-white">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Dorm Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Camera size={48} />
            </div>
          )}
        </div>

        {/* ปุ่มอัปโหลด (กล้อง) */}
        <label
          htmlFor="image-upload"
          className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-all z-10"
        >
          <Camera size={20} />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {setImageToInitial && (
          <button
            type="button"
            onClick={setImageToInitial}
            className="absolute bottom-2 left-2 bg-gray-600 p-3 rounded-full text-white cursor-pointer hover:bg-gray-700 shadow-lg transition-all z-10 border-none outline-none"
            title="รีเซ็ตรูปภาพ"
          >
            <MoveLeft size={20} />
          </button>
        )}

        {/* ปุ่มลบ (ถังขยะ) - จะแสดงเฉพาะเมื่อมีรูปภาพแล้วเท่านั้น */}
        {previewImage && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-0 left-2 bg-red-600 p-3 rounded-full text-white cursor-pointer hover:bg-red-700 shadow-lg transition-all z-10 border-none outline-none"
            title="ลบรูปภาพ"
          >
            <Trash size={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500">คลิกที่กล้องเพื่อเปลี่ยนรูปโปรไฟล์</p>
    </div>
  );
}