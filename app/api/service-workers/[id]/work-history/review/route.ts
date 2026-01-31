import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { message: "No service worker ID" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
    .from("service_review")
    .select(`
        id,
        review,
        rate,
        created_at,
        service_history!inner (
        id,
        start_date,
        end_date,

        services!service_history_service_type_id_fkey (
            id,
            name
        ),

        users!service_history_customer_id_fkey (
            id,
            user_detail (
            name,
            image_url
            )
        )
        )
    `)
    .eq("service_history.provider_id", id)
    .order("created_at", { ascending: false });


    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}
