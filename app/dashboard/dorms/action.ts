'use server'
import supabase from "@/configs/supabase"
import { verifyToken } from "@/utils/token"
import { cookies } from "next/headers"

export async function getDormDetailDashboard(){
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('token')
        
        // ควร handle error message ให้ชัดเจน
        if(!token) return { success: false, message: 'ไม่พบโทเคนการเข้าใช้งาน' }

        const user = await verifyToken(token.value)
        
        // แก้ไข flase -> false
        if(!user || user.role !== 'admin') return { success: false, message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' }

        // 1. ดึง Users ที่เป็น member ทั้งหมด
        const { data: memberUsers, error: memberError } = await supabase
            .from('users')
            .select('id, email') // เลือกเฉพาะ field ที่จำเป็น
            .eq('role', 'member')

        if (memberError || !memberUsers) {
            console.error('Error fetching members:', memberError)
            return { success: false, message: 'ไม่สามารถดึงข้อมูลสมาชิกได้' }
        }

        // เตรียม Array ของ ID เพื่อนำไป query ตารางอื่นทีเดียว (Bulk query)
        const memberIds = memberUsers.map(m => m.id)

        if (memberIds.length === 0) {
            return { success: true, data: [] } // ถ้าไม่มีสมาชิกเลย ก็ return ว่าง
        }

        // 2. ดึง Dorm Details ของทุกคนในรอบเดียว โดยใช้ .in()
        const { data: dorms, error: dormError } = await supabase
            .from('dorm_detail')
            .select('*')
            .in('user_id', memberIds)

        // 3. ดึง Subscription ของทุกคน และเรียงตามวันหมดอายุล่าสุด
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .in('user_id', memberIds)
            .order('expired_date', { ascending: false }) // เอาล่าสุดขึ้นก่อน

        if (dormError || subError) {
            console.error('Error fetching details:', dormError || subError)
            return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด' }
        }

        // 4. Data Mapping: รวมข้อมูลเข้าด้วยกันเพื่อให้ Frontend ใช้ง่าย
        const dashboardData = memberUsers.map(member => {
            // หาหอพักของ member คนนี้
            const memberDorm = dorms?.find(d => d.user_id === member.id) || null
            
            // หา subscription ล่าสุดของ member คนนี้ (ตัวแรกสุดเพราะเรา sort มาแล้ว)
            const memberSub = subscriptions?.find(s => s.user_id === member.id) || null

            // เช็คสถานะ subscription อย่างง่าย (Optional)
            const isActive = memberSub 
                ? new Date(memberSub.expired_date) > new Date() 
                : false

           
            return {
                dorm_id: memberDorm?.id || '',
                name: memberDorm?.name || '',
                user_id: memberDorm?.user_id || '',
                isActive: isActive,
                expire_date: memberSub?.expired_date || null,
                owner_name: memberDorm?.owner_name || ''
            }
        })

        return { success: true, data: dashboardData }

    } catch(err: any){
        console.error('Dashboard Error:', err)
        return { success: false, message: err.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' }
    }
}