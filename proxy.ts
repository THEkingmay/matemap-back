// ถ้าล็อกอินแล้วให้ไปหน้าแดชบอร์ด สำหรับแอดมินหรือร้านค้าหอพักที่มีบัญชีเท่านั้น 
// ถ้าไม่ให้อยู่หน้าแรกหรือล้อกอิน 

import { cookies } from "next/headers"
import { verifyToken } from "./utils/token"
import { NextRequest, NextResponse } from "next/server"

export default async function proxy(req : NextRequest){
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const {pathname} = req.nextUrl
    // ถ้าไม่โทเคนแปลว่ายังไม่ล้อกอินและอยู่ในหน้าแออดมินให้ไปหน้า /auth
    if(!token && adminPath.some(path=>pathname.startsWith(path)) ) {
        return NextResponse.redirect(new URL('/auth' , req.url))
    }
    // ถ้ามีโทเคนที่คุกกี้แต่อยู่หน้าแรกหรืออยู่ใน publicPath ให้ไป /dashboard
    if(token ){
       
        const {role} = await verifyToken(token)
       
        if(role==='admin'&& ( publicPath.some(path=>pathname.startsWith(path)) || pathname==='/')){
            return NextResponse.redirect(new URL('/dashboard' , req.url))
        }else if(role!=='admin'){
            // ถ้าไม่แอดมิน ลบโทเคน แล้วดันไปหน้าแรก
            cookieStore.delete('token')
            return NextResponse.redirect(new URL('/' , req.url))
        }
       
    }


}

export const config = {
    matcher : ['/', '/dashboard/:path*' , '/auth']
}

const publicPath = [
    '/auth'
]
const adminPath= [
    '/dashboard' 
]