import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function GET(
  req: NextRequest,
  context: { params: { productId: string } }
) {
  try {
    await mongooseConnect();
    const params = await context.params; // accessing params and awaiting before accessing ;  inside function not in function args (latest changes in nextjs params usage)
    const productId  = params.productId   

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await freePreviewModel.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
