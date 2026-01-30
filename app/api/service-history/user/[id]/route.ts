import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
import { formattimeToTH } from "../../helper/formatdate";


interface HistoryResType {
    id: number;
    provider_name: string;
    services: { name: string },
    start_location?: string;
    destination_location: string;
    detail?: string;
    status: 'accepted' | 'rejected' | 'pending' | 'done';
    start_date: string | Date;    // ISO 8601 string
    end_date: string | Date;      // ISO 8601 string
    created_at : string
}

interface ServiceBooking {
    customer_id: string;          // UUID format
    provider_id: string;          // UUID format
    service_type_id: string;      // UUID format
    start_location: string;       // Empty string in example
    destination_location: string; // e.g., 'หอปลายฝน'
    detail: string;               // e.g., 'เหมือนเดิมครับป้า'
    start_date: string | Date;    // ISO 8601 string
    end_date: string | Date;      // ISO 8601 string
}

// ดึงประวัติการจองทั้งหมดของผู้ใช้ 
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params
        if (!id) return NextResponse.json({ message: "No user id" }, { status: 400 })

        const isAuth = await validateRequest(req, id)
        if (!isAuth) return NextResponse.json({ message: 'คุณไม่มีสิทธิ' }, { status: 409 })

        const { data, error } = await supabase
            .from("service_history")
            .select(`
            * ,
            services(name)
        `)
            .eq("customer_id", id)
            .order('created_at', { ascending: false })

        // console.log("DATA" , data)

        if (error) throw error

        if (!data || data.length === 0) return NextResponse.json([], { status: 200 })

        const provider_id: string[] = data?.map(d => d.provider_id)
        // get provider name
        const { data: providerName, error: ProviderNameError } = await supabase
            .from("service_worker_detail")
            .select(`
            id ,
            name
        `)
            .in("id", provider_id)

        if (ProviderNameError) throw error
        if (!providerName) return NextResponse.json({ message: "smtn wrong" }, { status: 401 })
        // console.log(providerName)

        // mapdata
        const mapData: HistoryResType[] = data.map(d => ({
            id: d.id,
            provider_name: providerName.find(p => p.id===d.provider_id)?.name,
            services: d.services,
            start_location: d.start_location,
            destination_location: d.destination_location,
            detail: d.detail,
            status: d.status ,
            start_date : d.start_date ,
            end_date : d.end_date ,
            created_at : d.created_at
        }))

        // เอารีวิวของ history ที่เป็น done แล้ว
        const doneHistory = mapData.filter(data=>data.status === 'done' || data.status === 'rejected').map(data=>data.id)
        // console.log(doneHistory)
        const {data : reviews , error : reviewError} = await supabase
        .from('service_review')
        .select('review,rate,service_history_id')
        .in('service_history_id' , doneHistory)
        // console.log("review " , reviews)
        // console.log(reviewError)
        if(reviewError) return NextResponse.json({ message: "smtn wrong" }, { status: 401 })
        

        return NextResponse.json({data : mapData , reviews : reviews}, { status: 200 })


    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}

// เพิ่มการจอง
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const data: ServiceBooking = await req.json()

        // 1. Validate Authorization
        const isAuthorized = await validateRequest(req, data.customer_id)
        if (!isAuthorized) {
            return NextResponse.json({ message: 'คุณไม่มีสิทธิจองให้คนอื่น' }, { status: 409 })
        }

        // 2. Check Availability (The Overlap Logic)
        // We look for any existing booking for this provider that overlaps with the requested time.
        // Logic: (Start_Existing < End_New) AND (End_Existing > Start_New)
        const { data: busySlots, error: timetableError } = await supabase
            .from('service_timetable') 
            .select('start_date, end_date')
            .eq('service_provider_id', data.provider_id) 
            .lt('start_date', data.end_date)  // Existing start is before new end
            .gt('end_date', data.start_date)  // Existing end is after new start

        if (timetableError) {
             throw new Error(timetableError.message)
        }

        // 3. Handle Conflicts
        // If busySlots has any items, it means there is an overlap.
        if (busySlots && busySlots.length > 0) {
            const startDateTH = formattimeToTH(busySlots[0].start_date)
            const endDateTH = formattimeToTH(busySlots[0].end_date)
            return NextResponse.json(
                { message: `ขออภัยผู้ให้บริการไม่ว่างในช่วงเวลา ${startDateTH} ถึง ${endDateTH}` },
                { status: 409 }
            )
        }

        // 4. Insert Booking
        const {error: insertError } = await supabase
            .from("service_history")
            .insert(data)

        if (insertError) {
            throw new Error(insertError.message)
        }

        // Typo fixed: succesed -> successful
        return NextResponse.json({ message: "Booking successful" }, { status: 200 })

    } catch (err) {
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}


