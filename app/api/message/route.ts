import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";

interface MessageDetail { 
    id : string , 
    room_chat_id : string ,
    created_at : string ,
    message : string , 
    uid : string 
}

export async function GET(req : NextRequest) {
    try {
        const userid = req.nextUrl.searchParams.get('userId')
        const room_id = req.nextUrl.searchParams.get("roomId")

        // 1. Validation: Ensure both IDs exist
        if(!userid || !room_id){
            return NextResponse.json({message : "ข้อมูลไม่ครบถ้วน (Missing ID)"}, {status : 400})
        }

        const isAuthorized = await validateRequest(req , userid)
        if(!isAuthorized){
            return NextResponse.json({message : "ไม่มีสิทธิ์"}, {status : 401}) // 401 for Unauthorized is more standard than 400
        }

        // 2. Fetching Data
        // Select specifically matches MessageDetail interface
        const { data, error } = await supabase
            .from('chat_message')
            .select('id, room_chat_id, created_at, message, uid') 
            .eq('room_chat_id', room_id)
            .order('created_at');
            // 3. Error Handling
        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
        }

        return NextResponse.json(data as MessageDetail[], { status: 200 });

    } catch(err) {
        // Catch unexpected server errors
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST (req : NextRequest){
    try {
        const userid = req.nextUrl.searchParams.get('userId')
        const room_id = req.nextUrl.searchParams.get("roomId")

        const {message} = await req.json() 
        // 1. Validation: Ensure both IDs exist
        if(!userid || !room_id){
            return NextResponse.json({message : "ข้อมูลไม่ครบถ้วน (Missing ID)"}, {status : 400})
        }

        const isAuthorized = await validateRequest(req , userid)
        if(!isAuthorized){
            return NextResponse.json({message : "ไม่มีสิทธิ์"}, {status : 401}) // 401 for Unauthorized is more standard than 400
        }

        // 2. Fetching Data
        // Select specifically matches MessageDetail interface
        const {error } = await supabase
            .from('chat_message')
            .insert({message : message , uid : userid , room_chat_id : room_id})
    
        // 3. Error Handling
        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
        }

        return NextResponse.json({ status: 200 });

    } catch(err) {
        // Catch unexpected server errors
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}