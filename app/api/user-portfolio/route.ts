import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@lib/mongoose";
import { BasicPreviewModel } from "../../../models/basicPreview.model";

interface URLMetadata {
  status: "active" | "inactive";
  lastUsed: Date;
  usageCount: number;
}

interface PortfolioStats {
  totalProducts: number;
  totalViews: number;
  totalClicks: number;
  totalEmailClicks: number;
  topPerformingProducts: any[];
  templateUsage: { templateName: string; count: number }[];
}

interface UserPortfolioFilters {
  userId?: string;
  status?: "active" | "inactive";
  startDate?: Date;
  endDate?: Date;
}

interface AdvancedFilters extends UserPortfolioFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  performanceMetrics?: {
    minViews?: number;
    minClicks?: number;
  };
  templateName?: string;
}

// GET Handler
export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();
    const url = new URL(req.url);

    const cursor = url.searchParams.get("cursor");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const order = url.searchParams.get("order") || "desc";
    const search = url.searchParams.get("search") || "";

    const filters: AdvancedFilters = {
      status: (url.searchParams.get("status") as "active" | "inactive") || undefined,
      templateName: url.searchParams.get("template") || undefined,
      dateRange: url.searchParams.get("dateRange")
        ? {
            start: new Date(url.searchParams.get("startDate") || ""),
            end: new Date(url.searchParams.get("endDate") || ""),
          }
        : undefined,
      priceRange: url.searchParams.get("priceRange")
        ? {
            min: parseFloat(url.searchParams.get("minPrice") || "0"),
            max: parseFloat(url.searchParams.get("maxPrice") || "Infinity"),
          }
        : undefined,
      performanceMetrics: {
        minViews: parseInt(url.searchParams.get("minViews") || "0"),
        minClicks: parseInt(url.searchParams.get("minClicks") || "0"),
      },
    };

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { "productDetails.productName.content": { $regex: search, $options: "i" } },
        { "shopDetails.shopName.content": { $regex: search, $options: "i" } },
      ];
    }

    if (filters.status) query.status = filters.status;
    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    if (filters.priceRange) {
      query["productDetails.productPrice.content"] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      };
    }

    if (filters.performanceMetrics) {
      const { minViews, minClicks } = filters.performanceMetrics;
      if (minViews) query["analytics.views"] = { $gte: minViews };
      if (minClicks) query["analytics.clicks"] = { $gte: minClicks };
    }

    const cursorQuery = cursor ? { _id: { $gt: cursor } } : {};

    const productProjection = {
      _id: 1,
      "productDetails.productName": 1,
      "productDetails.productPictures": 1,
      "shopDetails.shopName": 1,
      "templateDetails.templateName": 1,
      "productDetails.productPrice": 1,
      createdAt: 1,
      updatedAt: 1,
      analytics: 1,
      uniqueURLs: 1,
      status: 1,
      "socialMediaTemplates.metadata": 1,
    };

    const products = await BasicPreviewModel.find({ ...query, ...cursorQuery })
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .limit(limit + 1)
      .select(productProjection);

    const hasMore = products.length > limit;
    const items = products.slice(0, limit);
    const nextCursor = hasMore ? items[items.length - 1]._id : null;

    const transformedProducts = items.map((product: any) => ({
      id: product._id,
      productName: product.productDetails?.productName?.content || "",
      thumbnailImage: product.productDetails?.productPictures?.[0]?.url || "",
      shopName: product.shopDetails?.shopName?.content || "",
      templateName: product.templateDetails?.templateName || "",
      productPrice: product.productDetails?.productPrice?.content || "",
      status: product.status || "draft",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      analytics: transformAnalytics(product.analytics),
      urls: transformURLs(product.uniqueURLs),
      socialMediaMetrics: transformSocialMediaMetrics(product.socialMediaTemplates),
    }));

    const portfolioStats = await getEnhancedPortfolioStats(query);

    return NextResponse.json({
      status: "success",
      data: {
        products: transformedProducts,
        portfolioStats,
        pagination: {
          nextCursor,
          hasMore,
          itemsPerPage: limit,
        },
        filters: {
          applied: {
            search,
            ...filters,
          },
          available: {
            sortOptions: ["createdAt", "views", "clicks", "engagementRate", "price"],
            statusOptions: ["draft", "published", "archived"],
            templates: await getAvailableTemplates(),
            categories: await getAvailableCategories(), // Placeholder function to be implemented
          },
        },
      },
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch portfolio" }, { status: 500 });
  }
}

