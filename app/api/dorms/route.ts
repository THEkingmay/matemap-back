import supabase from '@/configs/supabase';
import { NextResponse } from 'next/server';

// GET /api/dorms/ - ดึงข้อมูลหอพัก
export async function GET(
  request: Request
) {
  try {
    const { data, error } = await supabase
      .from('dorm_detail')
      .select('*')

    if (error) throw error;

     return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dorm' },
      { status: 500 }
    );
  }
}