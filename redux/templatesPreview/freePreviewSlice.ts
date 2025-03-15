import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/free-preview";
axios.defaults.withCredentials = true;

export const saveFreePreview = createAsyncThunk(
  "freePreview/createFreePreview",
  async (data: {
    productDetails: any;
    shopDetails: any;
    faqList: any;
    uniqueURLs: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Server error');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message || 'Request failed');
      }
    }
  }
);

interface ContentStyle {
  content: string;
  style: object;
}

interface ProductDetails {
  productName: ContentStyle;
  productPrice: ContentStyle;
  shortDescription: ContentStyle;
  longDescription: ContentStyle;
  qualityFeatures: ContentStyle;
  specifications: ContentStyle;
  productPictures: string[];
  productVideos: string[];
}

interface ShopDetails {
  shopName: ContentStyle;
  shopDescription: ContentStyle;
  shopImages: string[];
  shopAddress: ContentStyle;
  shopContact: ContentStyle;
  shopEmail: ContentStyle;
}

interface FreePreviewState {
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: any[];
  uniqueURLs: string[];
  createdPreview: any;
  error: any;
}

const initialState: FreePreviewState = {
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
  createdPreview: null,
  error: null,
};

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

const freePreviewSlice = createSlice({
  name: "freePreview",
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
    updateProductImages: (state, action: PayloadAction<string[]>) => {
      state.productDetails.productPictures = action.payload;
    },
    updateProductVideos: (state, action: PayloadAction<string[]>) => {
      state.productDetails.productVideos = action.payload;
    },
    updateShopImages: (state, action: PayloadAction<string[]>) => {
      state.shopDetails.shopImages = action.payload;
    },
    updateFaqList: (state, action: PayloadAction<any[]>) => {
      state.faqList = action.payload;
    },
    updateUniqueURLs: (state, action: PayloadAction<string[]>) => {
      state.uniqueURLs = action.payload;
    },
    resetTemplate: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFreePreview.fulfilled, (state, action) => {
        console.log("Free Preview created successfully", action.payload);
        state.createdPreview = action.payload;
      })
      .addCase(saveFreePreview.rejected, (state, action) => {
        console.error("Error creating free preview:", action.payload);
        state.error = action.payload;
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
  updateUniqueURLs,
  resetTemplate,
} = freePreviewSlice.actions;

export default freePreviewSlice.reducer;
