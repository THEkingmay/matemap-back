'use server'
import { cookies } from "next/headers"
import supabase from "@/configs/supabase"
import { genarateToken , verifyPassword } from "@/utils/token"

export async function login( email : string, password : string) {
    try {
    
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single() 

        if (error || !user) {
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        }


        const isMatch = await verifyPassword(password, user.hash_password)
        if(!isMatch){
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        }
    
        const token = await genarateToken(user.id ,user.role) 

        const cookieStore = await cookies()
        
       // เก็บโทเคนใน คุกกี้ ซึ่งมันจะแนบไปทุกรีเควส ปลอดภัย ไม่ต้องเขียนเอง clientเข้าถึงไม่ได้
        cookieStore.set('token' , token ,{
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/', 
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: 'lax' 
        })
        return { success: true }

    } catch (err) {
        console.error("Login Error:", (err as Error).message)
        throw err
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return { success: true }
}