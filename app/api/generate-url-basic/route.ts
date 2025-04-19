import { NextRequest, NextResponse } from "next/server";
import { BasicPreviewModel } from "../../../models/basicPreview.model";
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

    const existingProduct = await BasicPreviewModel.findById(productId);

    if (existingProduct) {
      return NextResponse.json({
        id: existingProduct._id,
        url: `${process.env.NEXTAUTH_URL}/basic-products/${existingProduct._id}`,
        existingData: existingProduct
      }, { status: 200 });
    }

    const productCount = await BasicPreviewModel.countDocuments();
    if (productCount >= 15) {
      return NextResponse.json(
        { error: "Basic tier limited upto total 15 product pages" },
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
