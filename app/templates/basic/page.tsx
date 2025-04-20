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
  updateSocialMediaTemplates,
} from "../../../redux/templatesPreview/basicPreviewSlice"
import type { MediaItem } from "../../../redux/templatesPreview/basicPreviewSlice";
import { uploadMedia } from "../../../redux/templatesPreview/basicPreviewSlice"
import type { RootState, AppDispatch } from "../../../redux/templatesPreview/basicPreviewStore"
import FreeTextEditor from "../../../text-editors/freeTextEditor"
import { toast } from "sonner"
import { unwrapResult } from "@reduxjs/toolkit";

interface Faq {
  question: string
  answer: string
}

interface SocialMediaTemplate {
  platform: string
  templateName: string
  caption: string
  hashtags: string[]
  imagePlaceholders: {
    position: number
    description: string
    aspectRatio?: string
    maxSize?: string
  }[]
  defaultImageUrl?: string
  productUrl: string
  callToAction?: string
  style: {
    fontFamily: string
    fontSize: string
    textColor: string
    backgroundColor: string
    accentColor?: string
    borderRadius?: string
  }
}

const BasicTemplate: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const basicPreviewState = useSelector((state: RootState) => state.basicPreview)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [newFaq, setNewFaq] = useState<Faq>({ question: "", answer: "" })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null)
  const [editingTemplateIndex, setEditingTemplateIndex] = useState<number | null>(null)
  const [newTemplate, setNewTemplate] = useState<SocialMediaTemplate>({
    platform: "",
    templateName: "",
    caption: "",
    hashtags: [],
    imagePlaceholders: [],
    productUrl: "",
    style: {
      fontFamily: "Arial",
      fontSize: "14px",
      textColor: "#000000",
      backgroundColor: "#FFFFFF"
    }
  })

  const productDetails = useSelector((state: RootState) => state.basicPreview.productDetails)
  const shopDetails = useSelector((state: RootState) => state.basicPreview.shopDetails)
  const faqList = useSelector((state: RootState) => state.basicPreview.faqList)
  const uniqueURLs = useSelector((state: RootState) => state.basicPreview.uniqueURLs)
  const socialMediaTemplates = useSelector((state: RootState) => state.basicPreview.socialMediaTemplates)

  const handleClearAll = () => {
    dispatch(resetTemplate())
    console.log("Redux state after reset:", basicPreviewState)
    localStorage.removeItem("basicPreview")
    setNewFaq({ question: "", answer: "" })
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
        const uploadResults = await Promise.all(
          files.map(async file => {
            const actionResult = await dispatch(uploadMedia({ file, mediaType: "image" }));
            const data = unwrapResult(actionResult);
            return data;
          })
        );

        const newImages: MediaItem[] = uploadResults.map(res => ({
          url: res.permanentUrl,
          type: "image"
        }));

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
      dispatch(updateFaqList([...faqList, newFaq]))
      setNewFaq({ question: "", answer: "" })
    }
  }
  
  const editFaq = (index: number) => {
    setEditingFaqIndex(index)
  }

  const updateFaq = (index: number, updatedFaq: Faq) => {
    const updatedFaqList = [...faqList]
    updatedFaqList[index] = updatedFaq
    dispatch(updateFaqList(updatedFaqList))
    setEditingFaqIndex(null)
  }

  const removeFaq = (index: number) => {
    const updatedFaqList = faqList.filter((_, i) => i !== index)
    dispatch(updateFaqList(updatedFaqList))
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index))
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
    router.push("/basic-template-preview")
  }

  const handleEditMode = () => {
    setShowPreview(false)
  }

  const addTemplate = () => {
    if (newTemplate.platform && newTemplate.templateName && newTemplate.caption) {
      dispatch(updateSocialMediaTemplates([...socialMediaTemplates, newTemplate]))
      setNewTemplate({
        platform: "",
        templateName: "",
        caption: "",
        hashtags: [],
        imagePlaceholders: [],
        productUrl: "",
        style: {
          fontFamily: "Arial",
          fontSize: "14px",
          textColor: "#000000",
          backgroundColor: "#FFFFFF"
        }
      })
    }
  }

  const editTemplate = (index: number) => {
    setEditingTemplateIndex(index)
  }

  const updateTemplate = (index: number, updatedTemplate: SocialMediaTemplate) => {
    const updatedTemplates = [...socialMediaTemplates]
    updatedTemplates[index] = updatedTemplate
    dispatch(updateSocialMediaTemplates(updatedTemplates))
    setEditingTemplateIndex(null)
  }

  const removeTemplate = (index: number) => {
    const updatedTemplates = socialMediaTemplates.filter((_, i) => i !== index)
    dispatch(updateSocialMediaTemplates(updatedTemplates))
  }

  const addHashtag = (index: number, hashtag: string) => {
    if (hashtag && !hashtag.startsWith('#')) {
      hashtag = '#' + hashtag
    }
    const updatedTemplates = [...socialMediaTemplates]
    updatedTemplates[index].hashtags = [...updatedTemplates[index].hashtags, hashtag]
    dispatch(updateSocialMediaTemplates(updatedTemplates))
  }

  const removeHashtag = (templateIndex: number, hashtagIndex: number) => {
    const updatedTemplates = [...socialMediaTemplates]
    updatedTemplates[templateIndex].hashtags = updatedTemplates[templateIndex].hashtags.filter((_, i) => i !== hashtagIndex)
    dispatch(updateSocialMediaTemplates(updatedTemplates))
  }

  const addImagePlaceholder = (index: number, placeholder: { position: number; description: string }) => {
    const updatedTemplates = [...socialMediaTemplates]
    updatedTemplates[index].imagePlaceholders = [...updatedTemplates[index].imagePlaceholders, placeholder]
    dispatch(updateSocialMediaTemplates(updatedTemplates))
  }

  const removeImagePlaceholder = (templateIndex: number, placeholderIndex: number) => {
    const updatedTemplates = [...socialMediaTemplates]
    updatedTemplates[templateIndex].imagePlaceholders = updatedTemplates[templateIndex].imagePlaceholders.filter((_, i) => i !== placeholderIndex)
    dispatch(updateSocialMediaTemplates(updatedTemplates))
  }

  return (
    <div className="flex justify-center items-center pt-10 w-screen min-h-screen bg-gray-100">
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-black">Basic Template</h2>
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
            placeholder="Enter quality features"
          />
        </div>

        {/* Specifications */}
        <div>
          <label className="block font-semibold text-gray-700">Specifications</label>
          <FreeTextEditor
            value={productDetails.specifications.content}
            onSave={(content: string, style: object) => handleProductContentSave("specifications", content, style)}
            placeholder="Enter specifications"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block font-semibold text-gray-700">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleProductImageUpload}
            className="mt-2"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {productDetails.productPictures.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => removeProductImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Video */}
        <div>
          <label className="block font-semibold text-gray-700">Product Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="mt-2"
          />
          {productDetails.productVideos.length > 0 && (
            <div className="mt-4">
              <video controls className="w-full max-w-md">
                <source src={productDetails.productVideos[0].url} type="video/mp4" />
              </video>
              <button
                onClick={removeVideo}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Video
              </button>
            </div>
          )}
        </div>

        {/* Shop Name */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Name</label>
          <FreeTextEditor
            value={shopDetails.shopName.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopName", content, style)}
            placeholder="Enter shop name"
          />
        </div>

        {/* Shop Description */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Description</label>
          <FreeTextEditor
            value={shopDetails.shopDescription.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopDescription", content, style)}
            placeholder="Enter shop description"
          />
        </div>

        {/* Shop Images */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleShopImageUpload}
            className="mt-2"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {shopDetails.shopImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={`Shop ${index + 1}`} className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => removeShopImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
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
            placeholder="Enter shop address"
          />
        </div>

        {/* Shop Contact */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Contact</label>
          <FreeTextEditor
            value={shopDetails.shopContact.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopContact", content, style)}
            placeholder="Enter shop contact"
          />
        </div>

        {/* Shop Email */}
        <div>
          <label className="block font-semibold text-gray-700">Shop Email</label>
          <FreeTextEditor
            value={shopDetails.shopEmail.content}
            onSave={(content: string, style: object) => handleShopContentSave("shopEmail", content, style)}
            placeholder="Enter shop email"
          />
        </div>

        {/* FAQ Section */}
        <div>
          <label className="block font-semibold text-gray-700">FAQ</label>
          <div className="space-y-4">
            {faqList.map((faq, index) => (
              <div key={index} className="border rounded p-4">
                {editingFaqIndex === index ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, { ...faq, question: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, { ...faq, answer: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Answer"
                    />
                    <button
                      onClick={() => updateFaq(index, faq)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="font-semibold">{faq.question}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editFaq(index)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeFaq(index)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {expandedFaq === index && (
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="New Question"
              />
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="New Answer"
              />
              <button
                onClick={addFaq}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Add FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Templates Section */}
        <div>
          <label className="block font-semibold text-gray-700">Social Media Templates</label>
          <div className="space-y-4">
            {socialMediaTemplates.map((template, index) => (
              <div key={index} className="border rounded p-4">
                {editingTemplateIndex === index ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Platform</label>
                        <input
                          type="text"
                          value={template.platform}
                          onChange={(e) => updateTemplate(index, { ...template, platform: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="e.g., Instagram, Facebook"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template Name</label>
                        <input
                          type="text"
                          value={template.templateName}
                          onChange={(e) => updateTemplate(index, { ...template, templateName: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="Template name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Caption</label>
                      <textarea
                        value={template.caption}
                        onChange={(e) => updateTemplate(index, { ...template, caption: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Enter caption"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hashtags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {template.hashtags.map((hashtag, hashtagIndex) => (
                          <span key={hashtagIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {hashtag}
                            <button
                              onClick={() => removeHashtag(index, hashtagIndex)}
                              className="ml-1 text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add hashtag"
                          className="flex-1 p-2 border rounded"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addHashtag(index, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image Placeholders</label>
                      <div className="space-y-2">
                        {template.imagePlaceholders.map((placeholder, placeholderIndex) => (
                          <div key={placeholderIndex} className="flex items-center gap-2">
                            <input
                              type="number"
                              value={placeholder.position}
                              onChange={(e) => {
                                const updatedPlaceholders = [...template.imagePlaceholders]
                                updatedPlaceholders[placeholderIndex].position = parseInt(e.target.value)
                                updateTemplate(index, { ...template, imagePlaceholders: updatedPlaceholders })
                              }}
                              className="w-20 p-2 border rounded"
                              placeholder="Position"
                            />
                            <input
                              type="text"
                              value={placeholder.description}
                              onChange={(e) => {
                                const updatedPlaceholders = [...template.imagePlaceholders]
                                updatedPlaceholders[placeholderIndex].description = e.target.value
                                updateTemplate(index, { ...template, imagePlaceholders: updatedPlaceholders })
                              }}
                              className="flex-1 p-2 border rounded"
                              placeholder="Description"
                            />
                            <button
                              onClick={() => removeImagePlaceholder(index, placeholderIndex)}
                              className="text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addImagePlaceholder(index, { position: template.imagePlaceholders.length + 1, description: '' })}
                          className="text-blue-500"
                        >
                          Add Image Placeholder
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600">Font Family</label>
                          <input
                            type="text"
                            value={template.style.fontFamily}
                            onChange={(e) => updateTemplate(index, { ...template, style: { ...template.style, fontFamily: e.target.value } })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Font Size</label>
                          <input
                            type="text"
                            value={template.style.fontSize}
                            onChange={(e) => updateTemplate(index, { ...template, style: { ...template.style, fontSize: e.target.value } })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Text Color</label>
                          <input
                            type="color"
                            value={template.style.textColor}
                            onChange={(e) => updateTemplate(index, { ...template, style: { ...template.style, textColor: e.target.value } })}
                            className="w-full p-1 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Background Color</label>
                          <input
                            type="color"
                            value={template.style.backgroundColor}
                            onChange={(e) => updateTemplate(index, { ...template, style: { ...template.style, backgroundColor: e.target.value } })}
                            className="w-full p-1 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingTemplateIndex(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateTemplate(index, template)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{template.platform} - {template.templateName}</h3>
                        <p className="text-sm text-gray-600">{template.caption}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editTemplate(index)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeTemplate(index)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {template.hashtags.map((hashtag, hashtagIndex) => (
                          <span key={hashtagIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-4">Add New Template</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <input
                      type="text"
                      value={newTemplate.platform}
                      onChange={(e) => setNewTemplate({ ...newTemplate, platform: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Instagram, Facebook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Template Name</label>
                    <input
                      type="text"
                      value={newTemplate.templateName}
                      onChange={(e) => setNewTemplate({ ...newTemplate, templateName: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Template name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Caption</label>
                  <textarea
                    value={newTemplate.caption}
                    onChange={(e) => setNewTemplate({ ...newTemplate, caption: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Enter caption"
                  />
                </div>
                <button
                  onClick={addTemplate}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicTemplate