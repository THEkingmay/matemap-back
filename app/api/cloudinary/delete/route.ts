import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import cloudinary from "@/configs/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. ตรวจสอบสิทธิ์ (Authorization)
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. ดึงข้อมูลรูปเก่าเพื่อเอา public_id
    const { data: oldProfile, error: fetchError } = await supabase
      .from("user_detail")
      .select("image_public_id")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. ลบรูปใน Cloudinary (ถ้ามี)
    if (oldProfile?.image_public_id) {
      try {
        const result = await cloudinary.uploader.destroy(oldProfile.image_public_id);
        console.log("Cloudinary delete result:", result); // เก็บ Log ไว้ตรวจสอบ
      } catch (cloudinaryError) {
        console.error("Cloudinary Error:", cloudinaryError);
        // อาจจะไม่ return error ทันที เพื่อให้ process การลบใน DB ทำงานต่อได้ (Fail-safe)
      }
    }

    // 4. อัปเดต Database ให้เป็น null
    const { error: updateError } = await supabase
      .from("user_detail")
      .update({ image_url: null, image_public_id: null })
      .eq("id", userId); // ตัด .single() ออกถ้าไม่จำเป็นต้อง return data

    if (updateError) {
      throw updateError;
    }

    // 5. **สำคัญ** ส่ง Response กลับเมื่อทำงานสำเร็จ
    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("Delete API Error:", err); // Log error ออกมาดู
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}