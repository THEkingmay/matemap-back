import supabase from '@/configs/supabase';
import { checkOwnership } from '@/utils/auth';
import { getUserIdFromRequest } from '@/utils/token';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/dorms/[id]/posts - ดึงข้อมูลโพสต์ของแต่ละหอพัก
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    
    const authCheck = await checkOwnership(request, id);

    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }


    const { data, error } = await supabase
      .from('dorm_posts')
      .select('*')
      .eq('dorm_id', id)
      .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json(data, { status: 200 });

    } catch (error) {
        return NextResponse.json(
      { error},
      { status: 500 }
    );
  }
}

// POST /api/dorms/[id]/posts - สร้างโพสต์หอพัก
export async function POST(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing dormId" },
        { status: 400 }
      );
    }

    const authCheck = await checkOwnership(request, id);
    if (authCheck.error) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const body = await request.json();
    const {
      roomNumber,
      roomType,
      rentPrice,
      readyDate,
      detail,
      facilities,
    } = body;

    const { data, error } = await supabase
      .from("dorm_posts")
      .insert({
        dorm_id: id,
        room_number: roomNumber,
        room_type: roomType,
        rent_price: rentPrice,
        ready_date: readyDate,
        detail,
        facilities,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: data }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Create post failed" },
      { status: 500 }
    );
  }
}