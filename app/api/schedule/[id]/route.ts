import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server"; // เพิ่ม NextResponse
import { isOverlap } from "../helper";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        const recordId = parseInt(id)

        // 1. ดึงข้อมูลเดิมเพื่อหา service_provider_id
        const { data: existingRecord, error: fetchError } = await supabase
            .from('service_timetable')
            .select('service_provider_id')
            .eq('id', recordId)
            .single();

        if (fetchError || !existingRecord) {
            console.log(fetchError)
            return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
        }

        // 2. ตรวจสอบสิทธิ์ (Authorization)
        const isAuthorized = await validateRequest(req, existingRecord.service_provider_id);
        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 3. รับข้อมูลที่จะแก้ไข
        const body = await req.json();
        const { start_date, end_date, type, userId } = body;
        // 4. เช็คเวลาซ้ำ (Overlap Check)

        const isOverlapping = await isOverlap(start_date, end_date, userId , recordId) ;

        // ถ้า isOverlapping เป็น true และไม่ได้จัดการเรื่อง ignore self ไว้ อาจต้องเพิ่ม logic ตรงนี้
        if (isOverlapping) {
            return NextResponse.json({ error: "Time slot overlaps" }, { status: 409 });
        }

        // 5. อัปเดตข้อมูล
        const { error: updateError } = await supabase
            .from('service_timetable')
            .update({
                start_date,
                end_date,
                type,
            })
            .eq('id', id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Update successful" }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        // 1. ดึงข้อมูลเดิมก่อนลบ เพื่อเอา service_provider_id มาเช็คสิทธิ์
        const { data: existingRecord, error: fetchError } = await supabase
            .from('service_timetable')
            .select('service_provider_id')
            .eq('id', Number(id))
            .single();

        if (fetchError || !existingRecord) {
            return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
        }

        // 2. ตรวจสอบสิทธิ์ผ่าน Header Token
        const isAuthorized = await validateRequest(req, existingRecord.service_provider_id);

        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 3. ลบข้อมูล
        const { error: deleteError } = await supabase
            .from('service_timetable')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Delete successful" }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}