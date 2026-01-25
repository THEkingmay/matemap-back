'use server'
import supabase from "@/configs/supabase"
import { IsAdmin, verifyToken } from "@/utils/token"
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
        const { data: serviceUsers, error: serviceError } = await supabase
            .from('users')
            .select('id, email') // เลือกเฉพาะ field ที่จำเป็น
            .eq('role', 'member')

        if (serviceError || !serviceUsers) {
            console.error('Error fetching members:', serviceError)
            return { success: false, message: 'ไม่สามารถดึงข้อมูลสมาชิกได้' }
        }

        // เตรียม Array ของ ID เพื่อนำไป query ตารางอื่นทีเดียว (Bulk query)
        const serviecID = serviceUsers.map(m => m.id)

        if (serviecID.length === 0) {
            return { success: true, data: [] } // ถ้าไม่มีสมาชิกเลย ก็ return ว่าง
        }

        // 2. ดึง Dorm Details ของทุกคนในรอบเดียว โดยใช้ .in()
        const { data: services, error: dormError } = await supabase
            .from('dorm_detail')
            .select('*')
            .in('user_id', serviecID)

        // 3. ดึง Subscription ของทุกคน และเรียงตามวันหมดอายุล่าสุด
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .in('user_id', serviecID)
            .order('expired_date', { ascending: false }) // เอาล่าสุดขึ้นก่อน

        if (dormError || subError) {
            console.error('Error fetching details:', dormError || subError)
            return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด' }
        }

        // 4. Data Mapping: รวมข้อมูลเข้าด้วยกันเพื่อให้ Frontend ใช้ง่าย
        const dashboardData = serviceUsers.map(member => {
            // หาหอพักของ member คนนี้
            const memberDorm = services?.find(d => d.user_id === member.id) || null
            
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

export async function getServiceDetailDashboard(){
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('token')
        
        // ควร handle error message ให้ชัดเจน
        if(!token) return { success: false, message: 'ไม่พบโทเคนการเข้าใช้งาน' }

        const user = await verifyToken(token.value)
        
        // แก้ไข flase -> false
        if(!user || user.role !== 'admin') return { success: false, message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' }

        // 1. ดึง Users ที่เป็น service ทั้งหมด
        const { data: serviceUsers, error: serviceError } = await supabase
            .from('users')
            .select('id') // เลือกเฉพาะ field ที่จำเป็น
            .eq('role', 'service')

        if (serviceError || !serviceUsers) {
            console.error('Error fetching members:', serviceError)
            return { success: false, message: 'ไม่สามารถดึงข้อมูลผู้ให้บริการได้' }
        }

        // เตรียม Array ของ ID เพื่อนำไป query ตารางอื่นทีเดียว (Bulk query)
        const service_uid = serviceUsers.map(m => m.id)
        
        if (service_uid.length === 0) {
            return { success: true, data: [] } // ถ้าไม่มีสมาชิกเลย ก็ return ว่าง
        }

        // 2. ดึง Dorm Details ของทุกคนในรอบเดียว โดยใช้ .in()
        const { data: services, error: dormError } = await supabase
            .from('service_worker_detail')
            .select('*')
            .in('id', service_uid)

        // 3. ดึง Subscription ของทุกคน และเรียงตามวันหมดอายุล่าสุด
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .in('user_id', service_uid)
            .order('expired_date', { ascending: false }) // เอาล่าสุดขึ้นก่อน
        console.log("subscritpions " , subscriptions)

        if (dormError || subError) {
            console.error('Error fetching details:', dormError || subError)
            return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด' }
        }

        // 4. Data Mapping: รวมข้อมูลเข้าด้วยกันเพื่อให้ Frontend ใช้ง่าย
        const dashboardData = serviceUsers.map(s => {
           
            const serviceUser = services?.find(d => d.id === s.id) || null
            // หา subscription ล่าสุดของ member คนนี้ (ตัวแรกสุดเพราะเรา sort มาแล้ว)
            const memberSub = subscriptions?.find(sub => sub.user_id === s.id) || null
            // เช็คสถานะ subscription อย่างง่าย (Optional)
            const isActive = memberSub 
                ? new Date(memberSub.expired_date) > new Date() 
                : false

           
            return {
                user_id : serviceUser.id ,
                name : serviceUser.name ,
                expired_date: memberSub.expired_date ,
                isActive: isActive
            }
        })

        return { success: true, data: dashboardData }

    } catch(err: any){
        console.error('Dashboard Error:', err)
        return { success: false, message: err.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' }
    }
}

export async function getUserIdbyDormId(dorm_id : string){
    try{
        const isAdmin = await IsAdmin()
        if(!isAdmin) return {success : false , error : "คุณไม่มีสิทธิ"}


        const {data : User , error} = await supabase
        .from('dorm_detail')
        .select('user_id')
        .eq('id' , dorm_id)
        .single()

        if(error) throw error 

        return {success : true , data : User? User.user_id : ''}


    }catch(err){    
        throw err
    }
}