import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()

        const isAuthrorized = await validateRequest(req , data.customer_id)
        if(!isAuthrorized) return NextResponse.json({message : 'คุณไม่มีสิทธิจองให้คนอื่น'} ,{status : 409} )

        console.log(data)

        return NextResponse.json({message  :"Booking succesed"}, {status : 200})
    } catch (err) {
        return NextResponse.json({ message: (err as Error).message }, { status: 500 })
    }
}