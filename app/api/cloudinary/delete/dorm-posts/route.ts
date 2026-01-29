import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { getUserIdFromRequest } from "@/utils/token";
import { checkOwnershipAsDorm } from "@/utils/auth";

export async function DELETE(req: NextRequest) {
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
      return NextResponse.json(
        { error: "Post not found or no permission" },
        { status: 403 }
      );
    }

    if (!post.public_image_url) {
      return NextResponse.json(
        { error: "Post has no image" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(post.public_image_url);

    await supabase
      .from("dorm_posts")
      .update({
        image_url: null,
        public_image_url: null,
      })
      .eq("id", postId)
      .eq("dorm_id", dormId);

    return NextResponse.json({
      message: "Delete post image success",
      postId,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
