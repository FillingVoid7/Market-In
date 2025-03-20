import mongoose, { Schema, Document, Types } from "mongoose";

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
  },
  { timestamps: true , collection:"saved-free-previews"},
  
);

export const freePreviewModel = mongoose.model<IFreePreview>("FreePreview",freePreviewSchema);
