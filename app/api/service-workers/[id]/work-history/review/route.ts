import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        
        const { id } = await ctx.params;
        
        if (!id) return NextResponse.json({ message: "No service worker ID" }, { status: 404 });

        const { data, error } = await supabase
            .from('service_review')
            .select(`
                id ,
                review, 
                rate,
                service_history!inner (
                    provider_id
                )
            `)
            .eq('service_history.provider_id', id);

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: (err as Error).message }, { status: 500 });
    }
}