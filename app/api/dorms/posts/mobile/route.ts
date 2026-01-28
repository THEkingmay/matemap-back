import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";


export async function   GET(req : NextRequest) {
    try{
        const LIMIT = 20
        const lastCreateAt = req.nextUrl.searchParams.get('lastCreateAt')
        // ถ้าไม่มีแปลว่าโหลดครั้งแรก
            // Start Query
        let query = supabase
        .from("dorm_posts")
        .select('*')
        .order("created_at", { ascending: false })
        .limit(LIMIT);

        // ถ้ามเวลาให้เอาตัวที่เวลาน้อยกว่า (สร้างก่อน)
        if (lastCreateAt && lastCreateAt !== 'undefined' && lastCreateAt !== 'null') {
            query = query.lt('created_at', lastCreateAt);
        }

    const { data, error } = await query;

        
    if (error) {
        console.log((error as Error).message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

    }catch(err){
        return NextResponse.json({message : (err as Error).message} , {status : 500})
    }
}