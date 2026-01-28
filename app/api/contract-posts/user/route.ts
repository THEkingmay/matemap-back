import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";

// Get all posts for a specific user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    // 1. Validate Input: Return 400 if userId is missing
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 2. Authorization: Return 401 if validation fails
    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Database Query
    // Fixed typo: 'erorr' -> 'error'
    const { data, error } = await supabase
      .from('contract_posts')
      .select('*')
      .eq("user_id", userId);

    // 4. Handle Database Errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Success Response
    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    // 6. Catch unexpected errors
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}