// PATCH Handler
export async function PATCH(req: NextRequest) {
  try {
    await mongooseConnect();
    const { productId, updates, operation }: { productId: string; updates: any; operation: string } = await req.json();

    switch (operation) {
      case "editProduct":
        return await editProduct(productId, updates);
      case "updateStatus":
      case "updateURL":
        return await updateProductURL(productId, updates.urlId, updates.status);
      case "regenerateURL":
        return await regenerateProductURL(productId, updates.urlId);
      default:
        return NextResponse.json({ status: "error", message: "Invalid operation" }, { status: 400 });
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ status: "error", message: "Update failed" }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(req: NextRequest) {
  try {
    await mongooseConnect();
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ status: "error", message: "Missing productId" }, { status: 400 });
    }

    const deleted = await BasicPreviewModel.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Product deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ status: "error", message: "Delete failed" }, { status: 500 });
  }
}

// Utilities
function transformAnalytics(analytics: any[] = []) {
  return analytics.map((item: any) => ({
    views: item.views || 0,
    clicks: item.clicks || 0,
    emailClicks: item.emailClicks || 0,
    date: item.date || null,
  }));
}

function transformURLs(urls: any[] = []): URLMetadata[] {
  return urls.map((url: any) => ({
    status: url.status,
    lastUsed: url.lastUsed,
    usageCount: url.usageCount,
  }));
}

function transformSocialMediaMetrics(templates: any[] = []): any[] {
  return templates.map((t: any) => t.metadata || {});
}

async function getEnhancedPortfolioStats(query: any): Promise<any> {
  const products = await BasicPreviewModel.find(query);

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p: any) => p.status === "published").length,
    totalViews: 0,
    totalClicks: 0,
    totalEmailClicks: 0,
    averageEngagementRate: 0,
    topPerformingProducts: [],
    templateUsage: [] as { templateName: string; count: number }[],
    performanceTrends: [],
  };

  const templateMap = new Map<string, number>();

  for (const product of products) {
    const analytics = product.analytics || [];
    let views = 0,
      clicks = 0,
      emailClicks = 0;

    analytics.forEach((a: any) => {
      views += a.views || 0;
      clicks += a.clicks || 0;
      emailClicks += a.emailClicks || 0;
    });

    stats.totalViews += views;
    stats.totalClicks += clicks;
    stats.totalEmailClicks += emailClicks;

    const template = product.templateDetails?.templateName;
    if (template) {
      templateMap.set(template, (templateMap.get(template) || 0) + 1);
    }
  }

  stats.averageEngagementRate = stats.totalViews
    ? ((stats.totalClicks + stats.totalEmailClicks) / stats.totalViews) * 100
    : 0;

  stats.templateUsage = Array.from(templateMap.entries()).map(([templateName, count]) => ({
    templateName,
    count,
  }));

  return stats;
}

// Placeholder Update Functions
async function updateProductURL(productId: string, urlId: string, status: "active" | "inactive") {
  return NextResponse.json({ status: "success", message: "URL status updated (placeholder)" });
}

async function regenerateProductURL(productId: string, urlId: string) {
  return NextResponse.json({ status: "success", message: "URL regenerated (placeholder)" });
}

async function editProduct(productId: string, updates: any) {
  const updated = await BasicPreviewModel.findByIdAndUpdate(productId, updates, { new: true });
  if (!updated) {
    return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ status: "success", data: updated });
}
function getAvailableTemplates(): any {
  throw new Error("Function not implemented.");
}

