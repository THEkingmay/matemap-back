import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        if (!id) return NextResponse.json({ message: 'ไม่มีไอดี' }, { status: 401 })

        const isAuthorized = await validateRequest(req, id)
        if (!isAuthorized) return NextResponse.json({ message: 'ไม่มีสิทธิ' }, { status: 409 })

        const {data , error} = await supabase
        .from('users')
        .select("email")
        .eq('id', id)
        .single()

        if(error) throw error

        return NextResponse.json({ email : data.email } ,{status : 200})

    } catch (err) {
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}