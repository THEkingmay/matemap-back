import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest , ctx : {params : Promise<{id : string}>}){
    try{
        console.log("GET ALL ")
        const {id} = await ctx.params
        if(!id) return NextResponse.json({message : "No user id"} , {status : 400})

        const isAuth = await validateRequest(req , id)
        if(!isAuth) return NextResponse.json({message : 'คุณไม่มีสิทธิ'} , {status : 409})

        const {data , error} = await supabase
        .from("service_history")
        .select("*")
        .eq("customer_id" , id)

        if(error) throw error

        return NextResponse.json(data , {status : 200})
        

    }catch(err){
        return NextResponse.json({message : (err as Error).message} , {status : 500})
    }
}



