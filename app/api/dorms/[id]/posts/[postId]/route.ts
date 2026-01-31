import supabase from '@/configs/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkOwnershipAsDorm } from '@/utils/auth';


// GET /api/dorms/[id]/posts/[postId] - ดึงข้อมูลรายละเอียดโพสต์หอพัก by post id TOTEST
export async function GET(
  request: NextRequest,
  context: {params : Promise<{id : string, postId : string}>}
) {
  try {
    const {id, postId} = await context.params;

    const authCheck = await checkOwnershipAsDorm(request, id);

    if (!authCheck.ok) {
        return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
      }
    
    const { data : post, error } = await supabase
    .from("dorm_posts")
    .select('*')
    .eq("dorm_id", id)
    .eq('id', postId)
    .single();

    if(!post) return NextResponse.json({message : "ไม่พบโพสต์"} , {status : 404})
    

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.log((error as Error).message)
    return NextResponse.json(
      { error: "Failed to fetch dorm post" },
      { status: 500 }
    );
  }
}

// PATCH /api/dorms/[id]/posts[postId] - อัพเดทข้อมูลรายละเอียดโพสต์หอพัก by post id
export async function PATCH(
  request: NextRequest,
  context: {params : Promise<{id : string, postId : string}>}
) {
  try {
    const { id, postId } = await context.params;

    const authCheck = await checkOwnershipAsDorm(request, id);

    if (!authCheck.ok) {
        return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
      }

    const body = await request.json();
    const allowedFields = [
      "roomNumber",
      "roomType",
      "rentPrice",
      "readyDate",
      "detail",
      "facilities",
    ];

    const payload = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined
      )
    );

    const { data, error } = await supabase
      .from("dorm_posts")
      .update(payload)
      .eq("id", postId)
      .select()
      .single();


    if (error) throw error;

     return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update dorm post' },
      { status: 500 }
    );
  }
}

// DELETE /api/dorms/[id]/posts[postId] - ลบโพสต์หอพัก by post id
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string, postId: string }> }

) {
  try {
    const { id, postId } = await context.params;

    
   const authCheck = await checkOwnershipAsDorm(request, id);

   if (!authCheck.ok) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { error } = await supabase
      .from('dorm_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 }); 
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete dorm post' },
      { status: 500 }
    );
  }
}