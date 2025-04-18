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
  platform: string;
  templateName: string;
  caption: string;
  hashtags: string[];
  imagePlaceholders: { position: number; description: string }[];
  defaultImageUrl?: string;
  style: {
    fontFamily: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
  };
}

interface CustomizationOptions {
  colorPalette: string[];
  templates: string[];
  socialMediaTemplates: SocialMediaPostTemplate[];
}

export interface IBasicPreview extends Document {
  _id: Types.ObjectId;
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: { question: string; answer: string }[];
  uniqueURLs: string[];
  customizationOptions: CustomizationOptions;
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
    customizationOptions: {
      colorPalette: [String],
      templates: [String],
      socialMediaTemplates: [{
        platform: String,
        templateName: String,
        caption: String,
        hashtags: [String],
        imagePlaceholders: [{
          position: Number,
          description: String
        }],
        defaultImageUrl: String,
        style: {
          fontFamily: String,
          fontSize: String,
          textColor: String,
          backgroundColor: String
        }
      }]
    },
    socialMediaLinks: [{
      platform: String,
      url: String,
      template: String
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
  { timestamps: true }
);

export const BasicPreviewModel = mongoose.model<IBasicPreview>("BasicPreview", basicPreviewSchema);