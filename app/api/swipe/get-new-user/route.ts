import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest, verifyToken } from "@/utils/token";


// http://localhost:3000/api/swipe/get-new-user?id=b01f3c4b-85b4-4c6a-94f0-06c663c5d4ec&&exclude=b3941b09-229f-457b-b98f-dcb9416454f3,8eee78cd-d936-474f-967c-3a974b4cb8de

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id'); // User ID ของเรา
    const excludeParam = searchParams.get('exclude'); // รับ string เช่น "uuid1,uuid2,uuid3"

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const bufferIds = excludeParam ? excludeParam.split(',') : [];
    const LIMIT = 20;

    const isAuthorized = await validateRequest(req , id)
    
    if(!isAuthorized) return NextResponse.json({ message : 'คุณไม่มีสิทธิทำรายการแทนผู้อื่น' } , {status : 409})

    try {
        
        // รับข้อมูลผู้ใช้คนอื่นๆ ที่ยังไม่เคยปัดและไม่ได้อญุ่บนมือของผู้ใช้ ส่งกลับไปให้หน้าแอปสร้างเป็น การ์ดให้ปัด
        const { data: newCandidates, error } = await supabase
            .rpc('get_new_candidates', {
                viewer_id: id,
                limit_count: LIMIT,
                buffer_ids: bufferIds 
            });

        if (error) throw error;
        
        
        return NextResponse.json({data:newCandidates , length : newCandidates.length});

    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}