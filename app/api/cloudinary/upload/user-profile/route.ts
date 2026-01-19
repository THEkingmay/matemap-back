import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import { validateRequest } from "@/utils/token";

// User05
// http://localhost:3000/api/cloudinary/upload?userId=1a2dc8d3-4478-4767-8d43-266783452d0f
// Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMmRjOGQzLTQ0NzgtNDc2Ny04ZDQzLTI2Njc4MzQ1MmQwZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY4ODQwMDkzLCJleHAiOjE3Njg5MjY0OTN9.5UFPb781rxyAfFlpO70oDSqfd_3xPjRm5f1qC89jWpc

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    // 1. อ่าน userId จาก query
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 2.ตรวจสิทธิ์ (token ต้องเป็นของ userId)
    const isAuthorized = await validateRequest(req, userId);

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "คุณไม่มีสิทธิ์อัปโหลดในนามบัญชีนี้" },
        { status: 401 }
      );
    }

    // 3. รับไฟล์
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 4. ตรวจขนาดไฟล์
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5 MB" },
        { status: 413 }
      );
    }

    // 5.แปลง File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Upload ไป Cloudinary (แยก folder ตาม user)
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/users/${userId}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 7️⃣ ส่งผลลัพธ์กลับ
    return NextResponse.json({
      message: "Upload success",
      uploaded_by: userId,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      size: file.size,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
