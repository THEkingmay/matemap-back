import cloudinary from "@/configs/cloudinary";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from 'crypto';
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

// user update post
export async function PUT(req: NextRequest) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  try {

    const formData = await req.formData()
    // console.log(formData)
    const post_id = formData.get('id')
    // ดึงโพสต์ไอดีนี้เอา user_id
    const { data: postSelect, error: postSelectError } = await supabase
      .from('contract_posts')
      .select('user_id, image_public_id')
      .eq('id', post_id)
      .select()
      .single()

    if (postSelectError || !postSelect) return NextResponse.json({ message: "ไม่พบโพสต์" }, { status: 404 })

    // เชคว่าเจ้าของโพสนตี้กับโทเคนใช่คนเดียวกันมั้ย
    const isAuthorized = await validateRequest(req, postSelect.user_id)
    if (!isAuthorized) return NextResponse.json({ message: "คุณไม่มีสิทธิ" }, { status: 409 })
    // อับเดตรูปก่อนเอา url ใหม่
    const file = formData.get("image") as File | null;

    if (!file) { // ถ้าไม่เปลี่ยนรูปให้ทำ จะได้ประหยัด Bandwidth
      const updatePayload = {
        title: formData.get('title'),
        price: Number(formData.get('price')),
        dorm_number: formData.get('dorm_number'),
        province: formData.get('province'),
        district: formData.get('district'),
        sub_district: formData.get('sub_district'),
        street: formData.get('street'),
        postal_code: formData.get('postal_code'),
        city: formData.get('city'),
      };
      // อับเดตโพสต์
      const { error } = await supabase
        .from("contract_posts")
        .update(updatePayload)
        .eq("id", post_id)

      if (error) {
        console.error("Supabase Update Error:", error);
        throw new Error(error.message);
      }
      return NextResponse.json({ message: "update post success" }, { status: 200 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only jpeg/png/webp allowed" },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Max file size 5MB" },
        { status: 413 }
      );
    }
    // ลบรูปเก่า (ถ้ามี)
    if (postSelect.image_public_id) {
      await cloudinary.uploader.destroy(postSelect.image_public_id);
    }

    // upload ใหม่
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/contract-posts/${post_id}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "fill" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer)
    }
    )

    const updatePayload = {
      title: formData.get('title'),
      price: Number(formData.get('price')),
      dorm_number: formData.get('dorm_number'),
      province: formData.get('province'),
      district: formData.get('district'),
      sub_district: formData.get('sub_district'),
      street: formData.get('street'),
      postal_code: formData.get('postal_code'),
      city: formData.get('city'),
      image_url: null,
      image_public_id: null
    };

    // 2. เช็คว่ามีการอัปโหลดรูปใหม่หรือไม่ (uploadResult มีค่าไหม?)
    if (uploadResult && uploadResult.secure_url) {
      updatePayload.image_url = uploadResult.secure_url;
      updatePayload.image_public_id = uploadResult.public_id;
    }

    // อับเดตโพสต์
    const { error } = await supabase
      .from("contract_posts")
      .update(updatePayload)
      .eq("id", post_id)

    if (error) {
      console.error("Supabase Update Error:", error);
      throw new Error(error.message);
    }
    return NextResponse.json({ message: "update post success" }, { status: 200 })

  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}

// add post
export async function POST(req: NextRequest) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: "ไม่มีไอดีผู้ใช้" }, { status: 403 });

    const formData = await req.formData();

    // 1. Validate Text Data (Basic check to ensure we don't upload if data is bad)
    const title = formData.get('title');
    const price = formData.get('price');

    if (!title || !price) {
      return NextResponse.json({ message: "Missing required fields (title or price)" }, { status: 400 });
    }

    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) return NextResponse.json({ message: "คุณไม่มีสิทธิ" }, { status: 409 });

    // 2. Validate File
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only jpeg/png/webp allowed" }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Max file size 5MB" }, { status: 413 });
    }

    // 3. Upload to Cloudinary
    const post_id = randomUUID();
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `matemap/contract-posts/${post_id}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "fill" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 4. Prepare Payload
    const insertPayload = {
      id: post_id,
      user_id: userId,
      title: title,
      price: Number(price),
      dorm_number: formData.get('dorm_number'),
      province: formData.get('province'),
      district: formData.get('district'),
      sub_district: formData.get('sub_district'),
      street: formData.get('street'),
      postal_code: formData.get('postal_code'),
      city: formData.get('city'),
      image_url: uploadResult?.secure_url || null,
      image_public_id: uploadResult?.public_id || null
    };

    // 5. Insert into Supabase
    const { data, error } = await supabase
      .from("contract_posts")
      .insert(insertPayload); // Fixed typo here

    // 6. Check for Database Error
    if (error) {
      console.error("Supabase Insert Error:", error);
      // Optional: Add logic here to delete the uploaded image from Cloudinary 
      // since the DB insert failed (cleanup).
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "add post success", data }, { status: 200 });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}

// delete post
export async function DELETE(req: NextRequest) {
  try {

    const postId = req.nextUrl.searchParams.get("postId")

    if (!postId) return NextResponse.json({ message: "ข้อมูลไม่ครบ" }, { status: 400 })

    // get post by id to get user id
    const {data : selectPost  , error} = await supabase
    .from('contract_posts')
    .select("user_id")
    .eq('id' , postId)

    if(error) throw error

    if(selectPost.length<= 0) return NextResponse.json({message : "ไม่พบโพสต์"} , {status : 404})

    // check authorize
    const isAuthorized = await validateRequest(req , selectPost[0].user_id)
    if(!isAuthorized) return NextResponse.json({message : "คุณไม่มีสิทธิ์"} , {status : 409})

    // delete post 
    const {error : deleteError}  = await supabase
    .from('contract_posts')
    .delete()
    .eq('id', postId)

    if(deleteError) throw deleteError

    return NextResponse.json({message : "ลบสำเร็จ"}, {status : 200})

  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}

