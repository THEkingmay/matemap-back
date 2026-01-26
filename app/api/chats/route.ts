import { NextRequest, NextResponse } from "next/server";
import supabase from "@/configs/supabase";
import { validateChatRequest } from "@/utils/token";

interface ChatRoom {
  roomId: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await validateChatRequest(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all rooms this user is in
    const { data: rooms, error: roomErr } = await supabase
      .from("room_chat")
      .select("id, user1_id, user2_id")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (roomErr) throw roomErr;
    if (!rooms || rooms.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const roomIds = rooms.map(r => r.id);

    // Get latest messages
    const { data: messages, error: msgErr } = await supabase
      .from("chat_message")
      .select("room_chat_id, message, created_at, uid")
      .in("room_chat_id", roomIds)
      .order("created_at", { ascending: false });

    if (msgErr) throw msgErr;

    // Keep latest per room
    const latestMessageByRoom = new Map<string, any>();
    for (const msg of messages ?? []) {
      if (!latestMessageByRoom.has(msg.room_chat_id)) {
        latestMessageByRoom.set(msg.room_chat_id, msg);
      }
    }

    // Get chat partner IDs
    const partnerIds = rooms.map(r =>
      r.user1_id === userId ? r.user2_id : r.user1_id
    );

    const { data: userDetails, error: detailErr } = await supabase
      .from("user_detail")
      .select("id, name, image_url")
      .in("id", partnerIds);

    if (detailErr) throw detailErr;

    // Final response
    const result: ChatRoom[] = rooms.map(room => {
      const last = latestMessageByRoom.get(room.id);
      const partnerId =
        room.user1_id === userId ? room.user2_id : room.user1_id;
      const partner = userDetails?.find(
        u => u.id === partnerId
      );

      return {
        roomId: room.id,
        name: partner?.name ?? "Unknown",
        lastMessage: last?.message ?? "",
        lastMessageTime: last?.created_at ?? "",
        image_url: partner?.image_url ?? null
      };
    }).sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("Chat home API error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
