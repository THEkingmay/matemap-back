import supabase from "@/configs/supabase";
import { IsAdmin, verifyToken } from "./token";
import { NextRequest } from "next/server";

export async function checkOwnership(request: NextRequest, dormId: string) {
  const isAdmin = await IsAdmin()
  if(isAdmin) return { isAdmin }

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  

  try {
    const user = await verifyToken(token);

    // by pass for user
    if(user.role == 'user')return {isUser : true}
    // เช็คว่าหอพักมีอยู่จริงไหม และใครเป็นเจ้าของ
    const { data: dormData, error } = await supabase
      .from("dorm_detail")
      .select('user_id')
      .eq("id", dormId)
      .single();
    if (error || !dormData) {
      return { error: "Dorm not found", status: 404 };
    }

    if (user.id !== dormData.user_id) {
      return { error: "Forbidden: You are not the owner", status: 403 };
    }

    // ส่ง user กลับไปเผื่อต้องใช้ต่อ
    return { user, isOwner: true };

  } catch (err) {
    return { error: "Invalid Token", status: 401 };
  }
}

type OwnershipResult =
  | { ok: true; userId: string; role: "owner" }
  | { ok: false; error: string; status: number };


export async function checkOwnershipAsDorm(
  request: NextRequest,
  dormId: string
): Promise<OwnershipResult> {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return { ok: false, error: "Unauthorized", status: 401 };
  }

  try {
    const user = await verifyToken(token);

    const { data: dormData, error } = await supabase
      .from("dorm_detail")
      .select("user_id")
      .eq("id", dormId)
      .single();

    if (error || !dormData) {
      return { ok: false, error: "Dorm not found", status: 404 };
    }

    if (user.id !== dormData.user_id) {
      return {
        ok: false,
        error: "Forbidden: You are not the owner",
        status: 403,
      };
    }

    return { ok: true, userId: user.id, role: "owner" };
  } catch {
    return { ok: false, error: "Invalid token", status: 401 };
  }
}