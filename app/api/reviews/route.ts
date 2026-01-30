import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    try {
        const body = await req.json();
        const { history_id, rating, comment } = body;

        // 1. Validate Input: กันค่าว่างก่อนเริ่ม process
        if (!history_id || !rating) {
            return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน (Missing required fields)" }, { status: 400 });
        }

        // 2. Check Owner: ดึง customer_id มาตรวจสอบ
        const { data: historySelect, error: historySelectError } = await supabase
            .from('service_history')
            .select('customer_id') // *Tip: ถ้าตาราง review ต้องเก็บ provider_id ด้วย ให้ select provider_id มาตรงนี้เลย
            .eq('id', history_id)
            .single();

        if (historySelectError || !historySelect) {
            return NextResponse.json({ message: "ไม่พบประวัติการใช้งานนี้" }, { status: 404 });
        }

        // 3. Auth Check
        const isAuthorized = await validateRequest(req, historySelect.customer_id);
        
        if (!isAuthorized) {
            return NextResponse.json({ message: "ไม่มีสิทธิ์เข้าถึง (Unauthorized)" }, { status: 401 });
        }

        // 4. Insert Review
        const { error: insertError } = await supabase
            .from('service_review')
            .insert({
                service_history_id: history_id,
                rate: Number(rating), // แปลงเป็นตัวเลขเพื่อความชัวร์
                review: comment || ""  // กัน null
            });

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ message: "บันทึกรีวิวสำเร็จ" }, { status: 201 });

    } catch (err) {
        console.error("Review API Error:", err); // Log error ไว้ที่ฝั่ง server ด้วยเพื่อการ debug
        return NextResponse.json({ message: (err as Error).message }, { status: 500 });
    }
}