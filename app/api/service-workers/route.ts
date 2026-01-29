import supabase from "@/configs/supabase";
import { NextResponse } from "next/server";

export async function  GET() {
    try{
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      service_worker_detail (
        name,
        tel,
        image_url,
        car_registration,
        created_at
      ),
      service_and_worker (
        services (
          id,
          name
        )
      )
    `)
    .eq('role' , 'service')

  if (error) {
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}catch(err){
    console.log((err as Error).message)
    return NextResponse.json({message : "Error"} , {status : 500})
}
}
