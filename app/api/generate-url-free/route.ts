import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await mongooseConnect();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const existingProduct = await freePreviewModel.findById(productId);

    if (existingProduct) {
      return NextResponse.json({
        id: existingProduct._id,
        url: `${process.env.NEXTAUTH_URL}/free-products/${existingProduct._id}`,
        existingData: existingProduct
      }, { status: 200 });
    }

    const productCount = await freePreviewModel.countDocuments();
    if (productCount >= 3) {
      return NextResponse.json(
        { error: "Free tier limited to 3 product pages" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Product not found. Create a product first before generating a URL." },
      { status: 404 }
    );

  } catch (error) {
    console.error("URL Generation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
