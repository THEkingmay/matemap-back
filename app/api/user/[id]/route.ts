// ดึง user detail

import { NextRequest } from "next/server";

export async function GET(req : NextRequest , {params} : {params : Promise<{id : string}>}){
    const {id} = await params;

    return new Response(JSON.stringify({message: `User ID is ${id}`}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}