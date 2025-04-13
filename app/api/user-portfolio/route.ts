import { NextRequest, NextResponse } from "next/server";
import { BasicPreviewModel } from "../../../models/basicPreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function GET(req: NextRequest) {
    try {
        await mongooseConnect();
        
        // Get userId from query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const previews = await BasicPreviewModel.find({ userId })
            .populate('analytics.productPageId') // If you need population
            .lean();

        if (!previews.length) {
            return NextResponse.json(
                { success: true, message: "No previews found", data: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                message: "Previews retrieved successfully", 
                data: previews 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, message: "Server error: " + errorMessage },
            { status: 500 }
        );
    }
}