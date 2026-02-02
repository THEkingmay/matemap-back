import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

/* =====================================================
   GET : ดึงงานทั้งหมดของ provider
===================================================== */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: provider_id } = await context.params;

    if (!provider_id) {
      return NextResponse.json(
        { message: "no provider id" },
        { status: 400 }
      );
    }

    const isAuth = await validateRequest(req, provider_id);
    if (!isAuth) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("service_history")
      .select(`
        id,
        created_at,
        start_location,
        destination_location,
        detail,
        start_date,
        end_date,
        status,
        customer:users!service_history_customer_id_fkey (
          id,
          email,
          user_detail (
            name,
            bio,
            tag,
            image_url,
            faculty,
            major,
            birth_year,
            tel
          )
        ),
        service:services!service_history_service_type_id_fkey (
          id,
          name
        )
      `)
      .eq("provider_id", provider_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}

/* =====================================================
   PUT : provider action (accept / done / reject)
===================================================== */

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: provider_id } = await context.params;
    const { history_id, action } = await req.json();

    // 1. Validation เบื้องต้น
    if (!provider_id || !history_id || !action) {
      return NextResponse.json({ message: "missing params" }, { status: 400 });
    }

    const isAuth = await validateRequest(req, provider_id);
    if (!isAuth) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    // 2. ดึงข้อมูล History
    const { data: history, error } = await supabase
      .from("service_history")
      .select("*")
      .eq("id", history_id)
      .single();

    if (error || !history) {
      return NextResponse.json({ message: "history not found" }, { status: 404 });
    }

    if (history.provider_id !== provider_id) {
      return NextResponse.json({ message: "not your job" }, { status: 403 });
    }

    /* ================= ACTION HANDLERS ================= */
    
    // CASE 1: ACCEPT
    if (action === "accepted") {
      if (history.status !== "pending") {
        return NextResponse.json(
          { message: "cannot accept this job (status is not pending)" },
          { status: 400 }
        );
      }

      // ตรวจสอบเวลาชน (Overlap Check)
      const { data: existingBookings, error: exitError } = await supabase
        .from("service_timetable")
        .select("id") // เลือกแค่ ID ก็พอเพื่อความเร็ว
        .eq("service_provider_id", provider_id) 
        .lt("start_date", history.end_date)
        .gt("end_date", history.start_date);

      if (exitError) throw exitError;
      if (existingBookings && existingBookings.length > 0) {
        return NextResponse.json(
          { message: "Time slot overlap! Cannot accept." },
          { status: 409 }
        );
      }

      // Insert ลงตารางเวลา
      const { error: insertError } = await supabase.from("service_timetable").insert({
        service_provider_id: provider_id,
        start_date: history.start_date,
        end_date: history.end_date,
        service_history_id: history_id,
        type: "booked",
      });
      
      if (insertError) throw insertError;
      
      await supabase
        .from("service_history")
        .update({ status: "accepted" })
        .eq("id", history_id);
    } 
    
    // CASE 2: DONE
    else if (action === "done") { // ใช้ else if เพื่อความชัดเจน
      if (history.status !== "accepted") {
        return NextResponse.json(
          { message: "job not accepted yet" },
          { status: 400 }
        );
      }

      await supabase
        .from("service_history")
        .update({ status: "done" })
        .eq("id", history_id);
    } 
    
    // CASE 3: REJECT
    else if (action === "rejected") {
      if (history.status === "done") {
        return NextResponse.json(
          { message: "cannot reject completed job" },
          { status: 400 }
        );
      }

      await supabase
        .from("service_history")
        .update({ status: "rejected" })
        .eq("id", history_id);

      // ลบออกจากตารางเวลา (ถ้ามี)
      await supabase
        .from("service_timetable")
        .delete()
        .eq("service_history_id", history_id);
    } 
    
    // CASE DEFAULT: Unknown Action
    else {
        return NextResponse.json({ message: "invalid action" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "update success" },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}