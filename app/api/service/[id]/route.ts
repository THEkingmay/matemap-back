import supabase from "@/configs/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest , ctx :{ params : Promise<{id : string}>}) {
    try {
        
        const {id} = await ctx.params

        // เพิ่ม: เช็คว่ามีการส่ง service_id มาหรือไม่
        if (!id) {
            return NextResponse.json({ error: "Missing service_id" }, { status: 400 })
        }
        // ดึงชื่อ service name ออกมา
        const { data: serviceName, error:nameError } = await supabase
            .from('services')
            .select('name') 
            .eq('id', id)
            .single()

        if(nameError) throw nameError


        const { data: relationData, error: relationError } = await supabase
            .from('service_and_worker')
            .select('user_id') // Optimization: เลือกมาแค่คอลัมน์ที่ต้องใช้
            .eq('service_id', id)

        if (relationError) throw relationError

        // 2. ดึง ID ออกมาอย่างปลอดภัย (กันค่า null)
        const userIds = relationData?.map(d => d.user_id) || []

        // 3. Optimization: ถ้าไม่มี User ใน Service นี้ ไม่ต้องคิวรีรอบสอง
        if (userIds.length === 0) {
            return NextResponse.json({
                service_name: serviceName.name,
                users: []
            })
        }

        // 4. ดึงรายละเอียด User
        const { data: userDetails, error: userError } = await supabase
            .from('service_worker_detail')
            .select('*')
            .in('id', userIds) // สมมติว่า 'id' คือ PK ในตาราง service_worker_detail

        if (userError) throw userError

        return NextResponse.json({
            service_name: serviceName.name,
            users: userDetails
        }, {status : 200})

    } catch (err: any) {
        console.error("API Error:", err) // log ไว้ดูที่ฝั่ง Backend
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}