import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { verifyToken } from "@/utils/token";
import { cookies } from "next/headers";

interface ServicesType {
  id?: string; // Optional for insert
  created_at?: string;
  name: string;
}

// Helper to check Admin role
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) return null;

  try {
    // Assuming verifyToken returns the decoded user payload
    const user = await verifyToken(token.value); 
    if (user?.role !== "admin") return null;
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const serviceId = req.nextUrl.searchParams.get("service_id");

    let result;

    if (!serviceId) {
      // Select all
      result = await supabase.from("services").select("*");
    } else {
      // Select by ID
      result = await supabase.from("services").select("*").eq("id", serviceId).single();
    }

    const { data, error } = result;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data  });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization Check
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 401 });
    }

    // 2. Parse Body
    const body: ServicesType = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Missing 'name' field" }, { status: 400 });
    }

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from("services")
      .insert([{ name: body.name }]) // ID and created_at are usually auto-generated
      .select();

    if (error) throw error;

    return NextResponse.json({ message: "Service created", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // 1. Authorization Check
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Query ID and Body
    const serviceId = req.nextUrl.searchParams.get("service_id");
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const body: Partial<ServicesType> = await req.json();

    // 3. Update Supabase
    const { data, error } = await supabase
      .from("services")
      .update({ name: body.name })
      .eq("id", serviceId)
      .select();

    if (error) throw error;

    return NextResponse.json({ message: "Service updated", data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Authorization Check
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Query ID
    const serviceId = req.nextUrl.searchParams.get("service_id");
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // 3. Delete from Supabase
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) throw error;

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}