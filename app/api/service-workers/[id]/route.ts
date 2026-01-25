import { NextRequest, NextResponse } from "next/server";

export async function GET(params:NextRequest) {
    return NextResponse.json({ message : 'ok'})
}