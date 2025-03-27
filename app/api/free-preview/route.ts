import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function POST(req: NextRequest) {
    try {
        await mongooseConnect();
        const body = await req.json();
        console.log('Received data:', body);

        console.log("Checking for existing product with name:", body.productDetails.productName.content);

        const existingPreview = await freePreviewModel.findOne({
            "productDetails.productName.content": body.productDetails.productName.content
        });
        console.log('Existing preview:', existingPreview);

        if (existingPreview) {
            return NextResponse.json(
                { success: false, message: "A preview already exists for this obligation." },
                { status: 400 }
            );
        }

        console.log('Existing Product found with ID:', body.productId);

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
