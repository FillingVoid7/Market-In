"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/templatesPreview/basicPreviewStore";
import type { RootState } from "../../../redux/templatesPreview/basicPreviewStore";
import { getProductBasic } from "../../../redux/templatesPreview/basicPreviewSlice";
import BasicTemplatePreview from "../../basic-template-preview/page";
import { BarLoader } from "react-spinners";
import { createSelector } from '@reduxjs/toolkit';

const selectBasicPreview = (state: RootState) => state.basicPreview;
const currentProductSelector = createSelector([selectBasicPreview],(basicPreview) => ({
    loading: basicPreview.loading,
    error: basicPreview.error,
    currentProduct: basicPreview.createdPreview 
  })
);

const ProductPage = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const productId = params?.id as string;

  const { 
    loading: productLoading, 
    error: productError, 
    currentProduct 
  } = useSelector(currentProductSelector);

  useEffect(() => {
    if (productId) {
      dispatch(getProductBasic(productId));
    }
  }, [dispatch, productId]);

  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <BarLoader color="#2563EB" width={200} />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{productError}</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your product is ready to be shared!
          </h2>
        </div>
      </div>
    );
  }

  return (
    <BasicTemplatePreview
      productDetails={currentProduct.productDetails}
      shopDetails={currentProduct.shopDetails}
      faqList={currentProduct.faqList}
      isGeneratedURL={true}
    />
  );
};

export default ProductPage;
