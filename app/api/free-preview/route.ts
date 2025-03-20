import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import connectDb from "../../../database/connectDb";

export async function POST(req: NextRequest) {
    try {
        console.log('connecting to db');
        await connectDb();
        console.log('connected to db');

        const { productDetails, shopDetails, faqList, uniqueURLs } = await req.json();

        if (!productDetails || !shopDetails || !faqList || !uniqueURLs) {
            return NextResponse.json(
                { success: false, message: "Invalid request body: Missing required fields" },
                { status: 400 }
            );
        }

        const freePreview = new freePreviewModel({
            productDetails,
            shopDetails,
            faqList,
            uniqueURLs,
        });

        const savedFreePreview = await freePreview.save();

        return NextResponse.json(
            { success: true, message: "Free Preview created successfully", data: savedFreePreview },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create Free Preview Error:", error);

        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
            if (error.name === "MongooseError" && error.message.includes("buffering timed out")) {
                errorMessage = "Database operation timed out. Please try again.";
            }
        }

        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}