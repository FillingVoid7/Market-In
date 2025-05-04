'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/userPortfolios/userPortfolioStore';
import { 
  fetchPortfolio, 
  deleteProduct, 
  updateProductStatus,
  setFilters, 
  clearFilters 
} from '@/redux/userPortfolios/userPortfolioSlice';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  BarChart,
  LineChart,
  EyeIcon, 
  MousePointerClick, 
  Mail,
  Trash2,
  Filter,
  Search,
  RefreshCcw
} from 'lucide-react';

export default function UserPortfolioPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    products, 
    portfolioStats, 
    pagination, 
    loading, 
    error,
    filters 
  } = useSelector((state: RootState) => state.userPortfolio);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPortfolio({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchPortfolio({ page: 1, limit: 10, filters: { search: searchTerm } }));
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    await dispatch(updateProductStatus({ 
      productId, 
      updates: { status: newStatus } 
    }));
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(productId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{portfolioStats?.totalProducts}</h3>
            </div>
            <BarChart className="text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">{portfolioStats?.totalViews}</h3>
            </div>
            <EyeIcon className="text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <h3 className="text-2xl font-bold">{portfolioStats?.totalClicks}</h3>
            </div>
            <MousePointerClick className="text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Engagement Rate</p>
              <h3 className="text-2xl font-bold">
                {portfolioStats?.averageEngagementRate.toFixed(2)}%
              </h3>
            </div>
            <LineChart className="text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <Select onValueChange={(value) => dispatch(setFilters({ status: value }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => {
            dispatch(clearFilters());
            setSearchTerm('');
          }}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Views</TableHeader>
                <TableHeader>Clicks</TableHeader>
                <TableHeader>Engagement</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.thumbnailImage} 
                        alt={product.productName}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sm text-gray-500">{product.shopName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={product.status}
                      onValueChange={(value) => handleStatusChange(product.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{product.analytics.totalViews}</TableCell>
                  <TableCell>{product.analytics.totalClicks}</TableCell>
                  <TableCell>{product.analytics.engagementRate}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => dispatch(fetchPortfolio({ 
                page: pagination.currentPage - 1,
                limit: pagination.itemsPerPage 
              }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => dispatch(fetchPortfolio({ 
                page: pagination.currentPage + 1,
                limit: pagination.itemsPerPage 
              }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}