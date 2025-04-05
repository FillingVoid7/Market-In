"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, Copy, Check, ChevronDown, ChevronUp, Link } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/templatesPreview/freePreviewStore"
import { saveFreePreview, updateUniqueURLs, createContentHash, generateUrlFree, MediaItem } from "../../redux/templatesPreview/freePreviewSlice"
import { toast } from "sonner"

interface Faq {
  id: number
  question: string
  answer: string
}

const FreeTemplatePreview: React.FC<{
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

  const data = useSelector((state: RootState) => state.freePreview)
  const uniqueURLs = useSelector((state: RootState) => state.freePreview.uniqueURLs)
  const { _id: productId } = useSelector((state: RootState) => state.freePreview);


  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg text-center p-6 w-96">
          <h2 className="text-2xl font-bold text-gray-800">No Preview Data Available</h2>
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
    )
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
        const errorMessage = resultAction.payload || "Failed to create Free Preview";
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

    console.log("Generating unique URL...")
    console.log("Product ID:", productId)
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
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
    toast.success("URL copied to clipboard!")
  }

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

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
            {/* Image Gallery */}
            <div className="space-y-6">
              {productDetails.productPictures?.length > 0 ? (
                <>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                    <img
                      src= {productDetails.productPictures[selectedImage]?.url || "/placeholder.svg?height=600&width=600"}
                      alt="Product"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {productDetails.productPictures.map((img:MediaItem, index:number) => (
                      <button
                        key={img.url}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
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
                      onClick={() => copyToClipboard(uniqueURLs[0].toString())}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label="Copy URL"
                    >
                      {copied === uniqueURLs[0].toString() ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
                  key={faq.id || index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
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

        {/* Shop Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div
                className="text-2xl font-bold text-gray-900"
                dangerouslySetInnerHTML={{ __html: shopDetails.shopName?.content || "Shop Name" }}
              />
              <div
                className="text-gray-600 prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: shopDetails.shopDescription?.content || "Shop description" }}
              />

              {shopDetails.shopContact?.content && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: shopDetails.shopContact.content }}
                  />
                </div>
              )}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Market-in</h3>
              <p className="text-gray-400">The ultimate platform for product marketers to reach their audience.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© 2025 Market-in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default FreeTemplatePreview

