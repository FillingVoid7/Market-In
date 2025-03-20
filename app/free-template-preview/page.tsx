"use client";
import React, {  useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/templatesPreview/freePreviewStore';
import { saveFreePreview } from '../../redux/templatesPreview/freePreviewSlice';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface ImageFile {
  url: string;
}

interface ProductDetails {
  productName: { content: string; style: object };
  productPrice: { content: string; style: object };
  shortDescription: { content: string; style: object };
  longDescription: { content: string; style: object };
  qualityFeatures: { content: string; style: object };
  specifications: { content: string; style: object };
  productPictures: string[];
  productVideos: string[];
}

interface ShopDetails {
  shopName: { content: string; style: object };
  shopDescription: { content: string; style: object };
  shopImages: string[];
  shopAddress: { content: string; style: object };
  shopContact: { content: string; style: object };
}

interface FreePreviewState {
  productDetails: ProductDetails;
  shopDetails: ShopDetails;
  faqList: Faq[];
  uniqueURLs: string[];
}
const FreeTemplatePreview: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const data = useSelector((state: RootState) => state.freePreview);

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg text-center p-6 w-96">
          <h2 className="text-2xl font-bold text-gray-800">No Preview Data Available</h2>
          <p className="text-gray-600 mt-2">Please add some content first</p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  const { productDetails, shopDetails, faqList, uniqueURLs } = data;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        saveFreePreview({
          productDetails: data.productDetails,
          shopDetails: data.shopDetails,
          faqList: data.faqList,
          uniqueURLs: data.uniqueURLs,
        }) as unknown as any
      );

      console.log('Result Action:', resultAction);

      if (saveFreePreview.fulfilled.match(resultAction)) {
        console.log('Free Preview created successfully', resultAction.payload);
      } else {
        const error = resultAction.error?.message || 'Failed to create Free Preview';
        console.error('Failed to save preview:', error);
      }
    } catch (error) {
      console.error('Failed to save preview:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Sticky Header with Gradient */}
      <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Editor
            </button>

            <div className="flex items-center gap-4">
              {uniqueURLs?.length > 0 && (
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                  <Share2 className="w-5 h-5" />
                  <select className="bg-transparent text-white border-none text-sm focus:ring-0">
                    {uniqueURLs.map((url, index) => (
                      <option key={index} value={url} className="text-gray-800">
                        {url}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <h1 className="text-2xl font-bold">{productDetails.productName?.content || 'Product Name'}</h1>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
            >
              Save Preview
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-blue-600/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {productDetails.productPictures?.length > 0 && (
                <>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={productDetails.productPictures[selectedImage]} 
                      alt="Product"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {productDetails.productPictures.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-blue-600 shadow-lg'
                            : 'border-transparent hover:border-blue-400'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {productDetails.productName?.content && (
                <h1 className="text-4xl font-bold text-gray-900" style={productDetails.productName.style}>
                  {productDetails.productName.content}
                </h1>
              )}

              {productDetails.productPrice?.content && (
                <div className="text-3xl font-bold text-blue-600" style={productDetails.productPrice.style}>
                  {productDetails.productPrice.content}
                </div>
              )}

              {/* Short Description */}
              {productDetails.shortDescription?.content && (
                <div className="text-gray-600 prose prose-blue" style={productDetails.shortDescription.style}>
                  {productDetails.shortDescription.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Details Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features */}
            {productDetails.qualityFeatures?.content && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
                <div className="prose prose-blue max-w-none" style={productDetails.qualityFeatures.style}>
                  {productDetails.qualityFeatures.content}
                </div>
              </div>
            )}

            {/* Specifications */}
            {productDetails.specifications?.content && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Specifications</h2>
                <div className="prose prose-blue max-w-none" style={productDetails.specifications.style}>
                  {productDetails.specifications.content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Video */}
        {productDetails.productVideos?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Video</h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <video
                src={productDetails.productVideos[0]} // Directly use the URL
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqList?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-sm font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {faqList.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shop Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {shopDetails.shopName?.content && (
                <h2 className="text-2xl font-bold text-gray-900" style={shopDetails.shopName.style}>
                  {shopDetails.shopName.content}
                </h2>
              )}
              {shopDetails.shopDescription?.content && (
                <p className="text-gray-600" style={shopDetails.shopDescription.style}>
                  {shopDetails.shopDescription.content}
                </p>
              )}
              {shopDetails.shopContact?.content && (
                <div className="text-gray-600" style={shopDetails.shopContact.style}>
                  {shopDetails.shopContact.content}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {shopDetails.shopImages?.length > 0 && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={shopDetails.shopImages[0]}
                    alt="Shop"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              {shopDetails.shopAddress?.content && (
                <div className="text-gray-600" style={shopDetails.shopAddress.style}>
                  {shopDetails.shopAddress.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default FreeTemplatePreview;