import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function POST(req: NextRequest) {
    try {
        await mongooseConnect();
        const body = await req.json();
        console.log('Received data:', body);
        
        const freePreview = new freePreviewModel(body);
        const savedFreePreview = await freePreview.save();

        return NextResponse.json(
            { success: true, message: "Free Preview created successfully", data: savedFreePreview },
            { status: 201 }
        );

    } catch (error) {
        console.error("Save error:", error);
        return NextResponse.json(
          { success: false, message: "Database operation failed" },
          { status: 500 }
        );
    }
}