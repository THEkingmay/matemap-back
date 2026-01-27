// app/api/contract-posts/route.ts

import supabase from "@/configs/supabase";
import { verifyToken } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const LIMIT = 20;
  const lastIndexCreate = req.nextUrl.searchParams.get('lastIndexCreate');

    const authHeader = req.headers.get("authorization");
    // 1. Fix: Return proper 401 response instead of false
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    // 2. Fix: Return proper 401 response if token verification fails
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Start Query
    let query = supabase
      .from("contract_posts")
      .select(`
        id,
        title,
        price,
        image_url,
        province,
        city,
        created_at
      `)
      .eq("status", "approved")
      .neq("user_id", user.id) // 3. Fix: Use .neq() ไม่เอาที่ไอดีนั้นๆ
      .order("created_at", { ascending: false })
      .limit(LIMIT);

  // ถ้ามี lastIndexCreate ส่งมา (ไม่ใช่หน้าแรก) ให้เพิ่มเงื่อนไข
  // กรองเอาเฉพาะโพสต์ที่ created_at น้อยกว่า (เก่ากว่า) อันล่าสุดที่ส่งมา
  if (lastIndexCreate && lastIndexCreate !== 'undefined' && lastIndexCreate !== 'null') {
    query = query.lt('created_at', lastIndexCreate);
  }

  const { data, error } = await query;

  if (error) {
    console.log((error as Error).message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}