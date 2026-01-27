import supabase from "@/configs/supabase";
import { NextResponse } from "next/server";

// GET /api/service-workers/[id]
export async function GET(
  req: Request,
  Params: { params: Promise<{ id: string }> }
) {
  const { id } = await Params.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

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
      service_and_worker (
        services (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