// แก้ไขสถานะ หรือข้อมูลการจอง
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params // id ของ user (จาก URL)
        const { history_id, type} = await req.json() // รับค่าที่ต้องการแก้

        // 1. ตรวจสอบสิทธิ์เบื้องต้น
        if (!id) return NextResponse.json({ message: "No user id" }, { status: 400 })
        const isAuth = await validateRequest(req, id)
        if (!isAuth) return NextResponse.json({ message: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้' }, { status: 409 })

        // 2. ตรวจสอบว่าประวัติการจองนี้เป็นของผู้ใช้คนนี้จริงหรือไม่ และสถานะปัจจุบันคืออะไร
        const { data: historyData, error: fetchError } = await supabase
            .from("service_history")
            .select("customer_id, status")
            .eq("id", history_id)
            .single()

        if (fetchError || !historyData) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        if (historyData.customer_id !== id) {
            return NextResponse.json({ message: "คุณไม่ใช่เจ้าของการจองนี้" }, { status: 403 })
        }

        // 3. Logic การป้องกัน: ห้ามแก้ไขรายการที่เสร็จสิ้นหรือถูกปฏิเสธไปแล้ว (ยกเว้นกรณีเฉพาะ)
        if (historyData.status === 'done' || historyData.status === 'rejected') {
             return NextResponse.json({ message: "ไม่สามารถแก้ไขรายการที่เสร็จสิ้นหรือถูกยกเลิกไปแล้วได้" }, { status: 400 })
        }

        // 4. ทำการอัปเดต
        const { data, error } = await supabase
            .from("service_history")
            .update({status : type})
            .eq("id", history_id)
            .select()

        if (error) throw error

        return NextResponse.json({ message: "Update successful", data }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}

// ลบประวัติการจอง (ลบได้เฉพาะสถานะ pending , accepted )
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params // id ของ user
        const { history_id } = await req.json() // รับ history_id จาก body (หรือจะใช้ searchParams ก็ได้ แต่ body ปลอดภัยกว่าในบางมุม)

        // 1. ตรวจสอบสิทธิ์
        const isAuth = await validateRequest(req, id)
        if (!isAuth) return NextResponse.json({ message: 'คุณไม่มีสิทธิ์ลบข้อมูลนี้' }, { status: 409 })

        // 2. ตรวจสอบสถานะก่อนลบ (สำคัญมาก เพื่อความปลอดภัยของข้อมูล)
        const { data: historyData, error: fetchError } = await supabase
            .from("service_history")
            .select("customer_id, status")
            .eq("id", history_id)
            .single()

        if (fetchError || !historyData) return NextResponse.json({ message: "Booking not found" }, { status: 404 })

        // ตรวจสอบความเป็นเจ้าของ
        if (historyData.customer_id !== id) {
            return NextResponse.json({ message: "คุณไม่ใช่เจ้าของการจองนี้" }, { status: 403 })
        }

        // กฎ: ลบได้เฉพาะรายการที่ยังไม่ดำเนินการ (Pending) หรือถูกปฏิเสธ (Rejected) 
        // ถ้าเป็น 'accepted' หรือ 'done' ไม่ควรให้ลบ เพราะอาจกระทบกับฝั่ง Provider หรือประวัติงาน
        if (historyData.status === 'accepted' || historyData.status === 'done') {
            return NextResponse.json({ message: "ไม่สามารถลบรายการที่รับงานแล้วหรือเสร็จสิ้นแล้วได้" }, { status: 400 })
        }

        // 3. ทำการลบ
        const { error: deleteError } = await supabase
            .from("service_history")
            .delete()
            .eq("id", history_id)

        if (deleteError) throw deleteError

        return NextResponse.json({ message: "Deleted successful" }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}