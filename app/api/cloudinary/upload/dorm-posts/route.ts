import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { getUserIdFromRequest } from "@/utils/token";
import { checkOwnershipAsDorm } from "@/utils/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dormId = req.nextUrl.searchParams.get("dormId");
    const postId = req.nextUrl.searchParams.get("postId");

    if (!dormId || !postId) {
      return NextResponse.json(
        { error: "Missing dormId or postId" },
        { status: 400 }
      );
    }

    const ownership = await checkOwnershipAsDorm(req, dormId);

    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
      );
    }

    const { data: post, error } = await supabase
      .from("dorm_posts")
      .select("public_image_url, dorm_id")
      .eq("id", postId)
      .eq("dorm_id", dormId)
      .single();

    if (error || !post) {
      console.log(error)
      return NextResponse.json(
        { error: "Post not found or no permission" },
        { status: 403 }
      );
    }

    // Parse file
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

    // Remove old image
    if (post.public_image_url) {
      await cloudinary.uploader.destroy(post.public_image_url);
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/dorm/${dormId}/posts/${postId}`,
          resource_type: "image",
          transformation: [{ width: 1200, height: 630, crop: "fill" }],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Update DB
    await supabase
      .from("dorm_posts")
      .update({
        image_url: uploadResult.secure_url,
        public_image_url: uploadResult.public_id,
      })
      .eq("id", postId)
      .eq("dorm_id", dormId);

    return NextResponse.json({
      message: "Upload post image success",
      postId,
      imageUrl: uploadResult.secure_url,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
