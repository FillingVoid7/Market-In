import { Schema, Document, Types } from "mongoose";
import { mongoose } from "@lib/mongoose";

interface StyledText {
  content: string;
  style: Record<string, unknown>;
}

interface ProductDetails {
  productName: StyledText;
  productPrice: StyledText;
  shortDescription: StyledText;
  longDescription: StyledText;
  qualityFeatures: StyledText;
  specifications: StyledText;
  productPictures: { url: string }[];
  productVideos: { url: string }[];
}

interface ShopDetails {
  shopName: StyledText;
  shopDescription: StyledText;
  shopImages: { url: string }[];
  shopAddress: StyledText;
  shopContact: StyledText;
  shopEmail: StyledText;
}

interface AnalyticsData {
  productPageId: Types.ObjectId;
  views: number;
  clicks: number;
  emailClicks: number;
}

export interface SocialMediaPostTemplate {
  templateName: string;
  caption: string;
  hashtags: string[];
  productUrl: string;
  callToAction?: string;
  metadata?: {
    lastUsed: string;
    usageCount: number;
    isActive: boolean;
  };
}

export interface IBasicPreview extends Document {
  _id: Types.ObjectId;
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: { question: string; answer: string }[];
  uniqueURLs: string[];
  socialMediaTemplates: SocialMediaPostTemplate[];
  analytics: AnalyticsData[];
  createdAt: Date;
  updatedAt: Date;
}

const basicPreviewSchema = new Schema<IBasicPreview>(
  {
    productDetails: {
      productName: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      productPrice: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      shortDescription: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      longDescription: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      qualityFeatures: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      specifications: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      productPictures: [{ url: String }],
      productVideos: [{ url: String }],
    },
    shopDetails: {
      shopName: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      shopDescription: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      shopImages: [{ url: String }],
      shopAddress: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      shopContact: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
      shopEmail: {
        content: { type: String },
        style: { type: Schema.Types.Mixed },
      },
    },
    faqList: [{ question: String, answer: String }],
    uniqueURLs: [String],
    socialMediaTemplates: [
      {
        templateName: { type: String },
        caption: { type: String },
        hashtags: [{ type: String }],
        productUrl: { type: String },
        callToAction: String,
        metadata: {
          lastUsed: { type: String, default: Date.now.toString() },
          usageCount: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      },
    ],
    analytics: [
      {
        productPageId: { type: Schema.Types.ObjectId, ref: "ProductPage" },
        views: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        emailClicks: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
    collection: "saved-basic-previews",
    strict: true,
  }
);

export const BasicPreviewModel =
  mongoose.models.BasicPreview ||
  mongoose.model<IBasicPreview>("BasicPreview", basicPreviewSchema);
