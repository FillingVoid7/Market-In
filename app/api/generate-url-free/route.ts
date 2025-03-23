import { NextRequest, NextResponse } from "next/server";
import { freePreviewModel } from "../../../models/freePreview.model";
import { mongooseConnect } from "@lib/mongoose";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await mongooseConnect();
    
    // Get the existing product ID from request body
    const { productId } = await req.json();
    
    // Validate input
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ID format
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Find existing product
    const existingProduct = await freePreviewModel.findById(productId);
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check URL limit (max 3 URLs)
    if (existingProduct.uniqueURLs.length >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 URLs per product" },
        { status: 400 }
      );
    }

    // Generate unique URL using existing ID
    const productUrl = `${process.env.NEXTAUTH_URL}/product/${existingProduct._id}`;

    // Add URL to product's uniqueURLs array
    const updatedProduct = await freePreviewModel.findByIdAndUpdate(
      productId,
      { $push: { uniqueURLs: productUrl } },
      { new: true }
    );

    return NextResponse.json({
      url: productUrl,
      existingData: {
        productDetails: updatedProduct.productDetails,
        shopDetails: updatedProduct.shopDetails,
        faqList: updatedProduct.faqList
      }
    }, { status: 200 });

  } catch (error) {
    console.error('URL Generation Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}