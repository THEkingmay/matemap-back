import supabase from '@/configs/supabase';
import { NextResponse } from 'next/server';

// GET /api/dorms/[id]/posts - ดึงข้อมูลโพสต์ของแต่ละหอพัก
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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