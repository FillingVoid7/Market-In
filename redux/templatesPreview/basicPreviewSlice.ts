import { createSlice, createAsyncThunk, PayloadAction, Middleware } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./basicPreviewStore";

const API_URL = "/api/basic-preview";
const GENERATE_URL = "/api/generate-url-basic";
const GET_PRODUCT_URL = "/api/get-basic-product";
axios.defaults.withCredentials = true;

// Local storage persistence
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

// Async Thunks
export const saveBasicPreview = createAsyncThunk(
  "basicPreview/createBasicPreview",
  async (data: BasicPreviewPayload, { rejectWithValue }) => {
    try {
      const sanitizedPayload = sanitizeBasicPayload(data);
      const response = await axios.post(API_URL, sanitizedPayload);
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
      const { _id, productDetails, shopDetails, faqList, uniqueURLs } = state.basicPreview;
      
      if (!_id) throw new Error("No product ID found in state");
      
      const contentHash = createContentHash({ productDetails, shopDetails, faqList });
      if (uniqueURLs.some(url => url.contentHash === contentHash)) {
        throw new Error("This product configuration already exists");
      }

      const response = await axios.post(GENERATE_URL, { productId: _id });
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

export const getProductBasic = createAsyncThunk(
  "basicPreview/getProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PRODUCT_URL}/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Interfaces
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

interface SocialMediaTemplate {
  name: string;
  captionStructure: string;
  defaultHashtags: string[];
  imageSlots: number;
  styleSettings: {
    fontFamily: string;
    brandColors: string[];
    layoutType: 'grid' | 'carousel' | 'single';
  };
}

interface SocialMediaPost {
  platform: string;
  templateUsed: SocialMediaTemplate;
  publishedContent: {
    finalCaption: string;
    usedHashtags: string[];
    imageUrls: string[];
    shortLink: string;
    engagementStats: {
      likes: number;
      shares: number;
      clickThroughs: number;
    };
  };
  scheduledTime?: Date;
}

interface CustomizationOptions {
  colorPalette: string[];
  templates: string[];
}

interface BasicPreviewState {
  _id?: string | null;
  userId?: string;
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: any[];
  uniqueURLs: URLSnapshot[];
  customizationOptions: CustomizationOptions;
  socialMediaTemplates: SocialMediaTemplate[];
  scheduledPosts: SocialMediaPost[];
  analytics: AnalyticsData[];
  createdPreview: any;
  error: string | null;
  loading: boolean;
}

// Initial State
const initialState: BasicPreviewState = loadState() || {
  _id: null,
  userId: undefined,
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
  customizationOptions: {
    colorPalette: [],
    templates: []
  },
  socialMediaTemplates: [],
  scheduledPosts: [],
  analytics: [],
  error: null,
  loading: false,
  createdPreview: null,
};

// Slice Configuration
const basicPreviewSlice = createSlice({
  name: "basicPreview",
  initialState,
  reducers: {
    updateProductField: (state, action: PayloadAction<UpdateFieldPayload>) => {
      const { field, content, style } = action.payload;
      state.productDetails[field] = { content, style };
    },
    updateShopField: (state, action: PayloadAction<UpdateFieldPayload>) => {
      const { field, content, style } = action.payload;
      state.shopDetails[field] = { content, style };
    },
    updateCustomization: (state, action: PayloadAction<CustomizationOptions>) => {
      state.customizationOptions = action.payload;
    },
    addSocialTemplate: (state, action: PayloadAction<SocialMediaTemplate>) => {
      state.socialMediaTemplates.push(action.payload);
    },
    schedulePost: (state, action: PayloadAction<SocialMediaPost>) => {
      state.scheduledPosts.push(action.payload);
    },
    updateMedia: (state, action: PayloadAction<{
      field: 'productPictures' | 'productVideos' | 'shopImages',
      media: MediaItem[]
    }>) => {
      const { field, media } = action.payload;
      if (field === 'productPictures' || field === 'productVideos') {
        state.productDetails[field] = media;
      } else {
        state.shopDetails[field] = media;
      }
    },
    resetTemplate: () => initialState,
    // ... other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBasicPreview.fulfilled, (state, action) => {
        state._id = action.payload.data._id;
        state.createdPreview = action.payload;
        state.userId = action.payload.userId;
      })
      .addCase(generateUrlBasic.fulfilled, (state, action) => {
        state.uniqueURLs.push({
          id: action.payload.id,
          url: action.payload.url,
          contentHash: createContentHash(action.payload.existingData),
          createdAt: new Date().toISOString()
        });
      })
      .addCase(getProductBasic.fulfilled, (state, action) => {
        state.productDetails = action.payload.productDetails;
        state.shopDetails = action.payload.shopDetails;
        state.customizationOptions = action.payload.customizationOptions;
        state.socialMediaTemplates = action.payload.socialMediaTemplates;
        state.scheduledPosts = action.payload.scheduledPosts;
        state.analytics = action.payload.analytics;
        state.loading = false;
      })
      // Handle other cases similarly
  },
});

// Helper Functions
const sanitizeBasicPayload = (data: BasicPreviewPayload) => ({
  ...data,
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
  socialMediaTemplates: data.socialMediaTemplates,
  scheduledPosts: data.scheduledPosts
});

const createContentHash = (data: {
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

// Export actions and reducer
export const {
  updateProductField,
  updateShopField,
  updateCustomization,
  addSocialTemplate,
  schedulePost,
  updateMedia,
  resetTemplate,
} = basicPreviewSlice.actions;

export default basicPreviewSlice.reducer;

export const persistStateMiddleware: Middleware = storeAPI => next => action => {
  const result = next(action);
  const state = storeAPI.getState() as RootState;
  saveState(state.basicPreview);
  return result;
};