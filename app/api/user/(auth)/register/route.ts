import supabase from "@/configs/supabase"
import { User } from "@/types/type"
import { hash_password_genarate, genarateToken } from "@/utils/token"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { email, password, otp_code } = await req.json()

        if(!email || !password || String(password).length < 8) {
            return NextResponse.json({ message: "ข้อมูลไม่ถูกต้อง ต้องกรอกอีเมล รหัสผ่าน และรหัสผ่านต้องมากว่าหรือเท่ากับ 8 ตัวอักษร" }, { status: 400 })
        }
        // แปลงเป็น String ก่อนเช็คความยาว เพื่อความชัวร์
        if (!otp_code || String(otp_code).length < 6) {
            return NextResponse.json({ message: "รูปแบบ OTP ไม่ถูกต้อง" }, { status: 400 })
        }

        // 1. ดึงข้อมูล OTP
        const { data, error } = await supabase.from('otp').select('*')
            .eq('email', email)
            .eq('is_used', false)
            .order('created_at', { ascending: false }) // ใหม่ไปเก่า
            .limit(1) // เอาอันเดียว

        if (error) throw error

        // 2. Safety Check
        if (!data || data.length === 0) {
            return NextResponse.json({ message: "ไม่พบรหัส OTP หรือรหัสถูกใช้งานไปแล้ว" }, { status: 404 })
        }

        const selectedOTP = data[0]

        // 3. Validation Logic (แปลงเป็น String ทั้งคู่ก่อนเทียบ เพื่อความปลอดภัย)
        if (String(selectedOTP.otp_code) !== String(otp_code)) {
            return NextResponse.json({ message: "รหัส OTP ไม่ถูกต้อง" }, { status: 400 })
        }

        // 4. Time Check (จุดที่แก้!)
        const isExpired = new Date(selectedOTP.expired_at).getTime() < new Date().getTime()
        
        // 🔴 ต้องเพิ่มตรงนี้ครับ!
        if (isExpired) {
            return NextResponse.json({ message: "รหัส OTP หมดอายุแล้ว" }, { status: 400 })
        }

        // 5. Update is_used ไว้ค่อยให้ cron job ลบเองทีหลัง
        const { error: updateIs_usedError } = await supabase.from('otp')
            .update({ is_used: true })
            .eq('email', email) // update ทุกอันของเมลนี้
        
        if (updateIs_usedError) throw updateIs_usedError

        // 6. เพิ่มข้อมูลลง users
        const hash_password = await hash_password_genarate(password)
        
        const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert({ 'email': email, 'hash_password': hash_password })
            .select()

        // ดักจับกรณี Email ซ้ำ (PostgreSQL Unique Violation Code: 23505)
        if (insertError) {
            if (insertError.code === '23505') {
                return NextResponse.json({ message: "อีเมลนี้ถูกลงทะเบียนแล้ว" }, { status: 409 }) // 409 Conflict
            }
            throw insertError
        }

        const user = insertedUser[0] as User
        
        // 7. สร้าง Token
        const token = await genarateToken(user.id, user.role)

        return NextResponse.json({ 
            message: 'สมัครสมาชิกสำเร็จ', 
            token: token, 
            user :{
                id : user.id , 
                role : user.role
            } // ส่งกลับไปให้หน้าแอปบันทึก อับเดต authContext หน้าแอป
        }, { status: 201 }) // Created 

    } catch (err) {
        console.error("Registration Error:", err) // ใช้ console.error เห็นชัดกว่าใน log
        return NextResponse.json({
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" 
        }, { status: 500 })
    }
}