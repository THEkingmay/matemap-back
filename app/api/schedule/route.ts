import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import {isOverlap } from "./helper";
// --- Interfaces ---
interface HistoryType {
  id: number;
  services: { name: string } | null;
  start_location?: string;
  destination_location: string;
  detail?: string;
  status: 'accepted' | 'rejected' | 'pending' | 'done';
}

interface ScheduleType {
  id: number;
  start_date: string;
  end_date: string;
  type: "booked" | 'errand';
  service_history: HistoryType | null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('service_timetable')
      .select(`
        id, 
        start_date, 
        end_date, 
        type,
        service_history (
          id,
          start_location,
          destination_location,
          detail,
          status,
          services ( name )
        )
      `)
      .eq("service_provider_id", userId);

    // 3. ดักจับ Error ของ Supabase
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("Fetch Schedule Error:", err); // Log error ไว้ดูใน Server Console ด้วย
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { start_date, end_date, userId , type} = body;  
        const isAuthorized = await validateRequest(req , userId)

        if(!isAuthorized) return NextResponse.json({message : "คุณไม่มีสิทธิ"} , {status : 409})

        // 1. Validate Input
        if (!start_date || !end_date || !userId) {
            return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน (start_date, end_date, userId)" }, { status: 400 });
        }

        // 2. เรียกฟังก์ชันเช็คเวลาชน
        const hasOverlap = await isOverlap(start_date, end_date, userId);

        // 3. ถ้าชน ให้ Return 409 Conflict
        if (hasOverlap) {
            return NextResponse.json({ message: "ช่วงเวลานี้มีการจองหรือติดธุระแล้ว" }, { status: 409 });
        }

        const {error} = await supabase
        .from('service_timetable')
        .insert({
          service_provider_id : userId ,
          start_date ,
          end_date ,
          type
        }) 
        if(error) throw error
        
        return NextResponse.json({ message: "ช่วงเวลาว่าง สามารถจองได้", body });

    } catch (err) { 
        console.log(err)
        return NextResponse.json({ message: (err as Error).message }, { status: 500 });
    }
}
