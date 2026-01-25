import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const dormId = req.nextUrl.searchParams.get("dormId");
    if (!dormId) {
      return NextResponse.json({ error: "Missing dormId" }, { status: 400 });
    }
    // ดึง uerId ของเจ้าของหอพักจาก dormId
    const { data: dormData, error: dormError } = await supabase
      .from("dorm_detail")
      .select("user_id, image_public_id")
      .eq("id", dormId)
      .single();
    if (dormError || !dormData) {
      return NextResponse.json({ error: "Dorm not found" }, { status: 404 });
    }
    const userId = dormData.user_id;

    // ตรวจ token ว่าเป็นเจ้าของบัญชี
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    // ลบรูปเก่าใน Cloudinary
    if (dormData.image_public_id) {
      await cloudinary.uploader.destroy(
        dormData.image_public_id
      );
    }
    // update Supabase
    await supabase
      .from("dorm_detail")
      .update({
        image_url: null,
        image_public_id: null,
      })
      .eq("id", dormId);
    return NextResponse.json({ message: "Delete success" });
  } catch (err) {
    console.error((err as  Error).message);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}