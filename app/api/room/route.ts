import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateRequest } from "@/utils/token";

interface ChatRoomType {
  room_id: string;
  target_id_image_uri: string;
  last_text: string;
  target_name: string;
  time: string;
  uid_owner_message: string;
  room_chat_type: 'match' | 'service' | 'contract';
}

// ดึงทุกห้องของผู้ใช้
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // 1. Authorization Check
    const isAuthorization = await validateRequest(req, userId);

    if (!isAuthorization) {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ (Unauthorized)" }, { status: 401 });
    }

    // 2. Fetch Chat Rooms
    const { data: rooms, error: roomError } = await supabase
      .from('room_chat')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (roomError) throw roomError;

    if (!rooms || rooms.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // 3. Fetch Details (Parallel Processing)
    const formattedDataPromise = rooms.map(async (room) => {
      // Determine target ID
      const targetId = room.user1_id === userId ? room.user2_id : room.user1_id;

      // A. Check Role of Target
      const { data: userRole } = await supabase
        .from('users')
        .select('role')
        .eq('id', targetId)
        .single();

      if (!userRole) return null; // Skip if user not found

      // B. Fetch Target Profile (Based on Role)
      let targetName = "ไม่รู้จัก";
      let targetImage = "";

      if (userRole.role === 'user') {
        const { data: targetUser } = await supabase
          .from('user_detail')
          .select('name, image_url')
          .eq('id', targetId)
          .single();
        if (targetUser) {
          targetName = targetUser.name;
          targetImage = targetUser.image_url;
        }

      } else if (userRole.role === 'member') {
        const { data: targetUser } = await supabase
          .from('dorm_detail')
          .select('name, image_url')
          .eq('user_id', targetId)
          .single();
        if (targetUser) {
          targetName = targetUser.name;
          targetImage = targetUser.image_url;
        }

      } else if (userRole.role === 'service') {
        const { data: targetUser } = await supabase
          .from('service_worker_detail')
          .select('name, image_url')
          .eq('id', targetId) 
          .single();
        if (targetUser) {
          targetName = targetUser.name;
          targetImage = targetUser.image_url;
        }
      } else {
        return null; // Unknown role
      }

      // C. Fetch Last Message (Common Logic - Done ONCE)
      const { data: lastMsg } = await supabase
        .from('chat_message')
        .select('message, created_at, uid')
        .eq('room_chat_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // D. Construct Object
      const chatRoom: ChatRoomType = {
        room_id: room.id,
        target_id_image_uri: targetImage || "",
        target_name: targetName,
        last_text: lastMsg?.message || "ยังไม่มีข้อความ",
        time: lastMsg?.created_at || room.created_at,
        uid_owner_message: lastMsg?.uid || "", // Handle undefined safely
        room_chat_type: room.room_chat_type,
      };

      return chatRoom;
    });

    // Wait for all promises
    const rawResults = await Promise.all(formattedDataPromise);

    // 4. Filter Nulls and Sort
    // Filter out any 'null' values from failed lookups before sorting
    const validResults = rawResults.filter((item): item is ChatRoomType => item !== null);

    validResults.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ data: validResults }, { status: 200 });

  } catch (err: any) {
    console.error("GET ChatRooms Error:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// สร้างห้องสำหรับนิสิตคุยกับคนขายสัญญา หอพัก หรือ ผู้ให้บริการ
export async function POST(req: NextRequest) {
  try {
    const { userId, roomType, ownerPostId } = await req.json();

    // 1. Validate Input
    if (!userId || !ownerPostId || !roomType) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน (Missing required fields)" }, { status: 400 });
    }

    if (userId === ownerPostId) {
       return NextResponse.json({ message: "ไม่สามารถสร้างห้องแชทกับตัวเองได้" }, { status: 400 });
    }

    // 2. Authorization Check
    const isAuthorization = await validateRequest(req, userId);
    if (!isAuthorization) {
      return NextResponse.json({ message: "คุณไม่มีสิทธิ์ (Unauthorized)" }, { status: 401 });
    }

    // 3. ตรวจสอบว่าเคยมีห้องแชทระหว่าง 2 คนนี้ ในประเภทห้องนี้ หรือยัง?
    // Logic: (User1=Me AND User2=Target) OR (User1=Target AND User2=Me)
    const { data: existingRoom, error: checkError } = await supabase
      .from('room_chat')
      .select('*')
      .eq('room_chat_type', roomType)
      .or(`and(user1_id.eq.${userId},user2_id.eq.${ownerPostId}),and(user1_id.eq.${ownerPostId},user2_id.eq.${userId})`)
      .maybeSingle(); // ใช้ maybeSingle เพื่อไม่ให้ error ถ้าไม่เจอข้อมูล

    if (checkError) {
        throw checkError;
    }

    // กรณี A: เจอห้องเดิมแล้ว -> ส่งห้องเดิมกลับไปเลย
    if (existingRoom) {
      return NextResponse.json({ 
        data: existingRoom, 
        message: "Room already exists" 
      }, { status: 200 });
    }

    // กรณี B: ยังไม่เคยมีห้อง -> สร้างห้องใหม่ (Insert)
    const { data: newRoom, error: createError } = await supabase
      .from('room_chat')
      .insert({
        user1_id: userId,
        user2_id: ownerPostId,
        room_chat_type: roomType
      })
      .select()
      .single();

    if (createError) {
        throw createError;
    }

    return NextResponse.json({ 
        data: newRoom, 
        message: "Room created successfully" 
    }, { status: 201 });

  } catch (err: any) {
    console.error("POST ChatRoom Error:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}