import supabase from "@/configs/supabase";
import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "@/utils/token";

/* =========================
   Helper: auth guard
========================= */
async function authorize(req: NextRequest, userId: string) {
  const isAllowed = await validateRequest(req, userId);

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}

/* =========================
   GET /api/service-workers/[id]
========================= */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const authError = await authorize(req, id);
  if (authError) return authError;

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      service_worker_detail (
        name,
        tel,
        image_url,
        car_registration,
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/* =========================
   PUT /api/service-workers/[id]
========================= */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const authError = await authorize(req, id);
  if (authError) return authError;

  const {
    name,
    tel,
    image_url,
    image_public_url,
    car_registration,
  } = await req.json();

  const { error } = await supabase
    .from("service_worker_detail")
    .update({
      name,
      tel,
      image_url,
      image_public_url,
      car_registration,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "updated" });
}

/* =========================
   DELETE /api/service-workers/[id]
========================= */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const authError = await authorize(req, id);
  if (authError) return authError;

  await supabase
    .from("service_worker_detail")
    .delete()
    .eq("id", id);

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "deleted" });
}
