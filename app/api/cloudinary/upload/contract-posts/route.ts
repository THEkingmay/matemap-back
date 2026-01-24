import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const postId = req.nextUrl.searchParams.get("postId");

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing userId or postId" },
        { status: 400 }
      );
    }

    // ตรวจ token
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ตรวจว่า post เป็นของ user
    const { data: post } = await supabase
      .from("contract_posts")
      .select("image_public_id")
      .eq("id", postId)
      .eq("user_id", userId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or no permission" },
        { status: 403 }
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

    // ลบรูปเก่า (ถ้ามี)
    if (post.image_public_id) {
      await cloudinary.uploader.destroy(post.image_public_id);
    }

    // upload ใหม่
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/contract-posts/${postId}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "fill" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // update DB
    await supabase
      .from("contract_posts")
      .update({
        image_url: uploadResult.secure_url,
        image_public_id: uploadResult.public_id,
      })
      .eq("id", postId);

    return NextResponse.json({
      message: "Upload post image success",
      post_id: postId,
      image_url: uploadResult.secure_url,
    });

  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
