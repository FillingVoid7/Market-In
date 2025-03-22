import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";
import mongoose,{Types} from "mongoose";

export async function GET(req: NextRequest, res:NextResponse) {
    try {
    await mongooseConnect();
    const id = req.nextUrl.searchParams.get("id");
    console.log('Received ID:', id);   

    if (!id || Array.isArray(id)) {
    return NextResponse.json({ error: "Missing or invalid product ID" }, { status: 400 });
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const product = await freePreviewModel.findOne({ _id: new mongoose.Types.ObjectId(id) });

    console.log('Product:', product);  
    if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
    } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}