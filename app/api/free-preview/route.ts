import { NextRequest,NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import connectDb from "../../../database/connectDb";

export async function POST(req:NextRequest){
    await connectDb();
    try{
        const {productDetails, shopDetails, faqList, uniqueURLs} = await req.json();
        const freePreview = new freePreviewModel({
            productDetails, 
            shopDetails,
            faqList, 
            uniqueURLs,
        })
        const savedFreePreview = await freePreview.save(); 
        return NextResponse.json({success:true, message:"Free Preview created successfully", data:savedFreePreview}, {status:201});

    }catch(error){
        console.error("Create Free Preview Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({success:false, message:errorMessage}, {status:500});
    }
}

