import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

/**
 * ฟังก์ชันสำหรับดึง Public ID ออกจาก Cloudinary URL
 * เพราะการลบรูปต้องใช้ ID (เช่น 'folder/image_name') ไม่ใช่ URL ทั้งหมด
 */
const getPublicIdFromUrl = (url: string) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // ดึงชื่อไฟล์พร้อมนามสกุล
  const publicId = fileName?.split(".")[0]; // ตัดนามสกุลออก
  return publicId;
};

export async function DELETE(req: NextRequest) {
  try {
    // 1. ดึง ID ของ Service Worker จาก Query Params (?workerId=...)
    const { searchParams } = new URL(req.url);
    const workerId = searchParams.get("workerId");

    if (!workerId) {
      return NextResponse.json({ error: "Missing worker ID" }, { status: 400 });
    }

    // 2. ดึงข้อมูลเดิมจาก Supabase เพื่อนำมาลบใน Cloudinary
    const { data: workerData, error: fetchError } = await supabase
      .from("service_worker_detail")
      .select("id, image_public_url") 
      .eq("id", workerId)
      .single();

    if (fetchError || !workerData) {
      return NextResponse.json({ error: "Service worker not found" }, { status: 404 });
    }

    // 3. ตรวจสอบสิทธิ์ (Authorization)
    // การส่ง req เข้าไปใน validateRequest เพื่อเช็ค Token ของ User ปัจจุบัน
    const isAuthorized = await validateRequest(req, workerId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: You don't have permission" },
        { status: 401 }
      );
    }

    // 4. ลบรูปใน Cloudinary (ถ้ามีข้อมูลใน image_public_url)
    if (workerData.image_public_url) {
      // ดึง public_id ออกจาก URL ก่อนส่งไปลบ
      const publicId = getPublicIdFromUrl(workerData.image_public_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 5. อัปเดต Database ใน Supabase ให้เป็นค่าว่าง
    const { error: updateError } = await supabase
      .from("service_worker_detail")
      .update({
        image_url: null,
        image_public_url: null,
      })
      .eq("id", workerId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: "Delete image successfully" });

  } catch (err) {
    console.error("Delete Error:", (err as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}