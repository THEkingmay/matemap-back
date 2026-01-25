import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { IsAdmin, validateRequest } from "@/utils/token";

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

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)

        if (error) {
            console.error("Supabase Error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({ data }, { status: 200 });

    } catch (err) {
        return NextResponse.json(
            { message: "Internal Server Error", error: (err as Error).message }, 
            { status: 500 }
        );
    }
}