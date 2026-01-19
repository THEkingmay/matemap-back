import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/configs/cloudinary";
import { validateRequest } from "@/utils/token";


export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");


    if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }


    const isAuthorized = await validateRequest(req, userId);
    if (!isAuthorized) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const timestamp = Math.floor(Date.now() / 1000);


    const signature = cloudinary.utils.api_sign_request(
    {
    timestamp,
    folder: `matemap/users/${userId}`,
    },
    process.env.CLOUDINARY_API_SECRET!
    );


    return NextResponse.json({
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder: `matemap/users/${userId}`,
    });
}