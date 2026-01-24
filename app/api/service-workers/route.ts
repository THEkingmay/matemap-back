import supabase from "@/configs/supabase";
import { NextResponse } from "next/server";

// GET /api/service-workers/ - ดึงข้อมูลคนรับจ้าง
export async function GET(
  request: Request
) {


  try {
   const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      service_worker_detail (
        name,
        tel,
        image_url,
        created_at
      ),
      service_and_worker!inner (
        services (
          id,
          name
        )
      )
    `);

    if (error) throw error;

     return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}