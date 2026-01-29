import supabase from '@/configs/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkOwnership } from '@/utils/auth';
import { validateRequest } from '@/utils/token';


// GET /api/dorms/my/[id] - ดึงข้อมูลหอพักผ่าน user_id
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const isAuthorized = await validateRequest(request, id);
       if (!isAuthorized) {
         return NextResponse.json(
           { error: "Unauthorized" },
           { status: 401 }
         );
       }
    
    const { data, error } = await supabase
    .from("dorm_detail")
    .select('*')
    .eq("user_id", id)
    .single();


    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dorm" },
      { status: 500 }
    );
  }
}