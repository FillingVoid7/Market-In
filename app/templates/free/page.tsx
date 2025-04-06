"use client"
import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {
  updateProductField,
  updateShopField,
  updateProductImages,
  updateProductVideos,
  updateShopImages,
  updateFaqList,
  updateUniqueURLs,
  resetTemplate,
} from "../../../redux/templatesPreview/freePreviewSlice"
import type { MediaItem } from "../../../redux/templatesPreview/freePreviewSlice";
import { uploadMedia } from "../../../redux/templatesPreview/freePreviewSlice"
import type { RootState, AppDispatch } from "../../../redux/templatesPreview/freePreviewStore"
import FreeTextEditor from "../../../text-editors/freeTextEditor"
import { toast } from "sonner"
import { unwrapResult } from "@reduxjs/toolkit";
import App from "next/app"

interface Faq {
  id: number
  question: string
  answer: string
  isEditing: boolean
}

interface ImageFile {
  file: File
  url: string
}


const FreeTemplate: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const freePreviewState = useSelector((state: RootState) => state.freePreview)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [newFaq, setNewFaq] = useState<Faq>({ id: 0, question: "", answer: "", isEditing: false })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const productDetails = useSelector((state: RootState) => state.freePreview.productDetails)
  const shopDetails = useSelector((state: RootState) => state.freePreview.shopDetails)
  const faqList = useSelector((state: RootState) => state.freePreview.faqList)
  const uniqueURLs = useSelector((state: RootState) => state.freePreview.uniqueURLs)

  const handleClearAll = () => {
    dispatch(resetTemplate())
    console.log("Redux state after reset:", freePreviewState)
    localStorage.removeItem("freePreview")
    setNewFaq({ id: 0, question: "", answer: "", isEditing: false })
    setExpandedFaq(null)
  }

  const handleProductContentSave = (field: keyof typeof productDetails, content: string, style: object) => {
    dispatch(updateProductField({ field, content, style }))
  }

  const handleShopContentSave = (field: keyof typeof shopDetails, content: string, style: object) => {
    dispatch(updateShopField({ field, content, style }))
  }

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      try {
        // Upload all files and wait for results
        const uploadResults = await Promise.all(
          files.map(async file => {
            const actionResult = await dispatch(uploadMedia({ file, mediaType: "image" }));
            console.log("Raw action result:", actionResult);
            const data = unwrapResult(actionResult); // <- from @reduxjs/toolkit
            console.log("Unwrapped result:", data);
            return data;
          })
        );

        console.log("Upload results:", uploadResults);
        // Create MediaItem array from upload results
        const newImages: MediaItem[] = uploadResults.map(res => ({
          url: res.permanentUrl,
          type: "image"
        }));
        console.log("New images:", newImages);

        // Update Redux with combined array
        dispatch(updateProductImages([
          ...productDetails.productPictures,
          ...newImages
        ]));
      } catch (error) {
        toast.error("Failed to upload product images");
      }
    }
  };

  const handleShopImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const result = await dispatch(uploadMedia({ file, mediaType: "image" })).unwrap();

        const newImage: MediaItem = {
          url: result.permanentUrl,
          type: "image"
        };

        dispatch(updateShopImages([
          ...shopDetails.shopImages,
          newImage
        ]));
      } catch (error) {
        toast.error("Failed to upload shop image");
      }
    }
  };

  const removeProductImage = (index: number) => {
    const updated = productDetails.productPictures.filter((_, i) => i !== index);
    dispatch(updateProductImages(updated));
  };

  const removeShopImage = (index: number) => {
    const updated = shopDetails.shopImages.filter((_, i) => i !== index);
    dispatch(updateShopImages(updated));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (productDetails.productVideos.length > 0) {
        toast.info("Only one video is allowed");
        return;
      }

      try {
        const result = await dispatch(uploadMedia({ file, mediaType: "video" })).unwrap();

        const newVideo: MediaItem = {
          url: result.permanentUrl,
          type: "video"
        };

        dispatch(updateProductVideos([newVideo]));
      } catch (error) {
        toast.error("Failed to upload video");
      }
    }
  };

  const removeVideo = () => {
    dispatch(updateProductVideos([]));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      dispatch(updateFaqList([...faqList, { ...newFaq, id: Date.now() }]))
      setNewFaq({ id: 0, question: "", answer: "", isEditing: false })
    }
  }

  const editFaq = (id: number) => {
    const updatedFaqList = faqList.map((faq) => (faq.id === id ? { ...faq, isEditing: true } : faq))
    dispatch(updateFaqList(updatedFaqList))
  }

  const updateFaq = (id: number, updatedFaq: Faq) => {
    const updatedFaqList = faqList.map((faq) => (faq.id === id ? { ...updatedFaq, isEditing: false } : faq))
    dispatch(updateFaqList(updatedFaqList))
  }

  const removeFaq = (id: number) => {
    const updatedFaqList = faqList.filter((faq) => faq.id !== id)
    dispatch(updateFaqList(updatedFaqList))
  }

  const toggleFaq = (id: number) => {
    setExpandedFaq((prev) => (prev === id ? null : id))
  }



  const handleShowPreview = () => {
    const requiredFields = [
      productDetails.productName.content,
      productDetails.productPrice.content,
      productDetails.shortDescription.content,
      productDetails.longDescription.content,
      productDetails.qualityFeatures.content,
      productDetails.specifications.content,
      productDetails.productPictures.length > 0,
      productDetails.productVideos.length > 0,
      shopDetails.shopName.content,
      shopDetails.shopDescription.content,
      shopDetails.shopImages.length > 0,
      shopDetails.shopAddress.content,
      shopDetails.shopContact.content,
    ]

    if (requiredFields.filter(Boolean).length < 7) {
      toast.info("Please fill at least seven field before previewing")
      return
    }

    setShowPreview(true)
    router.push("/free-template-preview")
  }

  const handleEditMode = () => {
    setShowPreview(false)
  }

  const handleReturnFromPreview = () => {
    setShowPreview(false)
  }

  return (
    <div className="flex justify-center items-center pt-10 w-screen min-h-screen bg-gray-100">
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-black">Free Template</h2>
          <button
            onClick={() => {
              if (!showPreview) {
                handleShowPreview()
              } else {
                handleEditMode()
              }
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <button onClick={handleClearAll} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded">
            Clear All
          </button>
        </div>

        {/* Product Name */}
        <div>
          <label className="block font-semibold text-gray-700">Product Name</label>
          <FreeTextEditor
            value={productDetails.productName.content}
            onSave={(content: string, style: object) => handleProductContentSave("productName", content, style)}
            placeholder="Enter product name"
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block font-semibold text-gray-700">Product Price</label>
          <FreeTextEditor
            value={productDetails.productPrice.content}
            onSave={(content: string, style: object) => handleProductContentSave("productPrice", content, style)}
            placeholder="Enter product price"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-semibold text-gray-700">Short Description</label>
          <FreeTextEditor
            value={productDetails.shortDescription.content}
            onSave={(content: string, style: object) => handleProductContentSave("shortDescription", content, style)}
            placeholder="Enter short description"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block font-semibold text-gray-700">Long Description</label>
          <FreeTextEditor
            value={productDetails.longDescription.content}
            onSave={(content: string, style: object) => handleProductContentSave("longDescription", content, style)}
            placeholder="Enter long description"
          />
        </div>

        {/* Quality Features */}
        <div>
          <label className="block font-semibold text-gray-700">Quality Features</label>
          <FreeTextEditor
            value={productDetails.qualityFeatures.content}
            onSave={(content: string, style: object) => handleProductContentSave("qualityFeatures", content, style)}
            placeholder="List the quality features of the product"
          />
        </div>

        {/* Specifications */}
        <div>
          <label className="block font-semibold text-gray-700">Specifications</label>
          <FreeTextEditor
            value={productDetails.specifications.content}
            onSave={(content: string, style: object) => handleProductContentSave("specifications", content, style)}
            placeholder="List the specs of the product"
          />
        </div>

        {/* Product Gallery */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Product Gallery</label>

          <input
            id="productImageInput"
            type="file"
            multiple
            onChange={handleProductImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Custom upload button */}
          <button
            type="button"
            onClick={() => document.getElementById("productImageInput")?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Upload Images
          </button>

          {/* Preview images */}
          <div className="flex flex-wrap gap-4 mt-4">
            {productDetails.productPictures.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  onClick={() => removeProductImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Product Video */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Product Video</label>

          <input
            id="productVideoInput"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => document.getElementById("productVideoInput")?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Upload Video
          </button>

          {/* Preview */}
          {productDetails.productVideos.length > 0 && (
            <div className="flex gap-4 mt-4">
              <div className="relative">
                <video
                  src={productDetails.productVideos[0].url}
                  controls
                  className="w-48 h-32 rounded"
                />
                <button
                  onClick={removeVideo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Customer Support - FAQ */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Customer Support - FAQ</h3>
          <div className="space-y-4 mt-4 text-black">
            <input
              type="text"
              value={newFaq.question}
              onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white"
              placeholder="Enter FAQ question"
            />
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white"
              rows={2}
              placeholder="Enter FAQ answer"
            />
            <button
              onClick={addFaq}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors  bg-blue-600"
            >
              Add FAQ
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {faqList.map((faq, index) => (
              <div key={faq.id} className="border rounded-lg p-4">
                {faq.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, { ...faq, question: e.target.value })}
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="Enter FAQ question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, { ...faq, answer: e.target.value })}
                      className="w-full border rounded px-3 py-2 mb-2"
                      rows={2}
                      placeholder="Enter FAQ answer"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateFaq(faq.id, { ...faq })}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => updateFaq(faq.id, { ...faq, isEditing: false })}
                        className="flex items-center gap-2 border px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex justify-between items-center cursor-pointer text-black"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <p className="font-semibold mb-2">
                        {index + 1}. {faq.question}
                      </p>
                      <span
                        className={`transform transition-transform duration-300 ${expandedFaq === faq.id ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </div>
                    {expandedFaq === faq.id && (
                      <>
                        <hr className="my-2" />
                        <p className="mb-4 text-black">A: {faq.answer}</p>
                      </>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => editFaq(faq.id)} className="flex items-center gap-2 text-blue-600">
                        Edit
                      </button>
                      <button onClick={() => removeFaq(faq.id)} className="flex items-center gap-2 text-red-500">
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shop Name */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Name</label>
          <FreeTextEditor
            value={shopDetails.shopName.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopName", content, style)}
            placeholder="Enter name of your shop"
          />
        </div>

        {/* Shop Description */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Description</label>
          <FreeTextEditor
            value={shopDetails.shopDescription.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopDescription", content, style)}
            placeholder="Enter description about your shop"
          />
        </div>

        {/* Shop Image */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Shop Image</label>

          <input
            id="shopImageInput"
            type="file"
            multiple
            onChange={handleShopImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => document.getElementById("shopImageInput")?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Upload Shop Image
          </button>

          {/* Previews */}
          <div className="flex flex-wrap gap-4 mt-4">
            {shopDetails.shopImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Shop Image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  onClick={() => removeShopImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Shop Address */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Address</label>
          <FreeTextEditor
            value={shopDetails.shopAddress.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopAddress", content, style)}
            placeholder="Enter address of your shop"
          />
        </div>

        {/* Shop Contact */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Contact</label>
          <FreeTextEditor
            value={shopDetails.shopContact.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopContact", content, style)}
            placeholder="Enter contact of your shop"
          />
        </div>

        {/* Show Product Preview */}
        <div className="mt-6">
          <button onClick={handleShowPreview} className="w-full py-2 bg-blue-600 text-white rounded font-semibold mb-2">
            Show Product Preview
          </button>
          {uniqueURLs.length > 0 && (
            <div className="mt-2 p-4 bg-gray-100 rounded">
              <p className="font-semibold mb-2">Generated URLs:</p>
              {uniqueURLs.map((url, index) => (
                <div key={index} className="mb-2 flex items-center gap-2">
                  <a
                    href={url.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all flex-grow"
                  >
                    {url.toString()}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(url.toString())
                      toast.success("URL copied to clipboard!")
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FreeTemplate

