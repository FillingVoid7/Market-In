import { Schema, Document, Types } from "mongoose";
import {mongoose} from '@lib/mongoose'; 

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

interface SocialMediaPostTemplate {
  platform: string;  // e.g., 'instagram', 'facebook', 'twitter'
  templateName: string;  // e.g., 'New Arrival', 'Limited Time Offer'
  caption: string;
  hashtags: string[];
  imagePlaceholders: {
    position: number;
    description: string;
    aspectRatio?: string;  // e.g., '1:1', '4:5', '16:9'
    maxSize?: string;     // e.g., '1080x1080'
  }[];
  defaultImageUrl?: string;  // Fallback image if no product image is available
  productUrl: string;        // The unique URL to the product page
  callToAction?: string;     // e.g., 'Shop Now', 'Learn More'
  style: {
    fontFamily: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
    accentColor?: string;    // For buttons or highlights
    borderRadius?: string;   // For image corners
  };
  metadata?: {
    lastUsed: Date;
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
      productName: { content: { type: String }, style: { type: Object } },
      productPrice: { content: { type: String }, style: { type: Object } },
      shortDescription: { content: { type: String }, style: { type: Object } },
      longDescription: { content: { type: String }, style: { type: Object } },
      qualityFeatures: { content: { type: String }, style: { type: Object } },
      specifications: { content: { type: String }, style: { type: Object } },
      productPictures: [{ url: String }],
      productVideos: [{ url: String }],
    },
    shopDetails: {
      shopName: { content: { type: String }, style: { type: Object } },
      shopDescription: { content: { type: String }, style: { type: Object } },
      shopImages: [{ url: String }],
      shopAddress: { content: { type: String }, style: { type: Object } },
      shopContact: { content: { type: String }, style: { type: Object } },
      shopEmail: { content: { type: String }, style: { type: Object } },
    },
    faqList: [{ question: String, answer: String }],
    uniqueURLs: [String],
    socialMediaTemplates: [{
      platform: { type: String, required: true },
      templateName: { type: String, required: true },
      caption: { type: String, required: true },
      hashtags: [String],
      imagePlaceholders: [{
        position: Number,
        description: String,
        aspectRatio: String,
        maxSize: String
      }],
      defaultImageUrl: String,
      productUrl: { type: String, required: true },
      callToAction: String,
      style: {
        fontFamily: String,
        fontSize: String,
        textColor: String,
        backgroundColor: String,
        accentColor: String,
        borderRadius: String
      },
    }],
    analytics: [
      {
        productPageId: { type: Schema.Types.ObjectId, ref: "ProductPage" },
        views: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        emailClicks: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true, collection:"saved-basic-previews" }
);

export const BasicPreviewModel = mongoose.models.BasicPreview || mongoose.model<IBasicPreview>("BasicPreview", basicPreviewSchema);