import supabase from '@/configs/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkOwnership } from '../route';

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