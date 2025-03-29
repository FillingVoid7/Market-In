import { createSlice, createAsyncThunk, PayloadAction, Middleware } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./freePreviewStore"

const API_URL = "/api/free-preview";
const GENERATE_URL = "/api/generate-url-free";
const GET_PRODUCT_URL = "/api/get-free-product";
axios.defaults.withCredentials = true;


const loadState = () => {
  try {
    if (typeof window === "undefined") return undefined;
    const serializedState = localStorage.getItem("freePreview");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error("Failed to load state", e);
    return undefined;
  }
};

const saveState = (state: FreePreviewState): void => {
  try {
    const serializedState: string = JSON.stringify(state);
    localStorage.setItem("freePreview", serializedState);
  } catch (e: unknown) {
    console.error("Failed to save state", e);
  }
};

export const saveFreePreview = createAsyncThunk(
  "freePreview/createFreePreview",
  async (
    data: {
      productDetails: ProductDetails;
      shopDetails: ShopDetails;
      faqList: any[];
      uniqueURLs: URLSnapshot[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}`, data);
      console.log("Result:", response.data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return rejectWithValue("A preview already exists for this obligation.");
        }
        return rejectWithValue(error.response.data?.message || "Server error");
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue(error.message || "Request failed");
      }
    }
  }
);

export const generateUrlFree = createAsyncThunk(
  "freePreview/generateUrl",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { _id, productDetails, shopDetails, faqList, uniqueURLs } = state.freePreview;
      if (!_id) {
        throw new Error("No product ID found in state");
      }
      const contentHash = createContentHash({ productDetails, shopDetails, faqList });
      const exists = uniqueURLs.some(url => url.contentHash === contentHash);
      if (exists) {
        throw new Error("This product configuration already exists");
      }
      const response = await axios.post(GENERATE_URL, {productId: _id });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);



export const getProductFree = createAsyncThunk(
  "freePreview/getProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const url = `${GET_PRODUCT_URL}/${productId}`;
      console.log("Fetching from:", url);
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


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

export interface ProductDetails {
  productName: ContentStyle;
  productPrice: ContentStyle;
  shortDescription: ContentStyle;
  longDescription: ContentStyle;
  qualityFeatures: ContentStyle;
  specifications: ContentStyle;
  productPictures: Array<{url: string}>;
  productVideos: Array<{url: string}>;
}

export interface ShopDetails {
  shopName: ContentStyle;
  shopDescription: ContentStyle;
  shopImages: Array<{url: string}>;
  shopAddress: ContentStyle;
  shopContact: ContentStyle;
  shopEmail: ContentStyle;
}

interface FreePreviewState {
  _id?: string | null;
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: any[];
  uniqueURLs: URLSnapshot[];
  createdPreview: any;
  error: string | null;
  loading:boolean;

}

const initialState: FreePreviewState = loadState() || {
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
  error:null,
  loading: false,
  createdPreview: null,
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

export const createContentHash = (data: {
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: any[];
}): string => {
  const jsonString = JSON.stringify({
    pd: data.productDetails,
    sd: data.shopDetails,
    faq: data.faqList
  });
  return btoa(jsonString).slice(0, 64);
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
      state.productDetails.productPictures = action.payload.map(url => ({ url }));
    },
    updateProductVideos: (state, action: PayloadAction<string[]>) => {
      state.productDetails.productVideos = action.payload.map(url => ({ url }));
    },
    updateShopImages: (state, action: PayloadAction<string[]>) => {
      state.shopDetails.shopImages = action.payload.map(url => ({ url }));
    },
    updateFaqList: (state, action: PayloadAction<any[]>) => {
      state.faqList = action.payload;
    },
    updateUniqueURLs: (state, action: PayloadAction<URLSnapshot[]>) => {
      state.uniqueURLs = action.payload;
    },
    resetTemplate: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFreePreview.fulfilled, (state, action) => {
        console.log("Free Preview created successfully", action.payload);
        state._id = action.payload.data._id;
        state.createdPreview = action.payload;
      })
      .addCase(saveFreePreview.rejected, (state, action) => {
        console.error("Error creating free preview:", action.payload);
        state.error = action.payload as string || "Error creating free preview";
      })
      .addCase(generateUrlFree.fulfilled, (state, action) => {
        state.uniqueURLs.push({
          id: action.payload.id,
          url: action.payload.url,
          contentHash: createContentHash(action.payload.existingData),
          createdAt: new Date().toISOString()
        });
      })
      .addCase(generateUrlFree.rejected, (state, action) => {
        state.error = action.payload as string || "Error generating URL";
      })

      .addCase(getProductFree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductFree.fulfilled, (state, action) => {
        state.productDetails = action.payload.productDetails;
        state.shopDetails = action.payload.shopDetails;
        state.faqList = action.payload.faqList;
        state.uniqueURLs = action.payload.uniqueURLs || [];
        state.loading = false;
        state.createdPreview = action.payload;
      })
      .addCase(getProductFree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Error fetching product data";
      })

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


export const persistStateMiddleware: Middleware = storeAPI => next => action => {
  const result = next(action);
  const state = storeAPI.getState() as RootState;
  saveState(state.freePreview);
  return result;
};

