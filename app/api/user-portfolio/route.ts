import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@lib/mongoose";
import { BasicPreviewModel } from "../../../models/basicPreview.model";

export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();

    const url = new URL(req.url);
    // Basic pagination params
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const order = url.searchParams.get("order") || "desc";
    const search = url.searchParams.get("search") || "";

    // Advanced filtering params
    const filters: AdvancedFilters = {
      status: url.searchParams.get("status") as 'draft' | 'published' | 'archived' || undefined,
      categories: url.searchParams.get("categories")?.split(","),
      dateRange: url.searchParams.get("dateRange") ? {
        start: new Date(url.searchParams.get("startDate") || ""),
        end: new Date(url.searchParams.get("endDate") || "")
      } : undefined,
      priceRange: url.searchParams.get("priceRange") ? {
        min: parseFloat(url.searchParams.get("minPrice") || "0"),
        max: parseFloat(url.searchParams.get("maxPrice") || "Infinity")
      } : undefined,
      performanceMetrics: {
        minViews: parseInt(url.searchParams.get("minViews") || "0"),
        minClicks: parseInt(url.searchParams.get("minClicks") || "0"),
        minEngagementRate: parseFloat(url.searchParams.get("minEngagementRate") || "0")
      }
    };

    // Build advanced query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { "productDetails.productName.content": { $regex: search, $options: "i" } },
        { "shopDetails.shopName.content": { $regex: search, $options: "i" } }
      ];
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.categories?.length) {
      query["productDetails.categories"] = { $in: filters.categories };
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    if (filters.priceRange) {
      query["productDetails.productPrice.content"] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max
      };
    }

    // Performance metrics filtering
    if (filters.performanceMetrics) {
      const { minViews, minClicks, minEngagementRate } = filters.performanceMetrics;
      if (minViews) {
        query["analytics.views"] = { $gte: minViews };
      }
      if (minClicks) {
        query["analytics.clicks"] = { $gte: minClicks };
      }
      if (minEngagementRate) {
        query.$expr = {
          $gte: [
            {
              $multiply: [
                { $divide: [
                  { $add: ["$analytics.clicks", "$analytics.emailClicks"] },
                  "$analytics.views"
                ] },
                100
              ]
            },
            minEngagementRate
          ]
        };
      }
    }

    const skip = (page - 1) * limit;
    const sortObject: any = {};
    sortObject[sortBy] = order === "desc" ? -1 : 1;

    // Get portfolio stats
    const portfolioStats = await getPortfolioStats(query);

    // Execute main query with pagination
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
          "productDetails.productPictures": { $slice: 1 },
          "productDetails.categories": 1,
          "shopDetails.shopName": 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          analytics: 1,
          uniqueURLs: { $slice: -1 }
        }),
      BasicPreviewModel.countDocuments(query)
    ]);

    // Transform products with enhanced analytics
    const transformedProducts = products.map(product => {
      const analytics = product.analytics || [];
      const totalStats = analytics.reduce((acc, curr) => ({
        views: acc.views + (curr.views || 0),
        clicks: acc.clicks + (curr.clicks || 0),
        emailClicks: acc.emailClicks + (curr.emailClicks || 0)
      }), { views: 0, clicks: 0, emailClicks: 0 });

      // Calculate periodic growth rates
      const recentAnalytics = analytics.slice(-2);
      const growthRate = recentAnalytics.length === 2 ? {
        views: ((recentAnalytics[1].views - recentAnalytics[0].views) / recentAnalytics[0].views * 100).toFixed(2),
        clicks: ((recentAnalytics[1].clicks - recentAnalytics[0].clicks) / recentAnalytics[0].clicks * 100).toFixed(2)
      } : null;

      return {
        id: product._id,
        productName: product.productDetails?.productName?.content || "",
        productPrice: product.productDetails?.productPrice?.content || "",
        shortDescription: product.productDetails?.shortDescription?.content || "",
        thumbnailImage: product.productDetails?.productPictures?.[0]?.url || "",
        categories: product.productDetails?.categories || [],
        shopName: product.shopDetails?.shopName?.content || "",
        status: product.status || "draft",
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        analytics: {
          totalViews: totalStats.views,
          totalClicks: totalStats.clicks,
          totalEmailClicks: totalStats.emailClicks,
          engagementRate: totalStats.views > 0 ? 
            ((totalStats.clicks + totalStats.emailClicks) / totalStats.views * 100).toFixed(2) + '%' : 
            '0%',
          growthRate
        },
        latestUrl: product.uniqueURLs?.[0]?.url || ""
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      status: "success",
      data: {
        products: transformedProducts,
        portfolioStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: {
          applied: {
            search,
            ...filters
          },
          available: {
            sortOptions: ["createdAt", "views", "clicks", "engagementRate"],
            statusOptions: ["draft", "published", "archived"]
          }
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

interface PortfolioStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalClicks: number;
  totalEmailClicks: number;
  averageEngagementRate: number;
  topPerformingProducts: any[];
}

interface AdvancedFilters extends UserPortfolioFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  performanceMetrics?: {
    minViews?: number;
    minClicks?: number;
    minEngagementRate?: number;
  };
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

async function getPortfolioStats(query: any): Promise<PortfolioStats> {
  const products = await BasicPreviewModel.find(query);
  
  const stats = products.reduce((acc, product) => {
    const analytics = product.analytics || [];
    const productStats = analytics.reduce((a, curr) => ({
      views: a.views + (curr.views || 0),
      clicks: a.clicks + (curr.clicks || 0),
      emailClicks: a.emailClicks + (curr.emailClicks || 0)
    }), { views: 0, clicks: 0, emailClicks: 0 });

    return {
      totalViews: acc.totalViews + productStats.views,
      totalClicks: acc.totalClicks + productStats.clicks,
      totalEmailClicks: acc.totalEmailClicks + productStats.emailClicks,
      activeProducts: acc.activeProducts + (product.status === 'active' ? 1 : 0)
    };
  }, { totalViews: 0, totalClicks: 0, totalEmailClicks: 0, activeProducts: 0 });

  // Get top performing products based on total views
  const topPerformingProducts = await BasicPreviewModel.find(query)
    .sort({ 'analytics.views': -1 })
    .limit(5)
    .select({
      'productDetails.productName': 1,
      analytics: 1
    });

  return {
    totalProducts: products.length,
    activeProducts: stats.activeProducts,
    totalViews: stats.totalViews,
    totalClicks: stats.totalClicks,
    totalEmailClicks: stats.totalEmailClicks,
    averageEngagementRate: stats.totalViews > 0 
      ? ((stats.totalClicks + stats.totalEmailClicks) / stats.totalViews * 100)
      : 0,
    topPerformingProducts
  };
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
