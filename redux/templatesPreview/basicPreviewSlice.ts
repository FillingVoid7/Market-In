import { createSlice, createAsyncThunk, PayloadAction, Middleware } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./basicPreviewStore";

const API_URL = "/api/basic-preview";
const GENERATE_URL = "/api/generate-url-basic";
const GET_PRODUCT_URL = "/api/get-basic-product";
axios.defaults.withCredentials = true;

const loadState = () => {
  try {
    if (typeof window === "undefined") return undefined;
    const serializedState = localStorage.getItem("basicPreview");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error("Failed to load state", e);
    return undefined;
  }
};

const saveState = (state: BasicPreviewState): void => {
  try {
    const serializedState: string = JSON.stringify(state);
    localStorage.setItem("basicPreview", serializedState);
  } catch (e: unknown) {
    console.error("Failed to save state", e);
  }
};

interface URLSnapshot {
  id: string;
  url: string;
  contentHash: string;
  createdAt: string;
}

interface ContentStyle {
  content: string;
  style: object;
}

export interface MediaItem {
  url: string;
  _id?: string;
  file?: File;
  type?: "image" | "video";
}

export interface ProductDetails {
  productName: ContentStyle;
  productPrice: ContentStyle;
  shortDescription: ContentStyle;
  longDescription: ContentStyle;
  qualityFeatures: ContentStyle;
  specifications: ContentStyle;
  productPictures: MediaItem[];
  productVideos: MediaItem[];
}

export interface ShopDetails {
  shopName: ContentStyle;
  shopDescription: ContentStyle;
  shopImages: MediaItem[];
  shopAddress: ContentStyle;
  shopContact: ContentStyle;
  shopEmail: ContentStyle;
}

export interface SocialMediaTemplate {
  platform: string;
  templateName: string;
  caption: string;
  hashtags: string[];
  imagePlaceholders: {
    position: number;
    description: string;
    aspectRatio?: string;
    maxSize?: string;
  }[];
  defaultImageUrl?: string;
  productUrl: string;
  callToAction?: string;
  style: {
    fontFamily: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
    accentColor?: string;
    borderRadius?: string;
  };
}

export interface Analytics {
  productPageId: string;
  views: number;
  clicks: number;
  emailClicks: number;
}

interface BasicPreviewState {
  _id?: string | null;
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: { question: string; answer: string }[];
  uniqueURLs: URLSnapshot[];
  socialMediaTemplates: SocialMediaTemplate[];
  analytics: Analytics[];
  createdPreview: any;
  error: string | null;
  loading: boolean;
}

const initialState: BasicPreviewState = loadState() || {
  _id: null,
  productDetails: {
    productName: { content: "", style: {} },
    productPrice: { content: "", style: {} },
    shortDescription: { content: "", style: {} },
    longDescription: { content: "", style: {} },
    qualityFeatures: { content: "", style: {} },
    specifications: { content: "", style: {} },
    productPictures: [],
    productVideos: [],
  },
  shopDetails: {
    shopName: { content: "", style: {} },
    shopDescription: { content: "", style: {} },
    shopImages: [],
    shopAddress: { content: "", style: {} },
    shopContact: { content: "", style: {} },
    shopEmail: { content: "", style: {} },
  },
  faqList: [],
  uniqueURLs: [],
  socialMediaTemplates: [],
  analytics: [],
  error: null,
  loading: false,
  createdPreview: null,
};

