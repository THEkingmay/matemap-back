import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { verifyToken } from "@/utils/token";

export async function POST(req: NextRequest) {
  try {
    // 1. แปลงข้อมูลจาก Body อย่างปลอดภัย
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "รูปแบบ JSON ไม่ถูกต้อง" }, 
        { status: 400 }
      );
    }

    const { id, target_id, action } = body;

    // 2. ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (!id || !target_id || !action) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน: กรุณาระบุ id, target_id และ action" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('Authorization');
    
    // ตรวจสอบว่ามี Header และเป็น format "Bearer <token>" หรือไม่
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // ดึงเฉพาะตัว Token ออกมา (ตัดคำว่า Bearer)

    // ตรวจสอบความถูกต้องของ Token
    const user = await verifyToken(token);
    
    if (!user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (id !== user.id) {
       return NextResponse.json(
         { error: "Forbidden: คุณไม่สามารถทำรายการแทนผู้อื่นได้" },
         { status: 403 }
       );
    }

    // 3. ตรวจสอบชนิดข้อมูล
    if (typeof id !== "string" || typeof target_id !== "string") {
      return NextResponse.json(
        { error: "ชนิดข้อมูลไม่ถูกต้อง: ID ต้องเป็นตัวอักษร (String)" },
        { status: 400 }
      );
    }

    // 4. ตรวจสอบตรรกะ: ป้องกันการปัดตัวเอง
    if (id === target_id) {
      return NextResponse.json(
        { error: "การดำเนินการไม่ถูกต้อง: คุณไม่สามารถปัดเลือกตัวเองได้" },
        { status: 400 }
      );
    }

    // 5. ตรวจสอบค่า Action
    const allowedActions = ["like", "pass"]; 
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: `Action ไม่ถูกต้อง ค่าที่ยอมรับได้คือ: ${allowedActions.join(", ")}` },
        { status: 400 }
      );
    }

    // 6. ดำเนินการบันทึกลงฐานข้อมูล (Card Swipes)
    const { error: insertError } = await supabase.from("card_swipes").insert({
      owner_id: id,
      target_id: target_id,
      action: action,
    });

    if (insertError) {
      if (insertError.code === "23505") { // Duplicate key
         return NextResponse.json(
          { error: "คุณได้ทำการปัดเลือกผู้ใช้นี้ไปแล้ว" },
          { status: 409 }
        );
      }
      
      console.error("Supabase Error (Insert Swipe):", insertError);
      return NextResponse.json(
        { error: "ไม่สามารถบันทึกข้อมูลการปัดได้" },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // ❤️ Match Logic: ตรวจสอบว่า "ใจตรงกัน" หรือไม่
    // ---------------------------------------------------------
    let isMatch = false;

    // เราจะเช็ค Match ก็ต่อเมื่อเรากด "Like" เท่านั้น (ถ้า Pass ไม่ต้องเช็ค)
    if (action === "like") {
        // เช็คว่าอีกฝ่าย (target_id) เคย Like เรา (owner_id) มาก่อนหน้านี้ไหม
        const { data: reciprocalLike } = await supabase
            .from("card_swipes")
            .select("*")
            .eq("owner_id", target_id) // เขาเป็นคนกด
            .eq("target_id", id)       // กดหาเรา
            .eq("action", "like")      // และต้องเป็น like
            .single(); // เอาแค่รายการเดียวพอ

        if (reciprocalLike) {
            // เจอว่าเขา Like เรามาเหมือนกัน! -> สร้าง Match
            isMatch = true;
            
            const { error: matchError } = await supabase
                .from("matches") // สมมติชื่อตาราง matches
                .insert({ 
                    user1_id: id, 
                    user2_id: target_id 
                });

            if (matchError) {
                console.error("Failed to create match record:", matchError);
            }
        }
    }

    // 7. ส่งค่าตอบกลับเมื่อสำเร็จ
    return NextResponse.json(
      { 
        message: isMatch ? "It's a Match! ใจตรงกัน!" : "บันทึกการปัดสำเร็จ",
        is_match: isMatch 
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ (Internal Server Error)" },
      { status: 500 }
    );
  }
}