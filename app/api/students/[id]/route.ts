import supabase from "@/configs/supabase";
import { NextResponse } from "next/server";

// GET /api/students/[id] - ดึงข้อมูลนิสิตรายบุคคล
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;

    const { data, error } = await supabase
      .from('user_detail')
      .select('*')
      .eq("id", id)
      .single();

    if (error) throw error;

     return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}