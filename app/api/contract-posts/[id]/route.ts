import { NextResponse, NextRequest } from "next/server";
import supabase from "@/configs/supabase";

// Get contract post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("contract_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
