import supabase from '@/configs/supabase';
import {validateRequest } from '@/utils/token';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/dorms/ - ดึงข้อมูลหอพัก
export async function GET(
  request: NextRequest
) {
  try {

    const user_id= request.nextUrl.searchParams.get('user_id')

    if(user_id){

      const isAuthorized = await validateRequest(request , user_id)
      if(!isAuthorized) return NextResponse.json({message : "You do not have authority"} , {status : 409})

      const { data, error } = await supabase
      .from('dorm_detail')
      .select('*')
      .eq('user_id' , user_id)
      .single()

      if(error) throw error

      return NextResponse.json(data , {status : 200})

    }

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