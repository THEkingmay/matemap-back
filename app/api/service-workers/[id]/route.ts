import supabase from "@/configs/supabase";
import { NextResponse, NextRequest } from "next/server";
import { validateRequest, verifyToken } from "@/utils/token";
import cloudinary from "@/configs/cloudinary";

/* =========================
   Helper: auth guard
========================= */
async function authorize(req: NextRequest, userId: string) {

  // bypass staudent
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  const user = await verifyToken(token)
  if(user.role =='user') return null

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

  const body = await req.json();
  const {
    name,
    tel,
    image_url,
    image_public_url,
    car_registration,
    services, // Array ของชื่อบริการ
  } = body;

  try {
    // 1. อัปเดตตาราง service_worker_detail
    const { error: detailError } = await supabase
      .from("service_worker_detail")
      .update({
        name,
        tel,
        image_url,
        image_public_url,
        car_registration,
      })
      .eq("id", id);

    if (detailError) throw detailError;

    // 2. จัดการตารางกลาง service_and_worker (Many-to-Many)
    if (services && Array.isArray(services)) {
      // ✅ แก้จาก worker_id เป็น user_id ให้ตรงตามรูป Schema
      const { error: delError } = await supabase
        .from("service_and_worker")
        .delete()
        .eq("user_id", id);

      if (delError) throw delError;

      // ค้นหา ID ของบริการจากชื่อ
      const { data: svcData, error: svcError } = await supabase
        .from("services")
        .select("id")
        .in("name", services);

      if (svcError) throw svcError;

      if (svcData && svcData.length > 0) {
        // ✅ เตรียมข้อมูล Insert โดยใช้ user_id ให้ตรงตามรูป Schema
        const insertData = svcData.map((svc) => ({
          user_id: id,
          service_id: svc.id,
        }));

        const { error: insertError } = await supabase
          .from("service_and_worker")
          .insert(insertData);

        if (insertError) throw insertError;
      }
    }

    return NextResponse.json({ message: "updated" });
  } catch (err: any) {
    console.error("Database Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE /api/service-workers/[id]
========================= */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {

    const authError = await authorize(req, id);
    if (authError) return authError;

    await supabase
      .from("service_worker_detail")
      .delete()
      .eq("id", id);

    await supabase
      .from("users")
      .delete()
      .eq("id", id);

      const deletion_res = await  cloudinary.api.delete_resources_by_prefix(`matemap/service-workers/${id}/profile`, {resource_type: 'image' }, async() => {
        console.log("Resources deleted, now deleting the folder...");
          await cloudinary.api.delete_folder(`matemap/service-workers/${id}`, (error: any, result: any) => {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
      });

    return NextResponse.json({ message: "deleted", cloudinary_message: deletion_res });
    
  } catch (err) {
      return NextResponse.json(
        { err },
        { status: 500 }
      );
  }

  
}
