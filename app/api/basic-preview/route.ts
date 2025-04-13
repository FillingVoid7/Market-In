import { NextRequest, NextResponse } from "next/server";
import { BasicPreviewModel } from "../../../models/basicPreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function POST(req: NextRequest) {
    try {
        await mongooseConnect();
        const body = await req.json();
        
        // Validate required fields
        if (!body.userId || !body.productDetails?.productName?.content) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check for existing product with same name for this user
        const existingPreview = await BasicPreviewModel.findOne({
            userId: body.userId,
            "productDetails.productName.content": body.productDetails.productName.content
        });

        if (existingPreview) {
            return NextResponse.json(
                { success: false, message: "A preview already exists for this product." },
                { status: 409 }
            );
        }

        // Create new preview with validation
        const basicPreview = new BasicPreviewModel({
            ...body,
            // Ensure required array fields are initialized
            productDetails: {
                ...body.productDetails,
                productPictures: body.productDetails.productPictures || [],
                productVideos: body.productDetails.productVideos || []
            },
            shopDetails: {
                ...body.shopDetails,
                shopImages: body.shopDetails.shopImages || []
            },
            socialMediaTemplates: body.socialMediaTemplates || [],
            scheduledPosts: body.scheduledPosts || []
        });

        const savedPreview = await basicPreview.save();

        return NextResponse.json(
            { 
                success: true, 
                message: "Preview created successfully", 
                data: savedPreview 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Save error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, message: "Server error: " + errorMessage },
            { status: 500 }
        );
    }
}