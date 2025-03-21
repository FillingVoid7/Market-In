import { Schema, Document, Types } from "mongoose";
import {mongoose} from '@lib/mongoose';     //importing from our shared connection 

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


interface IFreePreview extends Document {
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: { question: string; answer: string }[];
  uniqueURLs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const freePreviewSchema = new Schema<IFreePreview>(
  {
    productDetails: {
      productName: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      productPrice: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      shortDescription: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      longDescription: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      qualityFeatures: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      specifications: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      productPictures: [{ url: String }], 
      productVideos: [{ url: String }],
    },
    shopDetails: {
      shopName: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      shopDescription: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      shopImages: [{ url: String }], 
      shopAddress: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      shopContact: { content: { type: String }, style: { type: Schema.Types.Mixed } },
      shopEmail: { content: { type: String }, style: { type: Schema.Types.Mixed } },
    },
    faqList: [{ question: String, answer: String }], 
    uniqueURLs: [String], 
  },
  { timestamps: true , collection:"saved-free-previews"},
  
);

export const freePreviewModel = mongoose.models.FreePreview || mongoose.model<IFreePreview>("FreePreview",freePreviewSchema);
