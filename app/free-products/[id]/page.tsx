// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import FreeTemplatePreview from "../../free-template-preview/page";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/templatesPreview/freePreviewStore";
// import type { ProductDetails,ShopDetails } from "../../../redux/templatesPreview/freePreviewSlice";

// interface ProductData {
//   productDetails: ProductDetails;
//   shopDetails: ShopDetails;
//   faqList: any[];
// }

// const ProductPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const [productData, setProductData] = useState<ProductData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const reduxProduct = useSelector((state: RootState) => ({
//     productDetails: state.freePreview.productDetails,
//     shopDetails: state.freePreview.shopDetails,
//     faqList: state.freePreview.faqList
//   }));

//   useEffect(() => {
//     if (!id) {
//       setProductData(reduxProduct);
//       setLoading(false);
//       return;
//     }

//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`/api/get-product?id=${id}`);
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
//         const data: ProductData = await response.json();
//         setProductData(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err instanceof Error ? err.message : 'Failed to load product');
//         if (reduxProduct.productDetails.productName.content) {
//           setProductData(reduxProduct);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, reduxProduct]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
//           <p className="text-gray-600">{error}</p>
//           <button
//             onClick={() => router.push('/')}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//           >
//             Return Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!productData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//           <p className="text-gray-600">The requested product page does not exist</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <FreeTemplatePreview
//       productDetails={productData.productDetails}
//       shopDetails={productData.shopDetails}
//       faqList={productData.faqList}
//     />
//   );
// };

// export default ProductPage;