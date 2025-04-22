"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, Copy, Check, ChevronDown, ChevronUp, Link } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/templatesPreview/basicPreviewStore"
import { saveBasicPreview, updateUniqueURLs, createContentHash, generateUrlBasic, MediaItem } from "../../redux/templatesPreview/basicPreviewSlice"
import { toast } from "sonner"

interface Faq {
  question: string
  answer: string
}

const BasicTemplatePreview: React.FC<{
  productDetails: any,
  shopDetails: any,
  faqList: any,
  isGeneratedURL?: boolean,
}> = ({ isGeneratedURL = false }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const data = useSelector((state: RootState) => state.basicPreview)
  const uniqueURLs = useSelector((state: RootState) => state.basicPreview.uniqueURLs)
  const { _id: productId } = useSelector((state: RootState) => state.basicPreview);

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg text-center p-6 w-96">
          <h2 className="text-2xl font-bold text-gray-800">No Preview Data Available</h2>
          <p className="text-gray-600 mt-2">Please add some content first</p>
          <button
            onClick={() => router.push("/templates-basic")}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
        </div>
      </div>
    )
  }

  const { productDetails, shopDetails, faqList } = data;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        saveBasicPreview({
          productDetails: data.productDetails,
          shopDetails: data.shopDetails,
          faqList: data.faqList,
          uniqueURLs: data.uniqueURLs,
          socialMediaTemplates: data.socialMediaTemplates,
          analytics: data.analytics,
        }) as any
      );

      if (saveBasicPreview.fulfilled.match(resultAction)) {
        toast.success("Preview saved successfully!");
      } else {
        const errorMessage = resultAction.payload || "Failed to create Basic Preview";
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

  const generateUniqueURL = async () => {
    try {
      const resultAction = await dispatch(generateUrlBasic() as any);
      
      if (generateUrlBasic.fulfilled.match(resultAction)) {
        toast.success("URL generated successfully!");
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
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
    toast.success("URL copied to clipboard!")
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {!isGeneratedURL && (
        <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push("/templates/basic")}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            {productDetails.productPictures?.length > 0 ? (
              <>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <img
                    src={productDetails.productPictures[selectedImage]?.url || "/placeholder.svg?height=600&width=600"}
                    alt="Product"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {productDetails.productPictures.map((img: MediaItem, index: number) => (
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
                        src={img.url || "/placeholder.svg?height=600&width=600"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No product images available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1
                className="text-4xl font-bold text-gray-900 mb-2"
                dangerouslySetInnerHTML={{ __html: productDetails.productName?.content || "Product Name" }}
              />
              <div
                className="text-3xl font-bold text-blue-600"
                dangerouslySetInnerHTML={{ __html: productDetails.productPrice?.content || "Price" }}
              />
            </div>

            {/* Short Description */}
            <div
              className="text-gray-600 prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{
                __html: productDetails.shortDescription?.content || "Short description of the product",
              }}
            />

            {/* Generated URL */}
            {uniqueURLs.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generated URLs</h3>
                {uniqueURLs.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all flex-grow"
                    >
                      {url.url}
                    </a>
                    <button
                      onClick={() => copyToClipboard(url.url)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {copied === url.url ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Long Description */}
        {productDetails.longDescription?.content && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: productDetails.longDescription.content }}
            />
          </div>
        )}

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          {productDetails.qualityFeatures?.content && (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetails.qualityFeatures.content }}
              />
            </div>
          )}

          {/* Specifications */}
          {productDetails.specifications?.content && (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetails.specifications.content }}
              />
            </div>
          )}
        </div>

        {/* Product Video */}
        {productDetails.productVideos?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Video</h2>
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

        {/* FAQs */}
        {faqList?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-6 bg-white">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shop Details */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Shop</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{shopDetails.shopName?.content}</h3>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: shopDetails.shopDescription?.content }}
              />
            </div>

            <div className="space-y-4">
              {shopDetails.shopImages?.length > 0 ? (
                <div className="rounded-xl overflow-hidden shadow-lg h-64">
                  <img
                    src={shopDetails.shopImages[0].url || "/placeholder.svg?height=600&width=600"}
                    alt="Shop"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-100 h-64 flex items-center justify-center">
                  <p className="text-gray-400">No shop image available</p>
                </div>
              )}

              {shopDetails.shopAddress?.content && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: shopDetails.shopAddress.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BasicTemplatePreview
