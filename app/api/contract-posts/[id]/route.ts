import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 1. Fetch the post first
  const { data: contractPost, error: postError } = await supabase
    .from("contract_posts")
    .select("*")
    .eq("id", id)
    .single();

  // 2. Check if the post exists before trying to use its properties
  if (postError || !contractPost) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  // 3. Fetch owner detail using the ID from the post
  const { data: userDetail, error: userError } = await supabase
    .from("user_detail")
    .select("*")
    .eq("id", contractPost.user_id)
    .single();

  return NextResponse.json({ 
      post: contractPost, 
      owner: userDetail || null // Graceful fallback if user is missing
  });
}