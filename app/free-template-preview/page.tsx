"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Link,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/templatesPreview/freePreviewStore";
import {
  saveFreePreview,
  updateUniqueURLs,
  createContentHash,
  generateUrlFree,
  MediaItem,
} from "../../redux/templatesPreview/freePreviewSlice";
import { toast } from "sonner";
import Footer from "../../components/footer";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

const FreeTemplatePreview: React.FC<{
  productDetails: any;
  shopDetails: any;
  faqList: any;
  isGeneratedURL?: boolean;
}> = ({ isGeneratedURL = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const data = useSelector((state: RootState) => state.freePreview);
  const uniqueURLs = useSelector(
    (state: RootState) => state.freePreview.uniqueURLs
  );
  const { _id: productId } = useSelector(
    (state: RootState) => state.freePreview
  );

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg text-center p-6 w-96">
          <h2 className="text-2xl font-bold text-gray-800">
            No Preview Data Available
          </h2>
          <p className="text-gray-600 mt-2">Please add some content first</p>
          <button
            onClick={() => router.push("/templates-free")}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  const { productDetails, shopDetails, faqList } = data;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        saveFreePreview({
          productDetails: data.productDetails,
          shopDetails: data.shopDetails,
          faqList: data.faqList,
          uniqueURLs: data.uniqueURLs,
        }) as any
      );

      if (saveFreePreview.fulfilled.match(resultAction)) {
        toast.success("Preview saved successfully!");
      } else {
        const errorMessage =
          resultAction.payload || "Failed to create Free Preview";
        if (errorMessage === "A preview already exists for this obligation.") {
          toast.error("The preview has already been saved!");
        } else {
          toast.error(`Failed to save: ${errorMessage}`);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving the preview.");
    }
  };

  interface URLSnapshot {
    id: string;
    url: string;
    contentHash: string;
    createdAt: string;
  }

  const generateUniqueURL = async () => {
    console.log("Generating unique URL...");
    console.log("Product ID:", productId);
    if (!productId) {
      toast.error("Please save the product before generating a URL.");
      return;
    }

    const currentContent = {
      productDetails,
      shopDetails,
      faqList,
    };

    const contentHash = createContentHash(currentContent);
    const exists = uniqueURLs.some((url) => url.contentHash === contentHash);

    if (exists) {
      toast.error("This configuration already has a URL.");
      return;
    }

    try {
      toast.loading("Generating unique URL...");
      const resultAction = await dispatch(generateUrlFree() as any);

      if (generateUrlFree.fulfilled.match(resultAction)) {
        const { id, url, contentHash } = resultAction.payload;

        const newUrl: URLSnapshot = {
          id,
          url,
          contentHash,
          createdAt: new Date().toISOString(),
        };

        dispatch(updateUniqueURLs([...uniqueURLs, newUrl]));

        toast.dismiss();

        toast.success(
          <div className="flex flex-col gap-2">
            <p>URL generated successfully!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newUrl.url}
                readOnly
                className="w-full p-2 text-sm bg-white border rounded text-gray-800"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newUrl.url);
                  toast.success("URL copied to clipboard!");
                }}
                className="whitespace-nowrap bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                Copy
              </button>
            </div>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.dismiss();
        const error = resultAction.error?.message || "Failed to generate URL.";
        toast.error(`Error: ${error}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred while generating the URL.");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast.success("URL copied to clipboard!");
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {!isGeneratedURL && (
        <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push("/templates/free")}
                className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Editor
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={generateUniqueURL}
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Generate Product URL
                </button>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
                >
                  Save Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-blue-50 to-transparent pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {productDetails.productPictures?.length > 0 && (
              <div className="space-y-6">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <img
                    src={
                      productDetails.productPictures[selectedImage]?.url ||
                      "/placeholder.svg?height=600&width=600"
                    }
                    alt="Product"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {productDetails.productPictures.map(
                    (img: MediaItem, index: number) => (
                      <button
                        key={img.url}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-blue-600 shadow-lg"
                            : "border-transparent hover:border-blue-400"
                        }`}
                      >
                        <img
                          src={
                            img.url || "/placeholder.svg?height=600&width=600"
                          }
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-8">
              {(productDetails.productName?.content ||
                productDetails.productPrice?.content) && (
                <div>
                  {productDetails.productName?.content && (
                    <h1
                      className="text-4xl font-bold text-gray-900 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: productDetails.productName.content,
                      }}
                    />
                  )}
                  {productDetails.productPrice?.content && (
                    <div
                      className="text-3xl font-bold text-blue-600"
                      dangerouslySetInnerHTML={{
                        __html: productDetails.productPrice.content,
                      }}
                    />
                  )}
                </div>
              )}

              {/* Short Description*/}
              {productDetails.shortDescription?.content && (
                <div
                  className="text-gray-600 prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: productDetails.shortDescription.content,
                  }}
                />
              )}

              {/* Generated URL */}
              {uniqueURLs?.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Share2 className="w-4 h-4 mr-2 text-blue-600" />
                    Share Your Product
                  </h3>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
                    <input
                      type="text"
                      value={uniqueURLs[0].url}
                      readOnly
                      className="flex-grow text-sm bg-transparent border-none focus:ring-0 text-gray-700"
                    />
                    <button
                      onClick={() => copyToClipboard(uniqueURLs[0].url)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label="Copy URL"
                    >
                      {copied === uniqueURLs[0].url ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Long Description */}
        {productDetails.longDescription?.content && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Description
            </h2>
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{
                __html: productDetails.longDescription.content,
              }}
            />
          </div>
        )}

        {/* Product Details Section*/}
        {(productDetails.qualityFeatures?.content ||
          productDetails.specifications?.content) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Features */}
            {productDetails.qualityFeatures?.content && (
              <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Key Features
                </h2>
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: productDetails.qualityFeatures.content,
                  }}
                />
              </div>
            )}

            {/* Specifications */}
            {productDetails.specifications?.content && (
              <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Specifications
                </h2>
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: productDetails.specifications.content,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Product Video*/}
        {productDetails.productVideos?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Video
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <video
                src={productDetails.productVideos[0].url}
                controls
                className="w-full h-full object-cover"
                poster="/placeholder.svg?height=720&width=1280"
              />
            </div>
          </div>
        )}

        {/* FAQs*/}
        {faqList?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">
                      {faq.question}
                    </h3>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="p-6 bg-white">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shop Information*/}
        {(shopDetails.shopName?.content ||
          shopDetails.shopDescription?.content ||
          shopDetails.shopContact?.content ||
          shopDetails.shopImages?.length > 0 ||
          shopDetails.shopAddress?.content) && (
          <div className="bg-white rounded-xl shadow-lg p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About the Seller
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {shopDetails.shopName?.content && (
                  <div
                    className="text-2xl font-bold text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: shopDetails.shopName.content,
                    }}
                  />
                )}
                {shopDetails.shopDescription?.content && (
                  <div
                    className="text-gray-600 prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: shopDetails.shopDescription.content,
                    }}
                  />
                )}

                {shopDetails.shopContact?.content && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Contact
                    </h3>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: shopDetails.shopContact.content,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {shopDetails.shopImages?.length > 0 && (
                  <div className="rounded-xl overflow-hidden shadow-lg h-64">
                    <img
                      src={
                        shopDetails.shopImages[0].url ||
                        "/placeholder.svg?height=600&width=600"
                      }
                      alt="Shop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {shopDetails.shopAddress?.content && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Address
                    </h3>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: shopDetails.shopAddress.content,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FreeTemplatePreview;
