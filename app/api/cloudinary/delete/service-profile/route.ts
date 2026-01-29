import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // 1. ดึง ID ของ Service Worker จาก Query Params (?workerId=...)
    const { searchParams } = new URL(req.url);
    const workerId = searchParams.get("workerId");

    if (!workerId) {
      return NextResponse.json({ error: "Missing worker ID" }, { status: 400 });
    }

    // 2. ดึงข้อมูลเดิมจาก Supabase
    // เราเลือก image_public_url เพราะเราเก็บ public_id เต็มรูปแบบไว้ที่นี่แล้ว
    const { data: workerData, error: fetchError } = await supabase
      .from("service_worker_detail")
      .select("id, image_public_url") 
      .eq("id", workerId)
      .single();

    if (fetchError || !workerData) {
      return NextResponse.json({ error: "Service worker not found" }, { status: 404 });
    }

    // 3. ตรวจสอบสิทธิ์ (Authorization)
    const isAuthorized = await validateRequest(req, workerId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: You don't have permission" },
        { status: 401 }
      );
    }

    // 4. ลบรูปใน Cloudinary
    if (workerData.image_public_url) {
      /**
       * แก้ไขจุดนี้: เนื่องจากใน DB คอลัมน์ image_public_url เก็บค่า public_id เต็มๆ ไว้แล้ว
       * เช่น 'matemap/service-workers/id/profile/filename'
       * เราจึงส่งค่านั้นเข้าไปที่ cloudinary.uploader.destroy ได้ทันทีโดยไม่ต้องตัด URL
       */
      const result = await cloudinary.uploader.destroy(workerData.image_public_url);
      
      // log เพื่อเช็คสถานะการลบในฝั่ง Backend
      console.log("Cloudinary destroy result:", result); 
      
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error("Failed to delete image from Cloudinary storage");
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
      { error: (err as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}