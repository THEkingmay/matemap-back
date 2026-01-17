import { NextRequest, NextResponse } from "next/server"

export default async function Register(req : NextRequest){
    try{

        const {email , password , otp } = await req.json()

        // เปรียบเทียบ email กับ  otp ในตาราง otp ว่าตรงกันมั้ยเพื่อ verify ku email

    }catch(err){
        console.log((err as Error).message)
        return NextResponse.json({
            message : (err as Error).message
        } , {status : 500})
    }
}