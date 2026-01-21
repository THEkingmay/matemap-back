import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

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

    const isAuthorized = await validateRequest(req, id);
    if (!isAuthorized) {
      return NextResponse.json(
        { message: "คุณไม่มีสิทธิในการกระทำนี้" },
        { status: 401 }
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
    // ❤️ Match Logic
    // ---------------------------------------------------------
    
    // กรณีที่กด Pass ไม่ต้องเช็ค Match ให้จบการทำงานเลย
    if (action === "pass") {
         return NextResponse.json({ message: "ปัดผ่านสำเร็จ", is_match: false }, { status: 200 });
    }

    // กรณีที่กด Like: เช็คว่าอีกฝ่าย (target_id) เคย Like เราไหม
    const { data: reciprocalLike } = await supabase
        .from("card_swipes")
        .select("*")
        .eq("owner_id", target_id) 
        .eq("target_id", id)       
        .eq("action", "like")      
        .single();

    // ---------------------------------------------------------
    // SCENARIO A: MATCH HAPPENED (ใจตรงกัน)
    // ---------------------------------------------------------
    if (reciprocalLike) {
        // จัดเรียง ID เพื่อให้การค้นหาห้องแชทในอนาคตง่ายขึ้น (User1 < User2 เสมอ)
        const [user1_id, user2_id] = [id, target_id].sort();

        // สร้างห้องแชท
        const { data: newRoom, error: createRoomError } = await supabase
            .from("room_chat")
            .insert({ user1_id: user1_id, user2_id: user2_id, room_chat_type: "match" })
            .select()
            .single();

        if (createRoomError || !newRoom) {
            console.error("Room Creation Error:", createRoomError);
            // แจ้ง Client ว่า Match แล้ว แต่สร้างห้องไม่สำเร็จ (Client ควร Handle กรณีนี้)
            return NextResponse.json(
                { message: "Match แล้ว แต่เกิดข้อผิดพลาดในการสร้างห้องแชท", is_match: true },
                { status: 500 }
            );
        }

        // ดึงชื่อคู่ Match (เฉพาะตอน Match เท่านั้นถึงค่อยดึง เพื่อประหยัด Resource)
        let targetName = "";
        const { data: targetData } = await supabase
            .from("user_detail")
            .select("name")
            .eq("id", target_id)
            .single();

        if (targetData) {
            targetName = targetData.name;
        }

        // Return ทันทีเมื่อจบกระบวนการ Match
        return NextResponse.json(
            {
                message: "It's a Match! ใจตรงกัน!",
                is_match: true,
                room_id: newRoom.id,
                target_name: targetName,
            },
            { status: 200 }
        );
    }


    return NextResponse.json(
        {
            message: "บันทึกการกดถูกใจสำเร็จ",
            is_match: false,
        },
        { status: 200 }
    );

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ (Internal Server Error)" },
      { status: 500 }
    );
  }
}