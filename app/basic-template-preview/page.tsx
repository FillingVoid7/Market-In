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

const SocialMediaTemplatePreview: React.FC = () => {
  const socialMediaTemplates = useSelector((state: RootState) => state.basicPreview.socialMediaTemplates)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  if (!socialMediaTemplates.length) return null

  const handleCopy = (template: any, idx: number) => {
    const hashtags = template.hashtags && template.hashtags.length > 0 ? template.hashtags.map((tag: string) => `#${tag}`).join(' ') : ''
    const text = [
      template.caption,
      hashtags,
      template.callToAction
    ].filter(Boolean).join('\n')

    // HTML version for rich copy
    const html = `
      <div style="background:#181A20;padding:24px;border-radius:16px;max-width:600px;color:#fff;font-family:sans-serif;">
        ${template.caption ? `<div style='font-size:1.2rem;margin-bottom:16px;color:#f3f4f6;'>${template.caption}</div>` : ''}
        ${template.hashtags && template.hashtags.length > 0 ? `<div style='margin-bottom:16px;'>${template.hashtags.map((tag: string) => `<span style='display:inline-block;background:#23262F;color:#60a5fa;font-size:0.9rem;padding:4px 12px;border-radius:999px;margin-right:6px;margin-bottom:6px;'>#${tag}</span>`).join('')}</div>` : ''}
        ${template.callToAction ? `<div style='margin-top:20px;'><span style='display:inline-block;background:#23262F;color:#60a5fa;font-weight:600;font-size:1rem;padding:10px 24px;border-radius:8px;'>${template.callToAction}</span></div>` : ''}
      </div>
    `

    if (navigator.clipboard && (window.ClipboardItem || window.Clipboard)) {
      // Try to copy both HTML and plain text
      const blobHtml = new Blob([html], { type: 'text/html' })
      const blobText = new Blob([text], { type: 'text/plain' })
      // @ts-ignore
      navigator.clipboard.write([
        new window.ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })
      ]).then(() => {
        setCopiedIdx(idx)
        toast.success("Template copied to clipboard!")
        setTimeout(() => setCopiedIdx(null), 2000)
      }, () => {
        // fallback to plain text
        navigator.clipboard.writeText(text)
        setCopiedIdx(idx)
        toast.success("Template copied to clipboard!")
        setTimeout(() => setCopiedIdx(null), 2000)
      })
    } else {
      // fallback to plain text
      navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      toast.success("Template copied to clipboard!")
      setTimeout(() => setCopiedIdx(null), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {socialMediaTemplates.map((template, idx) => (
        <div
          key={idx}
          className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-white/20 relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
        >
          <button
            onClick={() => handleCopy(template, idx)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            title="Copy template"
          >
            {copiedIdx === idx ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
          {template.caption && (
            <p className="text-white text-lg mb-4 font-medium">{template.caption}</p>
          )}
          {template.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {template.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-sm text-purple-200 bg-white/10 px-3 py-1 rounded-full tracking-wide font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {template.callToAction && (
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-lg px-4 py-3 flex justify-center hover:bg-white/30 transition-colors">
                <span className="text-white font-semibold text-base">
                  {template.callToAction}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
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

    // Validate required fields
    if (!productDetails.productName?.content || !shopDetails.shopName?.content) {
      toast.error("Please fill in both Product Name and Shop Name before saving");
      return;
    }

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
          toast.error("Failed to save");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving the preview.");
    }
  };

  const generateUniqueURL = async () => {
    if (!productId) {
      toast.error("Please save the product before generating a URL.");
      return;
    }

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
        <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push("/templates/basic")}
                className="inline-flex items-center text-white hover:text-gray-200 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Editor
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={generateUniqueURL}
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Generate Product URL
                </button>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  Save Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Social Media Template Preview Card */}
      <div className="w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Social Media Templates</h2>
          <SocialMediaTemplatePreview />
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          {productDetails.productPictures?.length > 0 && (
            <div className="space-y-6">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white transform transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={productDetails.productPictures[selectedImage]?.url}
                  alt="Product"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productDetails.productPictures.map((img: MediaItem, index: number) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === index
                        ? "border-blue-600 shadow-lg ring-2 ring-blue-400"
                        : "border-transparent hover:border-blue-400"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-8">
            {productDetails.productName?.content && (
              <div className="animate-fade-in">
                <h1
                  className="text-4xl font-bold text-gray-900 mb-2 tracking-tight"
                  dangerouslySetInnerHTML={{ __html: productDetails.productName.content }}
                />
              </div>
            )}

            {productDetails.productPrice?.content && (
              <div
                className="text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                dangerouslySetInnerHTML={{ __html: productDetails.productPrice.content }}
              />
            )}

            {productDetails.shortDescription?.content && (
              <div
                className="text-gray-600 prose prose-blue max-w-none bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: productDetails.shortDescription.content,
                }}
              />
            )}

            {/* Generated URL */}
            {uniqueURLs.length > 0 && (
              <div className="mt-4 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated URLs</h3>
                {uniqueURLs.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
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
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
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

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          {productDetails.qualityFeatures?.content && (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full transform transition-transform duration-300 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetails.qualityFeatures.content }}
              />
            </div>
          )}

          {/* Specifications */}
          {productDetails.specifications?.content && (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full transform transition-transform duration-300 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetails.specifications.content }}
              />
            </div>
          )}
        </div>

        {/* Long Description */}
        {productDetails.longDescription?.content && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transform transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: productDetails.longDescription.content }}
            />
          </div>
        )}

        {/* Product Video */}
        {productDetails.productVideos?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transform transition-transform duration-300 hover:scale-[1.01]">
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
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transform transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 transform transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 transform transition-transform duration-300" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-6 bg-white animate-fade-in">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Shop Details */}
        {shopDetails.shopName?.content && (
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Shop</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{shopDetails.shopName.content}</h3>
                {shopDetails.shopDescription?.content && (
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: shopDetails.shopDescription.content }}
                  />
                )}
              </div>

              <div className="space-y-4">
                {shopDetails.shopImages?.length > 0 && (
                  <div className="rounded-xl overflow-hidden shadow-lg h-64 transform transition-transform duration-300 hover:scale-[1.02]">
                    <img
                      src={shopDetails.shopImages[0].url}
                      alt="Shop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {shopDetails.shopAddress?.content && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
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
        )}
      </main>
    </div>
  )
}

export default BasicTemplatePreview