export const saveBasicPreview = createAsyncThunk(
  "basicPreview/createBasicPreview",
  async (
    data: {
      productDetails: ProductDetails;
      shopDetails: ShopDetails;
      faqList: { question: string; answer: string }[];
      uniqueURLs: URLSnapshot[];
      socialMediaTemplates: SocialMediaTemplate[];
      analytics: Analytics[];
    },
    { rejectWithValue }
  ) => {
    try {
      const sanitizedPayload = {
        productDetails: {
          ...data.productDetails,
          productPictures: data.productDetails.productPictures.map(m => ({
            url: m.url,
            _id: m._id
          })),
          productVideos: data.productDetails.productVideos.map(m => ({
            url: m.url,
            _id: m._id
          }))
        },
        shopDetails: {
          ...data.shopDetails,
          shopImages: data.shopDetails.shopImages.map(m => ({
            url: m.url,
            _id: m._id
          }))
        },
        faqList: data.faqList,
        uniqueURLs: data.uniqueURLs,
        socialMediaTemplates: data.socialMediaTemplates,
        analytics: data.analytics
      };

      const response = await axios.post(`${API_URL}`, sanitizedPayload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const generateUrlBasic = createAsyncThunk(
  "basicPreview/generateUrl",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { _id } = state.basicPreview;
      if (!_id) {
        throw new Error("No product ID found in state");
      }
      const response = await axios.post(GENERATE_URL, { productId: _id });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getProductBasic = createAsyncThunk(
  "basicPreview/getProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const url = `${GET_PRODUCT_URL}/${productId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const uploadMedia = createAsyncThunk(
  "basicPreview/uploadMedia",
  async ({ file, mediaType }: { file: File; mediaType: "image" | "video" }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);

      const response = await axios.post("/api/upload-files", formData);
      return {
        permanentUrl: response.data.permanentUrl,
        mediaType,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

interface UpdateProductFieldPayload {
  field: keyof ProductDetails;
  content: string;
  style: object;
}

interface UpdateShopFieldPayload {
  field: keyof ShopDetails;
  content: string;
  style: object;
}

export const createContentHash = (data: {
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: any[];
}): string => {
  const jsonString = JSON.stringify({
    pd: data.productDetails,
    sd: data.shopDetails,
    faq: data.faqList,
  });
  return btoa(jsonString).slice(0, 64);
};

const basicPreviewSlice = createSlice({
  name: "basicPreview",
  initialState,
  reducers: {
    updateProductField: (state, action: PayloadAction<UpdateProductFieldPayload>) => {
      const { field, content, style } = action.payload;
      if (field === "productPictures" || field === "productVideos") {
        state.productDetails[field] = content as any;
      } else {
        state.productDetails[field] = { content, style };
      }
    },
    updateShopField: (state, action: PayloadAction<UpdateShopFieldPayload>) => {
      const { field, content, style } = action.payload;
      if (field === "shopImages") {
        state.shopDetails[field] = content as any;
      } else {
        state.shopDetails[field] = { content, style };
      }
    },
    updateProductImages: (state, action: PayloadAction<MediaItem[]>) => {
      state.productDetails.productPictures = action.payload;
    },
    updateProductVideos: (state, action: PayloadAction<MediaItem[]>) => {
      state.productDetails.productVideos = action.payload;
    },
    updateShopImages: (state, action: PayloadAction<MediaItem[]>) => {
      state.shopDetails.shopImages = action.payload;
    },
    updateFaqList: (state, action: PayloadAction<{ question: string; answer: string }[]>) => {
      state.faqList = action.payload;
    },
    updateSocialMediaTemplates: (state, action: PayloadAction<SocialMediaTemplate[]>) => {
      state.socialMediaTemplates = action.payload;
    },
    updateAnalytics: (state, action: PayloadAction<Analytics[]>) => {
      state.analytics = action.payload;
    },
    updateUniqueURLs: (state, action: PayloadAction<URLSnapshot[]>) => {
      state.uniqueURLs = action.payload;
    },
    resetTemplate: () => initialState,
    addMedia: (
      state,
      action: PayloadAction<{
        field: "productPictures" | "productVideos" | "shopImages";
        media: MediaItem;
      }>
    ) => {
      const { field, media } = action.payload;
      if (field === "productPictures" || field === "productVideos") {
        state.productDetails[field].push(media);
      } else if (field === "shopImages") {
        state.shopDetails[field].push(media);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBasicPreview.fulfilled, (state, action) => {
        state._id = action.payload.data._id;
        state.createdPreview = action.payload;
      })
      .addCase(saveBasicPreview.rejected, (state, action) => {
        state.error = action.payload as string || "Error creating basic preview";
      })
      .addCase(generateUrlBasic.fulfilled, (state, action) => {
        state.uniqueURLs.push({
          id: action.payload.id,
          url: action.payload.url,
          contentHash: createContentHash(action.payload.existingData),
          createdAt: new Date().toISOString()
        });
      })
      .addCase(generateUrlBasic.rejected, (state, action) => {
        state.error = action.payload as string || "Error generating URL";
      })
      .addCase(getProductBasic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductBasic.fulfilled, (state, action) => {
        state.productDetails = action.payload.productDetails;
        state.shopDetails = action.payload.shopDetails;
        state.faqList = action.payload.faqList;
        state.uniqueURLs = action.payload.uniqueURLs || [];
        state.socialMediaTemplates = action.payload.socialMediaTemplates || [];
        state.analytics = action.payload.analytics || [];
        state.loading = false;
        state.createdPreview = action.payload;
      })
      .addCase(getProductBasic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Error fetching product data";
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        const { permanentUrl, mediaType } = action.payload;
        const newMedia: MediaItem = { url: permanentUrl, type: mediaType };

        if (mediaType === "image") {
          state.productDetails.productPictures.push(newMedia);
        } else if (mediaType === "video") {
          state.productDetails.productVideos.push(newMedia);
        }
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.error = action.payload as string || "Media upload failed";
      });
  },
});

export const {
  updateProductField,
  updateShopField,
  updateProductImages,
  updateProductVideos,
  updateShopImages,
  updateFaqList,
  updateSocialMediaTemplates,
  updateAnalytics,
  updateUniqueURLs,
  resetTemplate,
  addMedia,
} = basicPreviewSlice.actions;

export default basicPreviewSlice.reducer;

export const persistStateMiddleware: Middleware = storeAPI => next => action => {
  const result = next(action);
  const state = storeAPI.getState() as RootState;
  saveState(state.basicPreview);
  return result;
};