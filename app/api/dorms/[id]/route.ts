import supabase from '@/configs/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/dorms/[id] - ดึงข้อมูลหอพัก
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabase
    .from("dorm_detail")
    .select('*')
    .eq("id", id)
    .single();

    //เอาอีเมลเจ้าของหอพักมาด้วย
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", data.user_id)
      .single();

    if (userError) throw userError;

    const dormWithOwnerEmail = {
      data : data,
      owner_email: userData?.email || null,
    };

    if (error) throw error;

    return NextResponse.json(dormWithOwnerEmail, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dorm" },
      { status: 500 }
    );
  }
}

// PATCH /api/dorms/[id] - อัพเดทข้อมูล
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }

) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const allowedFields = [
      "name",
      "dorm_number",
      "sub_district",
      "district",
      "city",
      "province",
      "postal_code",
      "detail",
      "owner_name",
      "owner_tel",
      "id_line",
      "social_media_link",
    ];

    const payload = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined
      )
    );

    const { data, error } = await supabase
      .from("dorm_detail")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    

    if (error) throw error;

     return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update dorm' },
      { status: 500 }
    );
  }
}

// DELETE /api/dorms/[id] - ลบหอพัก
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }

) {
  try {
    const { id } = await context.params;
    // ดึง user_id จาก dorm_detail ก่อนลบ
    const { data: dormData, error: dormError } = await supabase
      .from('dorm_detail')
      .select('user_id')
      .eq('id', id)
      .single();

    if (dormError || !dormData) throw dormError;
    const userId = dormData.user_id;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 }); 
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete dorm' },
      { status: 500 }
    );
  }
}