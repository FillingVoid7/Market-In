import { NextRequest, NextResponse } from "next/server";
import { BasicPreviewModel } from "../../../models/basicPreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function POST(req: NextRequest) { 
    try {
        await mongooseConnect();
        const body = await req.json();
        console.log('Received data:', body);

        if (!body.productDetails || !body.productDetails.productName || !body.productDetails.productName.content) {
            return NextResponse.json(
                { success: false, message: "Product name is required" },
                { status: 400 }
            );
        }

        if (!body.shopDetails || !body.shopDetails.shopName || !body.shopDetails.shopName.content) {
            return NextResponse.json(
                { success: false, message: "Product name is required" },
                { status: 400 }
            );
        }

        console.log("Checking for existing product with name:", body.productDetails.productName.content);

        const existingPreview = await BasicPreviewModel.findOne({
            "productDetails.productName.content": body.productDetails.productName.content
        });
        console.log('Existing preview:', existingPreview);

        if (existingPreview) {
            return NextResponse.json(
                { success: false, message: "A preview already exists for this product." },
                { status: 400 }
            );
        }

        const basicPreview = new BasicPreviewModel(body);
        const savedBasicPreview = await basicPreview.save();

        return NextResponse.json(
            { 
                success: true, 
                message: "Basic Preview created successfully", 
                data: savedBasicPreview 
            },
            { status: 201 }
        ); 

    } catch (error) {
        console.error("Save error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Database operation failed" 
            },
            { status: 500 }
        );
    }
}
