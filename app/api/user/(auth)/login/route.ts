import supabase from "@/configs/supabase";
import { User } from "@/types/type";
import { genarateToken, verifyPassword } from "@/utils/token"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {  message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        //  ค้นหา User ด้วย Email ก่อน 
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); 

        const exitUser = user as User
        // console.log("ExitUser" , exitUser)
        // ถ้าไม่เจอ user หรือมี error จาก database
        if (error || !exitUser) {
            return NextResponse.json(
                {  message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }
        
        // ตรวจสอบรหัสผ่านว่าตรงไหม
        const isMatch = await verifyPassword(password , exitUser.hash_password)
        // ถ้าไม่ตรงให้ส่งกลับไป
        if(!isMatch){
            return NextResponse.json(
                { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // ถ้าตรงจะสร้างโทเคน และเก็บ payload เป็น user id , role เพิ่ม role เพื่อความสะดวกในการเชคสิทธิในฝั่งแอปมือถือ
        const token = await genarateToken(exitUser.id , exitUser.role)

        // 4. Login สำเร็จ
        return NextResponse.json(
            { 
                message: "เข้าสู่ระบบสำเร็จ",
                token : token ,
                role : exitUser.role // ส่งกลับไปเพื่อให้ฝั่งแอปสามารถย้ายหน้าไปได้ว่าเป็น นิสิต หรือ บัญชีหอพัก
            }, 
            { status: 200 }
        );

    } catch (err) {
        return NextResponse.json({
            message: (err as Error).message
        }, { status: 500 });
    }
}