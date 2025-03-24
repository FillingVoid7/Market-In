import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await mongooseConnect();
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await freePreviewModel.findById(productId);
    console.log('Product:', product);
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}