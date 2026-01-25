import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        // 1. Validation: เช็กก่อนว่ามี userId ส่งมาไหม ถ้าไม่มีให้ error กลับไปเลย
        if (!userId) {
            return NextResponse.json(
                { message: "Missing userId" }, 
                { status: 400 }
            );
        }

        
        const isAuthorization = await validateRequest(req , userId)
        if(!isAuthorization) {
            return NextResponse.json({message : "คุณไม่มีสิทธิ"} , {status : 409})
        }

        const { data: latestSub, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .order('expired_date', { ascending: false }) // เรียงจากวันที่หมดอายุล่าสุดก่อน
            .limit(1)
            .maybeSingle(); // ใช้ maybeSingle เพื่อให้ return null ถ้าไม่เจอข้อมูล (แทนที่จะ error)

        if (error) {
            console.error("Supabase Error:", error);
            throw new Error(error.message);
        }

        // 3. Logic: ตรวจสอบสถานะ
        // กรณีที่ 1: ไม่เคยสมัครสมาชิกเลย (latestSub เป็น null) -> ถือว่า expired (true)
        if (!latestSub) {
            return NextResponse.json({ is_expired: true }, { status: 200 });
        }
        // กรณีที่ 2: เคยสมัคร เช็คว่าวันหมดอายุน้อยกว่าปัจจุบันหรือไม่
        // ถ้า expired_date น้อยกว่า ตอนนี้ แปลว่า "หมดอายุแล้ว"
        const isExpired = new Date(latestSub.expired_date) < new Date();

        return NextResponse.json({ is_expired: isExpired }, { status: 200 });

    } catch (err) {
        return NextResponse.json(
            { message: "Internal Server Error", error: (err as Error).message }, 
            { status: 500 }
        );
    }
}