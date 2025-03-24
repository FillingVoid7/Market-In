"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/templatesPreview/freePreviewStore";
import type { RootState } from "../../../redux/templatesPreview/freePreviewStore";
import { getProductFree } from "../../../redux/templatesPreview/freePreviewSlice";
import FreeTemplatePreview from "../../free-template-preview/page";
import { toast } from "sonner";

const ProductPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { _id:productId ,productDetails, shopDetails, faqList } = useSelector(
    (state: RootState) => state.freePreview
  );

  useEffect(() => {
    if (!productId) {
      toast.error("Invalid product URL. Please check the link.");
      return;
    }

    const fetchProduct = async () => {
      try {
        await dispatch(getProductFree(productId)).unwrap();
        toast.success("Product details loaded successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to load product details.");
      }
    };

    fetchProduct();
  }, [dispatch, productId]);

  if (!productDetails || !shopDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The requested product page does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FreeTemplatePreview
      productDetails={productDetails}
      shopDetails={shopDetails}
      faqList={faqList}
    />
  );
};

export default ProductPage;
