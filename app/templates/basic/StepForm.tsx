import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/templatesPreview/basicPreviewStore';
import {
  updateProductField,
  updateShopField,
  updateFaqList,
  updateSocialMediaTemplates,
  updateProductImages,
  updateProductVideos,
  updateShopImages,
  uploadMedia,
  MediaItem,
  ContentStyle
} from '../../../redux/templatesPreview/basicPreviewSlice';
import { SocialMediaPostTemplate } from '../../../models/basicPreview.model';
import FreeTextEditor from '../../../text-editors/freeTextEditor';
import { getPlatformLayout } from './platformLayouts';
import { toast } from 'sonner';
import { unwrapResult } from '@reduxjs/toolkit';

interface StepFormProps {
  onComplete: () => void;
}

const StepForm: React.FC<StepFormProps> = ({ onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTemplate, setNewTemplate] = useState<SocialMediaPostTemplate>({
    templateName: '',
    caption: '',
    hashtags: [],
    productUrl: '',
    callToAction: '',
    metadata: {
      lastUsed: new Date().toISOString(),
      usageCount: 0,
      isActive: true
    }
  });

  const productDetails = useSelector((state: RootState) => state.basicPreview.productDetails);
  const shopDetails = useSelector((state: RootState) => state.basicPreview.shopDetails);
  const faqList = useSelector((state: RootState) => state.basicPreview.faqList);
  const socialMediaTemplates = useSelector((state: RootState) => state.basicPreview.socialMediaTemplates);

  const handleProductContentSave = (field: keyof typeof productDetails, content: string, style: object) => {
    if (field === 'productPictures' || field === 'productVideos') {
      return;
    }
    dispatch(updateProductField({
      field,
      content,
      style: { ...(productDetails[field] as ContentStyle)?.style, ...style }
    }));
  };

  const handleShopContentSave = (field: keyof typeof shopDetails, content: string, style: object) => {
    if (field === 'shopImages') {
      return;
    }
    dispatch(updateShopField({
      field,
      content,
      style: { ...(shopDetails[field] as ContentStyle)?.style, ...style }
    }));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      dispatch(updateFaqList([...faqList, newFaq]));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const addTemplate = () => {
    if (socialMediaTemplates.length > 0) {
      toast.error("Only one template is allowed per product");
      return;
    }
    const updatedTemplates = [...socialMediaTemplates, newTemplate];
    dispatch(updateSocialMediaTemplates(updatedTemplates));
    setNewTemplate({
      templateName: '',
      caption: '',
      hashtags: [],
      productUrl: '',
      callToAction: '',
      metadata: {
        lastUsed: new Date().toISOString(),
        usageCount: 0,
        isActive: true
      }
    });
  };

  const deleteTemplate = (index: number) => {
    const updatedTemplates = socialMediaTemplates.filter((_, i) => i !== index);
    dispatch(updateSocialMediaTemplates(updatedTemplates));
  };

  const validateRequiredFields = (productDetails: any, shopDetails: any) => {
    const requiredFields = [
      { field: productDetails.productName.content, name: 'Product Name' },
      { field: productDetails.productPrice.content, name: 'Product Price' },
      { field: shopDetails.shopName.content, name: 'Shop Name' },
      { field: shopDetails.shopContact.content, name: 'Shop Contact' }
    ];
  
    const missingFields = requiredFields
      .filter(item => !item.field?.trim())
      .map(item => item.name);
  
    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p>Please fill in the required fields:</p>
          <ul className="list-disc pl-4 mt-2">
            {missingFields.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      );
      return false;
    }
  
    return true;
  };

  const nextStep = () => {
    if (currentStep === 4) {
      if (!validateRequiredFields(productDetails, shopDetails)) {
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

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

        const newImages = uploadResults.map(res => ({
          url: res.permanentUrl,
          type: "image" as "image"
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

        const newImage = {
          url: result.permanentUrl,
          type: "image" as "image"
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (productDetails.productVideos.length > 0) {
        toast.info("Only one video is allowed");
        return;
      }

      try {
        const result = await dispatch(uploadMedia({ file, mediaType: "video" })).unwrap();

        const newVideo = {
          url: result.permanentUrl,
          type: "video" as "video"
        };

        dispatch(updateProductVideos([newVideo]));
      } catch (error) {
        toast.error("Failed to upload video");
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

  const removeVideo = () => {
    dispatch(updateProductVideos([]));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-gray-800 text-2xl font-bold">Product Details</h2>
            <div>
              <label className="block font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <FreeTextEditor
                value={productDetails.productName.content}
                onSave={(content: string, style: object) => handleProductContentSave("productName", content, style)}
                placeholder="Enter product name (Required)"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Product Price <span className="text-red-500">*</span>
              </label>
              <FreeTextEditor
                value={productDetails.productPrice.content}
                onSave={(content: string, style: object) => handleProductContentSave("productPrice", content, style)}
                placeholder="Enter product price (Required)"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Short Description</label>
              <FreeTextEditor
                value={productDetails.shortDescription.content}
                onSave={(content: string, style: object) => handleProductContentSave("shortDescription", content, style)}
                placeholder="Enter short description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Long Description</label>
              <FreeTextEditor
                value={productDetails.longDescription.content}
                onSave={(content: string, style: object) => handleProductContentSave("longDescription", content, style)}
                placeholder="Enter detailed product description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Quality Features</label>
              <FreeTextEditor
                value={productDetails.qualityFeatures.content}
                onSave={(content: string, style: object) => handleProductContentSave("qualityFeatures", content, style)}
                placeholder="Enter product quality features"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Specifications</label>
              <FreeTextEditor
                value={productDetails.specifications.content}
                onSave={(content: string, style: object) => handleProductContentSave("specifications", content, style)}
                placeholder="Enter product specifications"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Product Pictures</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImageUpload}
                className="hidden"
                id="productImageInput"
              />
              <button
                type="button"
                onClick={() => document.getElementById("productImageInput")?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              >
                Upload Images
              </button>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {productDetails.productPictures.map((picture, index) => (
                  <div key={index} className="relative">
                    <img src={picture.url} alt={`Product ${index + 1}`} className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => removeProductImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Product Videos</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="productVideoInput"
              />
              <button
                type="button"
                onClick={() => document.getElementById("productVideoInput")?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              >
                Upload Video
              </button>
              <div className="mt-2 space-y-4">
                {productDetails.productVideos.map((video, index) => (
                  <div key={index} className="relative">
                    <video src={video.url} controls className="w-full rounded" />
                    <button
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-gray-800 text-2xl font-bold">Shop Details</h2>
            <div>
              <label className="block font-semibold text-gray-700">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <FreeTextEditor
                value={shopDetails.shopName.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopName", content, style)}
                placeholder="Enter shop name (Required)"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Description</label>
              <FreeTextEditor
                value={shopDetails.shopDescription.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopDescription", content, style)}
                placeholder="Enter shop description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Address</label>
              <FreeTextEditor
                value={shopDetails.shopAddress.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopAddress", content, style)}
                placeholder="Enter shop address"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Shop Contact <span className="text-red-500">*</span>
              </label>
              <FreeTextEditor
                value={shopDetails.shopContact.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopContact", content, style)}
                placeholder="Enter shop contact information (Required)"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Email</label>
              <FreeTextEditor
                value={shopDetails.shopEmail.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopEmail", content, style)}
                placeholder="Enter shop email"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Images</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleShopImageUpload}
                className="hidden"
                id="shopImageInput"
              />
              <button
                type="button"
                onClick={() => document.getElementById("shopImageInput")?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              >
                Upload Shop Image
              </button>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {shopDetails.shopImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.url} alt={`Shop ${index + 1}`} className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => removeShopImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-gray-800 text-2xl font-bold">FAQs</h2>
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-semibold text-gray-600">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
              <div className="space-y-2 text-gray-600">
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
                  className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Social Media Template</h2>
            <div className="space-y-4">
              {socialMediaTemplates.map((template, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 relative border border-gray-100">
                  <button
                    onClick={() => deleteTemplate(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    ×
                  </button>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{template.templateName || 'Untitled Template'}</h3>
                  {template.caption && (
                    <p className="text-gray-600 mb-3">{template.caption}</p>
                  )}
                  {template.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.hashtags.map((tag, i) => (
                        <span key={i} className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {template.callToAction && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-purple-600">{template.callToAction}</span>
                    </div>
                  )}
                </div>
              ))}

              {socialMediaTemplates.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6  border-gray-100">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Template Type</label>
                      <select
                        value={newTemplate.templateName}
                        onChange={(e) => setNewTemplate({ ...newTemplate, templateName: e.target.value })}
                        className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" className="text-gray-500">Select a template type</option>
                        <option value="New Arrival">New Arrival</option>
                        <option value="Limited Time Offer">Limited Time Offer</option>
                        <option value="Flash Sale">Flash Sale</option>
                        <option value="Product Launch">Product Launch</option>
                        <option value="Special Promotion">Special Promotion</option>
                        <option value="Holiday Special">Holiday Special</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Caption</label>
                      <textarea
                        value={newTemplate.caption}
                        onChange={(e) => setNewTemplate({ ...newTemplate, caption: e.target.value })}
                        className="w-full p-2 text-gray-700 
                         border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 border focus:border-blue-500 min-h-[100px] placeholder-gray-400"
                        placeholder="Write an engaging caption for your post..."
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Hashtags</label>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {newTemplate.hashtags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center">
                            #{tag}
                            <button
                              onClick={() => {
                                const updatedTags = [...newTemplate.hashtags];
                                updatedTags.splice(index, 1);
                                setNewTemplate({ ...newTemplate, hashtags: updatedTags });
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={newTemplate.hashtags.join(' ')}
                        onChange={(e) => setNewTemplate({ ...newTemplate, hashtags: e.target.value.split(' ').filter(tag => tag) })}
                        className="w-full p-2 text-gray-700 border  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        placeholder="#madeInNepal #vintageProduct #exclusive"
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Call to Action</label>
                      <select
                        value={newTemplate.callToAction || ''}
                        onChange={(e) => setNewTemplate({ ...newTemplate, callToAction: e.target.value })}
                        className="w-full text-sm p-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" className="text-gray-500">Select a call to action</option>
                        <option value="Shop Now">Shop Now</option>
                        <option value="Learn More">Learn More</option>
                        <option value="Get Yours Today">Get Yours Today</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Don't Miss Out">Don't Miss Out</option>
                        <option value="Grab Yours">Grab Yours</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={addTemplate}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Template
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentStep === step
                  ? 'bg-blue-600 text-white'
                  : currentStep > step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === 4 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default StepForm;