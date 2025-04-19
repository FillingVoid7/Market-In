import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@lib/mongoose";
import { BasicPreviewModel } from "../../../models/basicPreview.model";

export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const order = url.searchParams.get("order") || "desc";
    const search = url.searchParams.get("search") || "";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { "productDetails.productName.content": { $regex: search, $options: "i" } },
        { "shopDetails.shopName.content": { $regex: search, $options: "i" } }
      ];
    }

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = order === "desc" ? -1 : 1;

    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      BasicPreviewModel.find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .select({
          _id: 1,
          "productDetails.productName": 1,
          "productDetails.productPrice": 1,
          "productDetails.shortDescription": 1,
          "productDetails.productPictures": { $slice: 1 }, // Get only first picture
          "shopDetails.shopName": 1,
          createdAt: 1,
          updatedAt: 1,
          "analytics.views": 1,
          uniqueURLs: { $slice: -1 } // Get most recent URL
        }),
      BasicPreviewModel.countDocuments(query)
    ]);

    // Transform the data for the response
    const transformedProducts = products.map(product => ({
      id: product._id,
      productName: product.productDetails?.productName?.content || "",
      productPrice: product.productDetails?.productPrice?.content || "",
      shortDescription: product.productDetails?.shortDescription?.content || "",
      thumbnailImage: product.productDetails?.productPictures?.[0]?.url || "",
      shopName: product.shopDetails?.shopName?.content || "",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      views: product.analytics?.[0]?.views || 0,
      latestUrl: product.uniqueURLs?.[0]?.url || ""
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      status: "success",
      data: {
        products: transformedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Failed to fetch portfolio",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// For future implementation when user data is added
interface UserPortfolioFilters {
  userId?: string;
  status?: 'draft' | 'published' | 'archived';
  startDate?: Date;
  endDate?: Date;
}

// Helper function for future use with user authentication
function buildUserPortfolioQuery(filters: UserPortfolioFilters) {
  const query: any = {};

  if (filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.createdAt.$lte = filters.endDate;
    }
  }

  return query;
}

// DELETE endpoint for removing products from portfolio
export async function DELETE(req: NextRequest) {
  try {
    await mongooseConnect();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await BasicPreviewModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Product deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Failed to delete product",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint for updating product status
export async function PATCH(req: NextRequest) {
  try {
    await mongooseConnect();
    const { productId, updates } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updatedProduct = await BasicPreviewModel.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: updatedProduct
    }, { status: 200 });

  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
