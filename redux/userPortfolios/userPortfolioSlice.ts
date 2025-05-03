import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalEmailClicks: number;
  engagementRate: string;
  growthRate: {
    views: string;
    clicks: string;
  } | null;
}

interface ProductData {
  id: string;
  productName: string;
  productPrice: string;
  shortDescription: string;
  thumbnailImage: string;
  categories: string[];
  shopName: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  analytics: AnalyticsData;
  latestUrl: string;
}

interface PortfolioStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalClicks: number;
  totalEmailClicks: number;
  averageEngagementRate: number;
  topPerformingProducts: any[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PortfolioState {
  products: ProductData[];
  portfolioStats: PortfolioStats | null;
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status?: string;
    categories?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    priceRange?: {
      min: number;
      max: number;
    };
    performanceMetrics?: {
      minViews: number;
      minClicks: number;
      minEngagementRate: number;
    };
  };
}

const initialState: PortfolioState = {
  products: [],
  portfolioStats: null,
  pagination: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'userPortfolio/fetchPortfolio',
  async (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
    filters?: any;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.order) queryParams.set('order', params.order);

    const response = await fetch(`/api/user-portfolio?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch portfolio');
    }
    return response.json();
  }
);

export const deleteProduct = createAsyncThunk(
  'userPortfolio/deleteProduct',
  async (productId: string) => {
    const response = await fetch('/api/user-portfolio', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return productId;
  }
);

export const updateProductStatus = createAsyncThunk(
  'userPortfolio/updateProductStatus',
  async ({ productId, updates }: { productId: string; updates: any }) => {
    const response = await fetch('/api/user-portfolio', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, updates }),
    });
    if (!response.ok) {
      throw new Error('Failed to update product status');
    }
    return await response.json();
  }
);

const userPortfolioSlice = createSlice({
  name: 'userPortfolio',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.portfolioStats = action.payload.data.portfolioStats;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch portfolio';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.data.id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload.data,
          };
        }
      });
  },
});

export const { setFilters, clearFilters } = userPortfolioSlice.actions;
export default userPortfolioSlice.reducer;