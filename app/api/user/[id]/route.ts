import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { UserDetail } from "@/types/type";
import { validateRequest } from "@/utils/token";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Security Check: ตรวจสอบสิทธิ์ก่อนเสมอ
  const isAuthorized = await validateRequest(req , id);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูล" },
      { status: 401 }
    );
  }

  try {
    // 2. Data Fetching: ดึงข้อมูลจาก Supabase
    const { data, error } = await supabase
      .from("user_detail")
      .select("*")
      .eq("id", id)
      .single(); // ใช้ .single() เพื่อเอา Object เดียว ถ้ามั่นใจว่า id ไม่ซ้ำ

    // 3. Error Handling: จัดการกรณี Error จาก Database
    if (error) {
      console.error("Supabase Error:", error);
      // เช็คกรณีไม่เจอก็ได้ (Supabase มักส่ง code PGRST116 ถ้าไม่เจอข้อมูลเมื่อใช้ single)
      if (error.code === 'PGRST116') {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Success Response: ส่งข้อมูลกลับ
    // สามารถ Cast type เพื่อความมั่นใจ (Optional)
    const userDetail = data as UserDetail; 
    return NextResponse.json(userDetail, { status: 200 });

  } catch (err) {
    // 5. Catch All: กันเหนียวสำหรับ Error ที่คาดไม่ถึง
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. ตรวจสอบความปลอดภัย (Security Check)
  // ตรวจสอบว่าผู้ร้องขอมีสิทธิ์แก้ไขข้อมูลของ id นี้หรือไม่ (ป้องกันการแก้ข้อมูลคนอื่น)
  const isAuthorized = await validateRequest(req, id);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลนี้" }, // Unauthorized
      { status: 401 }
    );
  }

  try {
    // 2. รับข้อมูลที่ต้องการแก้ (Parse Body)
    const body = await req.json();

    // 3. ดำเนินการอัปเดต (Update Operation)
    const { data, error } = await supabase
      .from("user_detail")
      .update(body) 
      .eq("id", id)
      .select()     
      .single();   

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(body as UserDetail, { status: 200 });

  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. ตรวจสอบความปลอดภัย (Security Check)
  // เช็คสิทธิ์ก่อนลบเสมอ เพื่อป้องกันการลบข้อมูลโดยพลการ
  const isAuthorized = await validateRequest(req, id);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์ในการลบข้อมูลนี้" },
      { status: 401 }
    );
  }

  try {
    // 2. ดำเนินการลบ (Delete Operation)
    const { error } = await supabase
      .from("user_detail")
      .delete()
      .eq("id", id); // ลบแถวที่มี id ตรงกัน

    if (error) {
      console.error("Supabase Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. แจ้งผลสำเร็จ (Success Response)
    // การลบมักจะไม่ส่ง data กลับ แต่ส่งข้อความยืนยัน
    return NextResponse.json(
      { message: "ลบข้อมูลผู้ใช้สำเร็จ" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}