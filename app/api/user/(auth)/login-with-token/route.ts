import { NextRequest, NextResponse } from "next/server";
import { verifyToken , genarateToken } from "@/utils/token";


export async function POST(req: NextRequest) {
  try {
    // 1. ดึงค่าจาก Header มาตรฐาน 'Authorization'
    const authHeader = req.headers.get("Authorization");

    // 2. ตรวจสอบก่อนว่ามี Header ไหม และขึ้นต้นด้วย Bearer หรือไม่
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // ถ้าไม่มี ให้ส่ง 401 Unauthorized กลับไปทันที เพื่อไม่ให้โค้ดพัง
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    // 3. แยก Token ออกมา (Space คือตัวคั่น)
    // authHeader format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    const user =  await verifyToken(token)
    if(!user){
        return NextResponse.json({message : "ไม่พบข้อมูลผู้ใช้"} , {status : 404})
    }
    
    // ถ้าพบให้สร้างโทเคนชุดใหม่แล้วส่งกลับไปพร้อมข้อมูลผู้ใช้ที่ได้
    const newToken = await genarateToken(user.id , user.rold)
    return NextResponse.json({
        message : 'เข้าสู่ระบบด้วยโทเคนสำเร็จ' , 
        token : newToken ,
        user : {
            id : user.id , 
            role : user.role
        }
    } , {status : 200})
    
  } catch (err: any) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}