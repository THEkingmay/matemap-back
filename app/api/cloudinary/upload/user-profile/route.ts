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

    // ตรวจ token ว่าเป็นเจ้าของบัญชี
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only jpeg/png/webp allowed" },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Max file size 5MB" },
        { status: 413 }
      );
    }

    // ดึงรูปเก่า (ถ้ามี)
    const { data: oldProfile } = await supabase
      .from("user_detail")
      .select("image_public_id")
      .eq("id", userId)
      .single();

    // ลบรูปเก่าใน Cloudinary
    if (oldProfile?.image_public_id) {
      await cloudinary.uploader.destroy(
        oldProfile.image_public_id
      );
    }

    // Upload ใหม่
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/users/${userId}/profile`,
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // update Supabase
    await supabase
      .from("user_detail")
      .update({
        image_url: uploadResult.secure_url,
        image_public_id: uploadResult.public_id,
      })
      .eq("id", userId);

    return NextResponse.json({
      message: "Upload success", 
      uploaded_by: userId, 
      url: uploadResult.secure_url, 
      public_id: uploadResult.public_id, 
      size: file.size,
    });

  } catch (err) {
    console.error((err as  Error).message);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
