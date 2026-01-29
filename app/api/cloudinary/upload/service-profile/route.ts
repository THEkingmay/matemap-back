import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. ตรวจสอบสิทธิ์การใช้งาน (Authorization)
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ตรวจสอบประเภทไฟล์และขนาด
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only jpeg/png/webp allowed" }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Max file size 5MB" }, { status: 413 });
    }

    // 2. ดึงข้อมูลรูปเดิมจาก Supabase (เพื่อเอา Public URL มาลบใน Cloudinary)
    const { data: oldProfile } = await supabase
      .from("service_worker_detail")
      .select("image_public_url")
      .eq("id", userId)
      .single();

    // ลบรูปเก่าทิ้งจาก Cloudinary ถ้ามีอยู่
    if (oldProfile?.image_public_url) {
      try {
        await cloudinary.uploader.destroy(oldProfile.image_public_url);
      } catch (err) {
        console.warn("Cloudinary delete old image failed:", err);
      }
    }

    // 3. เตรียมไฟล์สำหรับการ Upload ไปยัง Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/service-workers/${userId}/profile`,
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 4. บันทึก URL และ Public ID ลงใน Supabase
    const { error: updateError } = await supabase
      .from("service_worker_detail")
      .update({
        image_url: uploadResult.secure_url,
        image_public_url: uploadResult.public_id,
      })
      .eq("id", userId);

    // หากบันทึกลง Database พลาด ให้แจ้งเตือนทันที
    if (updateError) {
      console.error("Supabase Update Error:", updateError.message);
      return NextResponse.json(
        { error: "Image uploaded but DB update failed", details: updateError.message },
        { status: 500 }
      );
    }

    // 5. ส่งผลลัพธ์กลับไปยัง Client
    return NextResponse.json({
      message: "Upload success", 
      uploaded_by: userId, 
      url: uploadResult.secure_url, 
      public_url: uploadResult.public_id, 
      size: file.size,
    });

  } catch (err) {
    console.error("Server Error:", (err as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}