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
  platform: 'Facebook' | 'Instagram' | 'TikTok'; 
  templateName: string;  // e.g., 'New Arrival', 'Limited Time Offer'
  caption: string;
  hashtags: string[];
  hooks?: string[]; // e.g., 'Limited Time Offer', 'Exclusive Deal'
  imagePlaceholders: {
    position: number;
    description: string;
    aspectRatio?: string;  // e.g., '1:1', '4:5', '16:9'
    maxSize?: string;     // e.g., '1080x1080'
  }[];
  defaultImageUrl?: string;  // Fallback image if no product image is available
  productUrl: string;        // The unique URL to the product page
  callToAction?: string;     // e.g., 'Shop Now', 'Learn More'
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
      productName: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      productPrice: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      shortDescription: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      longDescription: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      qualityFeatures: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      specifications: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      productPictures: [{ url: { type: String, required: true } }],
      productVideos: [{ url: { type: String, required: true } }],
    },
    shopDetails: {
      shopName: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      shopDescription: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      shopImages: [{ url: { type: String, required: true } }],
      shopAddress: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      shopContact: { content: { type: String, required: true }, style: { type: Object, default: {} } },
      shopEmail: { content: { type: String, required: true }, style: { type: Object, default: {} } },
    },
    faqList: [{ 
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],
    uniqueURLs: [{ type: String, required: true }],
    socialMediaTemplates: [{
      platform: { 
        type: String, 
        required: true,
        enum: ['Facebook', 'Instagram', 'TikTok']
      },
      templateName: { type: String, required: true },
      caption: { type: String, required: true },
      hashtags: [{ type: String }],
      hooks: [{ type: String }],
      imagePlaceholders: [{
        position: { type: Number, required: true },
        description: { type: String, required: true },
        aspectRatio: String,
        maxSize: String
      }],
      defaultImageUrl: String,
      productUrl: { type: String, required: true },
      callToAction: String,
      metadata: {
        lastUsed: { type: Date, default: Date.now },
        usageCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
      }
    }],
    analytics: [{
      productPageId: { type: Schema.Types.ObjectId, ref: "ProductPage", required: true },
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      emailClicks: { type: Number, default: 0 },
    }],
  },
  { 
    timestamps: true, 
    collection: "saved-basic-previews",
    strict: true
  }
);

export const BasicPreviewModel = mongoose.models.BasicPreview || mongoose.model<IBasicPreview>("BasicPreview", basicPreviewSchema);