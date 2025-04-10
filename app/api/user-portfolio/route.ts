import { NextRequest, NextResponse } from "next/server";
import { BasicPreviewModel } from "../../../models/basicPreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function GET(req: NextRequest) {
    try {
        await mongooseConnect();
        const { userId } = await req.json();
        console.log('Received data:', userId);

        const basicPreview = await BasicPreviewModel.find({userId});
        console.log('Existing preview:', basicPreview);

        if (!basicPreview) {
            return NextResponse.json(
                { success: false, message: "No preview found for this user." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Preview retrieved successfully", data: basicPreview },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Database operation failed" },
            { status: 500 }
        );
    }
}


