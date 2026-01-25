import supabase from "@/configs/supabase";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/utils/token";

// Get all contract posts
export async function GET() {
  const { data, error } = await supabase
    .from("contract_posts")
    .select(`
      id,
      title,
      price,
      image_url,
      province,
      city,
      created_at
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Create contract post
export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
     if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }
    
    // ดึง user จาก token
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      price,
      dorm_number,
      postal_code,
      province,
      city,
      district,
      sub_district,
      street,
    } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: "title and price are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contract_posts")
      .insert({
        user_id: userId,
        title,
        price,
        dorm_number,
        postal_code,
        province,
        city,
        district,
        sub_district,
        street,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Create contract post success",
      post: data,
    });

  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      { error: "Create post failed" },
      { status: 500 }
    );
  }
}

// UPDATE contract post
export async function PUT(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const postId = req.nextUrl.searchParams.get("postId");

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing userId or postId" },
        { status: 400 }
      );
    }

    // check token
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("contract_posts")
      .update(body) // update เฉพาะ field ที่ส่งมา
      .eq("id", postId)
      .eq("user_id", userId) // ป้องกันแก้ของคนอื่น
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Update contract post success",
      post: data,
    });

  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      { error: "Update post failed" },
      { status: 500 }
    );
  }
}

// DELETE contract post
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const postId = req.nextUrl.searchParams.get("postId");

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing userId or postId" },
        { status: 400 }
      );
    }

    // ตรวจ token
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("contract_posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId); // ลบได้เฉพาะของตัวเอง

    if (error) throw error;

    return NextResponse.json({
      message: "Delete contract post success",
    });

  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      { error: "Delete post failed" },
      { status: 500 }
    );
  }
}

